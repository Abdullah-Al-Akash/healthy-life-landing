import { publicApi, privateApi } from './client';

export const incompleteOrderApi = {
  create: (data) => publicApi.post('/incomplete-orders', data),
  getAll: () => privateApi.get('/incomplete-orders'),
  delete: (id) => privateApi.delete(`/incomplete-orders/${id}`),
};