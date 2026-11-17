import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, CheckCircle2, Sparkles, TrendingUp, X } from 'lucide-react';
import { useAppStore } from '../store/AppContext';

export const ToastContainer: React.FC = () => {
  const { state, dismissToast } = useAppStore();

  return (
    <div
      className="no-print fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none px-2 sm:px-0"
      aria-live="polite"
    >
      <AnimatePresence>
        {state.toasts.map((toast) => {
          const icon =
            toast.variant === 'badge' ? (
              <Award className="w-4 h-4 text-amber-500 shrink-0" />
            ) : toast.variant === 'level' ? (
              <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : toast.variant === 'xp' ? (
              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
            );

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 shadow-lg text-sm font-medium text-slate-900 dark:text-slate-100"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {icon}
                <span className="truncate">{toast.text}</span>
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Close"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
