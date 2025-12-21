import axios from 'axios';

const VITE_ENV = (typeof import.meta !== 'undefined' ? import.meta.env : undefined) || {};

// Requirements:
// - baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
// Practical behavior:
// - If VITE_API_URL is unset in-browser, use same-origin so requests hit the current host
//   (avoids accidentally calling localhost:3000 in production).
// - Never hardcode localhost:5173.
const API_BASE_URL = (
  VITE_ENV.VITE_API_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
).replace(/\/$/, '');

const API_KEY = VITE_ENV.VITE_API_KEY ?? '';

class APIError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.payload = payload;
  }
}

// Shared axios instance for the whole app.
// - baseURL uses required fallback
// - x-api-key always attached (even when empty)
export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': API_KEY,
  },
});

axiosClient.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers['x-api-key'] = API_KEY;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const payload = err?.response?.data;
    const message =
      payload?.message ||
      payload?.error ||
      err?.message ||
      (status ? `API Error: ${status}` : 'API Error');
    return Promise.reject(new APIError(message, { status, payload }));
  }
);

export const apiClient = {
  async get(endpoint, config) {
    const res = await axiosClient.get(endpoint, config);
    return res.data;
  },

  async post(endpoint, data, config) {
    const res = await axiosClient.post(endpoint, data, config);
    return res.data;
  },

  async postFormData(endpoint, formData, config) {
    const res = await axiosClient.post(endpoint, formData, {
      ...config,
      headers: {
        ...(config?.headers || {}),
        // Let axios set the boundary automatically.
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async put(endpoint, data, config) {
    const res = await axiosClient.put(endpoint, data, config);
    return res.data;
  },

  async delete(endpoint, config) {
    const res = await axiosClient.delete(endpoint, config);
    return res.data;
  },
};

export const connectGHL = async (userId, apiKey, locationId) => {
  if (!userId || !apiKey || !locationId) {
    throw new Error('Missing required fields: userId, apiKey, locationId');
  }

  return apiClient.post('/api/auth/ghl', {
    userId,
    apiKey,
    locationId,
  });
};

export { APIError };
