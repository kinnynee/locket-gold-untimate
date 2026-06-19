// src/components/editor/AdjustmentPanel.jsx
import { RotateCcw } from 'lucide-react';
import Slider from '../ui/Slider';
import { ADJUSTMENTS } from '../../data/mockData';
import useEditorStore from '../../store/editorStore';
import Button from '../ui/Button';

export default function AdjustmentPanel() {
  const { adjustments, setAdjustment, resetAdjustments } = useEditorStore();

  const hasChanges = ADJUSTMENTS.some((adj) => adjustments[adj.id] !== adj.default);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
          <span>🎛️</span>
          Điều Chỉnh
        </h3>
        {hasChanges && (
          <Button variant="ghost" size="sm" onClick={resetAdjustments} className="h-7 px-2 text-xs">
            <RotateCcw size={12} />
            Đặt lại
          </Button>
        )}
      </div>

      <div className="space-y-5">
        {ADJUSTMENTS.map((adj) => (
          <Slider
            key={adj.id}
            label={adj.label}
            icon={adj.icon}
            value={adjustments[adj.id]}
            min={adj.min}
            max={adj.max}
            step={adj.step}
            onChange={(val) => setAdjustment(adj.id, val)}
          />
        ))}
      </div>
    </div>
  );
}
