import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (payload) => api.post('/auth/login', payload).then((res) => res.data),
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data),
  me: () => api.get('/auth/me').then((res) => res.data),
};

export const productApi = {
  list: (params = {}) => api.get('/products', { params }).then((res) => res.data),
  get: (id) => api.get(`/products/${id}`).then((res) => res.data),
  create: (payload) => api.post('/products', payload).then((res) => res.data),
  update: (id, payload) => api.put(`/products/${id}`, payload).then((res) => res.data),
  remove: (id) => api.delete(`/products/${id}`).then((res) => res.data),
};

export const cartApi = {
  get: () => api.get('/cart').then((res) => res.data),
  add: (productId, quantity = 1) =>
    api.post('/cart/add', { productId, quantity }).then((res) => res.data),
  update: (productId, quantity) =>
    api.put('/cart/quantity', { productId, quantity }).then((res) => res.data),
  remove: (productId) => api.delete('/cart/remove', { data: { productId } }).then((res) => res.data),
};

export const tryOnApi = {
  send: (formData) =>
    api
      .post('/tryon', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data),
};

export const chatApi = {
  send: (message) => api.post('/chat', { message }).then((res) => res.data),
};

export default api;
