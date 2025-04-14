import React from 'react';
import { restartDecoder, reinitDecoder, addChannel, removeChannel } from '../utils/api';

const DecoderActions = ({ decoder, onUpdate }) => {
  const [channelInput, setChannelInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOperation = async (operation) => {
    try {
      setLoading(true);
      let response;
      
      switch(operation) {
        case 'reset':
          response = await restartDecoder(decoder.id);
          break;
        case 'reinit':
          response = await reinitDecoder(decoder.id);
          break;
        default:
          break;
      }
      
      onUpdate(); // Refresh parent component
      return response;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChannel = async () => {
    if (!channelInput.trim()) return;
    try {
      await addChannel(decoder.id, channelInput.trim());
      setChannelInput('');
      onUpdate();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveChannel = async (channel) => {
    try {
      await removeChannel(decoder.id, channel);
      onUpdate();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="decoder-actions">
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="btn-group">
        <button
          className="btn btn-sm btn-warning"
          onClick={() => handleOperation('reset')}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Reset'}
        </button>
        <button
          className="btn btn-sm btn-info"
          onClick={() => handleOperation('reinit')}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Reinit'}
        </button>
      </div>
      
      <div className="channel-management">
        <h5>Channel Management</h5>
        <div className="input-group">
          <input
            type="text"
            value={channelInput}
            onChange={(e) => setChannelInput(e.target.value)}
            placeholder="Channel name"
          />
          <button
            className="btn btn-sm btn-success"
            onClick={handleAddChannel}
          >
            Add
          </button>
        </div>
        
        <ul className="channel-list">
          {decoder.chaines?.map(channel => (
            <li key={channel}>
              {channel}
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleRemoveChannel(channel)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DecoderActions;