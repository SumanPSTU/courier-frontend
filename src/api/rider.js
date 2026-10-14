import api from './client';

export const riderApi = {
  apply: (data) => api.post('/rider/apply', data),
  getApplyRequirements: (vehicleType) => api.get('/rider/apply/requirements', { params: { vehicleType } }),
  getMyApplicationStatus: () => api.get('/rider/application/status'),
};
