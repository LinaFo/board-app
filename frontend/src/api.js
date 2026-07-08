import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data) => API.post('/users/register', data);
export const login = (data) => API.post('/users/login', data);

export const getAds = (params) => API.get('/ads', { params });
export const getAd = (id) => API.get(`/ads/${id}`);
export const createAd = (data) => API.post('/ads', data);
export const updateAd = (id, data) => API.put(`/ads/${id}`, data);
export const deleteAd = (id) => API.delete(`/ads/${id}`);
export const getMyAds = () => API.get('/ads/me');
export const getComments = (adId) => API.get(`/comments/${adId}`);
export const createComment = (data) => API.post('/comments', data);
export const deleteComment = (id) => API.delete(`/comments/${id}`);
export const likeComment = (commentId) => API.post('/comments/like', { commentId });
export const getLikedAds = () => API.get('/ads/liked');
export const likeAd = (adId) => API.post('/ads/like', { adId });
export const getAdLikes = (adId) => API.get(`/ads/${adId}/likes`);


export default API;