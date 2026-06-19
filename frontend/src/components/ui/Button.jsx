// src/components/ui/Button.jsx
import { motion } from 'framer-motion';

const variantClass = {
  gold:    'btn-gold',
  ghost:   'btn-ghost',
  surface: 'btn-surface',
  danger:  'btn-danger',
  icon:    'btn-ghost',
};

const sizeClass = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
  xl: 'btn-xl',
  icon: 'btn-md',
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
      whileHover={{ scale: disabled || isLoading ? 1 : 1.015 }}
      className={['btn', variantClass[variant] || 'btn-gold', sizeClass[size] || 'btn-md', className].join(' ')}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="btn-spin" />
          <span>Đang xử lý...</span>
        </>
      ) : children}
    </motion.button>
  );
}
