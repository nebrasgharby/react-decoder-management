// In DecoderOperations.js
import React from 'react';

const DecoderOperations = ({ decoder, onRestart, onShutdown, onReinit, onBack }) => {
  const handleOperation = async (operation) => {
    const confirmMessage = {
      restart: 'Are you sure you want to restart this decoder?',
      shutdown: 'Are you sure you want to shutdown this decoder?',
      reset: 'Are you sure you want to reset the password?'
    }[operation];

    if (window.confirm(confirmMessage)) {
      try {
        switch(operation) {
          case 'restart':
            await onRestart(decoder.id);
            break;
          case 'shutdown':
            await onShutdown(decoder.id);
            break;
          case 'reset':
            await onReinit(decoder.id);
            break;
        }
      } catch (error) {
        console.error('Operation failed:', error);
      }
    }
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Decoder #{decoder.id} Operations</h5>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          Back to Status
        </button>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4 mb-3">
            <button
              className="btn btn-warning btn-block"
              onClick={() => handleOperation('restart')}
            >
              Restart Decoder
            </button>
          </div>
          <div className="col-md-4 mb-3">
            <button
              className="btn btn-danger btn-block"
              onClick={() => handleOperation('shutdown')}
            >
              Shutdown Decoder
            </button>
          </div>
          <div className="col-md-4 mb-3">
            <button
              className="btn btn-info btn-block"
              onClick={() => handleOperation('reset')}
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecoderOperations;