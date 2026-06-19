// src/components/ui/CameraCapture.jsx
import { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, X } from 'lucide-react';
import Button from './Button';
import toast from 'react-hot-toast';

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' for front, 'environment' for rear
  const [error, setError] = useState(null);

  const startCamera = useCallback(async (mode) => {
    // Stop existing stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode }
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setError(null);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Không thể truy cập camera. Vui lòng kiểm tra quyền.");
      toast.error("Lỗi truy cập camera!");
    }
  }, [stream]);

  // Initial load
  useEffect(() => {
    startCamera(facingMode);
    return () => {
      // Cleanup on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // Only run once, startCamera manages dependencies internally if needed, but we manage it explicitly

  const toggleCamera = async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    await startCamera(newMode);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    // If front camera, we might want to mirror the canvas horizontally, but standard behavior is fine
    if (facingMode === 'user') {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to File
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error("Lỗi khi chụp ảnh");
        return;
      }
      const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      onCapture(file);
    }, 'image/jpeg', 0.95);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
      {error ? (
        <div style={{ padding: 24, textAlign: 'center', background: 'rgba(239,68,68,0.1)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.3)' }}>
          <p style={{ color: '#fca5a5', fontSize: 14 }}>{error}</p>
        </div>
      ) : (
        <div style={{ position: 'relative', width: '100%', maxWidth: 320, margin: '0 auto', borderRadius: 16, overflow: 'hidden', background: '#000', aspectRatio: '3/4' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
            }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="ghost" onClick={toggleCamera} disabled={!!error} style={{ flex: 1 }}>
          <RefreshCw size={18} /> Đảo Camera
        </Button>
        <Button variant="gold" onClick={capturePhoto} disabled={!!error} style={{ flex: 2 }}>
          <Camera size={18} /> Chụp Ảnh
        </Button>
        <Button variant="ghost" onClick={onClose} style={{ padding: 12 }}>
          <X size={18} />
        </Button>
      </div>
    </div>
  );
}
