import React from 'react';

const DecoderActionsModal = ({ decoder, status, onClose, onRefresh }) => {
  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Decoder #{decoder.id} Details</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Basic Information</h6>
                <ul className="list-group">
                  <li className="list-group-item">
                    <strong>IP Address:</strong> {decoder.adresseIp}
                  </li>
                  <li className="list-group-item">
                    <strong>Model:</strong> {decoder.model || 'N/A'}
                  </li>
                  <li className="list-group-item">
                    <strong>State:</strong> {decoder.etat || 'Unknown'}
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <h6>Status Information</h6>
                {status ? (
                  <ul className="list-group">
                    {Object.entries(status).map(([key, value]) => (
                      <li key={key} className="list-group-item">
                        <strong>{key}:</strong> {String(value)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="alert alert-info">Loading status...</div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button className="btn btn-primary" onClick={onRefresh}>
              Refresh Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecoderActionsModal;