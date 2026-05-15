'use client';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import LottieRenderer from './LottieRenderer';
import SectionWrapper from './SectionWrapper';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { HEADING_SIZE_MAP, DEFAULT_SECTION_VISUAL } from '@/lib/config';

export default function About() {
  const { cfg } = useSiteConfig();
  const hCls = HEADING_SIZE_MAP[cfg.heading_size] || HEADING_SIZE_MAP.md;
  const visual = cfg.section_about || DEFAULT_SECTION_VISUAL;

  return (
    <SectionWrapper id="about" visual={visual} className="py-24 md:py-32 px-6" fallbackBg="#0a0a0a">
      {/* Lottie decoration */}
      {cfg.lottie_about?.enabled && cfg.lottie_about?.source && (
        <div className="lottie-section" style={{ opacity: cfg.lottie_about.opacity || 0.2 }}>
          <LottieRenderer source={cfg.lottie_about.source} speed={cfg.lottie_about.speed} />
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left — Photo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative group">
              <div className="absolute -inset-3 border border-white/[0.04] rounded-3xl translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/[0.06] bg-surface shadow-2xl">
                {cfg.about_photo ? (
                  <img src={cfg.about_photo} alt="Profile" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface via-black to-black">
                    <span className="text-8xl font-bold text-white/[0.04]" style={{ fontFamily: `${cfg.font_display}, sans-serif` }}>CM</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-5 pt-14">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-neon-red uppercase block mb-1">{cfg.about_job_title}</span>
                  <span className="text-white font-bold text-lg uppercase tracking-tight" style={{ fontFamily: `${cfg.font_display}, sans-serif` }}>{cfg.hero_name}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="lg:col-span-7 pt-2 lg:pt-8"
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="w-10 h-[1px] bg-neon-red" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neon-red">{cfg.about_label}</span>
            </div>

            {cfg.about_heading_type === 'image' && cfg.about_heading_image ? (
              <div className={`mb-8 flex w-full ${cfg.about_heading_align === 'center' ? 'justify-center' : cfg.about_heading_align === 'right' ? 'justify-end' : 'justify-start'}`}>
                <img src={cfg.about_heading_image} alt={cfg.about_heading} className="object-contain" style={{ width: `${cfg.about_heading_scale || 100}%`, maxWidth: '100%', maxHeight: '200px' }} />
              </div>
            ) : (
              <h2 className={`font-bold leading-tight mb-8 ${hCls} ${cfg.about_heading_align === 'center' ? 'text-center' : cfg.about_heading_align === 'right' ? 'text-right' : 'text-left'}`} style={{ fontFamily: `${cfg.font_display}, sans-serif`, transform: `scale(${(cfg.about_heading_scale || 100) / 100})`, transformOrigin: cfg.about_heading_align === 'center' ? 'center' : cfg.about_heading_align === 'right' ? 'right' : 'left' }}>
                {cfg.about_heading}
              </h2>
            )}

            <div className="space-y-5 mb-10">
              <p className="text-gray-300 text-base md:text-lg leading-relaxed font-light">{cfg.about_bio}</p>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">{cfg.about_bio_extended}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 py-8 border-y border-white/[0.05]">
              {(cfg.about_stats || []).map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: `${cfg.font_display}, sans-serif` }}>{stat.value}</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
              <a href="#contact" className="inline-flex items-center gap-3 group">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white group-hover:text-neon-red transition-colors">Hablemos de tu proyecto</span>
                <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center group-hover:border-neon-red group-hover:bg-neon-red transition-all duration-300">
                  <ArrowRight size={14} />
                </div>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}