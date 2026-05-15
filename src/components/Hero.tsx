'use client';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Particles from './Particles';
import GlitchText from './GlitchText';
import LottieRenderer from './LottieRenderer';
import SectionWrapper from './SectionWrapper';
import MagneticButton from './ui/MagneticButton';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { DEFAULT_SECTION_VISUAL } from '@/lib/config';

export default function Hero() {
  const { cfg } = useSiteConfig();
  const visual = cfg.section_hero || DEFAULT_SECTION_VISUAL;
  const marqueeItems = cfg.marquee_items || ['Motion Graphics', 'Visual Design', 'Branding'];

  return (
    <SectionWrapper id="home" visual={visual} className="relative min-h-screen flex items-center justify-center">
      {/* Cinematic gradients (always present on hero for atmosphere) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,0,51,0.18),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_100%_100%,rgba(168,85,247,0.08),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_0%_80%,rgba(236,72,153,0.06),transparent_50%)] pointer-events-none" />

      {/* Static gradient mesh (no animation = no GPU drain) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[60%] opacity-20 pointer-events-none"
        style={{
          background: 'conic-gradient(from 180deg at 50% 50%, rgba(255,0,51,0.15), rgba(168,85,247,0.1), rgba(236,72,153,0.08), rgba(255,0,51,0.15))',
          filter: 'blur(80px)',
        }}
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }} />

      {/* Lottie */}
      {cfg.lottie_hero?.enabled && cfg.lottie_hero?.source && (
        <div className="lottie-hero" style={{ opacity: cfg.lottie_hero.opacity || 0.5 }}>
          <LottieRenderer source={cfg.lottie_hero.source} speed={cfg.lottie_hero.speed} />
        </div>
      )}

      {/* ═══ CONTENT ═══ */}
      <div className={`relative z-10 px-6 pt-24 pb-40 max-w-5xl mx-auto w-full flex flex-col ${cfg.hero_name_align === 'left' ? 'items-start text-left' : cfg.hero_name_align === 'right' ? 'items-end text-right' : 'items-center text-center'}`}>

        {/* Badge pill */}
        {/* Badge pill */}
        <div
          className="inline-flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.06] px-6 py-2.5 rounded-full mb-10 backdrop-blur-md hover:border-neon-red/30 hover:bg-white/[0.05] transition-all cursor-default opacity-0 animate-slide-up"
          style={{ animationDelay: '0.1s' }}
        >
          <span className="w-2 h-2 rounded-full bg-neon-red animate-pulse" />
          <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400">{cfg.hero_badge}</span>
        </div>

        {/* Title */}
        <h1
          className={`mb-6 relative flex flex-col w-full opacity-0 animate-slide-up ${cfg.hero_name_align === 'left' ? 'items-start text-left' : cfg.hero_name_align === 'right' ? 'items-end text-right' : 'items-center text-center'}`}
          style={{ animationDelay: '0.2s' }}
        >
          <span className="block text-gray-500 text-xs md:text-sm font-medium mb-4 tracking-[0.2em] uppercase" style={{ fontFamily: `${cfg.font_body}, sans-serif` }}>
            Portfolio
          </span>
          
          {cfg.hero_name_type === 'image' && cfg.hero_name_image ? (
            <img src={cfg.hero_name_image} alt={cfg.hero_name} className="object-contain" style={{ width: `${cfg.hero_name_scale || 100}%`, maxWidth: '100%', maxHeight: '400px' }} />
          ) : (
            <div style={{ transform: `scale(${(cfg.hero_name_scale || 100) / 100})`, transformOrigin: cfg.hero_name_align === 'left' ? 'left center' : cfg.hero_name_align === 'right' ? 'right center' : 'center' }}>
              <GlitchText
                text={cfg.hero_name}
                className="block text-display text-5xl sm:text-6xl md:text-7xl drop-shadow-[0_0_30px_rgba(255,0,51,0.15)]"
              />
            </div>
          )}

          <span
            className="block text-lg sm:text-xl md:text-2xl mt-5 gradient-text-animated font-bold opacity-0 animate-slide-up"
            style={{ fontFamily: `${cfg.font_display}, sans-serif`, animationDelay: '0.4s' }}
          >
            {cfg.hero_subtitle.toUpperCase()}
          </span>
        </h1>

        {/* Description */}
        <p
          className={`text-gray-400 text-sm md:text-base max-w-xl mb-14 leading-relaxed opacity-0 animate-slide-up ${cfg.hero_name_align === 'center' ? 'mx-auto' : ''}`}
          style={{ animationDelay: '0.5s' }}
        >
          {cfg.hero_description}
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-6 opacity-0 animate-slide-up"
          style={{ animationDelay: '0.6s' }}
        >
          <MagneticButton strength={0.3} className="group rounded-2xl">
            <a href="#work" className="moving-border-btn flex items-center justify-center gap-3 px-10 py-4 font-display font-bold text-[12px] tracking-[0.1em] text-white">
              VER TRABAJOS <span className="group-hover:translate-y-1 transition-transform">↓</span>
            </a>
          </MagneticButton>

          <MagneticButton strength={0.15} className="group rounded-2xl">
            <a href="#contact" className="glass-premium flex items-center justify-center gap-2 px-10 py-4 font-display font-bold text-[12px] text-gray-300 hover:text-white tracking-[0.1em] transition-all rounded-2xl">
              CONTACTAR
            </a>
          </MagneticButton>
        </div>

        {/* Stats */}
        <div 
          className="flex items-center justify-center gap-10 md:gap-16 mt-20 pt-8 border-t border-white/[0.04] opacity-0 animate-fade-in"
          style={{ animationDelay: '0.8s' }}
        >
          {cfg.hero_stats.map((stat, i) => (
            <div key={stat.label} className="text-center opacity-0 animate-slide-up" style={{ animationDelay: `${0.9 + i * 0.1}s` }}>
              <div className="text-3xl md:text-4xl font-bold gradient-text-animated" style={{ fontFamily: `${cfg.font_display}, sans-serif` }}>{stat.value}</div>
              <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-gray-500 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-[80px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-0 animate-fade-in"
        style={{ animationDelay: '1s' }}
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown size={16} className="text-gray-500" />
        </motion.div>
      </div>

      {/* Marquee — reads from config */}
      <div 
        className="absolute bottom-0 w-full overflow-hidden bg-gradient-to-t from-black via-black/80 to-transparent pt-16 pb-4 z-20 opacity-0 animate-fade-in"
        style={{ animationDelay: '0.8s' }}
      >
        <div className="animate-marquee cursor-default select-none">
          {[0, 1].map(rep => (
            <div key={rep} className="flex items-center gap-8 px-4">
              {marqueeItems.map((text, i) => (
                <div key={`${rep}-${i}`} className="flex items-center gap-8 shrink-0">
                  <span className="font-display font-bold text-[10px] tracking-[0.2em] text-gray-500 uppercase hover:text-gray-300 transition-colors">{text}</span>
                  <span className="text-[7px] shrink-0 text-neon-red">◆</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}