import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to FinWise</h1>
        <p className="hero-subtitle">Your personal finance companion for smarter money management</p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Track Expenses</h3>
          <p>Monitor your daily spending and income with easy-to-use tools</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Budget Analysis</h3>
          <p>Get insights into your spending patterns and financial habits</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Set Goals</h3>
          <p>Create and track your financial goals with progress monitoring</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <h3>Learn Finance</h3>
          <p>Access educational resources to improve your financial literacy</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn add-expense">
            <span>Add Expense</span>
            <span className="btn-icon">+</span>
          </button>
          <button className="action-btn view-budget">
            <span>View Budget</span>
            <span className="btn-icon">→</span>
          </button>
          <button className="action-btn set-goal">
            <span>Set New Goal</span>
            <span className="btn-icon">🎯</span>
          </button>
          <button className="action-btn learn">
            <span>Start Learning</span>
            <span className="btn-icon">📚</span>
          </button>
        </div>
      </div>

      <div className="tips-section">
        <h2>Financial Tips</h2>
        <div className="tips-carousel">
          <div className="tip-card">
            <h4>Saving Tip</h4>
            <p>Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings</p>
          </div>
          <div className="tip-card">
            <h4>Investment Tip</h4>
            <p>Start investing early to benefit from compound interest</p>
          </div>
          <div className="tip-card">
            <h4>Budgeting Tip</h4>
            <p>Track every expense for a month to understand your spending</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 