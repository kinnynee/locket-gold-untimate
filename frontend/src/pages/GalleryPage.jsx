// src/pages/GalleryPage.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid2x2, Grid3x3, Filter, Download, X, Image } from 'lucide-react';
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
  const [filterFilter, setFilterFilter] = useState('all');
  const [previewItem, setPreviewItem] = useState(null);
  const navigate = useNavigate();

  const filters = ['all', ...new Set(MOCK_GALLERY.map((i) => i.filter))];

  const filtered = items.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.filter.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filterFilter === 'all' || item.filter === filterFilter;
    return matchSearch && matchFilter;
  });

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success('Đã xóa ảnh');
  };

  const handleDownload = (item) => {
    const a = document.createElement('a');
    a.href = item.src;
    a.download = `locket-${item.id}.jpg`;
    a.click();
    toast.success('Đang tải xuống...');
  };

  const handleEdit = (item) => {
    navigate('/editor');
    toast('Mở trong Editor', { icon: '✏️' });
  };

  return (
    <div className="min-h-screen pt-20 pb-28 md:pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-zinc-100">
            Thư <span className="gold-gradient-text">Viện</span>
          </h1>
          <p className="text-zinc-400 mt-1">{items.length} ảnh đã xử lý</p>
        </motion.div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Tìm kiếm ảnh..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilterFilter(f)}
                className={[
                  'flex-shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap',
                  filterFilter === f
                    ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600',
                ].join(' ')}
              >
                {f === 'all' ? 'Tất cả' : f}
              </button>
            ))}
          </div>

          {/* Grid Toggle */}
          <div className="flex gap-1 p-1 bg-zinc-800 rounded-xl self-start sm:self-auto">
            <button onClick={() => setGridSize(2)} className={`p-2 rounded-lg transition-colors ${gridSize === 2 ? 'bg-zinc-700 text-yellow-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <Grid2x2 size={15} />
            </button>
            <button onClick={() => setGridSize(3)} className={`p-2 rounded-lg transition-colors ${gridSize === 3 ? 'bg-zinc-700 text-yellow-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
              <Grid3x3 size={15} />
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 space-y-4"
          >
            <div className="w-20 h-20 rounded-2xl bg-zinc-800 flex items-center justify-center">
              <Image size={32} className="text-zinc-600" />
            </div>
            <p className="text-zinc-400 font-medium">Không tìm thấy ảnh</p>
            <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setFilterFilter('all'); }}>
              Xóa bộ lọc
            </Button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className={`grid gap-4 ${
              gridSize === 2
                ? 'grid-cols-2 md:grid-cols-4'
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
            }`}
          >
            <AnimatePresence>
              {filtered.map((item) => (
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
      <Modal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        title={previewItem?.title}
        size="xl"
      >
        {previewItem && (
          <div className="space-y-4">
            <img
              src={previewItem.src}
              alt={previewItem.title}
              className="w-full rounded-xl max-h-[60vh] object-contain bg-zinc-800"
            />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-zinc-400">Bộ lọc: <span className="text-yellow-400">{previewItem.filter}</span></p>
                <p className="text-sm text-zinc-400">Ngày: {previewItem.date}</p>
                <p className="text-sm text-zinc-400">Kích thước: {previewItem.size}</p>
              </div>
              <Button variant="gold" onClick={() => handleDownload(previewItem)}>
                <Download size={16} />
                Tải xuống
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
