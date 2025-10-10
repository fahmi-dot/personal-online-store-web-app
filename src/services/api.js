import axios from 'axios';
import { store } from "../redux/store";
import { logout, setToken } from "../redux/slices/authSlice";

const API_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const { auth } = store.getState();
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { auth } = store.getState();
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await api.post("/auth/refresh", {
          refreshToken: auth.refreshToken,
        });
        const newAccessToken = response.data.data.accessToken;

        store.dispatch(setToken(newAccessToken));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

export const getAllProducts = () => api.get('/public/products');
export const getProductById = (id) => api.get(`/public/products/${id}`);
export const getAllCategories = () => api.get('/public/categories');
export const getCategoryById = (id) => api.get(`/public/categories/${id}`);

export const getMyProfile = () => api.get(`/user/profile`);
export const getMyOrders = () => api.get('/user/orders');
export const createOrder = (data) => api.post('/user/orders', data);
export const getMyCart = () => api.get('/user/cart')
export const addProductToCart = (data) => api.post('/user/cart', data);
