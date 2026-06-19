// src/pages/PhotoboothPage.jsx
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, RotateCcw, Plus, X, Camera } from 'lucide-react';
import { PHOTOBOOTH_LAYOUTS, FILTERS } from '../data/mockData';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import CameraCapture from '../components/ui/CameraCapture';
import toast from 'react-hot-toast';

const BG_COLORS = ['#000000', '#ffffff', '#1a1a1a', '#f5f0e8', '#0a0f1e', '#1c0a00'];

export default function PhotoboothPage() {
  const [layout, setLayout] = useState(PHOTOBOOTH_LAYOUTS[0]);
  const [photos, setPhotos] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [bgColor, setBgColor] = useState('#000000');
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const maxPhotos = layout.total;

  const onDrop = useCallback((acceptedFiles) => {
    const remaining = maxPhotos - photos.length;
    const newFiles = acceptedFiles.slice(0, remaining).map(f => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(f),
      name: f.name,
      file: f,
    }));
    setPhotos(prev => [...prev, ...newFiles]);
  }, [photos, maxPhotos]);

  const handleCapture = (file) => {
    if (photos.length >= maxPhotos) return;
    const newPhoto = {
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      name: file.name,
      file: file,
    };
    setPhotos(prev => [...prev, newPhoto]);
    setIsCameraOpen(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: maxPhotos,
    disabled: photos.length >= maxPhotos,
  });

  const removePhoto = id => setPhotos(prev => prev.filter(p => p.id !== id));

  const handleReset = () => {
    setPhotos([]);
    setActiveFilter(null);
  };

  const handleDownload = () => {
    toast.success('Đang tạo photobooth... (cần kết nối backend)');
  };

  return (
    <div className="page">
      <div className="page-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="page-header">
          <h1 className="page-title font-display">
            Photo<span className="gold-gradient-text">booth</span>
          </h1>
          <p className="page-subtitle">Tạo bộ ảnh ghép phong cách Locket Gold</p>
        </motion.div>

        <div className="pb-main-grid">

          {/* ── Left Controls ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Layout */}
            <div className="pb-control-card">
              <p className="pb-control-label">
                <span>📐</span> Bố cục
              </p>
              <div className="pb-layout-grid">
                {PHOTOBOOTH_LAYOUTS.map(l => (
                  <button
                    key={l.id}
                    onClick={() => { setLayout(l); setPhotos([]); }}
                    className={`pb-layout-btn${layout.id === l.id ? ' active' : ''}`}
                  >
                    <span className="pb-layout-icon">{l.icon}</span>
                    <span className="pb-layout-name">{l.name}</span>
                    <span className="pb-layout-count">{l.total} ảnh</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter */}
            <div className="pb-control-card">
              <p className="pb-control-label">
                <span>🎨</span> Bộ lọc
              </p>
              <div className="pb-filter-grid">
                <button
                  onClick={() => setActiveFilter(null)}
                  className={`pb-filter-btn${!activeFilter ? ' active' : ''}`}
                >
                  Gốc
                </button>
                {FILTERS.slice(0, 5).map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f)}
                    className={`pb-filter-btn${activeFilter?.id === f.id ? ' active' : ''}`}
                  >
                    <span style={{ display: 'block', fontSize: 16, marginBottom: 2 }}>{f.icon}</span>
                    {f.nameVi}
                  </button>
                ))}
              </div>
            </div>

            {/* Background */}
            <div className="pb-control-card">
              <p className="pb-control-label">
                <span>🖼️</span> Màu nền
              </p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {BG_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setBgColor(color)}
                    className={`pb-color-swatch${bgColor === color ? ' active' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="ghost" style={{ flex: 1 }} onClick={handleReset}>
                <RotateCcw size={14} /> Đặt lại
              </Button>
              <Button variant="gold" style={{ flex: 1 }} onClick={handleDownload} disabled={photos.length === 0}>
                <Download size={14} /> Xuất ảnh
              </Button>
            </div>
          </div>

          {/* ── Right Canvas ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Photobooth Preview */}
            <div className="pb-canvas" style={{ backgroundColor: bgColor }}>
              <div
                style={{
                  display: 'grid',
                  gap: 4,
                  padding: 8,
                  gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                  gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
                }}
              >
                {Array.from({ length: maxPhotos }).map((_, i) => (
                  <div key={i} className="pb-slot">
                    {photos[i] ? (
                      <>
                        <img
                          src={photos[i].url}
                          alt={`Photo ${i + 1}`}
                          className="pb-slot-img"
                          style={{ filter: activeFilter?.cssFilter }}
                        />
                        <button className="pb-slot-remove" onClick={() => removePhoto(photos[i].id)}>
                          <X size={10} />
                        </button>
                      </>
                    ) : (
                      <div style={{ display: 'flex', gap: 4, height: '100%', padding: 2 }}>
                        <div
                          {...(photos.length < maxPhotos ? getRootProps() : {})}
                          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', borderRadius: 6, cursor: 'pointer', border: '1px dashed var(--border-md)' }}
                        >
                          <input {...getInputProps()} />
                          <Upload size={14} style={{ color: 'var(--text-3)', marginBottom: 2 }} />
                          <span style={{ fontSize: 9, color: 'var(--text-3)' }}>Tải ảnh</span>
                        </div>
                        <div
                          onClick={() => setIsCameraOpen(true)}
                          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', borderRadius: 6, cursor: 'pointer', border: '1px dashed var(--border-md)' }}
                        >
                          <Camera size={14} style={{ color: 'var(--text-3)', marginBottom: 2 }} />
                          <span style={{ fontSize: 9, color: 'var(--text-3)' }}>Chụp ảnh</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="pb-canvas-label font-display">LOCKET GOLD ULTIMATE</p>
            </div>

            {/* Drop zone */}
            {photos.length < maxPhotos && (
              <div
                {...getRootProps()}
                className={`upload-zone${isDragActive ? ' drag-over' : ''}`}
                style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }}
              >
                <input {...getInputProps()} />
                <Upload size={24} style={{ color: 'var(--text-3)', margin: '0 auto 8px' }} />
                <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
                  {isDragActive
                    ? 'Thả ảnh vào đây...'
                    : `Kéo thả hoặc click để thêm (${photos.length}/${maxPhotos})`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Camera Modal */}
      <Modal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} title="Chụp Ảnh" size="md">
        <CameraCapture onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />
      </Modal>
    </div>
  );
}
