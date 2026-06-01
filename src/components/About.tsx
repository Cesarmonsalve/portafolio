'use client';
import { ArrowUpRight, Crosshair, Layers3, Sparkles } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import LottieRenderer from './LottieRenderer';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { DEFAULT_SECTION_VISUAL, HEADING_SIZE_MAP } from '@/lib/config';

const specialtyIcons = [Layers3, Sparkles, Crosshair];

export default function About() {
  const { cfg } = useSiteConfig();
  const visual = cfg.section_about || DEFAULT_SECTION_VISUAL;
  const hCls = HEADING_SIZE_MAP[cfg.heading_size] || HEADING_SIZE_MAP.md;

  return (
    <SectionWrapper id="about" visual={visual} fallbackBg="#10151D" className="section-shell px-5 py-24 md:px-8 md:py-32">
      <div className="arena-grid absolute inset-0 opacity-25" />
      {cfg.lottie_about?.enabled && cfg.lottie_about.source && <div className="lottie-section opacity-20"><LottieRenderer source={cfg.lottie_about.source} speed={cfg.lottie_about.speed} /></div>}
      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.82fr_1.18fr] lg:items-center">
        <div className="relative mx-auto w-full max-w-[460px]">
          <div className="absolute -inset-5 translate-x-5 translate-y-5 border border-neon-red/25 angle-frame" />
          <div className="acid-panel angle-frame relative overflow-hidden p-3">
            <div className="relative aspect-[4/5] overflow-hidden angle-frame-sm bg-[#0B0E13]">
              {cfg.about_photo ? <img src={cfg.about_photo} alt="Retrato de CM Design, director creativo y diseñador de motion graphics" loading="lazy" decoding="async" className="h-full w-full object-cover grayscale transition duration-700 hover:grayscale-0" /> : <div className="arena-grid flex h-full items-center justify-center"><span className="text-[9rem] font-black tracking-[-.12em] text-white/[0.055]">CM</span></div>}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent p-6 pt-20">
                <div className="acid-kicker">{cfg.about_job_title}</div>
                <div className="mt-2 text-2xl font-black uppercase tracking-[-.04em] text-white">{cfg.hero_name}</div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-5 border border-neon-red/30 bg-[#0B0E13] px-4 py-3 angle-frame-sm">
            <div className="text-[9px] font-black uppercase tracking-[.18em] text-gray-500">Creative profile</div>
            <div className="mt-1 text-xs font-black uppercase tracking-[.12em] text-neon-red">Impact first</div>
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center gap-3"><span className="h-px w-12 bg-neon-red" /><span className="acid-kicker">{cfg.about_label}</span></div>
          {cfg.about_heading_type === 'image' && cfg.about_heading_image ? <img src={cfg.about_heading_image} alt={cfg.about_heading} className="mb-7 max-h-48 max-w-full object-contain object-left" style={{ width: `${cfg.about_heading_scale || 100}%` }} /> : <h2 className={`heading-slashed max-w-3xl font-black uppercase leading-[.95] tracking-[-.045em] text-white ${hCls}`} style={{ fontFamily: `${cfg.font_display}, sans-serif` }}>{cfg.about_heading}</h2>}
          <div className="mt-7 space-y-4 border-l-2 border-neon-red/60 pl-5">
            <p className="text-base leading-7 text-gray-200 md:text-lg">{cfg.about_bio}</p>
            <p className="text-sm leading-7 text-gray-500 md:text-base">{cfg.about_bio_extended}</p>
          </div>
          <div className="mt-9 grid grid-cols-3 border-y border-white/[0.09]">
            {(cfg.about_stats || []).map((stat, index) => <div key={`${stat.label}-${index}`} className="border-r border-white/[0.09] px-3 py-5 last:border-r-0 md:px-5"><div className="text-xl font-black text-white md:text-3xl">{stat.value}</div><div className="mt-1 text-[9px] font-black uppercase tracking-[.14em] text-gray-500">{stat.label}</div></div>)}
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {(cfg.about_specialties || []).map((item, index) => {
              const Icon = specialtyIcons[index % specialtyIcons.length];
              return <div key={`${item.title}-${index}`} className="acid-panel angle-frame-sm p-4"><Icon size={16} className="mb-4 text-neon-red" /><div className="text-xs font-black uppercase tracking-[.08em] text-white">{item.title}</div><div className="mt-2 text-[11px] leading-5 text-gray-500">{item.desc}</div></div>;
            })}
          </div>
          <a href="#contact" className="ghost-button mt-8">Hablemos de tu proyecto <ArrowUpRight size={15} /></a>
        </div>
      </div>
    </SectionWrapper>
  );
}
