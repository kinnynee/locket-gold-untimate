// src/components/editor/FilterCard.jsx
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function FilterCard({ filter, isActive, onClick, previewUrl }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={[
        'filter-card cursor-pointer group relative',
        isActive ? 'active' : '',
      ].join(' ')}
    >
      {/* Preview Image */}
      <div className="aspect-square overflow-hidden rounded-xl bg-zinc-800">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={filter.nameVi}
            className="w-full h-full object-cover"
            style={{ filter: filter.cssFilter }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-2xl"
            style={{ background: filter.preview }}
          >
            {filter.icon}
          </div>
        )}
      </div>

      {/* Active Overlay */}
      {isActive && (
        <div className="absolute inset-0 rounded-xl bg-yellow-500/10 flex items-start justify-end p-1.5">
          <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
            <Check size={12} className="text-black font-bold" strokeWidth={3} />
          </div>
        </div>
      )}

      {/* Label */}
      <div className="pt-1.5 px-0.5">
        <p className={`text-xs font-medium truncate ${isActive ? 'text-yellow-400' : 'text-zinc-300'}`}>
          {filter.nameVi}
        </p>
        {filter.category === 'premium' && (
          <span className="text-[10px] text-yellow-500/70">✨ Premium</span>
        )}
      </div>
    </motion.div>
  );
}
