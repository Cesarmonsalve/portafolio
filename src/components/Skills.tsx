'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  SiCinema4D, SiBlender, SiFigma, SiSketch, SiCanva, SiInvision,
  SiUnity, SiUnrealengine, SiAutodesk, SiHoudini, SiGimp, SiInkscape, SiCoreldraw, SiDavinciresolve
} from 'react-icons/si';
import type { IconType } from 'react-icons';
import LottieRenderer from './LottieRenderer';
import { getSkills, getFullConfig, type Skill, type SiteConfig, DEFAULT_CONFIG } from '@/lib/config';

// ═══════════════════════════════════════════
// CUSTOM ADOBE ICONS (Because Simple Icons removed them)
// ═══════════════════════════════════════════
const CustomAdobe = ({ letters, color }: { letters: string, color: string }) => (
  <div 
    className="w-[28px] h-[28px] rounded-[5px] flex items-center justify-center font-bold text-[15px] tracking-tighter"
    style={{ backgroundColor: '#000000', color: color, border: `2px solid ${color}`, paddingLeft: '1px' }}
  >
    {letters}
  </div>
);

// ═══════════════════════════════════════════
// ICON MAP: matches skill names to real brand icons + brand colors
// ═══════════════════════════════════════════

interface SkillIconData {
  icon?: IconType;
  custom?: React.ReactNode;
  color: string;
}

const skillIconMap: Record<string, SkillIconData> = {
  // Adobe Suite (Custom)
  'after effects':      { custom: <CustomAdobe letters="Ae" color="#9999FF" />, color: '#9999FF' },
  'aftereffects':       { custom: <CustomAdobe letters="Ae" color="#9999FF" />, color: '#9999FF' },
  'ae':                 { custom: <CustomAdobe letters="Ae" color="#9999FF" />, color: '#9999FF' },
  'photoshop':          { custom: <CustomAdobe letters="Ps" color="#31A8FF" />, color: '#31A8FF' },
  'ps':                 { custom: <CustomAdobe letters="Ps" color="#31A8FF" />, color: '#31A8FF' },
  'illustrator':        { custom: <CustomAdobe letters="Ai" color="#FF9A00" />, color: '#FF9A00' },
  'ai':                 { custom: <CustomAdobe letters="Ai" color="#FF9A00" />, color: '#FF9A00' },
  'premiere pro':       { custom: <CustomAdobe letters="Pr" color="#9999FF" />, color: '#9999FF' },
  'premiere':           { custom: <CustomAdobe letters="Pr" color="#9999FF" />, color: '#9999FF' },
  'pr':                 { custom: <CustomAdobe letters="Pr" color="#9999FF" />, color: '#9999FF' },
  'lightroom':          { custom: <CustomAdobe letters="Lr" color="#31A8FF" />, color: '#31A8FF' },
  'lr':                 { custom: <CustomAdobe letters="Lr" color="#31A8FF" />, color: '#31A8FF' },
  'indesign':           { custom: <CustomAdobe letters="Id" color="#FF3366" />, color: '#FF3366' },
  'id':                 { custom: <CustomAdobe letters="Id" color="#FF3366" />, color: '#FF3366' },

  // 3D & Motion
  'cinema 4d':          { icon: SiCinema4D,             color: '#011A6A' },
  'cinema4d':           { icon: SiCinema4D,             color: '#011A6A' },
  'c4d':                { icon: SiCinema4D,             color: '#011A6A' },
  'blender':            { icon: SiBlender,              color: '#F5792A' },
  'unreal engine':      { icon: SiUnrealengine,         color: '#FFFFFF' },
  'unreal':             { icon: SiUnrealengine,         color: '#FFFFFF' },
  'unity':              { icon: SiUnity,                color: '#FFFFFF' },
  'autodesk':           { icon: SiAutodesk,             color: '#0696D7' },
  'maya':               { icon: SiAutodesk,             color: '#0696D7' },
  '3ds max':            { icon: SiAutodesk,             color: '#0696D7' },
  'houdini':            { icon: SiHoudini,              color: '#FF4713' },

  // Design Tools
  'figma':              { icon: SiFigma,                color: '#F24E1E' },
  'sketch':             { icon: SiSketch,               color: '#F7B500' },
  'canva':              { icon: SiCanva,                color: '#00C4CC' },
  'invision':           { icon: SiInvision,             color: '#FF3366' },
  'gimp':               { icon: SiGimp,                 color: '#5C5543' },
  'inkscape':           { icon: SiInkscape,             color: '#000000' },
  'corel':              { icon: SiCoreldraw,            color: '#000000' },
  'coreldraw':          { icon: SiCoreldraw,            color: '#000000' },

  // Video
  'davinci resolve':    { icon: SiDavinciresolve,       color: '#E12E2E' },
  'davinci':            { icon: SiDavinciresolve,       color: '#E12E2E' },
  'resolve':            { icon: SiDavinciresolve,       color: '#E12E2E' },
};

function getSkillIcon(name: string): SkillIconData | null {
  const normalized = name.toLowerCase().trim();
  return skillIconMap[normalized] || null;
}

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
          {skills.map((skill, i) => {
            const brandIcon = getSkillIcon(skill.name);

            return (
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
                  className="mb-3"
                  whileHover={{ scale: 1.2, rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  {brandIcon ? (
                    brandIcon.custom ? (
                      <div className="drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">{brandIcon.custom}</div>
                    ) : brandIcon.icon ? (
                      <brandIcon.icon size={28} style={{ color: brandIcon.color }} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                    ) : null
                  ) : (
                    <span className="text-2xl">{skill.icon}</span>
                  )}
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
                      background: brandIcon
                        ? `linear-gradient(90deg, ${brandIcon.color}88, ${brandIcon.color})`
                        : 'linear-gradient(90deg, #a855f7, #ec4899)',
                      boxShadow: brandIcon
                        ? `0 0 8px ${brandIcon.color}66`
                        : '0 0 8px rgba(168,85,247,0.4)',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }} />
                  </motion.div>
                </div>
                <span className="text-[10px] text-gray-400 mt-1.5 block">{skill.level}%</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}