// src/components/layout/BottomNav.jsx
import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../../data/mockData';
import * as Icons from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav-bar md:hidden">
      {NAV_ITEMS.map((item) => {
        const Icon = Icons[item.icon];
        const active = location.pathname === item.path ||
          (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-nav-item${active ? ' active' : ''}`}
          >
            {Icon && <Icon size={21} strokeWidth={active ? 2.5 : 1.6} />}
            <span>{item.label}</span>
            {active && <div className="bottom-nav-dot" />}
          </Link>
        );
      })}
    </nav>
  );
}
