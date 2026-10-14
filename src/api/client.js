import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-App': 'customer',
  },
  withCredentials: true,
});

let inFlightRefresh = null;
const refreshAccessToken = () => {
  if (!inFlightRefresh) {
    inFlightRefresh = axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true, headers: { 'X-Client-App': 'customer' } })
      .then((response) => response.data.accessToken)
      .finally(() => { inFlightRefresh = null; });
  }
  return inFlightRefresh;
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Let the browser set the multipart boundary instead of the default JSON type.
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRequest = originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/two-factor') ||
      originalRequest?.url?.includes('/auth/forget-password') ||
      originalRequest?.url?.includes('/auth/reset-password') ||
      originalRequest?.url?.includes('/auth/refresh-token');
    const roleMismatch = error.response?.status === 403 &&
      error.response?.data?.message?.includes('Access restricted to [CUSTOMER]');

    if (roleMismatch && !isAuthRequest) {
      localStorage.removeItem('accessToken');
      if (window.location.pathname !== '/login') window.location.assign('/login');
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      try {
        const accessToken = await refreshAccessToken();
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
