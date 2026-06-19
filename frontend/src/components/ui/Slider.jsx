// src/components/ui/Slider.jsx
export default function Slider({ label, icon, value, min, max, step = 1, onChange, unit = '' }) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-zinc-300">
          <span>{icon}</span>
          <span className="font-medium">{label}</span>
        </div>
        <span className="font-mono text-xs text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/20">
          {value > 0 ? `+${value}` : value}{unit}
        </span>
      </div>

      <div className="relative group">
        <div className="relative h-1.5 rounded-full bg-zinc-700">
          <div
            className="absolute left-0 top-0 h-full rounded-full progress-bar"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ height: '1.5rem', marginTop: '-0.375rem' }}
        />
        {/* Custom thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-yellow-500 border-2 border-yellow-300 shadow-lg shadow-yellow-500/50 pointer-events-none transition-transform group-hover:scale-110"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  );
}
