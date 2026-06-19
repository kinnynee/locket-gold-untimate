// src/store/editorStore.js
import { create } from 'zustand';
import { ADJUSTMENTS } from '../data/mockData';

const defaultAdjustments = ADJUSTMENTS.reduce((acc, adj) => {
  acc[adj.id] = adj.default;
  return acc;
}, {});

const useEditorStore = create((set, get) => ({
  // ── Upload State ──
  uploadedFile: null,
  previewUrl: null,
  imageId: null,
  fileType: null, // 'image' | 'video'
  isUploading: false,
  uploadProgress: 0,

  // ── Filter State ──
  activeFilter: null,
  filters: [],

  // ── Adjustment State ──
  adjustments: { ...defaultAdjustments },

  // ── Frame State ──
  activeFrame: null,

  // ── Processing State ──
  isProcessing: false,
  processedUrl: null,
  processingStep: '',

  // ── AI State ──
  aiSuggestions: [],
  isAILoading: false,

  // ── History ──
  history: [],
  historyIndex: -1,

  // ── Actions ──
  setUploadedFile: (file, url, type) => set({
    uploadedFile: file,
    previewUrl: url,
    fileType: type,
    processedUrl: null,
    activeFilter: null,
    adjustments: { ...defaultAdjustments },
    activeFrame: null,
  }),

  setImageId: (id) => set({ imageId: id }),

  setIsUploading: (val) => set({ isUploading: val }),
  setUploadProgress: (val) => set({ uploadProgress: val }),

  setActiveFilter: (filter) => {
    const prev = get().activeFilter;
    set({ activeFilter: filter });
    get().pushHistory({ type: 'filter', prev, next: filter });
  },

  setAdjustment: (key, value) => {
    const prev = get().adjustments[key];
    set((state) => ({
      adjustments: { ...state.adjustments, [key]: value },
    }));
    get().pushHistory({ type: 'adjustment', key, prev, next: value });
  },

  resetAdjustments: () => set({ adjustments: { ...defaultAdjustments } }),

  setActiveFrame: (frame) => set({ activeFrame: frame }),

  setIsProcessing: (val, step = '') => set({ isProcessing: val, processingStep: step }),
  setProcessedUrl: (url) => set({ processedUrl: url }),

  setAISuggestions: (suggestions) => set({ aiSuggestions: suggestions }),
  setIsAILoading: (val) => set({ isAILoading: val }),

  pushHistory: (action) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      return {
        history: [...newHistory, action],
        historyIndex: newHistory.length,
      };
    });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < 0) return;
    const action = history[historyIndex];
    if (action.type === 'filter') {
      set({ activeFilter: action.prev });
    } else if (action.type === 'adjustment') {
      set((state) => ({
        adjustments: { ...state.adjustments, [action.key]: action.prev },
      }));
    }
    set({ historyIndex: historyIndex - 1 });
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex >= history.length - 1) return;
    const action = history[historyIndex + 1];
    if (action.type === 'filter') {
      set({ activeFilter: action.next });
    } else if (action.type === 'adjustment') {
      set((state) => ({
        adjustments: { ...state.adjustments, [action.key]: action.next },
      }));
    }
    set({ historyIndex: historyIndex + 1 });
  },

  reset: () => set({
    uploadedFile: null,
    previewUrl: null,
    imageId: null,
    fileType: null,
    isUploading: false,
    uploadProgress: 0,
    activeFilter: null,
    adjustments: { ...defaultAdjustments },
    activeFrame: null,
    isProcessing: false,
    processedUrl: null,
    processingStep: '',
    aiSuggestions: [],
    history: [],
    historyIndex: -1,
  }),
}));

export default useEditorStore;
