'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export const toast = (msg: string, type: 'success'|'error'|'info' = 'success') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cm_toast', { detail: { msg, type, id: Date.now() } }));
  }
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<any[]>([]);

  useEffect(() => {
    const handler = (e: any) => {
      setToasts(t => [...t, e.detail]);
      setTimeout(() => {
        setToasts(t => t.filter(x => x.id !== e.detail.id));
      }, 3000);
    };
    window.addEventListener('cm_toast', handler);
    return () => window.removeEventListener('cm_toast', handler);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="glass-premium px-4 py-3 rounded-xl flex items-center gap-3 min-w-[250px] shadow-2xl pointer-events-auto"
          >
            {t.type === 'success' && <CheckCircle size={18} className="text-green-400" />}
            {t.type === 'error' && <XCircle size={18} className="text-red-400" />}
            {t.type === 'info' && <Info size={18} className="text-blue-400" />}
            <span className="text-sm font-medium text-white">{t.msg}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
