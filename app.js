// Frontend state
let transactions = [];

// Chart instance
let chartInstance = null;

// Load transactions initially (optional for database future)
window.addEventListener('DOMContentLoaded', () => {
  updateUI();
});

// Form Submit
document.getElementById('transactionForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;

  if (title && !isNaN(amount) && type) {
    const transaction = { title, amount, type };
    transactions.push(transaction);
    updateUI();

    // Clear form
    this.reset();
  }
});

// Update UI
function updateUI() {
  const totalIncome = transactions.filter(t => t.type === 'income')
                                  .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense')
                                   .reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalIncome - totalExpense;

  document.getElementById('totalIncome').textContent = `$${totalIncome}`;
  document.getElementById('totalExpense').textContent = `$${totalExpense}`;
  document.getElementById('netBalance').textContent = `$${netBalance}`;

  // Transaction History
  const list = document.getElementById('transactionList');
  list.innerHTML = '';
  transactions.forEach((t, index) => {
    const li = document.createElement('li');
    li.className = `list-group-item d-flex justify-content-between align-items-center`;
    li.innerHTML = `
      <span>${t.title} (${t.type})</span>
      <span class="${t.type === 'income' ? 'text-success' : 'text-danger'}">$${t.amount}</span>
    `;
    list.appendChild(li);
  });

  updateChart(totalIncome, totalExpense);
}

// Update Chart
function updateChart(income, expense) {
  const ctx = document.getElementById('incomeExpenseChart').getContext('2d');
  
  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#28a745', '#dc3545']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}
