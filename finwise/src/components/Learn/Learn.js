import React, { useState } from 'react';
import './Learn.css';

const Learn = () => {
  const [selectedModule, setSelectedModule] = useState(null);

  const modules = [
    {
      id: 1,
      title: 'Budgeting Basics',
      description: 'Learn the fundamentals of creating and maintaining a budget',
      lessons: [
        'Understanding Income and Expenses',
        'Creating a Monthly Budget',
        'Tracking Your Spending',
        'Setting Financial Goals'
      ],
      icon: '📊'
    },
    {
      id: 2,
      title: 'Saving Strategies',
      description: 'Discover effective ways to save money and build wealth',
      lessons: [
        'Emergency Fund Basics',
        'Saving Methods and Techniques',
        'Automating Your Savings',
        'Investment Fundamentals'
      ],
      icon: '💰'
    },
    {
      id: 3,
      title: 'Debt Management',
      description: 'Learn how to manage and reduce debt effectively',
      lessons: [
        'Understanding Different Types of Debt',
        'Debt Repayment Strategies',
        'Avoiding Bad Debt',
        'Credit Score Basics'
      ],
      icon: '📈'
    },
    {
      id: 4,
      title: 'Investment 101',
      description: 'Introduction to basic investment concepts and strategies',
      lessons: [
        'Investment Vehicle Types',
        'Risk and Return Basics',
        'Portfolio Diversification',
        'Long-term Investment Strategies'
      ],
      icon: '📱'
    }
  ];

  return (
    <div className="learn-container">
      <div className="learn-header">
        <h1>Financial Education</h1>
        <p>Enhance your financial knowledge with our comprehensive learning modules</p>
      </div>

      <div className="modules-grid">
        {modules.map(module => (
          <div 
            key={module.id} 
            className={`module-card ${selectedModule === module.id ? 'active' : ''}`}
            onClick={() => setSelectedModule(module.id === selectedModule ? null : module.id)}
          >
            <div className="module-icon">{module.icon}</div>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
            
            {selectedModule === module.id && (
              <div className="lessons-list">
                <h4>Lessons:</h4>
                <ul>
                  {module.lessons.map((lesson, index) => (
                    <li key={index}>
                      <span className="lesson-number">{index + 1}</span>
                      {lesson}
                    </li>
                  ))}
                </ul>
                <button className="start-module-btn">
                  Start Learning
                  <span className="btn-icon">→</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="learning-progress">
        <h2>Your Learning Progress</h2>
        <div className="progress-cards">
          <div className="progress-card">
            <div className="progress-info">
              <h4>Completed Modules</h4>
              <span className="progress-value">2/4</span>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: '50%' }}></div>
            </div>
          </div>
          <div className="progress-card">
            <div className="progress-info">
              <h4>Lessons Completed</h4>
              <span className="progress-value">8/16</span>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: '50%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn; 