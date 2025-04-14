import React, { useState, useEffect } from 'react';
import { 
  getClients, 
  deleteClient,
  assignDecoder, 
  unassignDecoder,
  getDecoders,
  restartDecoder,
  reinitDecoder,
  shutdownDecoder,
  getDecoderStatus,
  addChannel,
  removeChannel
} from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { decodeToken } from '../../utils/auth';
import { BiTrash, BiInfoCircle,  BiPowerOff, BiReset, BiArrowBack } from 'react-icons/bi';

const ClientsList = () => {
  const { user } = useAuth();
  const [currentRole, setCurrentRole] = useState(null);
  const [clients, setClients] = useState([]);
  const [decoders, setDecoders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showDecoderList, setShowDecoderList] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentActionClient, setCurrentActionClient] = useState(null);
  const [channelName, setChannelName] = useState('');
  const [currentDecoder, setCurrentDecoder] = useState(null);
  const [showChannels, setShowChannels] = useState({});

  const toggleChannels = (decoderId) => {
    setShowChannels(prev => ({
      ...prev,
      [decoderId]: !prev[decoderId]
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await Promise.all([
          getClients(),
          getDecoders()
        ]);

        if (user?.role) {
          setCurrentRole(user.role);
        } else {
          const token = localStorage.getItem('token');
          if (token) {
            const decoded = decodeToken(token);
            setCurrentRole(decoded?.role);
          }
        }

        setClients(response[0] || []);
        setDecoders(response[1] || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    
    try {
      setLoading(true);
      await deleteClient(clientId);
      setClients(clients.filter(client => client.id !== clientId));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete client');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (decoderId) => {
    if (!decoderId || !currentActionClient?.id) return;
    
    try {
      setLoading(true);
      await assignDecoder(decoderId, currentActionClient.id);
      await refreshData();
      setShowDecoderList(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to assign decoder');
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async (decoderId) => {
    if (!decoderId || !currentActionClient?.id) return;
    
    try {
      setLoading(true);
      await unassignDecoder(decoderId);
      await refreshData();
      setShowDecoderList(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to unassign decoder');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await Promise.all([
        getClients(),
        getDecoders()
      ]);
      setClients(response[0] || []);
      setDecoders(response[1] || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const handleDecoderOperation = async (operation, decoderIp) => {
    try {
      setLoading(true);
      let result;
      
      switch(operation) {
        case 'restart':
          result = await restartDecoder(decoderIp);
          break;
        case 'reinit':
          result = await reinitDecoder(decoderIp);
          break;
        case 'shutdown':
          result = await shutdownDecoder(decoderIp);
          break;
        case 'info':
          result = await getDecoderStatus(decoderIp);
          break;
        default:
          throw new Error('Unknown operation');
      }

      if (result.response === 'OK') {
        if (operation === 'restart') {
          alert('Decoder restart initiated. It may take 10-30 seconds.');
        }
        await refreshData();
        return result;
      } else {
        throw new Error(result.message || 'Operation failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleChannelOperation = async (operation, decoderId, channelNameToRemove = null) => {
    const channel = channelNameToRemove || channelName;
    
    if (!channel.trim()) {
      setError('Channel name cannot be empty');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let result;
      if (operation === 'add') {
        result = await addChannel(decoderId, channel);
      } else {
        result = await removeChannel(decoderId, channel);
      }

      if (result) {
        setChannelName('');
        await refreshData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const getClientDecoders = (clientId) => {
    return decoders.filter(d => d?.clientId === clientId);
  };

  const getUnassignedDecoders = () => {
    return decoders.filter(d => !d?.clientId);
  };

  const showDecodersForAction = (client, action) => {
    setCurrentActionClient(client);
    setCurrentAction(action);
    setShowDecoderList(true);
  };

  const showDecoderDetails = async (decoder) => {
    setCurrentDecoder(decoder);
    try {
      const status = await handleDecoderOperation('info', decoder.adresseIp);
      setCurrentDecoder({
        ...decoder,
        state: status.state,
        lastRestart: status.lastRestart,
        lastReinit: status.lastReinit
      });
    } catch (err) {
      console.error('Failed to get decoder status:', err);
    }
  };

  if (!currentRole) {
    return <div className="container-fluid p-4">Loading user data...</div>;
  }

  return (
    <div className="container-fluid p-4">
      <div className="card mb-4">
        <div className="card-body">
          <h1 className="mb-0">Dashboard</h1>
          <p className="text-muted">Welcome, {currentRole}</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">Clients Management</h2>
        </div>
        
        <div className="card-body">
          {error && (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)}
              />
            </div>
          )}
{showDecoderList && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentAction === 'assign' ? 'Assign Decoder' : 'Unassign Decoder'} to {currentActionClient?.nom || currentActionClient?.name}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDecoderList(false)}
                />
              </div>
              <div className="modal-body p-0">
                <div className="list-group">
                  {currentAction === 'assign' ? (
                    getUnassignedDecoders().length > 0 ? (
                      getUnassignedDecoders().map(decoder => (
                        <button
                          key={decoder.id}
                          className="list-group-item list-group-item-action"
                          onClick={() => handleAssign(decoder.id)}
                        >
                          <div className="d-flex justify-content-between">
                            <span>Decoder {decoder.adresseIp}</span>
                            <span className={`badge ${
                              decoder.etat === 'ACTIF' ? 'bg-success' : 'bg-danger'
                            }`}>
                              {decoder.etat}
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="alert alert-info m-3">No unassigned decoders available</div>
                    )
                  ) : (
                    getClientDecoders(currentActionClient?.id).length > 0 ? (
                      getClientDecoders(currentActionClient?.id).map(decoder => (
                        <button
                          key={decoder.id}
                          className="list-group-item list-group-item-action"
                          onClick={() => handleUnassign(decoder.id)}
                        >
                          <div className="d-flex justify-content-between">
                            <span>Decoder {decoder.adresseIp}</span>
                            <span className={`badge ${
                              decoder.etat === 'ACTIF' ? 'bg-success' : 'bg-danger'
                            }`}>
                              {decoder.etat}
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="alert alert-info m-3">No decoders assigned to this client</div>
                    )
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDecoderList(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : clients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <div className="alert alert-info">
                        No clients found
                      </div>
                    </td>
                  </tr>
                ) : (
                  clients.map(client => (
                    <React.Fragment key={client.id}>
                      <tr>
                        <td>{client.id}</td>
                        <td>{client.nom || client.name}</td>
                        <td>{client.email}</td>
                        <td>
                          <span className={`badge ${
                            client.role === 'ADMIN' ? 'bg-danger' : 'bg-info'
                          }`}>
                            {client.role}
                          </span>
                        </td>
                        
                        <td>
                          <div className="d-flex gap-2 align-items-center">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => showDecodersForAction(client, 'assign')}
                              disabled={loading}
                            >
                              Assign
                            </button>
                            
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => showDecodersForAction(client, 'unassign')}
                              disabled={loading || getClientDecoders(client.id).length === 0}
                            >
                              Unassign
                            </button>
                            
                            <button
                              className={`btn btn-sm ${selectedClient === client.id ? 'btn-secondary' : 'btn-primary'}`}
                              onClick={() => setSelectedClient(selectedClient === client.id ? null : client.id)}
                              disabled={loading}
                            >
                              {selectedClient === client.id ? 'Hide' : 'Show'}
                            </button>
                            
                            <button
                              className="btn btn-sm btn-danger ms-2"
                              onClick={() => handleDeleteClient(client.id)}
                              disabled={loading}
                              title="Delete client"
                            >
                              <BiTrash className="me-1" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {selectedClient === client.id && (
                        <tr>
                          <td colSpan="5" className="p-0">
                            <div className="p-3 bg-light">
                              <h5 className="mb-3">Decoders for {client.nom || client.name}</h5>
                              {getClientDecoders(client.id).length > 0 ? (
                                <div className="row g-3">
                                  {getClientDecoders(client.id).map(decoder => (
                                    <div key={decoder.id} className="col-md-6 col-lg-4">
                                      <div className="card h-100">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                          <span className="fw-bold">{decoder.adresseIp}</span>
                                          <span className={`badge ${
                                            decoder.etat === 'ACTIF' ? 'bg-success' : 'bg-danger'
                                          }`}>
                                            {decoder.etat}
                                          </span>
                                        </div>
                                        <div className="card-body">
                                          <div className="d-flex flex-wrap gap-2 mb-3">
                                            <button
                                              className="btn btn-sm btn-outline-info"
                                              onClick={() => showDecoderDetails(decoder)}
                                              disabled={loading}
                                            >
                                              <BiInfoCircle className="me-1" /> Info
                                            </button>
                                            <button
                                              className="btn btn-sm btn-outline-primary"
                                              onClick={() => toggleChannels(decoder.id)}
                                              disabled={loading}
                                            >
                                               {showChannels[decoder.id] ? 'Hide' : 'Show'} Channels
                                            </button>
                                            <button
                                              className="btn btn-sm btn-outline-warning"
                                              onClick={() => handleDecoderOperation('restart', decoder.adresseIp)}
                                              disabled={loading}
                                            >
                                              <BiReset className="me-1" /> Restart
                                            </button>
                                            <button
                                              className="btn btn-sm btn-outline-secondary"
                                              onClick={() => handleDecoderOperation('reinit', decoder.adresseIp)}
                                              disabled={loading}
                                            >
                                              <BiArrowBack className="me-1" /> Reinit
                                            </button>
                                            <button
                                              className="btn btn-sm btn-outline-danger"
                                              onClick={() => handleDecoderOperation('shutdown', decoder.adresseIp)}
                                              disabled={loading}
                                            >
                                              <BiPowerOff className="me-1" /> Shutdown
                                            </button>
                                          </div>

                                          {showChannels[decoder.id] && (
                                            <div className="mt-3">
                                              <h6>Channel Management</h6>
                                              
                                              <div className="input-group mb-3">
                                                <input
                                                  type="text"
                                                  className="form-control"
                                                  placeholder="Channel name"
                                                  value={channelName}
                                                  onChange={(e) => setChannelName(e.target.value)}
                                                  onKeyPress={(e) => e.key === 'Enter' && handleChannelOperation('add', decoder.id)}
                                                />
                                                <button
                                                  className="btn btn-success"
                                                  onClick={() => handleChannelOperation('add', decoder.id)}
                                                  disabled={loading}
                                                >
                                                  <i className="bi bi-plus"></i> Add
                                                </button>
                                              </div>

                                              {decoder.chaines?.length > 0 ? (
                                                <ul className="list-group">
                                                  {decoder.chaines.map((channel, index) => (
                                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                      {channel}
                                                      <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleChannelOperation('remove', decoder.id, channel)}
                                                        disabled={loading}
                                                      >
                                                        <BiTrash className="me-1" /> Remove
                                                      </button>
                                                    </li>
                                                  ))}
                                                </ul>
                                              ) : (
                                                <div className="alert alert-info">No channels assigned</div>
                                              )}
                                            </div>
                                          )}

                                          {currentDecoder?.id === decoder.id && (
                                            <div className="mt-2 small">
                                              <p><strong>State:</strong> {currentDecoder.state || 'Unknown'}</p>
                                              <p><strong>Last Restart:</strong> {currentDecoder.lastRestart || 'Unknown'}</p>
                                              <p><strong>Last Reinit:</strong> {currentDecoder.lastReinit || 'Unknown'}</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="alert alert-warning d-flex align-items-center">
                                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                  No decoder assigned to this client
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default ClientsList;