import { publicApi, privateApi } from './client';

export const authApi = {
  // পাবলিক
  login: (email, password) => publicApi.post('/auth/login', { email, password }),
  register: (data) => publicApi.post('/auth/register', data),
  
  // প্রাইভেট (অ্যাডমিন প্যানেল)
  getProfile: () => privateApi.get('/auth/me'),           // ← /profile এর জায়গায় /me
  updateProfile: (data) => privateApi.put('/auth/profile', data),
  changePassword: (data) => privateApi.put('/auth/change-password', data),
  
  // ইউজার ম্যানেজমেন্ট (অ্যাডমিন)
  getUsers: () => privateApi.get('/auth/users'),
  createAdmin: (data) => privateApi.post('/auth/users/admin', data),
  updateRole: (id, role) => privateApi.put(`/auth/users/${id}/role`, { role }),
  deleteUser: (id) => privateApi.delete(`/auth/users/${id}`),
};