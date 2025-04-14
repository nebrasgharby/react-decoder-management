import React, { useState, useEffect } from 'react';
import ClientList from '../components/clients/ClientList';
import ClientForm from '../components/clients/ClientForm';
import { getClients, createClient, deleteClient } from '../utils/api';

const ClientsView = () => {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

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
      fetchClients();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(id);
        fetchClients();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return React.createElement('div', { className: 'slide-in' },
    React.createElement('div', { className: 'd-flex justify-content-between mb-4' },
      React.createElement('h2', null, 'Clients Management'),
      React.createElement('button', {
        className: 'btn btn-primary',
        onClick: () => setShowForm(true)
      }, 'Add Client')
    ),
    error && React.createElement('div', { className: 'alert alert-danger' }, error),
    showForm &&
      React.createElement(ClientForm, {
        onSubmit: handleCreate,
        onCancel: () => setShowForm(false)
      }),
    React.createElement(ClientList, {
      clients: clients,
      onDelete: handleDelete,
      loading: loading
    })
  );
};

export default ClientsView;