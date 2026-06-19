// src/components/ui/Spinner.jsx
export default function Spinner({ size = 'md', label = 'Đang tải...' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} relative`}>
        <div className={`${sizes[size]} rounded-full border-2 border-zinc-700 absolute`} />
        <div className={`${sizes[size]} rounded-full border-2 border-transparent border-t-yellow-500 animate-spin absolute`} />
        <div className={`${sizes[size]} rounded-full border-2 border-transparent border-b-amber-500/50 animate-spin absolute`} style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      {label && <p className="text-sm text-zinc-400 animate-pulse">{label}</p>}
    </div>
  );
}
