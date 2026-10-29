import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudy } from '../context/StudyContext';
import { Icons } from './Icons';

export const ToastContainer = () => {
  const { toasts, removeToast } = useStudy();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-start gap-3.5 ${
              toast.type === 'celebrate'
                ? 'bg-gradient-to-r from-indigo-900/90 to-purple-900/90 border-indigo-400/50 text-white shadow-indigo-500/20'
                : toast.type === 'success'
                ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-200 shadow-emerald-500/10'
                : 'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            <div className={`mt-0.5 p-1.5 rounded-xl shrink-0 ${
              toast.type === 'celebrate'
                ? 'bg-indigo-500/30 text-indigo-300'
                : toast.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {toast.type === 'celebrate' ? (
                <Icons.Sparkles className="w-4 h-4" />
              ) : toast.type === 'success' ? (
                <Icons.Check className="w-4 h-4" />
              ) : (
                <Icons.Timer className="w-4 h-4" />
              )}
            </div>

            <div className="flex-1 text-sm font-medium leading-relaxed">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

