// src/pages/HomePage.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Wand2, Images, Camera, ArrowRight, Sparkles, Zap, Shield, Image, Film } from 'lucide-react';
import { MOCK_GALLERY, FILTERS } from '../data/mockData';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const features = [
  { icon: Wand2,  label: 'Bộ lọc AI',       desc: 'Gợi ý thông minh dựa trên nội dung ảnh của bạn',     color: '#fbbf24', bg: 'rgba(251,191,36,.12)' },
  { icon: Zap,    label: 'Xử lý tức thì',   desc: 'Kết quả ngay lập tức với Flask + OpenCV backend',     color: '#fb923c', bg: 'rgba(251,146,60,.12)' },
  { icon: Shield, label: 'Bảo mật tuyệt đối', desc: 'Dữ liệu xử lý cục bộ, không upload lên bất kỳ server nào', color: '#34d399', bg: 'rgba(52,211,153,.12)' },
];

const quickActions = [
  { label: 'Chỉnh ảnh',   icon: Image,  path: '/editor',         desc: 'Upload & chỉnh sửa chuyên nghiệp', color: '#fbbf24' },
  { label: 'Chỉnh video', icon: Film,   path: '/editor?tab=video', desc: 'Áp dụng bộ lọc cho video',        color: '#fb923c' },
  { label: 'Thư viện',    icon: Images, path: '/gallery',         desc: 'Xem toàn bộ lịch sử chỉnh sửa',   color: '#a78bfa' },
  { label: 'Photobooth',  icon: Camera, path: '/photobooth',      desc: 'Tạo ảnh nhóm phong cách Locket',   color: '#34d399' },
];

const stats = [
  { value: '6+',   label: 'Bộ lọc vàng' },
  { value: '18+',  label: 'Thông số chỉnh' },
  { value: '100%', label: 'Bảo mật offline' },
];

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: .09 } } };
const sectionFade = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: .55, ease: 'easeOut' } },
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* ══ HERO ══ */}
      <section className="hero-section">
        <div className="hero-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
          <div className="grid-lines" />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="hero-content"
        >
          <motion.div variants={fade} style={{ display: 'flex', justifyContent: 'center' }}>
            <Badge variant="premium" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 16px', fontSize: 12 }}>
              <Sparkles size={12} /> Phiên bản Ultimate
            </Badge>
          </motion.div>

          <motion.div variants={fade} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <h1 className="hero-title gold-gradient-text">LOCKET</h1>
            <p className="hero-subtitle">GOLD ULTIMATE</p>
            <p className="hero-desc">
              Ứng dụng chỉnh sửa ảnh và video chuyên nghiệp.<br />
              Bộ lọc vàng độc quyền, xử lý bằng AI và OpenCV.
            </p>
          </motion.div>

          <motion.div variants={fade} className="hero-ctas">
            <Button variant="gold" size="lg" onClick={() => navigate('/editor')} className="gold-glow">
              <Upload size={17} /> Bắt đầu chỉnh sửa <ArrowRight size={15} />
            </Button>
            <Button variant="ghost" size="lg" onClick={() => navigate('/photobooth')}>
              <Camera size={17} /> Photobooth
            </Button>
          </motion.div>

          <motion.div variants={fade} className="hero-stats">
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p className="hero-stat-value gold-gradient-text">{s.value}</p>
                <p className="hero-stat-label">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="scroll-indicator"
        >
          <div className="scroll-line" />
          <div className="scroll-dot" />
        </motion.div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="section">
        <div className="container">
          <motion.div
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="section-header"
          >
            <span className="section-eyebrow">Tính năng</span>
            <h2 className="section-title">Được xây dựng để xuất sắc</h2>
            <p className="section-desc">Công nghệ Flask + OpenCV + AI cho trải nghiệm chỉnh sửa chuyên nghiệp</p>
          </motion.div>

          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * .12, duration: .5, ease: 'easeOut' }}
                className="feature-card"
              >
                <div className="feature-icon-wrap" style={{ background: f.bg, color: f.color }}>
                  <f.icon size={22} />
                </div>
                <div>
                  <h3 className="feature-card-title">{f.label}</h3>
                  <p className="feature-card-desc">{f.desc}</p>
                </div>
                <div className="feature-accent" style={{ background: f.color }} />
              </motion.div>
            ))}
          </div>

          <div className="quick-actions-grid">
            {quickActions.map((a, i) => (
              <motion.button
                key={a.label}
                onClick={() => navigate(a.path)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * .07, duration: .4 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: .98 }}
                className="qa-card"
              >
                <div className="qa-icon" style={{ color: a.color, background: `${a.color}18` }}>
                  <a.icon size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="qa-label">{a.label}</p>
                  <p className="qa-desc">{a.desc}</p>
                </div>
                <ArrowRight size={14} className="qa-arrow" style={{ color: a.color }} />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FILTER SHOWCASE ══ */}
      <section className="section section-alt">
        <div className="container">
          <motion.div
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="section-header"
          >
            <span className="section-eyebrow">Độc quyền</span>
            <h2 className="section-title">Bộ lọc vàng đặc biệt</h2>
            <p className="section-desc">6 bộ lọc được tối ưu riêng cho phong cách Locket Gold</p>
          </motion.div>

          <div className="filters-showcase-grid">
            {FILTERS.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, scale: .85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * .07, duration: .4 }}
                className="filter-showcase-item"
                onClick={() => navigate('/editor')}
              >
                <div className="filter-showcase-preview" style={{ background: f.preview }}>
                  <span className="filter-showcase-emoji">{f.icon}</span>
                </div>
                <p className="filter-showcase-name">{f.nameVi}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-cta"
          >
            <Button variant="gold" size="lg" onClick={() => navigate('/editor')} className="gold-glow">
              <Wand2 size={17} /> Thử ngay bộ lọc <ArrowRight size={15} />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ══ GALLERY PREVIEW ══ */}
      <section className="section section-last">
        <div className="container">
          <motion.div
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="gallery-preview-header"
          >
            <div>
              <h2 className="section-title" style={{ textAlign: 'left' }}>Thư viện mẫu</h2>
              <p className="section-desc" style={{ textAlign: 'left', marginTop: 6 }}>Xem trước kết quả xử lý</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/gallery')}>
              Xem tất cả <ArrowRight size={13} />
            </Button>
          </motion.div>

          <div className="gallery-preview-grid">
            {MOCK_GALLERY.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * .05, duration: .4 }}
                className="gallery-preview-item"
                onClick={() => navigate('/gallery')}
              >
                <img src={item.src} alt={item.title} />
                <div className="gallery-preview-overlay">
                  <span className="gallery-preview-tag">{item.filter}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
