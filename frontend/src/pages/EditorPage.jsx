// src/pages/EditorPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Film, Undo2, Redo2, RotateCcw, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

import useEditorStore from '../store/editorStore';
import { uploadImage, uploadVideo, applyFilter, applyAdjustments, downloadImage } from '../api';
import { downloadBlob, isImageFile } from '../utils/imageUtils';

import UploadZone from '../components/editor/UploadZone';
import PreviewCanvas from '../components/editor/PreviewCanvas';
import FilterPanel from '../components/editor/FilterPanel';
import AdjustmentPanel from '../components/editor/AdjustmentPanel';
import AIFilterSuggest from '../components/editor/AIFilterSuggest';
import FrameBuilder from '../components/editor/FrameBuilder';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const PANEL_TABS = [
  { id: 'filter', label: 'Bộ Lọc', icon: '🎨' },
  { id: 'adjust', label: 'Điều Chỉnh', icon: '🎛️' },
  { id: 'frame', label: 'Khung', icon: '🖼️' },
  { id: 'ai', label: 'AI Gợi Ý', icon: '✨' },
];

export default function EditorPage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('filter');
  const [mode, setMode] = useState(searchParams.get('tab') === 'video' ? 'video' : 'image');
  const [panelOpen, setPanelOpen] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  const {
    previewUrl, fileType, uploadedFile, imageId,
    isUploading, activeFilter, adjustments, undo, redo,
    historyIndex, history, reset, setImageId, setIsUploading,
    setUploadProgress,
  } = useEditorStore();

  // Handle upload to backend
  useEffect(() => {
    if (!uploadedFile) return;
    const handleUpload = async () => {
      setIsUploading(true);
      try {
        let result;
        if (isImageFile(uploadedFile)) {
          result = await uploadImage(uploadedFile);
        } else {
          result = await uploadVideo(uploadedFile, setUploadProgress);
        }
        setImageId(result.id || result.image_id || 'demo-id');
      } catch (err) {
        // Demo mode: continue without backend
        setImageId('demo-id');
      } finally {
        setIsUploading(false);
      }
    };
    handleUpload();
  }, [uploadedFile]);

  const handleApply = async () => {
    if (!imageId) {
      toast.error('Vui lòng tải ảnh lên trước');
      return;
    }
    setIsApplying(true);
    try {
      await applyFilter(imageId, activeFilter?.apiKey, adjustments);
      toast.success('Đã áp dụng bộ lọc!');
    } catch {
      toast('Chạy ở chế độ demo — kết quả hiển thị trực tiếp trên trình duyệt', { icon: '💡' });
    } finally {
      setIsApplying(false);
    }
  };

  const handleDownload = async () => {
    if (!previewUrl) return;
    try {
      if (imageId && imageId !== 'demo-id') {
        const blob = await downloadImage(imageId);
        downloadBlob(blob, `locket-gold-${Date.now()}.jpg`);
      } else {
        // Demo: download current preview directly
        const a = document.createElement('a');
        a.href = previewUrl;
        a.download = `locket-gold-${Date.now()}.jpg`;
        a.click();
        toast.success('Đã tải xuống!');
      }
    } catch {
      toast.error('Lỗi khi tải xuống');
    }
  };

  const handleReset = () => {
    reset();
    toast('Đã xóa và đặt lại', { icon: '🔄' });
  };

  return (
    <div className="flex flex-col h-screen pt-16">
      {/* ── Top Bar ── */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800/50">
        {/* Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-zinc-800 rounded-xl">
          <button
            onClick={() => setMode('image')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === 'image' ? 'bg-yellow-500 text-black' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <Image size={13} />
            Ảnh
          </button>
          <button
            onClick={() => setMode('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${mode === 'video' ? 'bg-yellow-500 text-black' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <Film size={13} />
            Video
          </button>
        </div>

        <div className="flex-1" />

        {/* History Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={historyIndex < 0}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Hoàn tác"
          >
            <Undo2 size={15} />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Làm lại"
          >
            <Redo2 size={15} />
          </button>
        </div>

        {/* Apply & Download */}
        {previewUrl && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Đặt lại</span>
            </Button>
            <Button variant="gold" size="sm" onClick={handleDownload}>
              <Download size={14} />
              <span className="hidden sm:inline">Tải xuống</span>
            </Button>
          </div>
        )}
      </div>

      {/* ── Main Editor Layout ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isUploading ? (
            <div className="flex-1 flex items-center justify-center">
              <Spinner size="lg" label="Đang tải lên..." />
            </div>
          ) : !previewUrl ? (
            <UploadZone mode={mode} />
          ) : (
            <PreviewCanvas onDownload={handleDownload} onReset={handleReset} />
          )}
        </div>

        {/* ── Right Panel (Desktop) ── */}
        {previewUrl && (
          <>
            {/* Toggle Button */}
            <button
              onClick={() => setPanelOpen(!panelOpen)}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-5 h-12 items-center justify-center bg-zinc-800 border border-zinc-700 rounded-l-lg text-zinc-400 hover:text-zinc-100 transition-colors"
              style={{ right: panelOpen ? '320px' : '0' }}
            >
              {panelOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <AnimatePresence>
              {panelOpen && (
                <motion.aside
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                  className="hidden md:flex flex-col h-full bg-zinc-900 border-l border-zinc-800/50 overflow-hidden"
                  style={{ width: 320, minWidth: 320 }}
                >
                  {/* Tab Pills */}
                  <div className="p-3 border-b border-zinc-800/50 grid grid-cols-4 gap-1">
                    {PANEL_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={[
                          'flex flex-col items-center gap-0.5 py-2 rounded-xl text-[11px] font-medium transition-all',
                          activeTab === tab.id
                            ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800',
                        ].join(' ')}
                      >
                        <span className="text-base">{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Panel Content */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {activeTab === 'filter' && <FilterPanel />}
                    {activeTab === 'adjust' && <AdjustmentPanel />}
                    {activeTab === 'frame' && <FrameBuilder />}
                    {activeTab === 'ai' && <AIFilterSuggest />}
                  </div>

                  {/* Apply Button */}
                  {(activeFilter || Object.values(adjustments).some((v, i) => v !== 0)) && (
                    <div className="p-3 border-t border-zinc-800/50">
                      <Button
                        variant="gold"
                        className="w-full"
                        onClick={handleApply}
                        isLoading={isApplying}
                      >
                        Áp dụng & Xử lý
                      </Button>
                    </div>
                  )}
                </motion.aside>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* ── Mobile Bottom Panel ── */}
      {previewUrl && (
        <div className="md:hidden border-t border-zinc-800/50 bg-zinc-900 pb-16">
          {/* Mobile Tabs */}
          <div className="flex overflow-x-auto gap-1 p-2 scrollbar-none">
            {PANEL_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                    : 'text-zinc-500 bg-zinc-800 hover:text-zinc-300',
                ].join(' ')}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile Panel Content */}
          <div className="max-h-60 overflow-y-auto px-3 pb-3">
            {activeTab === 'filter' && <FilterPanel />}
            {activeTab === 'adjust' && <AdjustmentPanel />}
            {activeTab === 'frame' && <FrameBuilder />}
            {activeTab === 'ai' && <AIFilterSuggest />}
          </div>
        </div>
      )}
    </div>
  );
}
