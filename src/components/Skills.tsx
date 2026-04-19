'use client';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import LottieRenderer from './LottieRenderer';
import { getSkills, getFullConfig, type Skill, type SiteConfig, DEFAULT_CONFIG } from '@/lib/config';

const defaultSkills: Skill[] = [
  { id: '1', name: 'After Effects', level: 95, icon: '🎬', category: 'Video', position: 0 },
  { id: '2', name: 'Cinema 4D', level: 80, icon: '🧊', category: '3D', position: 1 },
  { id: '3', name: 'Photoshop', level: 92, icon: '🖼️', category: 'Diseño', position: 2 },
  { id: '4', name: 'Illustrator', level: 85, icon: '✏️', category: 'Diseño', position: 3 },
  { id: '5', name: 'Premiere Pro', level: 88, icon: '🎥', category: 'Video', position: 4 },
  { id: '6', name: 'DaVinci Resolve', level: 75, icon: '🎨', category: 'Video', position: 5 },
  { id: '7', name: 'Blender', level: 70, icon: '🔮', category: '3D', position: 6 },
  { id: '8', name: 'Figma', level: 78, icon: '📐', category: 'Diseño', position: 7 },
];

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [cfg, setCfg] = useState<SiteConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    getSkills().then((data) => {
      if (data.length > 0) setSkills(data);
    });
    getFullConfig().then(setCfg);
  }, []);

  return (
    <section id="skills" className="py-20 md:py-28 px-6 bg-bg-secondary relative overflow-hidden">
      {/* Floating orb */}
      <div className="floating-orb" style={{ width: 200, height: 200, bottom: '10%', left: '5%', background: 'var(--neon-purple)' }} />

      {/* Lottie decoration */}
      {cfg.lottie_skills?.enabled && cfg.lottie_skills?.source && (
        <div className="lottie-section" style={{ opacity: cfg.lottie_skills.opacity || 0.35 }}>
          <LottieRenderer source={cfg.lottie_skills.source} speed={cfg.lottie_skills.speed} />
        </div>
      )}

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-label text-neon-purple">Herramientas</span>
          <h2 className="text-heading text-3xl md:text-4xl mt-3">
            Mi{' '}
            <span className="gradient-text-animated">
              Arsenal
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="group bg-bg border border-white/[0.04] rounded-xl p-4 hover:border-neon-purple/20 hover:bg-bg-tertiary transition-all duration-300 card-spotlight"
              data-cursor-hover
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
                e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
              }}
            >
              <motion.div
                className="text-2xl mb-2"
                whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
              >
                {skill.icon}
              </motion.div>
              <h4 className="text-subheading text-xs mb-2.5">{skill.name}</h4>
              <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full relative"
                  style={{
                    background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                    boxShadow: '0 0 8px rgba(168,85,247,0.4)',
                  }}
                >
                  {/* Shimmer effect on progress bar */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }} />
                </motion.div>
              </div>
              <span className="text-[10px] text-gray-400 mt-1.5 block">{skill.level}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}