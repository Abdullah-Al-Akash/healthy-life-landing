import { publicApi } from './client';

export const orderApi = {
  // অর্ডার তৈরি - পাবলিক (লগইন লাগবে না)
  create: (data) => publicApi.post('/orders', data),
  
  // অর্ডার ট্র্যাক - পাবলিক
  track: (orderId) => publicApi.get(`/orders/track/${orderId}`),
};