// src/api/index.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 120000, // 2 phút cho xử lý video
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
    return Promise.reject(new Error(message));
  }
);

// ── Image APIs ──
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const applyFilter = (imageId, filterKey, adjustments = {}) => {
  return api.post('/filter/apply', { image_id: imageId, filter: filterKey, adjustments });
};

export const applyAdjustments = (imageId, adjustments) => {
  return api.post('/adjust', { image_id: imageId, ...adjustments });
};

export const applyFrame = (imageId, frameId) => {
  return api.post('/frame/apply', { image_id: imageId, frame_id: frameId });
};

export const downloadImage = (imageId) => {
  return api.get(`/download/image/${imageId}`, { responseType: 'blob' });
};

export const getAISuggestion = (imageId) => {
  return api.post('/ai/suggest', { image_id: imageId });
};

// ── Video APIs ──
export const uploadVideo = (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload/video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      const pct = Math.round((e.loaded * 100) / e.total);
      onProgress?.(pct);
    },
  });
};

export const applyVideoFilter = (videoId, filterKey) => {
  return api.post('/filter/video', { video_id: videoId, filter: filterKey });
};

export const downloadVideo = (videoId) => {
  return api.get(`/download/video/${videoId}`, { responseType: 'blob' });
};

// ── Photobooth APIs ──
export const createPhotobooth = (imageIds, layoutId, frameId) => {
  return api.post('/photobooth/create', { image_ids: imageIds, layout_id: layoutId, frame_id: frameId });
};

// ── Gallery APIs ──
export const getGallery = () => {
  return api.get('/gallery');
};

export const deleteGalleryItem = (id) => {
  return api.delete(`/gallery/${id}`);
};

export default api;
