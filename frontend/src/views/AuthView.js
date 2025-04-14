import React, { useState } from 'react';
import Login from '../components/auth/Login';
import { loginUser } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const AuthView = ({ onLogin }) => {
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    motDePasse: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (credentials) => {
    setLoading(true);
    setError(null);
    setFieldErrors({ email: '', motDePasse: '' });
    
    try {
      const response = await loginUser(credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        onLogin(response.user);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.errorType === "email") {
        setFieldErrors(prev => ({
          ...prev,
          email: "Email incorrect"
        }));
      } else if (err.response?.data?.errorType === "password") {
        setFieldErrors(prev => ({
          ...prev,
          motDePasse: "Mot de passe incorrect"
        }));
      } else {
        setError(err.message || 'Erreur de connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  return React.createElement('div', { className: 'auth-container' },
    React.createElement('div', { className: 'auth-card slide-in' },
      React.createElement('div', { className: 'card-header text-center' },
        React.createElement('h2', null, 'Decoder Management System')
      ),
      React.createElement('div', { className: 'card-body' },
        error && React.createElement('div', { 
          className: 'alert alert-danger',
          style: { color: 'red' } 
        }, error),
        React.createElement(Login, { 
          onSubmit: handleSubmit, 
          loading: loading,
          fieldErrors: fieldErrors
        })
      )
    )
  );
};

export default AuthView;