'use client';
import {
  SiCinema4D, SiBlender, SiFigma, SiSketch, SiCanva, SiInvision,
  SiUnity, SiUnrealengine, SiAutodesk, SiHoudini, SiGimp, SiInkscape, SiCoreldraw, SiDavinciresolve
} from 'react-icons/si';
import type { IconType } from 'react-icons';
import LottieRenderer from './LottieRenderer';
import SectionWrapper from './SectionWrapper';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { HEADING_SIZE_MAP, DEFAULT_SECTION_VISUAL } from '@/lib/config';
import type { Skill } from '@/lib/config';

/* Adobe custom icon */
const AdobeIcon = ({ letters, color }: { letters: string; color: string }) => (
  <div className="w-[28px] h-[28px] rounded-[5px] flex items-center justify-center font-bold text-[15px] tracking-tighter"
    style={{ backgroundColor: '#000', color, border: `2px solid ${color}`, paddingLeft: '1px' }}>{letters}</div>
);

interface SkillIconData { icon?: IconType; custom?: React.ReactNode; color: string; }

const skillIconMap: Record<string, SkillIconData> = {
  'after effects':   { custom: <AdobeIcon letters="Ae" color="#9999FF" />, color: '#9999FF' },
  'aftereffects':    { custom: <AdobeIcon letters="Ae" color="#9999FF" />, color: '#9999FF' },
  'ae':              { custom: <AdobeIcon letters="Ae" color="#9999FF" />, color: '#9999FF' },
  'photoshop':       { custom: <AdobeIcon letters="Ps" color="#31A8FF" />, color: '#31A8FF' },
  'ps':              { custom: <AdobeIcon letters="Ps" color="#31A8FF" />, color: '#31A8FF' },
  'illustrator':     { custom: <AdobeIcon letters="Ai" color="#FF9A00" />, color: '#FF9A00' },
  'ai':              { custom: <AdobeIcon letters="Ai" color="#FF9A00" />, color: '#FF9A00' },
  'premiere pro':    { custom: <AdobeIcon letters="Pr" color="#9999FF" />, color: '#9999FF' },
  'premiere':        { custom: <AdobeIcon letters="Pr" color="#9999FF" />, color: '#9999FF' },
  'pr':              { custom: <AdobeIcon letters="Pr" color="#9999FF" />, color: '#9999FF' },
  'lightroom':       { custom: <AdobeIcon letters="Lr" color="#31A8FF" />, color: '#31A8FF' },
  'lr':              { custom: <AdobeIcon letters="Lr" color="#31A8FF" />, color: '#31A8FF' },
  'indesign':        { custom: <AdobeIcon letters="Id" color="#FF3366" />, color: '#FF3366' },
  'cinema 4d':       { icon: SiCinema4D,      color: '#011A6A' },
  'cinema4d':        { icon: SiCinema4D,      color: '#011A6A' },
  'c4d':             { icon: SiCinema4D,      color: '#011A6A' },
  'blender':         { icon: SiBlender,       color: '#F5792A' },
  'unreal engine':   { icon: SiUnrealengine,  color: '#FFFFFF' },
  'unreal':          { icon: SiUnrealengine,  color: '#FFFFFF' },
  'unity':           { icon: SiUnity,         color: '#FFFFFF' },
  'autodesk':        { icon: SiAutodesk,      color: '#0696D7' },
  'maya':            { icon: SiAutodesk,      color: '#0696D7' },
  'houdini':         { icon: SiHoudini,       color: '#FF4713' },
  'figma':           { icon: SiFigma,         color: '#F24E1E' },
  'sketch':          { icon: SiSketch,        color: '#F7B500' },
  'canva':           { icon: SiCanva,         color: '#00C4CC' },
  'invision':        { icon: SiInvision,      color: '#FF3366' },
  'gimp':            { icon: SiGimp,          color: '#5C5543' },
  'inkscape':        { icon: SiInkscape,      color: '#000000' },
  'corel':           { icon: SiCoreldraw,     color: '#000000' },
  'coreldraw':       { icon: SiCoreldraw,     color: '#000000' },
  'davinci resolve': { icon: SiDavinciresolve, color: '#E12E2E' },
  'davinci':         { icon: SiDavinciresolve, color: '#E12E2E' },
  'resolve':         { icon: SiDavinciresolve, color: '#E12E2E' },
};

