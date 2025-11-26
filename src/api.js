import axios from 'axios';

const BASE_URL = 'https://backend-production-4c9e.up.railway.app/'; // Change to your backend URL

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Token handling
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// AUTH
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const getGoogleUrl = () => api.get('/auth/google/url');
export const getUser = () => api.get('/auth/user');
export const logout = () => api.post('/auth/logout');

// GOOGLE OAUTH
export const googleCallback = (code) => api.get(`/auth/google/callback?code=${code}`);

// UPLOAD
export const uploadImage = (formData) => api.post('/detection/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

// CHAT
export const sendChat = (data) => api.post('/chat', data);

// HISTORY
export const getHistory = () => api.get('/history');

// PROFILE
export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.post('/profile/update', data);
export const updateProfileImage = (formData) => api.post('/profile/image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
