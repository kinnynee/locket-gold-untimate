// src/components/editor/FilterCard.jsx
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function FilterCard({ filter, isActive, onClick, previewUrl }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: .97 }}
      className={`filter-item${isActive ? ' active' : ''}`}
      style={{ cursor: 'pointer' }}
    >
      <div className="filter-item-body" style={{ background: filter.preview }}>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={filter.nameVi}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: filter.cssFilter, borderRadius: 10 }}
          />
        ) : (
          <>
            <span className="filter-item-emoji">{filter.icon}</span>
            <span className="filter-item-name">{filter.nameVi}</span>
          </>
        )}
      </div>

      {isActive && <div className="filter-item-active-dot" />}

      {!previewUrl && (
        <div style={{ padding: '4px 2px' }}>
          <p style={{ fontSize: 10, fontWeight: 600, color: isActive ? 'var(--gold-400)' : 'var(--text-2)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {filter.nameVi}
          </p>
        </div>
      )}
    </motion.div>
  );
}
