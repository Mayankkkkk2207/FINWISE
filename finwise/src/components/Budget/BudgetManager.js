import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

const BudgetManager = () => {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch transactions from backend
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError('Failed to load transactions. Please try again later.');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateBalance = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + parseFloat(transaction.amount) 
        : total - parseFloat(transaction.amount);
    }, 0);
  };

  // Calculate total income
  const calculateIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + parseFloat(t.amount), 0);
  };

  // Calculate total expenses
  const calculateExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + parseFloat(t.amount), 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTransaction.description || !newTransaction.amount) return;

    try {
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({
          description: newTransaction.description,
          amount: parseFloat(newTransaction.amount),
          type: newTransaction.type
        })
      });

      if (!response.ok) throw new Error('Failed to add transaction');
      
      const addedTransaction = await response.json();
      setTransactions(prev => [...prev, addedTransaction]);
      setError(null);
      
      // Reset form
      setNewTransaction({
        description: '',
        amount: '',
        type: 'expense'
      });
    } catch (err) {
      setError('Failed to add transaction. Please try again.');
      console.error('Error adding transaction:', err);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });

      if (!response.ok) throw new Error('Failed to delete transaction');
      
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete transaction. Please try again.');
      console.error('Error deleting transaction:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading transactions...</div>;
  }

  return (
    <div className="budget-manager">
      {error && <div className="error-message">{error}</div>}
      
      <div className="balance-section">
        <h3>Current Balance</h3>
        <div className="balance">${calculateBalance().toFixed(2)}</div>
        <div className="balance-stats">
          <div className="stat income-stat">
            <span>Total Income</span>
            <span className="income-amount">+${calculateIncome().toFixed(2)}</span>
          </div>
          <div className="stat expense-stat">
            <span>Total Expenses</span>
            <span className="expense-amount">-${calculateExpenses().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <input
            type="text"
            name="description"
            value={newTransaction.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="amount"
            value={newTransaction.amount}
            onChange={handleInputChange}
            placeholder="Amount"
            step="0.01"
            min="0"
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <select
            name="type"
            value={newTransaction.type}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Add Transaction</button>
      </form>

      <div className="transactions-list">
        <h3>Recent Transactions</h3>
        {transactions.length === 0 ? (
          <div className="no-transactions">No transactions yet</div>
        ) : (
          transactions.map(transaction => (
            <div 
              key={transaction.id} 
              className={`transaction-item ${transaction.type}`}
            >
              <div className="transaction-info">
                <div className="transaction-details">
                  <span className="description">{transaction.description}</span>
                  <span className="transaction-date">
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                </div>
                <span className="amount">
                  {transaction.type === 'income' ? '+' : '-'}
                  ${parseFloat(transaction.amount).toFixed(2)}
                </span>
              </div>
              <button 
                onClick={() => deleteTransaction(transaction.id)}
                className="delete-btn"
                title="Delete transaction"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BudgetManager; 