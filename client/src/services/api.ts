import axios from 'axios';

const getBaseUrl = () => {
  // In production (Vercel), always use relative path so /api/* hits Vercel serverless functions
  if (import.meta.env.PROD) return '';
  // In local dev, use VITE_API_URL or default to localhost:5000
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
