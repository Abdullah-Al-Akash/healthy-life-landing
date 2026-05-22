import { publicApi } from './client';

export const productApi = {
  // পাবলিক রাউট - টোকেন লাগবে না
  getAll: () => publicApi.get('/products'),
  getBySlug: (slug) => publicApi.get(`/products/slug/${slug}`),
};