// src/pages/GalleryPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid2x2, Grid3x3, Download, X, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_GALLERY } from '../data/mockData';
import GalleryCard from '../components/gallery/GalleryCard';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';

export default function GalleryPage() {
  const [items, setItems] = useState(MOCK_GALLERY);
  const [search, setSearch] = useState('');
  const [gridSize, setGridSize] = useState(3);
  const [activeFilter, setActiveFilter] = useState('all');
  const [previewItem, setPreviewItem] = useState(null);
  const navigate = useNavigate();

  const filters = ['all', ...new Set(MOCK_GALLERY.map(i => i.filter))];

  const filtered = items.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.filter.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'all' || item.filter === activeFilter;
    return matchSearch && matchFilter;
  });

  const handleDelete = id => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success('Đã xóa ảnh');
  };

  const handleDownload = item => {
    const a = document.createElement('a');
    a.href = item.src;
    a.download = `locket-${item.id}.jpg`;
    a.click();
    toast.success('Đang tải xuống...');
  };

  const handleEdit = () => {
    navigate('/editor');
    toast('Mở trong Editor', { icon: '✏️' });
  };

  return (
    <div className="page">
      <div className="page-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-header"
        >
          <h1 className="page-title font-display">
            Thư <span className="gold-gradient-text">Viện</span>
          </h1>
          <p className="page-subtitle">{items.length} ảnh đã xử lý</p>
        </motion.div>

        {/* Toolbar */}
        <div className="gallery-toolbar">
          {/* Search */}
          <div className="input-icon-wrap" style={{ flex: 1, minWidth: 200 }}>
            <Search size={15} className="icon" />
            <input
              type="text"
              placeholder="Tìm kiếm ảnh..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: 38 }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`chip${activeFilter === f ? ' active' : ''}`}
              >
                {f === 'all' ? 'Tất cả' : f}
              </button>
            ))}
          </div>

          {/* Grid toggle */}
          <div className="gallery-toolbar-right">
            <div className="grid-toggle">
              <button
                className={`grid-toggle-btn${gridSize === 2 ? ' active' : ''}`}
                onClick={() => setGridSize(2)}
              >
                <Grid2x2 size={16} />
              </button>
              <button
                className={`grid-toggle-btn${gridSize === 3 ? ' active' : ''}`}
                onClick={() => setGridSize(3)}
              >
                <Grid3x3 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-state">
            <div className="empty-icon">
              <Image size={32} style={{ color: 'var(--text-3)' }} />
            </div>
            <p className="empty-title">Không tìm thấy ảnh</p>
            <p className="empty-desc">Thử từ khóa khác hoặc xóa bộ lọc</p>
            <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setActiveFilter('all'); }}>
              Xóa bộ lọc
            </Button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className={gridSize === 2 ? 'gallery-grid-2' : 'gallery-grid-3'}
          >
            <AnimatePresence>
              {filtered.map(item => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onPreview={setPreviewItem}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Preview Modal */}
      <Modal isOpen={!!previewItem} onClose={() => setPreviewItem(null)} title={previewItem?.title} size="xl">
        {previewItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <img
              src={previewItem.src}
              alt={previewItem.title}
              style={{ width: '100%', borderRadius: 14, maxHeight: '60vh', objectFit: 'contain', background: 'var(--bg-panel)' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
                  Bộ lọc: <span style={{ color: 'var(--gold-400)', fontWeight: 600 }}>{previewItem.filter}</span>
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Ngày: {previewItem.date}</p>
                <p style={{ fontSize: 13, color: 'var(--text-2)' }}>Kích thước: {previewItem.size}</p>
              </div>
              <Button variant="gold" onClick={() => handleDownload(previewItem)}>
                <Download size={15} /> Tải xuống
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
