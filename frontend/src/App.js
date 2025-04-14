import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';
import { checkAuth, logout } from './utils/auth';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authData = await checkAuth();
        if (authData) {
          persistAuth(true, authData.user);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const persistAuth = (authenticated, userData) => {
    setIsAuthenticated(authenticated);
    setUser(userData);
    localStorage.setItem('isAuthenticated', authenticated);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const clearAuth = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  const handleLogin = (userData) => {
    persistAuth(true, userData);
  };

  const handleLogout = () => {
    logout();
    clearAuth();
  };

  if (loading) {
    return React.createElement(
      'div',
      { className: 'auth-container' },
      React.createElement('div', { className: 'spinner' }, 'Loading...')
    );
  }

  return React.createElement(
    Router,
    null,
    React.createElement(
      Routes,
      null,
      React.createElement(Route, {
        path: '/auth',
        element: !isAuthenticated
          ? React.createElement(AuthView, { onLogin: handleLogin })
          : React.createElement(Navigate, { to: '/dashboard', replace: true })
      }),
      React.createElement(Route, {
        path: '/dashboard/*',
        element: isAuthenticated
          ? React.createElement(DashboardView, { user: user, onLogout: handleLogout })
          : React.createElement(Navigate, { to: '/auth', replace: true })
      }),
      React.createElement(Route, {
        path: '*',
        element: React.createElement(Navigate, {
          to: isAuthenticated ? '/dashboard' : '/auth',
          replace: true
        })
      })
    )
  );
};

export default App;