// src/pages/AboutPage.jsx
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { FILTERS } from '../data/mockData';
import Badge from '../components/ui/Badge';

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
            Ứng dụng chụp, chỉnh sửa ảnh và video với các bộ lọc màu cực chất. 
            Mang đến cho bạn những bức ảnh mang phong cách hoài cổ, ấm áp và lung linh nhất!
          </p>

          <div className="about-badges">
            <Badge variant="gold">✨ Bộ lọc độc quyền</Badge>
            <Badge variant="green">✅ Dễ dàng sử dụng</Badge>
            <Badge variant="blue">📱 Lưu giữ kỉ niệm</Badge>
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

        {/* About App */}
        <motion.div
          variants={sectionIn} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="about-section"
        >
          <h2 className="about-section-title font-display">Locket Gold là gì?</h2>
          <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', color: 'var(--text-2)', lineHeight: 1.6 }}>
            <p style={{ marginBottom: 16 }}>
              Locket Gold Ultimate là ứng dụng giúp bạn lưu giữ mọi khoảnh khắc đáng nhớ một cách nghệ thuật nhất. Không cần phải rành về chỉnh sửa, ứng dụng đã cung cấp sẵn những bộ lọc màu (filter) được thiết kế tỉ mỉ, giúp hô biến bức ảnh bình thường thành những tác phẩm mang đậm phong cách vintage, màu phim, hay rực rỡ ấm áp.
            </p>
            <p>
              Bạn có thể tự sướng, ghép ảnh kiểu Photobooth Hàn Quốc, hay áp dụng bộ lọc cho cả video. Mọi thứ đều tự động, nhanh chóng và cực kỳ dễ sử dụng!
            </p>
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
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <div className="about-footer">
            <p className="about-footer-title font-display gold-gradient-text">LOCKET GOLD ULTIMATE</p>
            <p className="about-footer-sub">Lưu giữ mọi khoảnh khắc lung linh nhất</p>
            <p className="about-footer-made">Phiên bản Premium dành riêng cho bạn ❤️</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
