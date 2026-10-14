import api from './client';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (data) => api.post('/auth/forget-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.patch('/auth/profile', data),
  uploadProfileImage: (file) => {
    const form = new FormData();
    form.append('profileImage', file);
    return api.put('/auth/profile/image', form);
  },
  removeProfileImage: () => api.delete('/auth/profile/image'),
  enableTwoFactor: () => api.post('/auth/two-factor/enable'),
  confirmEnableTwoFactor: (otp) => api.post('/auth/two-factor/confirm-enable', { otp }),
  disableTwoFactor: () => api.post('/auth/two-factor/disable'),
  confirmDisableTwoFactor: (otp) => api.post('/auth/two-factor/confirm-disable', { otp }),
  verifyTwoFactorLogin: (data) => api.post('/auth/two-factor/verify-login', data),
  cancelTwoFactorLogin: (data) => api.post('/auth/two-factor/cancel-login', data),
};

export const setAuthTokens = (accessToken) => {
  localStorage.setItem('accessToken', accessToken);
};

export const clearAuthTokens = () => {
  localStorage.removeItem('accessToken');
};

export const getAccessToken = () => localStorage.getItem('accessToken');

export const isAuthenticated = () => !!localStorage.getItem('accessToken');
