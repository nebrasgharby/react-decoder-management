import React, { useState } from 'react';

const Login = ({ onSubmit, loading, fieldErrors }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    motDePasse: ''
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(credentials);
  };

  // Style pour les messages d'erreur en rouge
  const errorStyle = {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: '0.25rem'
  };

  return React.createElement('form', { onSubmit: handleSubmit },
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Email'),
      React.createElement('input', {
        type: 'email',
        className: `form-control ${fieldErrors?.email ? 'is-invalid' : ''}`,
        name: 'email',
        value: credentials.email,
        onChange: handleChange,
        required: true,
        style: fieldErrors?.email ? { borderColor: 'red' } : {}
      }),
      fieldErrors?.email && React.createElement('div', { 
        style: errorStyle 
      }, fieldErrors.email)
    ),
    React.createElement('div', { className: 'form-group' },
      React.createElement('label', null, 'Mot de passe'),
      React.createElement('input', {
        type: 'password',
        className: `form-control ${fieldErrors?.motDePasse ? 'is-invalid' : ''}`,
        name: 'motDePasse',
        value: credentials.motDePasse,
        onChange: handleChange,
        required: true,
        style: fieldErrors?.motDePasse ? { borderColor: 'red' } : {}
      }),
      fieldErrors?.motDePasse && React.createElement('div', { 
        style: errorStyle 
      }, fieldErrors.motDePasse)
    ),
    React.createElement('button', {
      type: 'submit',
      className: 'btn btn-primary btn-block',
      disabled: loading,
      style: { marginTop: '1rem' }
    }, loading ? 'Chargement...' : 'Se connecter')
  );
};

export default Login;