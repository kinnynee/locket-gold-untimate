// src/pages/AboutPage.jsx
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { FILTERS } from '../data/mockData';
import Badge from '../components/ui/Badge';

const techStack = [
  { category: 'Frontend', icon: '⚛️', items: ['React 18', 'Vite 6', 'TailwindCSS', 'Framer Motion', 'Zustand'] },
  { category: 'Backend',  icon: '🐍', items: ['Python Flask', 'OpenCV', 'Pillow', 'NumPy'] },
  { category: 'AI & ML',  icon: '🤖', items: ['AI Filter Suggest', 'OpenCV DNN', 'Image Analysis'] },
  { category: 'UX/UI',    icon: '🎨', items: ['Mobile First', 'Dark Mode', 'Glassmorphism', 'Gold Design'] },
];

const featuresList = [
  { label: 'Upload ảnh & video', icon: '📤' },
  { label: 'Warm Gold Filter', icon: '✨' },
  { label: 'Vintage Filter', icon: '📷' },
  { label: 'Black & White', icon: '🖤' },
  { label: 'Smooth Skin', icon: '💆' },
  { label: 'Sharp Gold', icon: '⚡' },
  { label: 'Chỉnh Brightness', icon: '☀️' },
  { label: 'Chỉnh Contrast', icon: '◐' },
  { label: 'Chỉnh Saturation', icon: '🎨' },
  { label: 'Chỉnh Sharpness', icon: '🔍' },
  { label: 'Khung Locket', icon: '🖼️' },
  { label: 'Photobooth', icon: '📸' },
  { label: 'Xử lý video', icon: '🎬' },
  { label: 'AI gợi ý bộ lọc', icon: '🤖' },
  { label: 'Thư viện ảnh', icon: '📚' },
  { label: 'Download kết quả', icon: '💾' },
  { label: 'Undo / Redo', icon: '↩️' },
  { label: 'Responsive UI', icon: '📱' },
];

const sectionIn = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: .5, ease: 'easeOut' } },
};

export default function AboutPage() {
  return (
    <div className="page">
      <div className="page-container" style={{ maxWidth: 960 }}>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="about-hero">
          <div className="about-logo-wrap">
            <div className="about-logo">
              <Sparkles size={40} color="#000" />
            </div>
            <div className="about-logo-ring" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <h1 className="about-title font-display gold-gradient-text">LOCKET GOLD</h1>
            <p className="about-title-sub">ULTIMATE</p>
          </div>

          <p className="about-desc">
            Ứng dụng xử lý ảnh và video chuyên nghiệp, được phát triển như đồ án đại học với
            công nghệ Flask + OpenCV + React.
          </p>

          <div className="about-badges">
            <Badge variant="gold">✨ Đồ án đại học</Badge>
            <Badge variant="green">✅ Giao diện tiếng Việt</Badge>
            <Badge variant="blue">📱 Mobile First</Badge>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          variants={sectionIn} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="about-section"
        >
          <h2 className="about-section-title font-display">Tính năng</h2>
          <div className="features-list-grid">
            {featuresList.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, scale: .9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * .03 }}
                className="feature-list-item"
              >
                <span className="feature-list-icon">{f.icon}</span>
                <span className="feature-list-label">{f.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          variants={sectionIn} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="about-section"
        >
          <h2 className="about-section-title font-display">Công nghệ sử dụng</h2>
          <div className="tech-grid">
            {techStack.map((stack, i) => (
              <motion.div
                key={stack.category}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * .1 }}
                className="tech-card"
              >
                <div className="tech-card-header">
                  <span className="tech-card-icon">{stack.icon}</span>
                  <h3 className="tech-card-title">{stack.category}</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {stack.items.map(item => (
                    <span key={item} className="tech-tag">{item}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filter Details */}
        <motion.div
          variants={sectionIn} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="about-section"
        >
          <h2 className="about-section-title font-display">Bộ lọc độc quyền</h2>
          <div className="filters-detail-list">
            {FILTERS.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * .07 }}
                className="filter-detail-row"
              >
                <div className="filter-detail-thumb" style={{ background: f.preview }}>
                  {f.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <p className="filter-detail-name">{f.nameVi}</p>
                    {f.category === 'premium' && <Badge variant="premium">Premium</Badge>}
                  </div>
                  <p className="filter-detail-desc">{f.description}</p>
                </div>
                <code className="filter-detail-api">{f.apiKey}</code>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="about-footer">
            <p className="about-footer-title font-display gold-gradient-text">LOCKET GOLD ULTIMATE</p>
            <p className="about-footer-sub">Đồ án đại học — Xử lý ảnh và video với AI</p>
            <p className="about-footer-made">Built with ❤️ using React + Flask + OpenCV</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
