import React from 'react';

const DecoderList = ({ decoders, loading, currentUser, onSelect, onAssign, onUnassign }) => {
  if (loading) return <div>Loading decoders...</div>;

  // Group decoders by client
  const decodersByClient = decoders.reduce((acc, decoder) => {
    const clientId = decoder.clientId || 'unassigned';
    if (!acc[clientId]) {
      acc[clientId] = {
        client: decoder.client,
        decoders: []
      };
    }
    acc[clientId].decoders.push(decoder);
    return acc;
  }, {});

  return (
    <div className="decoder-list">
      <h2>Decoder Management</h2>
      
      {Object.entries(decodersByClient).map(([clientId, { client, decoders }]) => (
        <div key={clientId} className="client-group">
          <h3>
            {client ? client.nom : 'Unassigned Decoders'}
            {clientId === 'unassigned' && currentUser.role === 'ADMIN' && (
              <span className="badge">Unassigned</span>
            )}
          </h3>
          
          <div className="decoder-grid">
            {decoders.map(decoder => (
              <div key={decoder.id} className="decoder-card">
                <div className="decoder-info">
                  <h4>Decoder #{decoder.id}</h4>
                  <p>IP: {decoder.adresseIp}</p>
                  <button 
                    className="btn btn-info"
                    onClick={() => onSelect(decoder)}
                  >
                    View Status
                  </button>
                </div>
                
                <div className="decoder-actions">
                  {!decoder.clientId && currentUser.role === 'ADMIN' && (
                    <button
                      className="btn btn-success"
                      onClick={() => onAssign(decoder.id)}
                    >
                      Assign to Me
                    </button>
                  )}
                  
                  {decoder.clientId === currentUser.id && (
                    <button
                      className="btn btn-warning"
                      onClick={() => onUnassign(decoder.id)}
                    >
                      Unassign
                    </button>
                  )}
                  
                  {decoder.clientId && decoder.clientId !== currentUser.id && (
                    <span className="badge">
                      Assigned to {decoder.client.nom}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DecoderList;