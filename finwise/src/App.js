import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import BudgetManager from './components/Budget/BudgetManager';
import Auth from './components/Auth/Auth';
import Home from './components/Home/Home';
import Learn from './components/Learn/Learn';
import Goals from './components/Goals/Goals';
import config from './config';
import './components/Budget/BudgetManager.css';

// Components
function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">FinWise</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/budget">Budget</Link>
        <Link to="/learn">Learn</Link>
        <Link to="/goals">Goals</Link>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

function Budget() {
  return (
    <div className="budget">
      <h2>Budget Tracker</h2>
      <BudgetManager />
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/logout`, {
        method: 'POST',
        headers: {
          'Authorization': localStorage.getItem('token')
        }
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navbar onLogout={handleLogout} />}
        <main className="main-content">
          <Routes>
            <Route path="/auth" element={
              !isAuthenticated 
                ? <Auth onLogin={handleLogin} />
                : <Navigate to="/" replace />
            } />
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/budget" element={
              <ProtectedRoute>
                <Budget />
              </ProtectedRoute>
            } />
            <Route path="/learn" element={
              <ProtectedRoute>
                <Learn />
              </ProtectedRoute>
            } />
            <Route path="/goals" element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
