import { privateApi } from './client';

export const adminApi = {
  // Products
  getProducts: () => privateApi.get('/products'),
  getProductById: (id) => privateApi.get(`/products/id/${id}`),
  createProduct: (data) => privateApi.post('/products', data),
  updateProduct: (id, data) => privateApi.put(`/products/${id}`, data),
  deleteProduct: (id) => privateApi.delete(`/products/${id}`),
  toggleProduct: (id) => privateApi.patch(`/products/${id}/toggle`),
  
  // Orders
  getOrders: () => privateApi.get('/orders'),
  getOrderById: (id) => privateApi.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => privateApi.put(`/orders/${id}/status`, { status }),
  sendToCourier: (id, provider) => privateApi.post(`/orders/${id}/courier`, { provider }),
  
  // Users (Admin only)
  getUsers: () => privateApi.get('/auth/users'),
  createAdmin: (data) => privateApi.post('/auth/users/admin', data),
  updateUserRole: (id, role) => privateApi.put(`/auth/users/${id}/role`, { role }),
  deleteUser: (id) => privateApi.delete(`/auth/users/${id}`),
};