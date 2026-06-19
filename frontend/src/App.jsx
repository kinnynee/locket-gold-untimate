// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import EditorPage from './pages/EditorPage';
import GalleryPage from './pages/GalleryPage';
import PhotoboothPage from './pages/PhotoboothPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-[#0a0a0a] text-zinc-100">
        {/* Navigation */}
        <Navbar />
        <BottomNav />

        {/* Page Routes */}
        <main>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/photobooth" element={<PhotoboothPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e1e1e',
              color: '#f5f5f5',
              border: '1px solid #2a2a2a',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#f59e0b', secondary: '#000' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}
