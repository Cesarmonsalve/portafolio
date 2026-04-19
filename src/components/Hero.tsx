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
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto w-full">
        
        {/* Floating animated cinematic bars */}
        <motion.div 
          className="absolute top-10 left-10 w-32 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: [-50, 50, -50], opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-32 right-10 w-24 h-[1px] bg-gradient-to-r from-transparent via-neon-red/40 to-transparent"
          animate={{ x: [50, -50, 50], opacity: [0, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 1 }}
        />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
          className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.04] px-5 py-2 rounded-full mb-12 backdrop-blur-md hover:border-white/10 hover:bg-white/[0.04] transition-all"
        >
          <Sparkles size={14} className="text-neon-red animate-pulse-neon" />
          <span className="text-label !text-[10px] tracking-wide-custom">
            {cfg.hero_badge}
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 relative"
        >
          <span className="block text-gray-500 font-body text-xs md:text-sm font-medium mb-5 tracking-wide-custom uppercase">
            Portfolio
          </span>
          <GlitchText
            text={cfg.hero_name}
            className="block text-display text-5xl sm:text-7xl md:text-8xl drop-shadow-[0_0_25px_rgba(255,0,51,0.2)]"
          />
          <span className="block neon-text text-heading text-lg sm:text-2xl md:text-3xl mt-4 bg-clip-text">
            {cfg.hero_subtitle.toUpperCase()}
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-12 leading-relaxed"
        >
          {cfg.hero_description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1, type: "spring", stiffness: 120 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#work"
            className="group relative overflow-hidden flex items-center justify-center gap-2 bg-neon-red px-8 py-4 rounded-xl font-display font-bold text-[11px] tracking-wide-custom transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,0,51,0.4)]"
            data-cursor-hover
          >
            <span className="relative z-10 text-white flex items-center gap-2">VER TRABAJOS <span className="group-hover:translate-y-1 transition-transform">↓</span></span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
          </a>
          <a
            href="#contact"
            className="group flex items-center justify-center gap-2 bg-white/[0.02] border border-white/[0.08] backdrop-blur-md hover:border-neon-red/40 hover:bg-neon-red/[0.05] px-8 py-4 rounded-xl font-display font-bold text-[11px] text-gray-300 hover:text-white tracking-wide-custom transition-all hover:scale-105"
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

      {/* Cinematic Marquee Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-0 w-full overflow-hidden border-t border-b border-white/[0.04] bg-white/[0.01] backdrop-blur-xl py-3.5 z-20"
      >
        <div className="flex whitespace-nowrap animate-marquee w-[200%] sm:w-max hover:[animation-play-state:paused] cursor-default">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-4">
              <span className="font-display font-bold text-[10px] tracking-widest text-gray-400 uppercase">MOTION GRAPHICS</span>
              <Sparkles size={10} className="text-neon-red animate-pulse-neon" />
              <span className="font-display font-bold text-[10px] tracking-widest text-gray-400 uppercase">VISUAL DESIGN</span>
              <Sparkles size={10} className="text-neon-purple animate-pulse-neon" />
              <span className="font-display font-bold text-[10px] tracking-widest text-gray-400 uppercase">BRANDING</span>
              <Sparkles size={10} className="text-neon-accent animate-pulse-neon" />
              <span className="font-display font-bold text-[10px] tracking-widest text-gray-400 uppercase">FLYER DESIGN</span>
              <Sparkles size={10} className="text-gray-600" />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}