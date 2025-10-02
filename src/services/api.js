import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

export const getAllProducts = () => api.get('/public/products');
export const getProductById = (id) => api.get(`/public/products/${id}`);
export const getAllCategories = () => api.get('/public/categories');

export const getMyProfile = () => api.get(`/user/profile`);
export const getMyOrders = () => api.get('/user/orders');
export const createOrder = (data) => api.post('/user/orders', data);
export const addProductToOrder = (id, productId, quantity) =>
  api.post(`/user/orders/${id}/add-product?productId=${productId}&quantity=${quantity}`);
