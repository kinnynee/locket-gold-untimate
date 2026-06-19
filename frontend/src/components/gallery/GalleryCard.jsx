// src/components/gallery/GalleryCard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, Edit, Eye } from 'lucide-react';

export default function GalleryCard({ item, onDownload, onDelete, onEdit, onPreview }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: .9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: .9 }}
      whileHover={{ y: -4 }}
      className="gallery-card"
    >
      {/* Image */}
      {!loaded && <div className="skeleton" style={{ position: 'absolute', inset: 0 }} />}
      <img
        src={item.src}
        alt={item.title}
        onLoad={() => setLoaded(true)}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity .3s' }}
      />

      {/* Overlay */}
      <div className="gallery-card-overlay">
        {/* Actions top-right */}
        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 5 }}>
          <button
            onClick={e => { e.stopPropagation(); onPreview?.(item); }}
            className="gallery-card-action"
            title="Xem"
          >
            <Eye size={13} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onEdit?.(item); }}
            className="gallery-card-action"
            title="Chỉnh sửa"
          >
            <Edit size={13} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete?.(item.id); }}
            className="gallery-card-action danger"
            title="Xóa"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Bottom info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="gallery-card-tag">{item.filter}</span>
          <button
            onClick={e => { e.stopPropagation(); onDownload?.(item); }}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              padding: '7px', borderRadius: 8,
              background: 'var(--gold-500)', color: '#000',
              fontSize: 11, fontWeight: 700,
              transition: 'background .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--gold-400)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--gold-500)'}
          >
            <Download size={12} /> Tải xuống
          </button>
        </div>
      </div>

      {/* Info bar */}
      <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
          {item.title}
        </p>
        <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{item.date}</p>
      </div>
    </motion.div>
  );
}
