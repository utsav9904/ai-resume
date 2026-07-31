import axios from 'axios';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'http://localhost:5000') {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.PROD) return '';
  return 'http://localhost:5000';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return reject without forced window redirect to prevent login loop
    return Promise.reject(error);
  }
);

export default api;
