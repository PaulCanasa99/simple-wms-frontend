import axios from 'axios';
import { getStoredToken } from '../auth/storage';

const envApiUrl = (import.meta.env.VITE_API_URL ?? '').trim();

export const hasRealApi = envApiUrl.length > 0;
export const apiBaseURL = envApiUrl || '/api';

export const client = axios.create({
  baseURL: apiBaseURL,
  timeout: 10_000,
});

client.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});
