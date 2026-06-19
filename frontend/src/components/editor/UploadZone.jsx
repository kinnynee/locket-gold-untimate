// src/components/editor/UploadZone.jsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, Film, X, Camera } from 'lucide-react';
import { isImageFile, isVideoFile, formatFileSize, validateImageFile, validateVideoFile } from '../../utils/imageUtils';
import useEditorStore from '../../store/editorStore';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import CameraCapture from '../ui/CameraCapture';
import toast from 'react-hot-toast';

export default function UploadZone({ mode = 'both' }) {
  const [error, setError] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const { setUploadedFile, previewUrl } = useEditorStore();

  const onDrop = useCallback((acceptedFiles) => {
    setError('');
    const file = acceptedFiles[0];
    if (!file) return;

    let validation;
    if (isImageFile(file)) {
      validation = validateImageFile(file);
      if (!validation.valid) { setError(validation.error); return; }
      const url = URL.createObjectURL(file);
      setUploadedFile(file, url, 'image');
      toast.success('Ảnh đã được tải lên!');
    } else if (isVideoFile(file)) {
      validation = validateVideoFile(file);
      if (!validation.valid) { setError(validation.error); return; }
      const url = URL.createObjectURL(file);
      setUploadedFile(file, url, 'video');
      toast.success('Video đã được tải lên!');
    } else {
      setError('Định dạng file không được hỗ trợ');
    }
  }, [setUploadedFile]);

  const handleCapture = (file) => {
    const url = URL.createObjectURL(file);
    setUploadedFile(file, url, 'image');
    toast.success('Đã chụp ảnh thành công!');
    setIsCameraOpen(false);
  };

  const accept = mode === 'image'
    ? { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] }
    : mode === 'video'
    ? { 'video/*': ['.mp4', '.webm', '.avi', '.mov'] }
    : {
        'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
        'video/*': ['.mp4', '.webm', '.avi', '.mov'],
      };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    multiple: false,
  });

  if (previewUrl) return null;

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div
          {...getRootProps()}
          className={[
            'upload-zone p-12 text-center cursor-pointer transition-all duration-300',
            isDragActive && !isDragReject ? 'drag-over' : '',
            isDragReject ? 'border-red-500/50 bg-red-500/5' : '',
          ].join(' ')}
        >
          <input {...getInputProps()} />

          <AnimatePresence mode="wait">
            {isDragActive ? (
              <motion.div
                key="drag"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="space-y-4"
              >
                <div className="text-6xl animate-bounce">📥</div>
                <p className="text-yellow-400 font-semibold text-lg">Thả file vào đây!</p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Icon */}
                <div className="relative mx-auto w-20 h-20">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-600/20 blur-xl animate-pulse-gold" />
                  <div className="relative w-20 h-20 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto">
                    <Upload size={32} className="text-yellow-400" />
                  </div>
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <p className="text-zinc-100 font-semibold text-lg">
                    Kéo thả hoặc{' '}
                    <span className="text-yellow-400 underline underline-offset-2 cursor-pointer">chọn file</span>
                  </p>
                  <p className="text-zinc-500 text-sm">
                    {mode === 'image' && 'Hỗ trợ JPEG, PNG, WEBP, GIF — tối đa 20MB'}
                    {mode === 'video' && 'Hỗ trợ MP4, WEBM, AVI, MOV — tối đa 500MB'}
                    {mode === 'both' && 'Hỗ trợ ảnh (JPG, PNG) và video (MP4, WEBM)'}
                  </p>
                </div>

                {/* Type badges */}
                <div className="flex items-center justify-center gap-3">
                  {(mode === 'image' || mode === 'both') && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs">
                      <Image size={12} />
                      <span>Ảnh</span>
                    </div>
                  )}
                  {(mode === 'video' || mode === 'both') && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs">
                      <Film size={12} />
                      <span>Video</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
            >
              <X size={14} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={() => setIsCameraOpen(true)}>
            <Camera size={18} className="mr-2" /> Mở Camera Chụp Trực Tiếp
          </Button>
        </div>

      </motion.div>

      {/* Camera Modal */}
      <Modal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} title="Chụp Ảnh" size="md">
        <CameraCapture onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />
      </Modal>
    </div>
  );
}
