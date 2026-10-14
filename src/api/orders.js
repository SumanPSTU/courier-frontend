import api from './client';

export const ordersApi = {
  estimate: (data) => api.post('/orders/estimate', data),
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  // Tracking IDs are often copied with the display-only "#" prefix.
  track: (trackingId) => api.get(`/orders/tracking/${encodeURIComponent(String(trackingId).trim().replace(/^#/, ''))}`),
  getPricingConfig: () => api.get('/pricing'),
};
