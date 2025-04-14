// In ChannelManagement.js
import React, { useState } from 'react';

const ChannelManagement = ({ decoder, onAddChannel, onRemoveChannel, onBack }) => {
  const [newChannel, setNewChannel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAdd = async () => {
    if (!newChannel.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onAddChannel(decoder.id, newChannel.trim());
      setNewChannel('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Decoder #{decoder.id} Channel Management</h5>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          Back to Status
        </button>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="mb-4">
          <h6>Current Channels</h6>
          {decoder.chaines?.length > 0 ? (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {decoder.chaines.map(channel => (
                <div key={channel} className="badge bg-primary p-2 d-flex align-items-center">
                  {channel}
                  <button
                    className="btn-close btn-close-white ms-2"
                    onClick={() => onRemoveChannel(decoder.id, channel)}
                    disabled={loading}
                    aria-label="Remove"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">No channels assigned</div>
          )}
        </div>

        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={newChannel}
            onChange={(e) => setNewChannel(e.target.value)}
            placeholder="Channel name"
            disabled={loading}
          />
          <button
            className="btn btn-success"
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Channel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelManagement;