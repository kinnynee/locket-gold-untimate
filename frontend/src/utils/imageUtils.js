// src/utils/imageUtils.js

/**
 * Tạo Object URL từ File
 */
export const createObjectUrl = (file) => URL.createObjectURL(file);

/**
 * Giải phóng Object URL
 */
export const revokeObjectUrl = (url) => URL.revokeObjectURL(url);

/**
 * Kiểm tra file có phải ảnh không
 */
export const isImageFile = (file) => file?.type?.startsWith('image/');

/**
 * Kiểm tra file có phải video không
 */
export const isVideoFile = (file) => file?.type?.startsWith('video/');

/**
 * Format kích thước file
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};

/**
 * Tạo CSS filter string từ adjustment values
 */
export const buildCSSFilter = (adjustments, filterCss = '') => {
  const { brightness = 0, contrast = 0, saturation = 0, sharpness = 0 } = adjustments;

  const brightnessVal = 1 + brightness / 100;
  const contrastVal = 1 + contrast / 100;
  const saturateVal = 1 + saturation / 100;

  const adjustFilter = [
    `brightness(${brightnessVal.toFixed(2)})`,
    `contrast(${contrastVal.toFixed(2)})`,
    `saturate(${saturateVal.toFixed(2)})`,
  ].join(' ');

  return `${filterCss} ${adjustFilter}`.trim();
};

/**
 * Download blob dưới dạng file
 */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Validate file type
 */
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Chỉ hỗ trợ JPEG, PNG, WEBP, GIF' };
  }
  if (file.size > 20 * 1024 * 1024) {
    return { valid: false, error: 'File quá lớn (tối đa 20MB)' };
  }
  return { valid: true };
};

export const validateVideoFile = (file) => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/avi', 'video/mov'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Chỉ hỗ trợ MP4, WEBM, AVI, MOV' };
  }
  if (file.size > 500 * 1024 * 1024) {
    return { valid: false, error: 'File quá lớn (tối đa 500MB)' };
  }
  return { valid: true };
};

/**
 * Lấy kích thước ảnh
 */
export const getImageDimensions = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = url;
  });
};
