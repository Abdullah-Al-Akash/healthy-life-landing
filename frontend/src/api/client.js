import axios from 'axios';

// পাবলিক API - কোনো টোকেন লাগবে না
export const publicApi = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// প্রাইভেট API - শুধু অ্যাডমিন প্যানেলের জন্য টোকেন লাগবে
export const privateApi = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// শুধু প্রাইভেট এ টোকেন যোগ হবে
privateApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);