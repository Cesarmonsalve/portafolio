'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LottieRenderer from './LottieRenderer';
import { getFullConfig, DEFAULT_CONFIG, type SiteConfig } from '@/lib/config';

export default function Footer() {
  const [cfg, setCfg] = useState<SiteConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    getFullConfig().then(setCfg);
  }, []);

  return (
    <footer className="relative py-8 px-6 border-t border-white/[0.04] overflow-hidden">
      {/* Lottie decoration (very subtle) */}
      {cfg.lottie_footer?.enabled && cfg.lottie_footer?.source && (
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ opacity: (cfg.lottie_footer.opacity || 0.6) * 0.15 }}>
          <LottieRenderer source={cfg.lottie_footer.source} speed={cfg.lottie_footer.speed} />
        </div>
      )}

      {/* Animated glow line at top */}
      <div className="glow-line absolute top-0 left-0 right-0" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
        <motion.a
          href="#home"
          className="flex items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="relative w-28 h-8 flex items-center justify-start">
            <img src="/logo.png" alt="CM Design Logo" className="w-full h-full object-contain object-left" />
          </div>
        </motion.a>
        <p className="text-[11px] text-gray-400">
          © {new Date().getFullYear()} CM Design. Todos los derechos reservados.
        </p>
        <p className="text-[11px] text-gray-500">
          {cfg.footer_text}
        </p>
      </div>
    </footer>
  );
}