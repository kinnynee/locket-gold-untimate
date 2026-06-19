// src/components/layout/BottomNav.jsx
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../data/mockData';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-40 md:hidden safe-area-pb">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = Icons[item.icon];
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 relative"
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-yellow-500/10 rounded-xl mx-1"
                />
              )}
              <div className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-yellow-400' : 'text-zinc-500'}`}>
                {Icon && <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />}
              </div>
              <span className={`relative z-10 text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-yellow-400' : 'text-zinc-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
