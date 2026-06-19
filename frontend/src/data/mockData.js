// src/data/mockData.js
// Dữ liệu mẫu để demo giao diện

export const FILTERS = [
  {
    id: 'warm_gold',
    name: 'Warm Gold',
    nameVi: 'Vàng Ấm',
    icon: '✨',
    description: 'Ánh vàng ấm áp, sang trọng',
    preview: 'linear-gradient(135deg, #f59e0b22, #d9770622)',
    cssFilter: 'sepia(0.4) saturate(1.4) hue-rotate(-10deg) brightness(1.05)',
    apiKey: 'warm_gold',
    category: 'premium',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    nameVi: 'Cổ Điển',
    icon: '📷',
    description: 'Phong cách retro hoài cổ',
    preview: 'linear-gradient(135deg, #92400e22, #78350f22)',
    cssFilter: 'sepia(0.6) saturate(0.8) contrast(1.1) brightness(0.95)',
    apiKey: 'vintage',
    category: 'classic',
  },
  {
    id: 'bw',
    name: 'Black & White',
    nameVi: 'Đen Trắng',
    icon: '🖤',
    description: 'Tối giản, nghệ thuật',
    preview: 'linear-gradient(135deg, #52525222, #0a0a0a22)',
    cssFilter: 'grayscale(1) contrast(1.15) brightness(1.05)',
    apiKey: 'black_white',
    category: 'classic',
  },
  {
    id: 'smooth_skin',
    name: 'Smooth Skin',
    nameVi: 'Da Mịn',
    icon: '💆',
    description: 'Làn da mịn màng, tươi sáng',
    preview: 'linear-gradient(135deg, #fde68a22, #fbbf2422)',
    cssFilter: 'brightness(1.08) saturate(0.9) contrast(0.95) blur(0.3px)',
    apiKey: 'smooth_skin',
    category: 'beauty',
  },
  {
    id: 'sharp_gold',
    name: 'Sharp Gold',
    nameVi: 'Vàng Sắc Nét',
    icon: '⚡',
    description: 'Sắc nét, nổi bật vàng rực',
    preview: 'linear-gradient(135deg, #fbbf2422, #f59e0b33)',
    cssFilter: 'saturate(1.6) contrast(1.2) brightness(1.05) sepia(0.2)',
    apiKey: 'sharp_gold',
    category: 'premium',
  },
  {
    id: 'locket_glow',
    name: 'Locket Glow',
    nameVi: 'Ánh Locket',
    icon: '💛',
    description: 'Hiệu ứng phát sáng đặc trưng',
    preview: 'linear-gradient(135deg, #fcd34d22, #f59e0b22)',
    cssFilter: 'brightness(1.1) saturate(1.3) contrast(1.05) sepia(0.3)',
    apiKey: 'locket_glow',
    category: 'premium',
  },
];

export const ADJUSTMENTS = [
  { id: 'brightness', label: 'Độ Sáng', icon: '☀️', min: -100, max: 100, default: 0, step: 1 },
  { id: 'contrast', label: 'Tương Phản', icon: '◐', min: -100, max: 100, default: 0, step: 1 },
  { id: 'saturation', label: 'Bão Hòa', icon: '🎨', min: -100, max: 100, default: 0, step: 1 },
  { id: 'sharpness', label: 'Độ Sắc Nét', icon: '🔍', min: 0, max: 100, default: 0, step: 1 },
  { id: 'warmth', label: 'Độ Ấm', icon: '🌅', min: -100, max: 100, default: 0, step: 1 },
  { id: 'vignette', label: 'Viền Tối', icon: '🔮', min: 0, max: 100, default: 0, step: 1 },
];

export const LOCKET_FRAMES = [
  { id: 'circle_gold', name: 'Tròn Vàng', icon: '⭕', description: 'Khung tròn viền vàng' },
  { id: 'square_vintage', name: 'Vuông Cổ Điển', icon: '⬛', description: 'Khung vuông vintage' },
  { id: 'heart_gold', name: 'Trái Tim', icon: '💛', description: 'Khung trái tim vàng' },
  { id: 'polaroid', name: 'Polaroid', icon: '📸', description: 'Khung Polaroid kinh điển' },
  { id: 'film_strip', name: 'Cuộn Film', icon: '🎞️', description: 'Khung cuộn phim' },
  { id: 'locket_oval', name: 'Locket Oval', icon: '🥚', description: 'Khung oval đặc trưng Locket' },
];

