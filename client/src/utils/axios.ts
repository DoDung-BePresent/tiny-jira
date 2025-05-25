import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const options = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

const API = axios.create(options);

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default API;
