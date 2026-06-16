'use client';
import { motion } from 'framer-motion';

export default function AdminActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="admin-card p-5"
    >
      <h3 className="mb-4 text-xs font-black uppercase tracking-[.14em] text-white">
        Actividad reciente
      </h3>
      <div className="flex flex-col items-center justify-center py-8 text-gray-600">
        <p className="text-sm">Sin actividad registrada aún.</p>
        <p className="mt-1 text-xs text-gray-700">
          Las acciones del panel aparecerán aquí.
        </p>
      </div>
    </motion.div>
  );
}
