// src/components/ui/Button.jsx
import { motion } from 'framer-motion';

const variants = {
  gold: 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-semibold hover:from-yellow-400 hover:to-amber-500 shadow-lg shadow-yellow-500/20',
  ghost: 'bg-transparent border border-zinc-700 text-zinc-300 hover:border-yellow-500/50 hover:text-yellow-400',
  danger: 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20',
  surface: 'bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700',
  icon: 'bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 hover:bg-zinc-700 hover:border-yellow-500/30',
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
  xl: 'h-14 px-8 text-lg gap-3',
  icon: 'h-10 w-10',
};

export default function Button({
  children,
  variant = 'gold',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      className={[
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Đang xử lý...</span>
        </>
      ) : children}
    </motion.button>
  );
}
