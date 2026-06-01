'use client';
import { Gauge, Wrench } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import LottieRenderer from './LottieRenderer';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { DEFAULT_SECTION_VISUAL, HEADING_SIZE_MAP } from '@/lib/config';

export default function Skills() {
  const { cfg, skills } = useSiteConfig();
  const visual = cfg.section_skills || DEFAULT_SECTION_VISUAL;
  const hCls = HEADING_SIZE_MAP[cfg.heading_size] || HEADING_SIZE_MAP.md;

  return (
    <SectionWrapper id="skills" visual={visual} className="section-shell px-5 py-24 md:px-8 md:py-32">
      <div className="arena-grid absolute inset-0 opacity-25" />
      {cfg.lottie_skills?.enabled && cfg.lottie_skills.source && <div className="lottie-section opacity-20"><LottieRenderer source={cfg.lottie_skills.source} speed={cfg.lottie_skills.speed} /></div>}
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-7 lg:grid-cols-[1fr_.72fr] lg:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3"><span className="h-px w-12 bg-neon-red" /><span className="acid-kicker">{cfg.skills_label}</span></div>
            <h2 className={`heading-slashed font-black uppercase leading-[.95] tracking-[-.045em] text-white ${hCls}`} style={{ fontFamily: `${cfg.font_display}, sans-serif` }}>{cfg.skills_heading}</h2>
          </div>
          <p className="border-l-2 border-neon-red/60 pl-5 text-sm leading-7 text-gray-400">{cfg.skills_desc}</p>
        </div>
        <div className="mt-11 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[...skills].sort((a, b) => a.position - b.position).map((skill, index) => (
            <div key={skill.id} className="acid-panel angle-frame-sm group p-5 transition duration-300 hover:-translate-y-1 hover:border-neon-red/60">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center border border-neon-red/20 bg-neon-red/[0.05] text-xl angle-frame-sm">{skill.icon || <Wrench size={18} />}</div>
                <span className="acid-number">0{index + 1}</span>
              </div>
              <div className="mt-5 text-sm font-black uppercase tracking-[.05em] text-white">{skill.name}</div>
              <div className="mt-1 text-[9px] font-black uppercase tracking-[.16em] text-gray-600">{skill.category}</div>
              <div className="mt-6 h-1.5 overflow-hidden bg-white/[0.06]"><div className="h-full bg-neon-red shadow-[0_0_12px_rgba(203,254,28,.42)] transition-all duration-700" style={{ width: `${skill.level}%` }} /></div>
              <div className="mt-3 flex items-center justify-between text-[9px] font-black uppercase tracking-[.13em] text-gray-600"><span className="flex items-center gap-1"><Gauge size={11} /> Nivel</span><span className="text-neon-red">{skill.level}%</span></div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
