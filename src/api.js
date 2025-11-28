import axios from 'axios';

const BASE_URL = 'https://backend-production-4c9e.up.railway.app/'; 
// const BASE_URL="http://127.0.0.1:8000";
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // Changed to false to avoid CORS issues with wildcard origins
});

// Token handling
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 200 OK with error in body
api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.error) {
      return Promise.reject(new Error(response.data.error));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// AUTH
export const signup = (data) => api.post('/auth/signup', data);
export const login = (data) => api.post('/auth/login', data);
export const getGoogleUrl = () => api.get('/auth/google/url');
export const getUser = () => api.get('/auth/user');
export const logout = () => api.post('/auth/logout');

// GOOGLE OAUTH
export const googleCallback = (code) => api.get(`/auth/google/callback?code=${code}`);

// UPLOAD
export const uploadImage = (formData) => {
  console.log('Uploading image to backend...');
  console.log('Target URL:', `${BASE_URL}/detection/upload`);
  for (let pair of formData.entries()) {
    console.log('FormData:', pair[0], pair[1]);
  }
  // Do NOT set Content-Type manually for FormData, let the browser set it with the boundary
  return api.post('/detection/upload', formData).then(res => {
    console.log('Upload successful:', res.data);
    return res;
  }).catch(err => {
    console.error('Upload error:', err.message);
    if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
    } else if (err.request) {
        console.error('No response received. Request was made but no response.');
        console.error('Request details:', err.request);
    } else {
        console.error('Error setting up request:', err.message);
    }
    throw err;
  });
};

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
