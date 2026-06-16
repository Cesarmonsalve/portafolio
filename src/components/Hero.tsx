'use client';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Layers3, Play, Sparkles, Zap } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import LottieRenderer from './LottieRenderer';
import AnimatedStat from './ui/AnimatedStat';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { DEFAULT_SECTION_VISUAL } from '@/lib/config';
import { fadeRight, fadeUp, staggerContainer } from '@/lib/motion/variants';

const LOADOUT_ITEMS = [
  'Motion graphics cinematográfico',
  'Diseño competitivo para gaming',
  'Branding visual de alto impacto',
];

export default function Hero() {
  const { cfg } = useSiteConfig();
  const reduced = useReducedMotion();
  const visual = cfg.section_hero || DEFAULT_SECTION_VISUAL;
  const marquee = cfg.marquee_items || ['Motion Graphics', 'Visual Design', 'Branding'];

  return (
    <SectionWrapper id="home" visual={visual} className="section-shell min-h-screen overflow-hidden pt-24">
      {/* Cinematic mesh background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="arena-grid absolute inset-0 opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(203,254,28,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(139,92,246,0.06),transparent)]" />
        {!reduced && (
          <>
            <div className="absolute -right-32 top-16 h-[460px] w-[460px] rounded-full bg-neon-purple/[0.14] blur-[120px] animate-float" />
            <div className="absolute -left-40 bottom-16 h-[360px] w-[360px] rounded-full bg-neon-red/[0.09] blur-[110px] animate-float" style={{ animationDelay: '2s' }} />
          </>
        )}
        <div className="absolute right-[8%] top-[18%] hidden h-32 w-32 rotate-12 border border-neon-red/20 arena-dots opacity-50 lg:block" />
        <div className="absolute left-[4%] top-[32%] hidden text-[120px] font-black leading-none text-white/[0.018] [writing-mode:vertical-rl] lg:block">
          CREATIVE ARENA
        </div>
      </div>

      {cfg.lottie_hero?.enabled && cfg.lottie_hero.source && (
        <div className="lottie-hero opacity-30">
          <LottieRenderer source={cfg.lottie_hero.source} speed={cfg.lottie_hero.speed} />
        </div>
      )}

      <motion.div
        className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-10 px-5 pb-28 pt-12 md:px-8 lg:grid-cols-[1.16fr_.84fr] lg:pb-24"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div>
          <motion.div variants={fadeUp} className="mb-7 flex items-center gap-3">
            <motion.span
              variants={fadeUp}
              className="h-px w-12 bg-neon-red origin-left"
              style={{ scaleX: reduced ? 1 : undefined }}
            />
            <span className="acid-kicker">{cfg.hero_badge}</span>
          </motion.div>

          <motion.div variants={fadeUp}>
            <p className="mb-3 font-body text-[11px] font-black uppercase tracking-[.28em] text-gray-500">
              Portfolio // Dirección visual
            </p>
            {cfg.hero_name_type === 'image' && cfg.hero_name_image ? (
              <img
                src={cfg.hero_name_image}
                alt={cfg.hero_name}
                className="mb-5 max-h-[250px] max-w-full object-contain object-left"
                style={{ width: `${cfg.hero_name_scale || 100}%` }}
              />
            ) : (
              <h1
                className="heading-slashed font-display max-w-4xl text-[var(--text-hero)] font-black uppercase leading-[.86] tracking-[-.075em] text-white"
                style={{
                  fontFamily: `${cfg.font_display}, var(--font-outfit), sans-serif`,
                  transform: `scale(${(cfg.hero_name_scale || 100) / 100})`,
                  transformOrigin: 'left center',
                }}
              >
                {cfg.hero_name}
              </h1>
            )}
            <div className="mt-5 flex items-center gap-3 text-base font-black uppercase tracking-[.16em] text-neon-red md:text-xl">
              <Zap size={19} className="fill-neon-red" aria-hidden="true" />
              {cfg.hero_subtitle}
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-2xl border-l-2 border-neon-red/70 pl-5 font-body text-sm leading-7 text-gray-400 md:text-base"
          >
            {cfg.hero_description}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#work" className="acid-button" data-cursor-hover>
              <Layers3 size={16} aria-hidden="true" />
              Explorar trabajos
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a
              href={cfg.contact_whatsapp || '#contact'}
              target="_blank"
              rel="noopener noreferrer"
              className="ghost-button"
              data-cursor-hover
            >
              <Play size={15} aria-hidden="true" />
              Iniciar proyecto
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 grid max-w-2xl grid-cols-3 border-y border-white/[0.09]"
          >
            {(cfg.hero_stats || []).map((stat, index) => (
              <AnimatedStat
                key={`${stat.label}-${index}`}
                value={stat.value}
                label={stat.label}
                index={index}
                fontFamily={cfg.font_display}
              />
            ))}
          </motion.div>
        </div>

        <motion.div variants={fadeRight} className="relative min-h-[420px] lg:min-h-[560px]">
          <div className="absolute inset-x-10 inset-y-8 rotate-[-4deg] border border-neon-red/20 angle-frame hidden lg:block" aria-hidden="true" />
          <div className="absolute inset-x-3 inset-y-16 rotate-[4deg] border border-white/10 angle-frame hidden lg:block" aria-hidden="true" />
          <div className="acid-panel angle-frame absolute inset-x-0 inset-y-0 overflow-hidden p-5 md:inset-x-6 lg:inset-x-14 lg:p-7">
            <div className="arena-grid absolute inset-0 opacity-35" aria-hidden="true" />
            <div className="relative flex items-start justify-between">
              <span className="acid-kicker">Creative Loadout</span>
              <Sparkles size={17} className="text-neon-red" aria-hidden="true" />
            </div>
            <div className="relative mt-6 flex h-[220px] items-center justify-center overflow-hidden border border-white/[0.08] bg-[#0B0E13] angle-frame lg:mt-10 lg:h-[290px]">
              <div className="arena-dots absolute inset-0 opacity-35" aria-hidden="true" />
              <img
                src={cfg.logo_url || '/logo.svg'}
                alt="CM Design"
                className="relative z-10 max-h-32 w-[70%] object-contain drop-shadow-[0_0_30px_rgba(203,254,28,.12)] lg:max-h-44"
              />
              <div className="absolute bottom-4 left-4 text-[9px] font-black uppercase tracking-[.22em] text-neon-red">
                Visual impact systems
              </div>
            </div>
            <div className="relative mt-4 grid gap-3 lg:mt-6">
              {LOADOUT_ITEMS.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border-b border-white/[0.07] pb-3 text-xs font-bold uppercase tracking-[.08em] text-gray-300"
                >
                  <span className="acid-number">0{index + 1}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-2 right-0 border border-neon-red/30 bg-[#10151D] px-4 py-3 angle-frame-sm">
            <div className="text-[9px] font-black uppercase tracking-[.18em] text-gray-500">Status</div>
            <div className="mt-1 flex items-center gap-2 text-[11px] font-black uppercase tracking-[.14em] text-neon-red">
              <span className="h-2 w-2 animate-pulse rounded-full bg-neon-red" aria-hidden="true" />
              Ready to deploy
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div
        aria-hidden="true"
        className="absolute bottom-0 z-20 w-full overflow-hidden border-y border-neon-red/15 bg-[#0B0E13]/90 py-3 backdrop-blur"
      >
        <div className={`flex w-max items-center ${reduced ? '' : 'animate-marquee'}`}>
          {[0, 1].map((rep) =>
            marquee.map((item, index) => (
              <div key={`${rep}-${item}-${index}`} className="flex shrink-0 items-center gap-5 px-5">
                <span className="text-[10px] font-black uppercase tracking-[.22em] text-gray-400">
                  {item}
                </span>
                <span className="text-neon-red">✦</span>
              </div>
            )),
          )}
        </div>
      </div>

      <a
        href="#work"
        className="absolute bottom-16 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 text-[9px] font-black uppercase tracking-[.2em] text-gray-500 md:flex"
      >
        <ArrowDown size={14} className={`text-neon-red ${reduced ? '' : 'animate-bounce'}`} aria-hidden="true" />
        Scroll
      </a>
    </SectionWrapper>
  );
}
