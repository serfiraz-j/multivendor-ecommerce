import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Django sunucu adresin
  headers: {
    'Content-Type': 'application/json',
  },
});

// Her istek atıldığında localStorage'daki token'ı kontrol et ve header'a ekle
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;