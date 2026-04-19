'use client';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import Particles from './Particles';
import GlitchText from './GlitchText';
import LottieRenderer from './LottieRenderer';
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

      {/* Floating orbs */}
      <div className="floating-orb" style={{ width: 300, height: 300, top: '10%', left: '15%', background: 'var(--neon-red)' }} />
      <div className="floating-orb" style={{ width: 200, height: 200, bottom: '20%', right: '10%', background: 'var(--neon-purple)' }} />
      <div className="floating-orb" style={{ width: 150, height: 150, top: '60%', left: '60%', background: 'var(--neon-pink)' }} />

      <Particles count={35} />

      {/* Lottie Animation Layer */}
      {cfg.lottie_hero?.enabled && cfg.lottie_hero?.source && (
        <div className="lottie-hero" style={{ opacity: cfg.lottie_hero.opacity || 0.5 }}>
          <LottieRenderer
            source={cfg.lottie_hero.source}
            speed={cfg.lottie_hero.speed}
          />
        </div>
      )}

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
        {/* Extra cinematic accent line */}
        <motion.div
          className="absolute top-1/2 left-0 w-16 h-[1px] bg-gradient-to-r from-neon-purple/30 to-transparent"
          animate={{ scaleX: [0, 1, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
          className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.04] px-5 py-2 rounded-full mb-12 backdrop-blur-md hover:border-white/10 hover:bg-white/[0.04] transition-all elastic-press"
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
          <span className="block text-gray-400 font-body text-xs md:text-sm font-medium mb-5 tracking-wide-custom uppercase">
            Portfolio
          </span>
          <GlitchText
            text={cfg.hero_name}
            className="block text-display text-5xl sm:text-7xl md:text-8xl drop-shadow-[0_0_25px_rgba(255,0,51,0.2)]"
          />
          <motion.span
            className="block text-heading text-lg sm:text-2xl md:text-3xl mt-4 gradient-text-animated"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {cfg.hero_subtitle.toUpperCase()}
          </motion.span>
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
            className="group relative overflow-hidden flex items-center justify-center gap-2 bg-neon-red px-8 py-4 rounded-xl font-display font-bold text-[11px] tracking-wide-custom transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,0,51,0.4)] elastic-press"
            data-cursor-hover
          >
            <span className="relative z-10 text-white flex items-center gap-2">VER TRABAJOS <span className="group-hover:translate-y-1 transition-transform">↓</span></span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
          </a>
          <a
            href="#contact"
            className="group flex items-center justify-center gap-2 bg-white/[0.02] border border-white/[0.08] backdrop-blur-md hover:border-neon-red/40 hover:bg-neon-red/[0.05] px-8 py-4 rounded-xl font-display font-bold text-[11px] text-gray-300 hover:text-white tracking-wide-custom transition-all hover:scale-105 elastic-press"
            data-cursor-hover
          >
            CONTACTAR
          </a>
        </motion.div>

        {/* Stats with counting animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex items-center justify-center gap-10 md:gap-14 mt-16 pt-8 border-t border-white/[0.04]"
        >
          {cfg.hero_stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + i * 0.15, duration: 0.5 }}
            >
              <div className="text-heading text-2xl md:text-3xl gradient-text-animated">{stat.value}</div>
              <div className="text-label mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} className="text-gray-500" />
        </motion.div>
      </motion.div>

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
              <Sparkles size={10} className="text-neon-red/50" />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}