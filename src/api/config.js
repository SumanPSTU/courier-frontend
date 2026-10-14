const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (import.meta.env.PROD && !configuredBaseUrl) {
  throw new Error('VITE_API_BASE_URL must be configured for production builds.');
}

export const API_BASE_URL = (configuredBaseUrl || 'http://localhost:5003/api').replace(/\/+$/, '');
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');
