// src/pages/HomePage.jsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Wand2, Images, Camera, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';
import { MOCK_GALLERY, FILTERS } from '../data/mockData';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const features = [
  { icon: Wand2, label: 'Bộ lọc AI', desc: 'Gợi ý thông minh từ AI', color: 'text-yellow-400' },
  { icon: Zap, label: 'Xử lý nhanh', desc: 'Kết quả tức thì với Flask', color: 'text-amber-400' },
  { icon: Shield, label: 'Bảo mật', desc: 'Dữ liệu lưu trên máy bạn', color: 'text-emerald-400' },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20 } },
};

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 pt-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-yellow-500/8 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-600/6 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-yellow-500/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-yellow-500/3" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-10 text-center max-w-3xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <Badge variant="premium" className="px-4 py-1.5 text-sm">
              <Sparkles size={13} />
              Phiên bản Ultimate
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
              <span className="gold-gradient-text">LOCKET GOLD</span>
              <br />
              <span className="text-zinc-200 text-4xl sm:text-5xl md:text-6xl">ULTIMATE</span>
            </h1>
            <p className="text-zinc-400 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed">
              Ứng dụng chỉnh sửa ảnh và video chuyên nghiệp. Bộ lọc vàng độc quyền, xử lý bằng AI và OpenCV.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="gold"
              size="lg"
              onClick={() => navigate('/editor')}
              className="w-full sm:w-auto gold-glow"
            >
              <Upload size={18} />
              Bắt đầu chỉnh sửa
              <ArrowRight size={16} />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/photobooth')}
              className="w-full sm:w-auto"
            >
              <Camera size={18} />
              Photobooth
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-8 pt-4">
            {[
              { value: '6+', label: 'Bộ lọc độc quyền' },
              { value: '18+', label: 'Điều chỉnh chuyên sâu' },
              { value: '100%', label: 'Bảo mật offline' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl font-bold gold-gradient-text">{stat.value}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-yellow-500/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50 animate-bounce" />
        </motion.div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-100 mb-3">
              Tính năng nổi bật
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Được xây dựng với Flask + OpenCV + AI cho trải nghiệm chỉnh sửa chuyên nghiệp
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {features.map((feat, i) => (
              <motion.div
                key={feat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 space-y-3 hover:border-yellow-500/20 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center ${feat.color} group-hover:scale-110 transition-transform`}>
                  <feat.icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100">{feat.label}</h3>
                  <p className="text-sm text-zinc-400 mt-1">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Chỉnh ảnh', icon: '🖼️', path: '/editor', desc: 'Upload & chỉnh sửa' },
              { label: 'Chỉnh video', icon: '🎬', path: '/editor?tab=video', desc: 'Lọc video' },
              { label: 'Thư viện', icon: '📚', path: '/gallery', desc: 'Xem lịch sử' },
              { label: 'Photobooth', icon: '📸', path: '/photobooth', desc: 'Tạo ảnh nhóm' },
            ].map((action) => (
              <motion.button
                key={action.label}
                onClick={() => navigate(action.path)}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 hover:border-yellow-500/30 hover:bg-zinc-800 text-left transition-all group"
              >
                <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform">{action.icon}</span>
                <p className="font-semibold text-zinc-100 text-sm">{action.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{action.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filter Showcase ── */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-zinc-900/30 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl font-bold text-zinc-100 mb-2">Bộ lọc độc quyền</h2>
            <p className="text-zinc-400">6 bộ lọc được tối ưu cho ảnh phong cách Locket Gold</p>
          </motion.div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {FILTERS.map((filter, i) => (
              <motion.div
                key={filter.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group text-center space-y-2"
              >
                <div
                  className="aspect-square rounded-2xl flex items-center justify-center text-3xl border border-zinc-700/50 group-hover:border-yellow-500/40 transition-all group-hover:scale-105"
                  style={{ background: filter.preview }}
                >
                  {filter.icon}
                </div>
                <p className="text-xs font-medium text-zinc-300">{filter.nameVi}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="gold" size="lg" onClick={() => navigate('/editor')}>
              <Wand2 size={18} />
              Thử ngay bộ lọc
            </Button>
          </div>
        </div>
      </section>

      {/* ── Gallery Preview ── */}
      <section className="py-20 px-4 pb-28 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-zinc-100">Thư viện mẫu</h2>
              <p className="text-zinc-400 text-sm mt-1">Xem trước kết quả xử lý</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/gallery')}>
              Xem tất cả
              <ArrowRight size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {MOCK_GALLERY.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-xl overflow-hidden aspect-square cursor-pointer"
                onClick={() => navigate('/gallery')}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2">
                    <span className="text-xs text-white font-medium">{item.filter}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
