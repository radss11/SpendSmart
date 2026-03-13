import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './App.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const API = 'http://localhost:5000';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ name: '', type: 'Investment', amount: '' });
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API}/api/transaction`);
      const data = await res.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (e) {
      setTransactions([]);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const totalIncome = transactions
    .filter(t => ['Investment', 'Salary', 'Extra Income'].includes(t.type))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => !['Investment', 'Salary', 'Extra Income'].includes(t.type))
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  const isIncome = (type) => ['Investment', 'Salary', 'Extra Income'].includes(type);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount) return;
    setLoading(true);
    try {
      await fetch(`${API}/api/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: Number(form.amount), date: new Date() })
      });
      setForm({ name: '', type: 'Investment', amount: '' });
      fetchTransactions();
    } catch (e) {}
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/api/transaction`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _id: id }) });
      fetchTransactions();
    } catch (e) {}
  };

  const chartData = {
    labels: ['Income', 'Expense'],
    datasets: [{
      data: [totalIncome || 1, totalExpense || 1],
      backgroundColor: ['#00ff9d', '#ff2d78'],
      borderColor: ['#00ff9d', '#ff2d78'],
      borderWidth: 0,
      hoverOffset: 4,
    }]
  };

  const chartOptions = {
    cutout: '75%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` $${ctx.parsed.toLocaleString()}`
        }
      }
    }
  };

  return (
    <div className="app-wrapper">
      <header className="header">
        <div className="header-logo">Spend<span>Smart</span></div>
        <div className="header-tag">Personal Finance</div>
      </header>

      <main className="main-content">

        {/* STATS ROW */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Balance</div>
            <div className={`stat-value ${balance >= 0 ? 'income' : 'expense'}`}>
              ${balance.toLocaleString()}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Income</div>
            <div className="stat-value income">${totalIncome.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Expenses</div>
            <div className="stat-value expense">${totalExpense.toLocaleString()}</div>
          </div>
        </div>

        {/* LEFT PANEL */}
        <div className="left-panel">

          {/* ADD TRANSACTION */}
          <div className="panel-card">
            <div className="panel-title">New Transaction</div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  className="form-input"
                  placeholder="e.g. Monthly salary"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                >
                  <option>Investment</option>
                  <option>Salary</option>
                  <option>Extra Income</option>
                  <option>Education</option>
                  <option>Groceries</option>
                  <option>Health</option>
                  <option>Subscription</option>
                  <option>Takeaway</option>
                  <option>Clothing</option>
                  <option>Travel</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <input
                  className="form-input"
                  type="number"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? 'Adding...' : '+ Add Transaction'}
              </button>
            </form>
          </div>

          {/* HISTORY */}
          <div className="panel-card">
            <div className="panel-title">History</div>
            <div className="history-list">
              {transactions.length === 0 && (
                <div className="empty-state">no transactions yet</div>
              )}
              {transactions.slice().reverse().map(t => (
                <div className="history-item" key={t._id}>
                  <div className="history-item-left">
                    <div className={`history-dot ${isIncome(t.type) ? 'income' : 'expense'}`} />
                    <div>
                      <div className="history-name">{t.name}</div>
                      <div className="history-category">{t.type}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className={`history-amount ${isIncome(t.type) ? 'income' : 'expense'}`}>
                      {isIncome(t.type) ? '+' : '-'}${Number(t.amount).toLocaleString()}
                    </div>
                    <button className="delete-btn" onClick={() => handleDelete(t._id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="panel-card">
            <div className="panel-title">Overview</div>
            <div className="chart-container">
              {(totalIncome > 0 || totalExpense > 0) ? (
                <Doughnut data={chartData} options={chartOptions} />
              ) : (
                <div className="empty-state" style={{ paddingTop: '4rem' }}>
                  add transactions to see chart
                </div>
              )}
            </div>
            {(totalIncome > 0 || totalExpense > 0) && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff9d' }} />
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>income</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff2d78' }} />
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>expense</span>
                </div>
              </div>
            )}
          </div>

          {/* CATEGORY BREAKDOWN */}
          <div className="panel-card">
            <div className="panel-title">By Category</div>
            <div className="history-list">
              {transactions.length === 0 && (
                <div className="empty-state">no data yet</div>
              )}
              {Object.entries(
                transactions.reduce((acc, t) => {
                  acc[t.type] = (acc[t.type] || 0) + Number(t.amount);
                  return acc;
                }, {})
              ).map(([type, total]) => (
                <div className="history-item" key={type}>
                  <div className="history-item-left">
                    <div className={`history-dot ${isIncome(type) ? 'income' : 'expense'}`} />
                    <div className="history-name">{type}</div>
                  </div>
                  <div className={`history-amount ${isIncome(type) ? 'income' : 'expense'}`}>
                    ${Number(total).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;