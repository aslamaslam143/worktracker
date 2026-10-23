import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});

let tokenGetter = null;

export const setAuthTokenGetter = (getter) => {
  tokenGetter = getter;
};

api.interceptors.request.use(async (config) => {
  if (tokenGetter) {
    try {
      const token = await tokenGetter();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error('Failed to get Clerk session token:', err);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;