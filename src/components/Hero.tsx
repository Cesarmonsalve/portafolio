'use client';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import Particles from './Particles';
import GlitchText from './GlitchText';
import { getFullConfig, type SiteConfig, DEFAULT_CONFIG } from '@/lib/config';

export default function Hero() {
  const [cfg, setCfg] = useState<SiteConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    getFullConfig().then(setCfg);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,rgba(255,0,51,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(168,85,247,0.06),transparent)]" />
      <Particles count={35} />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-4 py-1.5 rounded-full mb-10"
        >
          <Sparkles size={12} className="text-neon-red" />
          <span className="text-label !text-[10px]">
            {cfg.hero_badge}
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5"
        >
          <span className="block text-gray-500 font-body text-sm font-normal mb-4 tracking-label uppercase">
            Portfolio
          </span>
          <GlitchText
            text={cfg.hero_name}
            className="block text-display text-5xl sm:text-6xl md:text-7xl"
          />
          <span className="block neon-text text-heading text-lg sm:text-xl md:text-2xl mt-3">
            {cfg.hero_subtitle.toUpperCase()}
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-gray-400 text-sm md:text-[15px] max-w-lg mx-auto mb-10 leading-body"
        >
          {cfg.hero_description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href="#work"
            className="group flex items-center gap-2 bg-neon-red hover:bg-red-600 px-6 py-3 rounded-lg font-display font-bold text-xs tracking-label transition-all hover:shadow-[0_0_30px_rgba(255,0,51,0.3)]"
            data-cursor-hover
          >
            VER TRABAJOS
            <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] hover:border-neon-red/40 hover:bg-neon-red/[0.05] px-6 py-3 rounded-lg font-display font-bold text-xs tracking-label transition-all"
            data-cursor-hover
          >
            CONTACTAR
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex items-center justify-center gap-10 md:gap-14 mt-16 pt-8 border-t border-white/[0.04]"
        >
          {cfg.hero_stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-heading text-2xl md:text-3xl neon-text">{stat.value}</div>
              <div className="text-label mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <ArrowDown size={16} className="text-gray-600" />
        </motion.div>
      </motion.div>
    </section>
  );
}