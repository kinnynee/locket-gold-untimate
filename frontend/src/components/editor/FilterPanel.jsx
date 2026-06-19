// src/components/editor/FilterPanel.jsx
import FilterCard from './FilterCard';
import { FILTERS } from '../../data/mockData';
import useEditorStore from '../../store/editorStore';

export default function FilterPanel() {
  const { activeFilter, setActiveFilter, previewUrl } = useEditorStore();

  const categories = [
    { key: 'premium', label: '✨ Premium' },
    { key: 'classic', label: '📷 Cổ điển' },
    { key: 'beauty',  label: '💆 Làm đẹp' },
  ];

  const handleSelect = filter => {
    setActiveFilter(activeFilter?.id === filter.id ? null : filter);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <p className="panel-section-label">🎨 Bộ Lọc</p>

      {/* No Filter */}
      <div
        onClick={() => setActiveFilter(null)}
        className={`filter-item${!activeFilter ? ' active' : ''}`}
        style={{ cursor: 'pointer' }}
      >
        <div className="filter-item-body" style={{ background: 'var(--bg-panel)' }}>
          <span style={{ fontSize: 20 }}>🚫</span>
          <span className="filter-item-name">Gốc</span>
        </div>
        {!activeFilter && <div className="filter-item-active-dot" />}
      </div>

      {/* Filters by category */}
      {categories.map(cat => {
        const catFilters = FILTERS.filter(f => f.category === cat.key);
        if (!catFilters.length) return null;
        return (
          <div key={cat.key}>
            <p className="panel-section-label">{cat.label}</p>
            <div className="filter-grid">
              {catFilters.map(filter => (
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
