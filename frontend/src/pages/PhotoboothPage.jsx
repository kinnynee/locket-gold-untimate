// src/pages/PhotoboothPage.jsx
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, Download, RotateCcw, Plus, X, Images } from 'lucide-react';
import { PHOTOBOOTH_LAYOUTS, LOCKET_FRAMES, FILTERS } from '../data/mockData';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function PhotoboothPage() {
  const [layout, setLayout] = useState(PHOTOBOOTH_LAYOUTS[0]);
  const [photos, setPhotos] = useState([]);
  const [activeFrame, setActiveFrame] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [bgColor, setBgColor] = useState('#000000');

  const maxPhotos = layout.total;

  const onDrop = useCallback((acceptedFiles) => {
    const remaining = maxPhotos - photos.length;
    const newFiles = acceptedFiles.slice(0, remaining).map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setPhotos((prev) => [...prev, ...newFiles]);
  }, [photos, maxPhotos]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: maxPhotos,
    disabled: photos.length >= maxPhotos,
  });

  const removePhoto = (id) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleReset = () => {
    setPhotos([]);
    setActiveFilter(null);
    setActiveFrame(null);
  };

  const handleDownload = () => {
    toast.success('Đang tạo photobooth... (cần kết nối backend)');
  };

  const BG_COLORS = ['#000000', '#ffffff', '#1a1a1a', '#f5f0e8', '#0a0f1e', '#1c0a00'];

  return (
    <div className="min-h-screen pt-20 pb-28 md:pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-zinc-100">
            Photo<span className="gold-gradient-text">booth</span>
          </h1>
          <p className="text-zinc-400 mt-1">Tạo bộ ảnh ghép phong cách Locket Gold</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Controls */}
          <div className="space-y-6">
            {/* Layout Selection */}
            <div className="glass-card p-4 space-y-3">
              <h3 className="text-sm font-semibold text-zinc-200">📐 Bố cục</h3>
              <div className="grid grid-cols-2 gap-2">
                {PHOTOBOOTH_LAYOUTS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => { setLayout(l); setPhotos([]); }}
                    className={[
                      'p-3 rounded-xl border text-left transition-all',
                      layout.id === l.id
                        ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400'
                        : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600',
                    ].join(' ')}
                  >
                    <span className="text-xl block mb-1">{l.icon}</span>
                    <span className="text-xs font-medium">{l.name}</span>
                    <span className="text-[10px] text-zinc-500 block">{l.total} ảnh</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filter */}
            <div className="glass-card p-4 space-y-3">
              <h3 className="text-sm font-semibold text-zinc-200">🎨 Bộ lọc</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveFilter(null)}
                  className={`p-2 rounded-xl border text-center text-xs transition-all ${!activeFilter ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' : 'border-zinc-700 text-zinc-400'}`}
                >
                  Gốc
                </button>
                {FILTERS.slice(0, 5).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f)}
                    className={`p-2 rounded-xl border text-center text-xs transition-all ${activeFilter?.id === f.id ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400' : 'border-zinc-700 text-zinc-400'}`}
                  >
                    {f.icon}
                    <span className="block text-[10px] mt-0.5">{f.nameVi}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div className="glass-card p-4 space-y-3">
              <h3 className="text-sm font-semibold text-zinc-200">🎨 Nền</h3>
              <div className="flex gap-2 flex-wrap">
                {BG_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBgColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${bgColor === color ? 'border-yellow-500 scale-110' : 'border-zinc-600 hover:border-zinc-400'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={handleReset}>
                <RotateCcw size={14} />
                Đặt lại
              </Button>
              <Button variant="gold" className="flex-1" onClick={handleDownload} disabled={photos.length === 0}>
                <Download size={14} />
                Xuất ảnh
              </Button>
            </div>
          </div>

          {/* Right: Canvas */}
          <div className="lg:col-span-2 space-y-4">
            {/* Photobooth Preview */}
            <div
              className="rounded-2xl border border-zinc-700/50 overflow-hidden"
              style={{ backgroundColor: bgColor }}
            >
              <div
                className={`grid gap-1 p-2`}
                style={{
                  gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
                  gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
                }}
              >
                {Array.from({ length: maxPhotos }).map((_, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                    {photos[i] ? (
                      <>
                        <img
                          src={photos[i].url}
                          alt={`Photo ${i + 1}`}
                          className="w-full h-full object-cover"
                          style={{ filter: activeFilter?.cssFilter }}
                        />
                        <button
                          onClick={() => removePhoto(photos[i].id)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-400 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </>
                    ) : (
                      <div
                        {...(photos.length < maxPhotos ? getRootProps() : {})}
                        className="w-full h-full flex flex-col items-center justify-center gap-1 border-2 border-dashed border-zinc-600/50 rounded-lg cursor-pointer hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-all"
                      >
                        <input {...getInputProps()} />
                        <Plus size={20} className="text-zinc-500" />
                        <span className="text-[10px] text-zinc-500">Thêm ảnh</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Label */}
              <div className="px-3 pb-3 text-center">
                <p className="font-display text-sm font-bold gold-gradient-text">LOCKET GOLD ULTIMATE</p>
              </div>
            </div>

            {/* Upload Area */}
            {photos.length < maxPhotos && (
              <div
                {...getRootProps()}
                className={`upload-zone p-6 text-center cursor-pointer ${isDragActive ? 'drag-over' : ''}`}
              >
                <input {...getInputProps()} />
                <Upload size={24} className="text-zinc-500 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">
                  {isDragActive ? 'Thả ảnh vào đây' : `Kéo thả hoặc click để thêm ảnh (${photos.length}/${maxPhotos})`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
