// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Базовый URL из .env
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Добавляем интерсепторы (опционально)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Обработка 401 ошибки
    }
    return Promise.reject(error);
  }
);
export default api;