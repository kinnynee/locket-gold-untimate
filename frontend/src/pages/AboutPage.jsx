// src/pages/AboutPage.jsx
import { motion } from 'framer-motion';
import { Code2, Layers, Cpu, Sparkles } from 'lucide-react';
import { FILTERS } from '../data/mockData';
import Badge from '../components/ui/Badge';

const techStack = [
  { category: 'Frontend', icon: '⚛️', items: ['React 18', 'Vite 6', 'TailwindCSS', 'Framer Motion', 'Zustand'] },
  { category: 'Backend', icon: '🐍', items: ['Python Flask', 'OpenCV', 'Pillow', 'NumPy'] },
  { category: 'AI & ML', icon: '🤖', items: ['AI Filter Suggest', 'OpenCV DNN', 'Image Analysis'] },
  { category: 'UX/UI', icon: '🎨', items: ['Mobile First', 'Dark Mode', 'Glassmorphism', 'Gold Design System'] },
];

const team = [
  { role: 'Full-Stack Developer', name: 'Nhóm phát triển', desc: 'Thiết kế & lập trình toàn bộ hệ thống' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-28 md:pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-16">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center mx-auto shadow-2xl shadow-yellow-500/30">
              <Sparkles size={40} className="text-black" />
            </div>
            <div className="absolute -inset-2 rounded-3xl border border-yellow-500/20 animate-pulse-gold" />
          </div>

          <div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
              <span className="gold-gradient-text">LOCKET GOLD</span>
              <br />
              <span className="text-zinc-300 text-3xl">ULTIMATE</span>
            </h1>
            <p className="text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Ứng dụng xử lý ảnh và video chuyên nghiệp, được phát triển như đồ án đại học với công nghệ Flask + OpenCV + React.
            </p>
          </div>

          <div className="flex justify-center gap-3 flex-wrap">
            <Badge variant="gold">✨ Đồ án đại học</Badge>
            <Badge variant="green">✅ Giao diện tiếng Việt</Badge>
            <Badge variant="blue">📱 Mobile First</Badge>
          </div>
        </motion.div>

        {/* Features List */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="font-display text-2xl font-bold text-zinc-100 text-center">Tính năng</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
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
            ].map((feat, i) => (
              <motion.div
                key={feat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 hover:border-yellow-500/20 transition-colors"
              >
                <span className="text-lg flex-shrink-0">{feat.icon}</span>
                <span className="text-sm text-zinc-300 font-medium">{feat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="font-display text-2xl font-bold text-zinc-100 text-center">Công nghệ sử dụng</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {techStack.map((stack, i) => (
              <motion.div
                key={stack.category}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{stack.icon}</span>
                  <h3 className="font-semibold text-zinc-100">{stack.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stack.items.map((item) => (
                    <span key={item} className="px-2.5 py-1 rounded-lg bg-zinc-700/50 text-zinc-300 text-xs font-medium border border-zinc-600/50">
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Filters Showcase */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="font-display text-2xl font-bold text-zinc-100 text-center">Bộ lọc độc quyền</h2>
          <div className="space-y-3">
            {FILTERS.map((filter, i) => (
              <motion.div
                key={filter.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-zinc-800/60 border border-zinc-700/50 hover:border-yellow-500/20 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl border border-zinc-700"
                  style={{ background: filter.preview }}
                >
                  {filter.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-zinc-100">{filter.nameVi}</h3>
                    {filter.category === 'premium' && <Badge variant="premium">Premium</Badge>}
                  </div>
                  <p className="text-sm text-zinc-400 mt-0.5">{filter.description}</p>
                </div>
                <code className="hidden sm:block text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-700">
                  {filter.apiKey}
                </code>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center py-8 border-t border-zinc-800"
        >
          <p className="font-display text-lg gold-gradient-text font-bold">LOCKET GOLD ULTIMATE</p>
          <p className="text-zinc-500 text-sm mt-1">Đồ án đại học — Xử lý ảnh và video với AI</p>
          <p className="text-zinc-600 text-xs mt-3">Built with ❤️ using React + Flask + OpenCV</p>
        </motion.div>
      </div>
    </div>
  );
}
