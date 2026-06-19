// src/components/editor/AIFilterSuggest.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { AI_SUGGESTIONS, FILTERS } from '../../data/mockData';
import useEditorStore from '../../store/editorStore';
import Button from '../ui/Button';

export default function AIFilterSuggest() {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detected, setDetected] = useState(null);
  const { setActiveFilter, previewUrl } = useEditorStore();

  const handleAnalyze = async () => {
    if (!previewUrl) return;
    setIsLoading(true);
    // Simulate AI analysis
    await new Promise((r) => setTimeout(r, 1800));
    const random = AI_SUGGESTIONS[Math.floor(Math.random() * AI_SUGGESTIONS.length)];
    setDetected(random);
    setIsLoading(false);
    setExpanded(true);
  };

  const applyFilter = (filterId) => {
    const filter = FILTERS.find((f) => f.id === filterId);
    if (filter) setActiveFilter(filter);
  };

  return (
    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => !detected ? handleAnalyze() : setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 text-left"
        disabled={isLoading || !previewUrl}
      >
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 size={16} className="text-yellow-400 animate-spin" />
          ) : (
            <Sparkles size={16} className="text-yellow-400" />
          )}
          <span className="text-sm font-medium text-yellow-300">
            {isLoading ? 'AI đang phân tích...' : 'AI Gợi Ý Bộ Lọc'}
          </span>
        </div>
        {detected && (
          <ChevronRight
            size={14}
            className={`text-yellow-400 transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        )}
      </button>

      {/* Loading Bar */}
      {isLoading && (
        <div className="px-3 pb-3">
          <div className="h-1 w-full rounded-full bg-zinc-700 overflow-hidden">
            <div className="h-full progress-bar animate-[progress_1.8s_ease-in-out_forwards]" style={{ width: '100%' }} />
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {expanded && detected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-yellow-500/20"
          >
            <div className="p-3 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{detected.icon}</span>
                <div>
                  <p className="text-xs font-medium text-zinc-200">Phát hiện: {detected.scenario}</p>
                  <p className="text-[11px] text-zinc-500">{detected.description}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                {detected.suggested.map((filterId) => {
                  const filter = FILTERS.find((f) => f.id === filterId);
                  if (!filter) return null;
                  return (
                    <button
                      key={filterId}
                      onClick={() => applyFilter(filterId)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-yellow-500/40 hover:bg-yellow-500/5 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <span>{filter.icon}</span>
                        <span className="text-xs font-medium text-zinc-200">{filter.nameVi}</span>
                      </div>
                      <span className="text-[10px] text-yellow-500/70 group-hover:text-yellow-400">Áp dụng →</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!previewUrl && (
        <p className="px-3 pb-3 text-xs text-zinc-600">Tải ảnh lên để sử dụng AI gợi ý</p>
      )}
    </div>
  );
}
