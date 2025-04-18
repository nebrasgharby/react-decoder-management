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

  return (
    <div className="auth-container d-flex justify-content-center align-items-center min-vh-100">
      <div className="auth-card slide-in card shadow-lg" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card-header bg-primary text-white text-center py-3">
          <h2 className="m-0">
            <i className="fas fa-satellite-dish me-2"></i>
            Decoder Management System
          </h2>
        </div>
        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger mb-4">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}
          <Login 
            onSubmit={handleSubmit} 
            loading={loading}
            fieldErrors={fieldErrors}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthView;