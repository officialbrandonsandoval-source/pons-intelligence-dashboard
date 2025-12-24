import axios from 'axios';

// API base URL contract:
// - ALWAYS comes from import.meta.env.VITE_API_URL
// - MUST be set (even in dev)
// - All callers must use absolute endpoints (never relative /api/...)
const RAW_API_BASE = import.meta.env.VITE_API_URL;

if (!RAW_API_BASE || String(RAW_API_BASE).trim().length === 0) {
  const message =
    'Missing VITE_API_URL. Set VITE_API_URL to your backend base URL (e.g. https://your-backend.com).';
  // Explicitly log for visibility in production builds.
  // eslint-disable-next-line no-console
  console.error(message);
  throw new Error(message);
}

const API_BASE = String(RAW_API_BASE).trim().replace(/\/+$/, '');

// Build an absolute URL from the API base.
// Disallows relative URLs to avoid accidental same-origin calls in production.
export function apiUrl(pathname) {
  if (!pathname || typeof pathname !== 'string') {
    throw new Error('apiUrl(pathname) requires a non-empty string');
  }

  if (/^https?:\/\//i.test(pathname)) {
    return pathname;
  }

  // All API calls must be absolute and under /api/...
  if (!pathname.startsWith('/api/')) {
    throw new Error(
      `API path must be absolute and start with "/api/": received "${pathname}"`
    );
  }

  return `${API_BASE}${pathname}`;
}

const API_KEY = (import.meta.env.VITE_API_KEY ?? '').toString().trim();

class APIError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.payload = payload;
  }
}

// Shared axios instance for the whole app.
// - baseURL uses API_BASE
// - x-api-key header comes from VITE_API_KEY
export const axiosClient = axios.create({
  // Keep baseURL set for convenience, but apiClient below still forces absolute URLs.
  // This prevents accidental same-origin requests if someone passes a relative path.
  baseURL: API_BASE,
  headers: API_KEY ? { 'x-api-key': API_KEY } : {},
});

// Simplified axios instance (requested contract):
// - baseURL MUST come from VITE_API_URL
// - default content-type json
// NOTE: We keep x-api-key attached because this backend requires it.
export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
  },
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  // Preserve backend auth requirements.
  if (API_KEY) config.headers['x-api-key'] = API_KEY;
  return config;
});

api.interceptors.response.use(
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

axiosClient.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  if (API_KEY) config.headers['x-api-key'] = API_KEY;
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
    const res = await axiosClient.get(apiUrl(endpoint), config);
    return res.data;
  },

  async post(endpoint, data, config) {
    const res = await axiosClient.post(apiUrl(endpoint), data, config);
    return res.data;
  },

  async postFormData(endpoint, formData, config) {
    const res = await axiosClient.post(apiUrl(endpoint), formData, {
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
    const res = await axiosClient.put(apiUrl(endpoint), data, config);
    return res.data;
  },

  async delete(endpoint, config) {
    const res = await axiosClient.delete(apiUrl(endpoint), config);
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

// GHL connection status
// Requirement: GET {VITE_API_URL}/api/auth/ghl/status?userId=dev
export const getGHLStatus = async (userId) => {
  const id = (userId ?? '').toString().trim();
  if (!id) {
    throw new Error('getGHLStatus requires userId');
  }

  const res = await api.get('/api/auth/ghl/status', {
    params: { userId: id },
  });

  return res.data;
};

export { APIError };
