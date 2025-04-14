import React, { useState, useEffect } from 'react';
import { 
  getDecoders, 
  getDecoderStatus,
  restartDecoder,
  reinitDecoder,
  shutdownDecoder
} from '../utils/api';

const DecodersView = ({ user }) => {
  const [decoders, setDecoders] = useState([]);
  const [selectedDecoder, setSelectedDecoder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [decoderDetails, setDecoderDetails] = useState(null);

  useEffect(() => {
    fetchDecoders();
  }, [user]); // Add user to dependency array

  const fetchDecoders = async () => {
    setLoading(true);
    try {
      const allDecoders = await getDecoders();
      
      // Filter decoders based on user role
      const filteredDecoders = user.role === 'ADMIN' 
        ? allDecoders 
        : allDecoders.filter(decoder => decoder.clientId === user.id);
      
      setDecoders(filteredDecoders);
    } catch (err) {
      setError(err.message);
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
          alert('Redémarrage du décodeur initié. Cela peut prendre 10-30 secondes.');
        }
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

  const fetchDecoderDetails = async (decoder) => {
    try {
      setLoading(true);
      const status = await handleDecoderOperation('info', decoder.adresseIp);
      setDecoderDetails({
        ...decoder,
        state: status.state,
        lastRestart: status.lastRestart,
        lastReinit: status.lastReinit
      });
    } catch (err) {
      console.error('Failed to get decoder status:', err);
      setError('Impossible de récupérer les détails du décodeur');
    } finally {
      setLoading(false);
    }
  };

  const handleShowInfo = async (decoder) => {
    setSelectedDecoder(decoder);
    await fetchDecoderDetails(decoder);
  };

  const handleCloseInfo = () => {
    setSelectedDecoder(null);
    setDecoderDetails(null);
  };

  const handleOperation = async (operation) => {
    if (!selectedDecoder) return;
    
    try {
      await handleDecoderOperation(operation, selectedDecoder.adresseIp);
      // Refresh details after operation
      await fetchDecoderDetails(selectedDecoder);
    } catch (err) {
      console.error(`Operation ${operation} failed:`, err);
    }
  };

  return (
    <div className="decoders-view">
      {error && (
        <div className="alert alert-danger">
          {error}
          <button 
            type="button" 
            className="close-btn" 
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}
      
      <h2 className="decoders-title">
        {user.role === 'ADMIN' ? 'Tous les décodeurs' : 'Mes décodeurs'}
      </h2>
      
      {loading && !decoderDetails ? (
        <div className="loading-spinner">Chargement...</div>
      ) : (
        <div className="decoders-container">
          {decoders.length > 0 ? (
            decoders.map(decoder => (
              <div key={decoder.id} className="decoder-card">
                <div className="decoder-info">
                  <h3>Décodeur #{decoder.id}</h3>
                  <p>IP: {decoder.adresseIp}</p>
                  
                </div>
                
                <button 
                  className="info-btn"
                  onClick={() => handleShowInfo(decoder)}
                  disabled={loading}
                >
                  Info
                </button>
              </div>
            ))
          ) : (
            <div className="no-decoders">
              {user.role === 'ADMIN' 
                ? 'Aucun décodeur disponible' 
                : 'Aucun décodeur ne vous est attribué'}
            </div>
          )}
        </div>
      )}

      {selectedDecoder && decoderDetails && (
        <div className="decoder-details-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={handleCloseInfo}>×</button>
            <h3>Détails du Décodeur #{selectedDecoder.id}</h3>
            
            <div className="decoder-status">
              <p><strong>Adresse IP:</strong> {decoderDetails.adresseIp}</p>
              <p><strong>État:</strong> <span className={`status-badge ${decoderDetails.state.toLowerCase()}`}>
                {decoderDetails.state || 'INCONNU'}
              </span></p>
              <p><strong>Dernier redémarrage:</strong> {decoderDetails.lastRestart || 'Inconnu'}</p>
              <p><strong>Dernière réinitialisation:</strong> {decoderDetails.lastReinit || 'Inconnu'}</p>
              
              <div className="decoder-actions">
                <button 
                  className="action-btn restart-btn"
                  onClick={() => handleOperation('restart')}
                  disabled={loading}
                >
                  Redémarrer
                </button>
                <button 
                  className="action-btn reinit-btn"
                  onClick={() => handleOperation('reinit')}
                  disabled={loading}
                >
                  Réinitialiser
                </button>
                <button 
                  className="action-btn shutdown-btn"
                  onClick={() => handleOperation('shutdown')}
                  disabled={loading}
                >
                  Éteindre
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .decoders-view {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .decoders-title {
          color: #333;
          margin-bottom: 20px;
        }
        
        .decoders-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .decoder-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          display: flex;
          flex-direction: column;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .decoder-info {
          margin-bottom: 15px;
        }
        
        .status-badge {
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.9em;
        }
        
        .status-badge.actif, .status-badge.active {
          background: #d4edda;
          color: #155724;
        }
        
        .status-badge.inactif, .status-badge.inactive {
          background: #f8d7da;
          color: #721c24;
        }
        
        .info-btn {
          background: #17a2b8;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          align-self: flex-start;
          margin-top: auto;
        }
        
        .info-btn:hover {
          background: #138496;
        }
        
        .info-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
        
        .decoder-details-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 500px;
          width: 100%;
          position: relative;
        }
        
        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 1.5em;
          cursor: pointer;
        }
        
        .decoder-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        
        .action-btn {
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .restart-btn {
          background: #ffc107;
          color: #212529;
        }
        
        .reinit-btn {
          background: #17a2b8;
          color: white;
        }
        
        .shutdown-btn {
          background: #dc3545;
          color: white;
        }
        
        .no-decoders {
          text-align: center;
          padding: 40px;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
};

export default DecodersView;