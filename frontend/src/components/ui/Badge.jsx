// src/components/ui/Badge.jsx
const variants = {
  gold: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
  zinc: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
  premium: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-500/40',
};

export default function Badge({ children, variant = 'gold', className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
