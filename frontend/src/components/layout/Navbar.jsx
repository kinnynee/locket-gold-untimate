// src/components/layout/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NAV_ITEMS } from '../../data/mockData';
import * as Icons from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Background */}
        <div className="navbar-bg" />

        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <div className="navbar-logo-icon">
            <Sparkles size={17} color="#000" />
          </div>
          <div className="navbar-logo-text">
            <span className="navbar-logo-name">LOCKET GOLD</span>
            <span className="navbar-logo-sub">Ultimate</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = Icons[item.icon];
            const active = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link${active ? ' active' : ''}`}
              >
                {Icon && <Icon size={14} />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="navbar-mobile-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: .2 }}
            className="navbar-mobile-menu"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = Icons[item.icon];
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`navbar-mobile-link${active ? ' active' : ''}`}
                >
                  {Icon && <Icon size={18} />}
                  {item.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