export const MOCK_GALLERY = [
  {
    id: 1,
    title: 'Ảnh mẫu 1',
    src: 'https://picsum.photos/seed/locket1/400/400',
    filter: 'Warm Gold',
    date: '2025-06-15',
    size: '2.4 MB',
    type: 'image',
  },
  {
    id: 2,
    title: 'Ảnh mẫu 2',
    src: 'https://picsum.photos/seed/locket2/400/400',
    filter: 'Vintage',
    date: '2025-06-14',
    size: '1.8 MB',
    type: 'image',
  },
  {
    id: 3,
    title: 'Ảnh mẫu 3',
    src: 'https://picsum.photos/seed/locket3/400/400',
    filter: 'Black & White',
    date: '2025-06-13',
    size: '1.2 MB',
    type: 'image',
  },
  {
    id: 4,
    title: 'Ảnh mẫu 4',
    src: 'https://picsum.photos/seed/locket4/400/400',
    filter: 'Sharp Gold',
    date: '2025-06-12',
    size: '3.1 MB',
    type: 'image',
  },
  {
    id: 5,
    title: 'Ảnh mẫu 5',
    src: 'https://picsum.photos/seed/locket5/400/400',
    filter: 'Smooth Skin',
    date: '2025-06-11',
    size: '2.0 MB',
    type: 'image',
  },
  {
    id: 6,
    title: 'Ảnh mẫu 6',
    src: 'https://picsum.photos/seed/locket6/400/400',
    filter: 'Locket Glow',
    date: '2025-06-10',
    size: '1.5 MB',
    type: 'image',
  },
];

export const AI_SUGGESTIONS = [
  {
    id: 'portrait',
    scenario: 'Chân dung',
    icon: '👤',
    suggested: ['smooth_skin', 'warm_gold'],
    description: 'Phù hợp cho ảnh chân dung người',
  },
  {
    id: 'landscape',
    scenario: 'Phong cảnh',
    icon: '🏞️',
    suggested: ['sharp_gold', 'vintage'],
    description: 'Tối ưu cho ảnh phong cảnh thiên nhiên',
  },
  {
    id: 'event',
    scenario: 'Sự kiện',
    icon: '🎉',
    suggested: ['warm_gold', 'locket_glow'],
    description: 'Hoàn hảo cho ảnh tiệc, sự kiện',
  },
];

export const VIDEO_FILTERS = [
  { id: 'warm_gold_video', name: 'Vàng Ấm', icon: '✨', apiKey: 'warm_gold' },
  { id: 'vintage_video', name: 'Cổ Điển', icon: '📷', apiKey: 'vintage' },
  { id: 'bw_video', name: 'Đen Trắng', icon: '🖤', apiKey: 'black_white' },
  { id: 'cinematic', name: 'Điện Ảnh', icon: '🎬', apiKey: 'cinematic' },
];

export const PHOTOBOOTH_LAYOUTS = [
  { id: '2x2', name: '2x2', cols: 2, rows: 2, total: 4, icon: '⊞' },
  { id: '1x3', name: '1x3', cols: 1, rows: 3, total: 3, icon: '☰' },
  { id: '2x3', name: '2x3', cols: 2, rows: 3, total: 6, icon: '⊟' },
  { id: '1x4', name: 'Strip', cols: 1, rows: 4, total: 4, icon: '🎞️' },
];

export const NAV_ITEMS = [
  { path: '/', label: 'Trang Chủ', icon: 'Home' },
  { path: '/editor', label: 'Chỉnh Sửa', icon: 'Wand2' },
  { path: '/gallery', label: 'Thư Viện', icon: 'Images' },
  { path: '/photobooth', label: 'Photobooth', icon: 'Camera' },
  { path: '/about', label: 'Giới Thiệu', icon: 'Info' },
];
