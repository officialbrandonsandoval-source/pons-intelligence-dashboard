import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './styles/theme.css';

// Startup validation: fail fast instead of silent network errors.
const maskKey = (key) => {
  if (!key) return '';
  const str = String(key);
  if (str.length <= 8) return '********';
  return `${str.slice(0, 4)}…${str.slice(-4)}`;
};

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

if (import.meta.env.DEV) {
  console.log('[api]', {
    baseURL: API_URL,
    apiKey: maskKey(API_KEY),
  });
}

if (typeof API_URL === 'string' && API_URL.includes(':8000')) {
  throw new Error(
    'Fatal: VITE_API_URL contains :8000. Refusing to start to prevent misrouted API traffic.'
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
