// src/components/gallery/GalleryCard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, Edit, Eye } from 'lucide-react';

export default function GalleryCard({ item, onDownload, onDelete, onEdit, onPreview }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      className="group relative rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700/50 hover:border-yellow-500/30 transition-all duration-300"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-zinc-900">
        {!imageLoaded && <div className="skeleton w-full h-full" />}
        <img
          src={item.src}
          alt={item.title}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); onPreview?.(item); }}
            className="w-8 h-8 rounded-lg bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 flex items-center justify-center text-zinc-300 hover:text-zinc-100 hover:border-zinc-500 transition-colors"
            title="Xem"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(item); }}
            className="w-8 h-8 rounded-lg bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 flex items-center justify-center text-zinc-300 hover:text-yellow-400 hover:border-yellow-500/50 transition-colors"
            title="Chỉnh sửa"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(item.id); }}
            className="w-8 h-8 rounded-lg bg-zinc-900/80 backdrop-blur-sm border border-zinc-700/50 flex items-center justify-center text-zinc-300 hover:text-red-400 hover:border-red-500/50 transition-colors"
            title="Xóa"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Download Button */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); onDownload?.(item); }}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-semibold transition-colors"
          >
            <Download size={13} />
            Tải xuống
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-zinc-200 truncate">{item.title}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-zinc-500">{item.date}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400/80 border border-yellow-500/20">
            {item.filter}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
