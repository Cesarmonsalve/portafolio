'use client';
import { motion } from 'framer-motion';
import { Zap, Target, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import LottieRenderer from './LottieRenderer';
import { getFullConfig, type SiteConfig, DEFAULT_CONFIG } from '@/lib/config';

const iconMap: Record<string, typeof Zap> = { 'Motion Graphics': Zap, 'Flyer Design': Target, 'Branding Visual': Award };

export default function About() {
  const [cfg, setCfg] = useState<SiteConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    getFullConfig().then(setCfg);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="about" className="py-20 md:py-28 px-6 relative overflow-hidden">
      {/* Background floating orb */}
      <div className="floating-orb" style={{ width: 250, height: 250, top: '20%', right: '-5%', background: 'var(--neon-purple)' }} />

      {/* Lottie decoration */}
      {cfg.lottie_about?.enabled && cfg.lottie_about?.source && (
        <div className="lottie-section" style={{ opacity: cfg.lottie_about.opacity || 0.35 }}>
          <LottieRenderer source={cfg.lottie_about.source} speed={cfg.lottie_about.speed} />
        </div>
      )}

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left — Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] max-w-sm mx-auto">
              {/* Background glow */}
              <motion.div
                className="absolute inset-0 bg-neon-red/10 rounded-2xl blur-[60px]"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Main container */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/[0.06] bg-surface">
                {cfg.about_photo ? (
                  <img src={cfg.about_photo} alt="CM Design" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <motion.div
                        className="w-24 h-24 mx-auto mb-4 bg-neon-red/[0.08] rounded-xl flex items-center justify-center text-display text-4xl neon-red morph-blob"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        CM
                      </motion.div>
                      <p className="text-caption text-xs">Foto de perfil</p>
                    </div>
                  </div>
                )}
                {/* Decorative elements */}
                <div className="absolute top-5 right-5 w-16 h-16 border border-neon-red/20 rounded-full animate-[spin_15s_linear_infinite]" />
                <div className="absolute bottom-5 left-5 w-12 h-12 border border-neon-purple/20 rounded-lg rotate-45 morph-blob" />
                {/* Gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface to-transparent" />
              </div>
            </div>
          </motion.div>

          {/* Right — Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.span variants={itemVariants} className="text-label text-neon-red block">Sobre Mí</motion.span>
            <motion.h2 variants={itemVariants} className="text-heading text-3xl md:text-4xl mt-3 mb-5">
              {cfg.about_title.split(' ').map((word, i, arr) =>
                i === arr.length - 1
                  ? <span key={i} className="gradient-text-animated">{word}</span>
                  : <span key={i}>{word} </span>
              )}
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-400 text-sm leading-body mb-4">
              {cfg.about_bio}
            </motion.p>
            <motion.p variants={itemVariants} className="text-gray-400 text-sm leading-body mb-8">
              {cfg.about_bio_extended}
            </motion.p>

            {/* Specialties */}
            <div className="space-y-3">
              {cfg.about_specialties.map((item, i) => {
                const Icon = iconMap[item.title] || Zap;
                return (
                  <motion.div
                    key={item.title}
                    variants={itemVariants}
                    className="flex items-start gap-3 group"
                    whileHover={{ x: 6 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-9 h-9 bg-neon-red/[0.06] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-neon-red/[0.12] transition-colors">
                      <Icon size={16} className="text-neon-red" />
                    </div>
                    <div>
                      <h4 className="text-subheading text-xs">{item.title}</h4>
                      <p className="text-caption text-[11px]">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}