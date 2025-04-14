import { useState } from 'react';
import { decoderService } from '../components/services/decoderService';

export const useDecoders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOperation = async (operation, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation(...args);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return {
    loading,
    error,
    getAllDecoders: () => handleOperation(decoderService.getAllDecoders),
    getDecoderDetails: (id) => handleOperation(decoderService.getDecoderDetails, id),
    getDecoderStatus: (id) => handleOperation(decoderService.getDecoderStatus, id),
    assignDecoder: (decoderId, clientId) => handleOperation(decoderService.assignDecoder, decoderId, clientId),
    unassignDecoder: (decoderId) => handleOperation(decoderService.unassignDecoder, decoderId),
    restartDecoder: (decoderId) => handleOperation(decoderService.restartDecoder, decoderId),
    shutdownDecoder: (decoderId) => handleOperation(decoderService.shutdownDecoder, decoderId),
    reinitDecoder: (decoderId) => handleOperation(decoderService.reinitDecoder, decoderId),
    addChannel: (decoderId, channel) => handleOperation(decoderService.addChannel, decoderId, channel),
    removeChannel: (decoderId, channel) => handleOperation(decoderService.removeChannel, decoderId, channel),
    deleteDecoder: (decoderId) => handleOperation(decoderService.deleteDecoder, decoderId)
  };
};