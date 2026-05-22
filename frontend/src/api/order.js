import { publicApi } from './client';

export const orderApi = {
  // অর্ডার তৈরি
  create: (orderData) => publicApi.post('/orders', orderData),
  
  // অর্ডার ট্র্যাক (পুরনো - শুধু অর্ডার আইডি)
  track: (orderId) => publicApi.get(`/orders/track/${orderId}`),
  
  // নতুন সার্চ এপিআই (অর্ডার আইডি বা ফোন নাম্বার)
  search: (query) => publicApi.get(`/orders/search?q=${encodeURIComponent(query)}`),
};