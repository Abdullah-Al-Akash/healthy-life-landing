import { publicApi, privateApi } from './client';

export const authApi = {
  // পাবলিক
  login: (email, password) => publicApi.post('/auth/login', { email, password }),
  
  // প্রাইভেট (অ্যাডমিন প্যানেল)
  getProfile: () => privateApi.get('/auth/profile'),
  getUsers: () => privateApi.get('/auth/users'),
  updateRole: (id, role) => privateApi.put(`/auth/users/${id}/role`, { role }),
  deleteUser: (id) => privateApi.delete(`/auth/users/${id}`),
};