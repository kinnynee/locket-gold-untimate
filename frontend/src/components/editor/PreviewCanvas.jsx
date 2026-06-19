// src/components/editor/PreviewCanvas.jsx
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, Download, Trash2, Eye, EyeOff } from 'lucide-react';
import useEditorStore from '../../store/editorStore';
import { buildCSSFilter } from '../../utils/imageUtils';
import Button from '../ui/Button';

export default function PreviewCanvas({ onDownload, onReset }) {
  const { previewUrl, processedUrl, fileType, activeFilter, adjustments } = useEditorStore();
  const [zoom, setZoom] = useState(1);
  const [showOriginal, setShowOriginal] = useState(false);
  const imgRef = useRef(null);

  const displayUrl = showOriginal ? previewUrl : (processedUrl || previewUrl);
  const cssFilter = buildCSSFilter(adjustments, showOriginal ? '' : (activeFilter?.cssFilter || ''));

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.25));
  const handleResetZoom = () => setZoom(1);

  if (!previewUrl) return null;

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 relative overflow-hidden">
      {/* Toolbar */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 rounded-xl px-2 py-1.5">
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50 transition-colors"
          title="Thu nhỏ"
        >
          <ZoomOut size={15} />
        </button>
        <button
          onClick={handleResetZoom}
          className="px-2 py-1 rounded-lg text-xs font-mono text-zinc-300 hover:bg-zinc-700/50 transition-colors min-w-[44px] text-center"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50 transition-colors"
          title="Phóng to"
        >
          <ZoomIn size={15} />
        </button>
        <div className="w-px h-5 bg-zinc-700 mx-1" />
        <button
          onClick={() => setShowOriginal(!showOriginal)}
          className={`p-1.5 rounded-lg transition-colors ${showOriginal ? 'text-yellow-400 bg-yellow-500/10' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50'}`}
          title={showOriginal ? 'Xem ảnh đã chỉnh' : 'Xem ảnh gốc'}
        >
          {showOriginal ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
      </div>

      {/* Label */}
      {showOriginal && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-10 px-3 py-1 bg-zinc-800/90 rounded-full text-xs text-zinc-400 border border-zinc-700/50">
          Đang xem ảnh gốc
        </div>
      )}

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-6" style={{ background: 'repeating-conic-gradient(#1a1a1a 0% 25%, #141414 0% 50%) 0 0 / 20px 20px' }}>
        <motion.div
          animate={{ scale: zoom }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="relative"
        >
          {fileType === 'image' ? (
            <img
              ref={imgRef}
              src={displayUrl}
              alt="Preview"
              className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl"
              style={{ filter: cssFilter, transition: 'filter 0.3s ease' }}
              draggable={false}
            />
          ) : (
            <video
              src={displayUrl}
              controls
              className="max-w-full max-h-[70vh] rounded-xl shadow-2xl"
              style={{ filter: cssFilter }}
            />
          )}
        </motion.div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onReset}>
          <Trash2 size={14} />
          Xóa
        </Button>
        <Button variant="gold" size="sm" onClick={onDownload}>
          <Download size={14} />
          Tải xuống
        </Button>
      </div>
    </div>
  );
}
