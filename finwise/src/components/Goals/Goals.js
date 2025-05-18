import React, { useState } from 'react';
import './Goals.css';

const Goals = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: '2024-12-31',
      category: 'Savings'
    },
    {
      id: 2,
      title: 'New Car',
      targetAmount: 25000,
      currentAmount: 8000,
      deadline: '2025-06-30',
      category: 'Purchase'
    },
    {
      id: 3,
      title: 'Vacation Fund',
      targetAmount: 5000,
      currentAmount: 3200,
      deadline: '2024-08-01',
      category: 'Travel'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: 'Savings'
  });

  const calculateProgress = (current, target) => {
    return (current / target) * 100;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const goalToAdd = {
      id: goals.length + 1,
      ...newGoal,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount)
    };
    setGoals(prev => [...prev, goalToAdd]);
    setShowAddForm(false);
    setNewGoal({
      title: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      category: 'Savings'
    });
  };

  return (
    <div className="goals-container">
      <div className="goals-header">
        <h1>Financial Goals</h1>
        <p>Track and manage your financial objectives</p>
        <button 
          className="add-goal-button"
          onClick={() => setShowAddForm(true)}
        >
          + Add New Goal
        </button>
      </div>

      {showAddForm && (
        <div className="add-goal-form">
          <h2>Create New Goal</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Goal Title</label>
              <input
                type="text"
                name="title"
                value={newGoal.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Emergency Fund"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Target Amount</label>
                <input
                  type="number"
                  name="targetAmount"
                  value={newGoal.targetAmount}
                  onChange={handleInputChange}
                  required
                  placeholder="$"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label>Current Amount</label>
                <input
                  type="number"
                  name="currentAmount"
                  value={newGoal.currentAmount}
                  onChange={handleInputChange}
                  required
                  placeholder="$"
                  min="0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={newGoal.deadline}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  name="category"
                  value={newGoal.category}
                  onChange={handleInputChange}
                >
                  <option value="Savings">Savings</option>
                  <option value="Investment">Investment</option>
                  <option value="Purchase">Purchase</option>
                  <option value="Travel">Travel</option>
                  <option value="Education">Education</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">Create Goal</button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="goals-grid">
        {goals.map(goal => (
          <div key={goal.id} className="goal-card">
            <div className="goal-header">
              <div className="goal-category">{goal.category}</div>
              <h3>{goal.title}</h3>
            </div>
            
            <div className="goal-amounts">
              <div className="current-amount">
                ${goal.currentAmount.toLocaleString()}
                <span>saved</span>
              </div>
              <div className="target-amount">
                of ${goal.targetAmount.toLocaleString()}
              </div>
            </div>

            <div className="goal-progress">
              <div 
                className="progress-bar"
                style={{ width: `${calculateProgress(goal.currentAmount, goal.targetAmount)}%` }}
              ></div>
            </div>

            <div className="goal-footer">
              <div className="deadline">
                <span>Deadline:</span>
                {new Date(goal.deadline).toLocaleDateString()}
              </div>
              <button className="update-btn">Update Progress</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Goals; 