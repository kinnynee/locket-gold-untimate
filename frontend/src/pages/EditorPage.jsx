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
  { id: 'frame',  label: 'Khung',    icon: '🖼️' },
  { id: 'ai',     label: 'AI',       icon: '✨' },
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
      } catch {
        setImageId('demo-id');
      } finally {
        setIsUploading(false);
      }
    };
    handleUpload();
  }, [uploadedFile]);

  const handleApply = async () => {
    if (!imageId) { toast.error('Vui lòng tải ảnh lên trước'); return; }
    setIsApplying(true);
    try {
      await applyFilter(imageId, activeFilter?.apiKey, adjustments);
      toast.success('Đã áp dụng bộ lọc!');
    } catch {
      toast('Chạy ở chế độ demo — kết quả hiển thị trực tiếp', { icon: '💡' });
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

  const handleReset = () => { reset(); toast('Đã đặt lại', { icon: '🔄' }); };

  const showApplyBtn = activeFilter || Object.values(adjustments).some(v => v !== 0);

  return (
    <div className="editor-layout">
      {/* ── Toolbar ── */}
      <div className="toolbar">
        {/* Mode Toggle */}
        <div className="mode-toggle">
          <button
            className={`mode-btn${mode === 'image' ? ' active' : ''}`}
            onClick={() => setMode('image')}
          >
            <Image size={13} /> Ảnh
          </button>
          <button
            className={`mode-btn${mode === 'video' ? ' active' : ''}`}
            onClick={() => setMode('video')}
          >
            <Film size={13} /> Video
          </button>
        </div>

        <div className="toolbar-sep" />

        {/* History */}
        <button
          className="toolbar-icon-btn"
          onClick={undo}
          disabled={historyIndex < 0}
          title="Hoàn tác"
        >
          <Undo2 size={15} />
        </button>
        <button
          className="toolbar-icon-btn"
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          title="Làm lại"
        >
          <Redo2 size={15} />
        </button>

        <div className="toolbar-spacer" />

        {/* Actions */}
        {previewUrl && (
          <>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw size={13} />
              <span style={{ display: 'none' }} className="sm-show">Đặt lại</span>
            </Button>
            <Button variant="gold" size="sm" onClick={handleDownload}>
              <Download size={13} /> Tải xuống
            </Button>
          </>
        )}
      </div>

      {/* ── Main ── */}
      <div className="editor-main">
        {/* Canvas */}
        <div className="editor-canvas-area">
          {isUploading ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spinner size="lg" label="Đang tải lên..." />
            </div>
          ) : !previewUrl ? (
            <UploadZone mode={mode} />
          ) : (
            <PreviewCanvas onDownload={handleDownload} onReset={handleReset} />
          )}
        </div>

        {/* ── Desktop Right Panel ── */}
        {previewUrl && (
          <>
            <button
              className="editor-panel-toggle"
              onClick={() => setPanelOpen(!panelOpen)}
              style={{ right: panelOpen ? 320 : 0 }}
              title={panelOpen ? 'Ẩn panel' : 'Hiện panel'}
            >
              {panelOpen ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
            </button>

            <AnimatePresence>
              {panelOpen && (
                <motion.aside
                  key="editor-panel"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                  className="side-panel"
                  style={{ width: 320, minWidth: 320 }}
                >
                  {/* Tabs */}
                  <div className="panel-tabs">
                    {PANEL_TABS.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`panel-tab-btn${activeTab === tab.id ? ' active' : ''}`}
                      >
                        <span style={{ fontSize: 16 }}>{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Content */}
                  <div className="panel-body">
                    {activeTab === 'filter' && <FilterPanel />}
                    {activeTab === 'adjust' && <AdjustmentPanel />}
                    {activeTab === 'frame' && <FrameBuilder />}
                    {activeTab === 'ai' && <AIFilterSuggest />}
                  </div>

                  {/* Apply */}
                  {showApplyBtn && (
                    <div className="panel-footer">
                      <Button variant="gold" style={{ width: '100%' }} onClick={handleApply} isLoading={isApplying}>
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
        <div className="editor-mobile-panel md:hidden">
          <div className="editor-mobile-tabs">
            {PANEL_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`editor-mobile-tab${activeTab === tab.id ? ' active' : ''}`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="editor-mobile-content">
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
