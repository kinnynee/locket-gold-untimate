// src/components/editor/FilterPanel.jsx
import { motion } from 'framer-motion';
import FilterCard from './FilterCard';
import { FILTERS } from '../../data/mockData';
import useEditorStore from '../../store/editorStore';

export default function FilterPanel() {
  const { activeFilter, setActiveFilter, previewUrl } = useEditorStore();

  const categories = [
    { key: 'premium', label: '✨ Premium' },
    { key: 'classic', label: '📷 Cổ điển' },
    { key: 'beauty', label: '💆 Làm đẹp' },
  ];

  const handleSelect = (filter) => {
    if (activeFilter?.id === filter.id) {
      setActiveFilter(null);
    } else {
      setActiveFilter(filter);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
        <span>🎨</span>
        Bộ Lọc
      </h3>

      {/* No Filter Option */}
      <motion.div
        onClick={() => setActiveFilter(null)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className={[
          'filter-card cursor-pointer',
          !activeFilter ? 'active' : '',
        ].join(' ')}
      >
        <div className="aspect-square rounded-xl bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center text-zinc-500">
          <span className="text-xs font-medium">Gốc</span>
        </div>
        <div className="pt-1.5 px-0.5">
          <p className={`text-xs font-medium ${!activeFilter ? 'text-yellow-400' : 'text-zinc-400'}`}>
            Không lọc
          </p>
        </div>
      </motion.div>

      {/* Filters by category */}
      {categories.map((cat) => {
        const catFilters = FILTERS.filter((f) => f.category === cat.key);
        return (
          <div key={cat.key} className="space-y-2">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">{cat.label}</p>
            <div className="grid grid-cols-3 gap-2">
              {catFilters.map((filter) => (
                <FilterCard
                  key={filter.id}
                  filter={filter}
                  isActive={activeFilter?.id === filter.id}
                  onClick={() => handleSelect(filter)}
                  previewUrl={previewUrl}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