function getSkillIcon(name: string): SkillIconData | null {
  return skillIconMap[name.toLowerCase().trim()] || null;
}

const defaultSkills: Skill[] = [
  { id: '1', name: 'After Effects', level: 95, icon: '🎬', category: 'Video', position: 0 },
  { id: '2', name: 'Cinema 4D',     level: 80, icon: '🧊', category: '3D',    position: 1 },
  { id: '3', name: 'Photoshop',     level: 92, icon: '🖼️', category: 'Diseño', position: 2 },
  { id: '4', name: 'Illustrator',   level: 85, icon: '✏️', category: 'Diseño', position: 3 },
  { id: '5', name: 'Premiere Pro',  level: 88, icon: '🎥', category: 'Video', position: 4 },
  { id: '6', name: 'DaVinci Resolve', level: 75, icon: '🎨', category: 'Video', position: 5 },
  { id: '7', name: 'Blender',       level: 70, icon: '🔮', category: '3D',    position: 6 },
  { id: '8', name: 'Figma',         level: 78, icon: '📐', category: 'Diseño', position: 7 },
];

export default function Skills() {
  const { skills: contextSkills, cfg } = useSiteConfig();
  const skills = contextSkills.length > 0 ? contextSkills : defaultSkills;
  const hCls = HEADING_SIZE_MAP[cfg.heading_size] || HEADING_SIZE_MAP.md;
  const visual = cfg.section_skills || DEFAULT_SECTION_VISUAL;

  return (
    <SectionWrapper id="skills" visual={visual} className="py-24 md:py-32 px-6">
      {cfg.lottie_skills?.enabled && cfg.lottie_skills?.source && (
        <div className="lottie-section" style={{ opacity: cfg.lottie_skills.opacity || 0.15 }}>
          <LottieRenderer source={cfg.lottie_skills.source} speed={cfg.lottie_skills.speed} />
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-14 animate-slide-up">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-[1px] bg-neon-red" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neon-red">{cfg.skills_label}</span>
          </div>
          <h2 className={`font-black leading-tight mb-4 morphing-gradient-text inline-block ${hCls}`} style={{ fontFamily: `${cfg.font_display}, sans-serif` }}>{cfg.skills_heading}</h2>
          <p className="text-gray-500 text-sm md:text-base max-w-lg">{cfg.skills_desc}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {skills.map((skill, index) => {
            const brandIcon = getSkillIcon(skill.name);
            const Icon = brandIcon?.icon;
            return (
              <div key={skill.id}
                className="group relative bg-bg border border-white/[0.04] rounded-2xl p-5 hover:border-white/[0.1] hover:-translate-y-1 transition-all duration-300 overflow-hidden opacity-0 animate-slide-up"
                style={{ animationDelay: `${index * 0.06}s` }}>
                <div className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: brandIcon ? `linear-gradient(90deg, transparent, ${brandIcon.color}80, transparent)` : 'linear-gradient(90deg, transparent, rgba(255,0,51,0.5), transparent)' }} />
                <div className="mb-4 hover:scale-110 transition-transform">
                  {brandIcon ? (brandIcon.custom ? <div className="drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">{brandIcon.custom}</div> : Icon ? <Icon size={28} style={{ color: brandIcon.color }} /> : null) : <span className="text-2xl">{skill.icon}</span>}
                </div>
                <h4 className="text-white font-semibold text-sm mb-1" style={{ fontFamily: `${cfg.font_display}, sans-serif` }}>{skill.name}</h4>
                <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-gray-600 mb-3">{skill.category}</span>
                <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className="h-full rounded-full animate-bar-fill"
                    style={{
                      width: `${skill.level}%`,
                      animationDelay: `${index * 0.08}s`,
                      background: brandIcon ? `linear-gradient(90deg, ${brandIcon.color}55, ${brandIcon.color})` : 'linear-gradient(90deg, #ff0033, #a855f7)',
                      boxShadow: brandIcon ? `0 0 8px ${brandIcon.color}44` : '0 0 8px rgba(255,0,51,0.3)',
                    }} />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[9px] text-gray-600 uppercase tracking-widest font-bold">Nivel</span>
                  <span className="text-[11px] font-bold" style={{ color: brandIcon?.color || '#ff0033' }}>{skill.level}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}