'use client';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-neon-red rounded-md flex items-center justify-center font-display font-black text-xs">
            CM
          </div>
          <span className="font-display font-bold text-sm">CM DESIGN</span>
        </div>
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} CM Design. Todos los derechos reservados.
        </p>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-xs text-gray-700"
        >
          Diseñado con 🔥 por CM
        </motion.p>
      </div>
    </footer>
  );
}