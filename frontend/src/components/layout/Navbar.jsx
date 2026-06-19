// src/components/layout/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NAV_ITEMS } from '../../data/mockData';
import * as Icons from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16">
      <div className="h-full mx-auto max-w-7xl px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/30 group-hover:shadow-yellow-500/50 transition-shadow">
            <Sparkles size={18} className="text-black" />
          </div>
          <div className="hidden sm:block">
            <p className="font-display font-bold text-sm leading-tight gold-gradient-text">LOCKET GOLD</p>
            <p className="text-[10px] text-zinc-500 tracking-widest uppercase">Ultimate</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = Icons[item.icon];
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={[
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-yellow-400 bg-yellow-500/10'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800',
                ].join(' ')}
              >
                {Icon && <Icon size={15} />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Background blur */}
      <div className="absolute inset-0 -z-10 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50" />

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-16 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800 md:hidden"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = Icons[item.icon];
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={[
                  'flex items-center gap-3 px-6 py-4 text-sm font-medium border-b border-zinc-800/50 transition-colors',
                  isActive
                    ? 'text-yellow-400 bg-yellow-500/5'
                    : 'text-zinc-300 hover:bg-zinc-800/50',
                ].join(' ')}
              >
                {Icon && <Icon size={18} />}
                {item.label}
              </Link>
            );
          })}
        </motion.div>
      )}
    </header>
  );
}
