'use client';
import { motion } from 'framer-motion';
import { Zap, Target, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFullConfig, type SiteConfig, DEFAULT_CONFIG } from '@/lib/config';

const iconMap: Record<string, typeof Zap> = { 'Motion Graphics': Zap, 'Flyer Design': Target, 'Branding Visual': Award };

export default function About() {
  const [cfg, setCfg] = useState<SiteConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    getFullConfig().then(setCfg);
  }, []);

  return (
    <section id="about" className="py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left — Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/5] max-w-sm mx-auto">
              {/* Background glow */}
              <div className="absolute inset-0 bg-neon-red/10 rounded-2xl blur-[60px]" />
              {/* Main container */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/[0.06] bg-surface">
                {cfg.about_photo ? (
                  <img src={cfg.about_photo} alt="CM Design" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-neon-red/[0.08] rounded-xl flex items-center justify-center text-display text-4xl neon-red">
                        CM
                      </div>
                      <p className="text-caption text-xs">Foto de perfil</p>
                    </div>
                  </div>
                )}
                {/* Decorative */}
                <div className="absolute top-5 right-5 w-16 h-16 border border-neon-red/20 rounded-full animate-[spin_15s_linear_infinite]" />
                <div className="absolute bottom-5 left-5 w-12 h-12 border border-neon-purple/20 rounded-lg rotate-45" />
              </div>
            </div>
          </motion.div>

          {/* Right — Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-label text-neon-red">Sobre Mí</span>
            <h2 className="text-heading text-3xl md:text-4xl mt-3 mb-5">
              {cfg.about_title.split(' ').map((word, i, arr) =>
                i === arr.length - 1
                  ? <span key={i} className="neon-text">{word}</span>
                  : <span key={i}>{word} </span>
              )}
            </h2>
            <p className="text-gray-400 text-sm leading-body mb-4">
              {cfg.about_bio}
            </p>
            <p className="text-gray-400 text-sm leading-body mb-8">
              {cfg.about_bio_extended}
            </p>

            {/* Specialties */}
            <div className="space-y-3">
              {cfg.about_specialties.map((item) => {
                const Icon = iconMap[item.title] || Zap;
                return (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-neon-red/[0.06] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-neon-red" />
                    </div>
                    <div>
                      <h4 className="text-subheading text-xs">{item.title}</h4>
                      <p className="text-caption text-[11px]">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}