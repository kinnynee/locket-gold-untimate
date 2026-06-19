// src/components/editor/AdjustmentPanel.jsx
import { RotateCcw } from 'lucide-react';
import Slider from '../ui/Slider';
import { ADJUSTMENTS } from '../../data/mockData';
import useEditorStore from '../../store/editorStore';
import Button from '../ui/Button';

export default function AdjustmentPanel() {
  const { adjustments, setAdjustment, resetAdjustments } = useEditorStore();
  const hasChanges = ADJUSTMENTS.some(adj => adjustments[adj.id] !== adj.default);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p className="panel-section-label" style={{ marginBottom: 0 }}>🎛️ Điều Chỉnh</p>
        {hasChanges && (
          <Button variant="ghost" size="sm" onClick={resetAdjustments}>
            <RotateCcw size={12} /> Đặt lại
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {ADJUSTMENTS.map(adj => (
          <div key={adj.id} className="adjustment-row">
            <div className="adjustment-header">
              <span className="adjustment-label">{adj.icon} {adj.label}</span>
              <span className="adjustment-value">{adjustments[adj.id] > 0 ? '+' : ''}{adjustments[adj.id]}</span>
            </div>
            <Slider
              label=""
              value={adjustments[adj.id]}
              min={adj.min}
              max={adj.max}
              step={adj.step}
              onChange={val => setAdjustment(adj.id, val)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
