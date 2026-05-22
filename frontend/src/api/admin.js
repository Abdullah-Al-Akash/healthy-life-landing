import { privateApi } from './client';

export const adminApi = {
  // প্রোডাক্ট ম্যানেজমেন্ট
  createProduct: (data) => privateApi.post('/products', data),
  updateProduct: (id, data) => privateApi.put(`/products/${id}`, data),
  deleteProduct: (id) => privateApi.delete(`/products/${id}`),
  
  // অর্ডার ম্যানেজমেন্ট
  getOrders: () => privateApi.get('/orders'),
  updateOrderStatus: (id, status) => privateApi.put(`/orders/${id}/status`, { status }),
  
  // ইউজার ম্যানেজমেন্ট
  getUsers: () => privateApi.get('/auth/users'),
  createAdmin: (data) => privateApi.post('/auth/users/admin', data),
  deleteUser: (id) => privateApi.delete(`/auth/users/${id}`),
};