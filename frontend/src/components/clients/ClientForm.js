import React, { useState } from 'react';

const ClientForm = ({ onSubmit, onCancel }) => {
  const [client, setClient] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    role: 'CLIENT'
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(client);
    } catch (err) {      
      setError(err.response?.message || 'Erreur inconnue');
    }
  };

  return (
    <div className="form-card">
      <h2>Ajouter un utilisateur</h2>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label>
          Nom :
          <input
            type="text"
            name="nom"
            value={client.nom}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email :
          <input
            type="email"
            name="email"
            value={client.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Mot de passe :
          <input
            type="password"
            name="motDePasse"
            value={client.motDePasse}
            onChange={handleChange}
            required
            minLength={6}
          />
        </label>

        <label>
          Rôle :
          <select
            name="role"
            value={client.role}
            onChange={handleChange}
          >
            <option value="CLIENT">Client</option>
            <option value="ADMIN">Admin</option>
          </select>
        </label>

        <div className="form-actions">
          <button type="button" className="btn cancel" onClick={onCancel}>Annuler</button>
          <button type="submit" className="btn submit">Créer</button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
