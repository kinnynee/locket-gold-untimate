// src/components/ui/Badge.jsx
const variantClass = {
  gold:    'badge-gold',
  green:   'badge-green',
  blue:    'badge-blue',
  red:     'badge-red',
  zinc:    'badge-zinc',
  premium: 'badge-premium',
  outline: 'badge-outline',
};

export default function Badge({ children, variant = 'gold', className = '' }) {
  return (
    <span className={['badge', variantClass[variant] || 'badge-gold', className].join(' ')}>
      {children}
    </span>
  );
}
