// src/components/editor/FrameBuilder.jsx
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { LOCKET_FRAMES } from '../../data/mockData';
import useEditorStore from '../../store/editorStore';

export default function FrameBuilder() {
  const { activeFrame, setActiveFrame } = useEditorStore();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
        <span>🖼️</span>
        Khung Locket
      </h3>

      <div className="grid grid-cols-3 gap-2">
        {/* No Frame */}
        <motion.div
          onClick={() => setActiveFrame(null)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className={[
            'filter-card cursor-pointer',
            !activeFrame ? 'active' : '',
          ].join(' ')}
        >
          <div className="aspect-square rounded-xl bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center text-lg">
            ∅
          </div>
          <p className={`text-xs font-medium pt-1 ${!activeFrame ? 'text-yellow-400' : 'text-zinc-400'}`}>Không khung</p>
        </motion.div>

        {LOCKET_FRAMES.map((frame) => (
          <motion.div
            key={frame.id}
            onClick={() => setActiveFrame(frame.id === activeFrame ? null : frame.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={[
              'filter-card cursor-pointer relative',
              activeFrame === frame.id ? 'active' : '',
            ].join(' ')}
          >
            <div className="aspect-square rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-2xl group-hover:border-yellow-500/50 relative overflow-hidden">
              {frame.icon}
              {/* Gold shimmer on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 to-yellow-500/10 opacity-0 hover:opacity-100 transition-opacity" />
            </div>

            {activeFrame === frame.id && (
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center">
                <Check size={10} className="text-black" strokeWidth={3} />
              </div>
            )}

            <div className="pt-1">
              <p className={`text-[11px] font-medium truncate ${activeFrame === frame.id ? 'text-yellow-400' : 'text-zinc-400'}`}>
                {frame.name}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
