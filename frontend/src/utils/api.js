import axios from 'axios';

// Constants for decoder simulator
const SIMULATOR_URL = 'https://wflageol-uqtr.net/decoder';
const CODE_PERMANENT = 'SOLO87370400';
const API_BASE_URL = 'http://localhost:5000/api'; // Your backend base URL

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const loginUser = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};

// Client API
export const getClients = async () => {
  const response = await axios.get('/clients');
  return response.data;
};

export const createClient = async (clientData) => {
  const response = await axios.post('/clients', clientData);
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await axios.delete(`/clients/${id}`);
  return response.data;
};

// Decoder API
export const getDecoders = async () => {
  const response = await axios.get('/decodeurs');
  return response.data;
};

export const assignDecoder = async (decoderId, clientId) => {
  const response = await axios.put(`/decodeurs/${decoderId}/assign`, { clientId });
  return response.data;
};

export const unassignDecoder = async (decoderId) => {
  const response = await axios.put(`/decodeurs/${decoderId}/unassign`);
  return response.data;
};

// Channel Management - Corrected versions

// In your api.js
// utils/api.js
export const addChannel = async (decoderId, channelName) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token found');

  try {
    const response = await axios.put(
      `/decodeurs/${decoderId}/channels`,
      { chaine: channelName }, // Must match backend expectation
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('API Error:', {
      url: `/decodeurs/${decoderId}/channels`,
      request: { chaine: channelName },
      response: error.response?.data
    });
    throw error;
  }
};
export const removeChannel = async (decoderId, channelName) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.delete(
      `/decodeurs/${decoderId}/channels/${encodeURIComponent(channelName)}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error removing channel:', {
      url: `/decodeurs/${decoderId}/channels/${channelName}`,
      error: error.response?.data || error.message
    });
    throw error;
  }
};

// Decoder Operations (using simulator API)
export const getDecoderStatus = async (ipAddress) => {
  const response = await axios.post(SIMULATOR_URL, {
    id: CODE_PERMANENT,
    address: ipAddress,
    action: 'info'
  });
  return response.data;
};

export const restartDecoder = async (ipAddress) => {
  const response = await axios.post(SIMULATOR_URL, {
    id: CODE_PERMANENT,
    address: ipAddress,
    action: 'reset'
  });
  return response.data;
};

export const reinitDecoder = async (ipAddress) => {
  const response = await axios.post(SIMULATOR_URL, {
    id: CODE_PERMANENT,
    address: ipAddress,
    action: 'reinit'
  });
  return response.data;
};

export const shutdownDecoder = async (ipAddress) => {
  const response = await axios.post(SIMULATOR_URL, {
    id: CODE_PERMANENT,
    address: ipAddress,
    action: 'shutdown'
  });
  return response.data;
};

// Helper function to fetch all decoders from simulator
export const fetchAllSimulatorDecoders = async () => {
  try {
    const response = await axios.get(`https://wflageol-uqtr.net/list?id=${CODE_PERMANENT}`);
    return response.data.decoders || [];
  } catch (error) {
    console.error('Error fetching decoders from simulator:', error);
    return [];
  }
};

// Alias for getDecoderStatus
export const getDecoderInfo = getDecoderStatus;