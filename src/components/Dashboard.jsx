import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (Array.isArray(response.data)) {
          setTransactions(response.data);
        } else {
          throw new Error('Invalid data format');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const chartData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        label: 'Amount',
        data: [
          transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
          Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Financial Dashboard</h2>
      {transactions.length > 0 ? (
        <>
          <div className="dashboard-chart">
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Income vs Expenses' } } }} />
          </div>
          <h3 className="dashboard-subtitle">Recent Transactions</h3>
          <div className="dashboard-table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map((transaction, index) => (
                  <tr key={index}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.description}</td>
                    <td className={transaction.amount >= 0 ? 'positive-amount' : 'negative-amount'}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td>{transaction.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="dashboard-no-data">
          <p>No transactions available. Please upload a bank statement.</p>
          <Link to="/upload" className="dashboard-upload-link">Upload CSV</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;