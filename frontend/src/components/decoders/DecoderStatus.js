import React, { useState, useEffect } from 'react';
import { decoderService } from '../services/decoderService';

const DecoderStatus = ({ decoder, onBack }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const statusData = await decoderService.getDecoderStatus(decoder.id);
      setStatus(statusData);
    } catch (err) {
      setError(err.message || 'Failed to fetch status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [decoder.id]);

  const handleOperation = async (operation) => {
    setLoading(true);
    try {
      let result;
      switch(operation) {
        case 'restart':
          result = await decoderService.restartDecoder(decoder.id);
          setTimeout(fetchStatus, 30000); // Refresh after expected restart time
          break;
        case 'shutdown':
          result = await decoderService.shutdownDecoder(decoder.id);
          await fetchStatus();
          break;
        case 'reinit':
          result = await decoderService.reinitDecoder(decoder.id);
          await fetchStatus();
          break;
        default:
          break;
      }
      return result;
    } catch (err) {
      setError(err.message || `Failed to ${operation} decoder`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-4 shadow">
      <div className="card-header d-flex justify-content-between align-items-center bg-primary text-white">
        <h5 className="mb-0">Decoder #{decoder.id}</h5>
        <button className="btn btn-light btn-sm" onClick={onBack}>
          Back
        </button>
      </div>

      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="row mb-4">
          <div className="col-md-6">
            <h6>Basic Information</h6>
            <ul className="list-group">
              <li className="list-group-item">
                <strong>IP Address:</strong> {decoder.adresseIp}
              </li>
              <li className="list-group-item">
                <strong>Assigned to:</strong> 
                {decoder.client ? decoder.client.nom : 'Unassigned'}
              </li>
            </ul>
          </div>

          <div className="col-md-6">
            <h6>Decoder Status</h6>
            {loading && !status ? (
              <div className="alert alert-info">Loading status...</div>
            ) : status ? (
              <ul className="list-group">
                <li className="list-group-item">
                  <strong>State:</strong> {status.state || 'Unknown'}
                </li>
                <li className="list-group-item">
                  <strong>Last Restart:</strong> {status.lastRestart || 'Never'}
                </li>
                <li className="list-group-item">
                  <strong>Last Reinit:</strong> {status.lastReinit || 'Never'}
                </li>
              </ul>
            ) : (
              <div className="alert alert-warning">No status available</div>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <button
            className="btn btn-warning"
            onClick={() => handleOperation('restart')}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Restart'}
          </button>
          
          <button
            className="btn btn-danger"
            onClick={() => handleOperation('shutdown')}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Shutdown'}
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={() => handleOperation('reinit')}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Reinit Password'}
          </button>
          
          <button
            className="btn btn-info"
            onClick={fetchStatus}
            disabled={loading}
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default DecoderStatus;