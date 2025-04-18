import React, { useState, useEffect } from 'react';
import ClientList from '../components/clients/ClientList';
import ClientForm from '../components/clients/ClientForm';
import { getClients, createClient, deleteClient } from '../utils/api';

const ClientsView = () => {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchClients();
  }, [refreshTrigger]); // Add refreshTrigger as dependency

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await getClients();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (clientData) => {
    try {
      await createClient(clientData);
      setShowForm(false);
      setRefreshTrigger(prev => prev + 1); // This will trigger the useEffect
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(id);
        setRefreshTrigger(prev => prev + 1); // This will trigger the useEffect
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="slide-in">
      <div className="d-flex justify-content-between mb-4">
        <h2>Clients Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          Add Client
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
          />
        </div>
      )}

      {showForm && (
        <ClientForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}

      <ClientList
        clients={clients}
        onDelete={handleDelete}
        loading={loading}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
};

export default ClientsView;