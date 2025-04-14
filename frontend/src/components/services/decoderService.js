import axios from 'axios';
import { getAuthHeader } from './authService';

const API_BASE = '/api/decodeurs';

export const decoderService = {
  // Get decoder list
  async getDecoders() {
    const response = await axios.get(API_BASE, getAuthHeader());
    return response.data;
  },

  // Get decoder details
  async getDecoderDetails(id) {
    const response = await axios.get(`${API_BASE}/${id}`, getAuthHeader());
    return response.data;
  },

  // Get decoder status
  async getDecoderStatus(id) {
    const response = await axios.get(`${API_BASE}/${id}/status`, getAuthHeader());
    return response.data;
  },

  // Decoder operations
  async restartDecoder(id) {
    const response = await axios.post(
      `${API_BASE}/${id}/restart`, 
      {},
      getAuthHeader()
    );
    return response.data;
  },

  async shutdownDecoder(id) {
    const response = await axios.post(
      `${API_BASE}/${id}/shutdown`, 
      {},
      getAuthHeader()
    );
    return response.data;
  },

  async reinitDecoder(id) {
    const response = await axios.post(
      `${API_BASE}/${id}/reinit`, 
      {},
      getAuthHeader()
    );
    return response.data;
  },

  // Channel management
  async addChannel(decoderId, channel) {
    const response = await axios.put(
      `${API_BASE}/${decoderId}/channels`,
      { channel },
      getAuthHeader()
    );
    return response.data;
  },

  async removeChannel(decoderId, channel) {
    const response = await axios.delete(
      `${API_BASE}/${decoderId}/channels/${encodeURIComponent(channel)}`,
      getAuthHeader()
    );
    return response.data;
  },

  // Assignment
  async assignDecoder(decoderId, clientId) {
    const response = await axios.put(
      `${API_BASE}/${decoderId}/assign`,
      { clientId },
      getAuthHeader()
    );
    return response.data;
  },

  async unassignDecoder(decoderId) {
    const response = await axios.put(
      `${API_BASE}/${decoderId}/unassign`,
      {},
      getAuthHeader()
    );
    return response.data;
  }
};