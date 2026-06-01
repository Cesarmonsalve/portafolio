'use client';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Layers3, Play, Sparkles, Zap } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import LottieRenderer from './LottieRenderer';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { DEFAULT_SECTION_VISUAL } from '@/lib/config';

export default function Hero() {
  const { cfg } = useSiteConfig();
  const visual = cfg.section_hero || DEFAULT_SECTION_VISUAL;
  const marquee = cfg.marquee_items || ['Motion Graphics', 'Visual Design', 'Branding'];

  return (
    <SectionWrapper id="home" visual={visual} className="section-shell min-h-screen overflow-hidden pt-24">
      <div className="arena-grid absolute inset-0 opacity-70" />
      <div className="absolute -right-32 top-16 h-[460px] w-[460px] rounded-full bg-neon-purple/[0.14] blur-[120px]" />
      <div className="absolute -left-40 bottom-16 h-[360px] w-[360px] rounded-full bg-neon-red/[0.09] blur-[110px]" />
      <div className="absolute right-[8%] top-[18%] hidden h-32 w-32 rotate-12 border border-neon-red/20 arena-dots opacity-50 lg:block" />
      <div aria-hidden="true" className="absolute left-[4%] top-[32%] hidden text-[120px] font-black leading-none text-white/[0.018] [writing-mode:vertical-rl] lg:block">CREATIVE ARENA</div>

      {cfg.lottie_hero?.enabled && cfg.lottie_hero.source && (
        <div className="lottie-hero opacity-30"><LottieRenderer source={cfg.lottie_hero.source} speed={cfg.lottie_hero.speed} /></div>
      )}

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-10 px-5 pb-28 pt-12 md:px-8 lg:grid-cols-[1.16fr_.84fr] lg:pb-24">
        <div>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }} className="mb-7 flex items-center gap-3">
            <span className="h-px w-12 bg-neon-red" />
            <span className="acid-kicker">{cfg.hero_badge}</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .08 }}>
            <p className="mb-3 text-[11px] font-black uppercase tracking-[.28em] text-gray-500">Portfolio // Dirección visual</p>
            {cfg.hero_name_type === 'image' && cfg.hero_name_image ? (
              <img src={cfg.hero_name_image} alt={cfg.hero_name} className="mb-5 max-h-[250px] max-w-full object-contain object-left" style={{ width: `${cfg.hero_name_scale || 100}%` }} />
            ) : (
              <h1 className="heading-slashed max-w-4xl text-[4.4rem] font-black uppercase leading-[.86] tracking-[-.075em] text-white sm:text-[6.4rem] md:text-[8.4rem] lg:text-[9.1rem]" style={{ fontFamily: `${cfg.font_display}, sans-serif`, transform: `scale(${(cfg.hero_name_scale || 100) / 100})`, transformOrigin: 'left center' }}>
                {cfg.hero_name}
              </h1>
            )}
            <div className="mt-5 flex items-center gap-3 text-base font-black uppercase tracking-[.16em] text-neon-red md:text-xl">
              <Zap size={19} className="fill-neon-red" /> {cfg.hero_subtitle}
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .22 }} className="mt-7 max-w-2xl border-l-2 border-neon-red/70 pl-5 text-sm leading-7 text-gray-400 md:text-base">
            {cfg.hero_description}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .32 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#work" className="acid-button"><Layers3 size={16} /> Explorar trabajos <ArrowUpRight size={15} /></a>
            <a href={cfg.contact_whatsapp || '#contact'} target="_blank" rel="noopener noreferrer" className="ghost-button"><Play size={15} /> Iniciar proyecto</a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .7, delay: .45 }} className="mt-12 grid max-w-2xl grid-cols-3 border-y border-white/[0.09]">
            {(cfg.hero_stats || []).map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="border-r border-white/[0.09] px-3 py-5 first:pl-0 last:border-r-0 md:px-6">
                <div className="text-2xl font-black text-white md:text-4xl" style={{ fontFamily: `${cfg.font_display}, sans-serif` }}>{stat.value}</div>
                <div className="mt-1 text-[9px] font-black uppercase tracking-[.18em] text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: .2 }} className="relative hidden min-h-[560px] lg:block">
          <div className="absolute inset-x-10 inset-y-8 rotate-[-4deg] border border-neon-red/20 angle-frame" />
          <div className="absolute inset-x-3 inset-y-16 rotate-[4deg] border border-white/10 angle-frame" />
          <div className="acid-panel angle-frame absolute inset-x-14 inset-y-0 overflow-hidden p-7">
            <div className="arena-grid absolute inset-0 opacity-35" />
            <div className="relative flex items-start justify-between">
              <span className="acid-kicker">Creative Loadout</span>
              <Sparkles size={17} className="text-neon-red" />
            </div>
            <div className="relative mt-10 flex h-[290px] items-center justify-center overflow-hidden border border-white/[0.08] bg-[#0B0E13] angle-frame">
              <div className="arena-dots absolute inset-0 opacity-35" />
              <img src="/logo.png" alt="CM Design" className="relative z-10 max-h-44 w-[70%] object-contain drop-shadow-[0_0_30px_rgba(203,254,28,.12)]" />
              <div className="absolute bottom-4 left-4 text-[9px] font-black uppercase tracking-[.22em] text-neon-red">Visual impact systems</div>
            </div>
            <div className="relative mt-6 grid gap-3">
              {['Motion graphics cinematográfico', 'Diseño competitivo para gaming', 'Branding visual de alto impacto'].map((item, index) => (
                <div key={item} className="flex items-center gap-3 border-b border-white/[0.07] pb-3 text-xs font-bold uppercase tracking-[.08em] text-gray-300">
                  <span className="acid-number">0{index + 1}</span><span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-2 right-0 border border-neon-red/30 bg-[#10151D] px-4 py-3 angle-frame-sm">
            <div className="text-[9px] font-black uppercase tracking-[.18em] text-gray-500">Status</div>
            <div className="mt-1 flex items-center gap-2 text-[11px] font-black uppercase tracking-[.14em] text-neon-red"><span className="h-2 w-2 animate-pulse rounded-full bg-neon-red" /> Ready to deploy</div>
          </div>
        </motion.div>
      </div>

      <div aria-hidden="true" className="absolute bottom-0 z-20 w-full overflow-hidden border-y border-neon-red/15 bg-[#0B0E13]/90 py-3 backdrop-blur">
        <div className="animate-marquee flex w-max items-center">
          {[0, 1].map((rep) => marquee.map((item, index) => (
            <div key={`${rep}-${item}-${index}`} className="flex shrink-0 items-center gap-5 px-5">
              <span className="text-[10px] font-black uppercase tracking-[.22em] text-gray-400">{item}</span><span className="text-neon-red">✦</span>
            </div>
          )))}
        </div>
      </div>
      <a href="#work" className="absolute bottom-16 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 text-[9px] font-black uppercase tracking-[.2em] text-gray-500 md:flex"><ArrowDown size={14} className="animate-bounce text-neon-red" /> Scroll</a>
    </SectionWrapper>
  );
}
