'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import CommandCenter from './CommandCenter';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { DEFAULT_SECTION_VISUAL } from '@/lib/config';

export default function Hero() {
  const { cfg } = useSiteConfig();
  const sv = cfg.section_hero || DEFAULT_SECTION_VISUAL;
  const [textIndex, setTextIndex] = useState(0);

  const ROTATING_TEXTS = cfg.hero_rotating_texts?.length > 0 
    ? cfg.hero_rotating_texts 
    : ['Motion Designer', 'Graphic Designer', 'Video Editor', 'Creative Director'];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [ROTATING_TEXTS.length]);

  return (
    <SectionWrapper id="home" visual={cfg.section_hero || DEFAULT_SECTION_VISUAL} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-[var(--accent-cyan)]/5 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[var(--accent-violet)]/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col justify-center">
        
        {/* Huge Name Presentation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <h1 className="text-brutal text-[20vw] leading-[0.8] tracking-tighter text-white select-none relative z-10">
            {cfg.hero_name || 'CESAR'}<span className="text-[var(--accent-cyan)]">.</span>
          </h1>
        </motion.div>

        {/* Dynamic Rotating Text & Description */}
        <div className="mt-8 md:mt-12 max-w-2xl ml-2 md:ml-4 flex flex-col gap-6">
          <div className="h-12 flex items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={textIndex}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-2xl md:text-4xl font-display font-bold gradient-text"
              >
                {ROTATING_TEXTS[textIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-xl"
          >
            {cfg.hero_description || 'Diseñando experiencias digitales de vanguardia que combinan tecnología, arte y usabilidad extrema.'}
          </motion.p>
        </div>
      </div>

      {/* Command Center Float */}
      <CommandCenter />

      {/* Divider and Metadata Row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-0 right-0 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between pointer-events-none"
      >
        <div className="brutal-divider absolute top-1/2 left-0 right-0 -z-10 opacity-50" />
        
        <div className="bg-bg px-4 py-2 text-mono-tech text-xs tracking-widest text-gray-500 uppercase hidden md:block">
          BASED IN MEDELLÍN, COL
        </div>

        {/* Rotating Scroll Indicator */}
        <div className="relative w-28 h-28 bg-bg rounded-full flex items-center justify-center p-2 border-4 border-bg shadow-[0_0_0_2px_rgba(255,255,255,0.1)]">
          <svg className="absolute inset-0 w-full h-full animate-spin-slow text-gray-400" viewBox="0 0 144 144">
            <path id="circlePath" d="M 72, 72 m -56, 0 a 56,56 0 1,1 112,0 a 56,56 0 1,1 -112,0" fill="none" />
            <text className="text-mono-tech uppercase font-bold text-[10px] tracking-[0.2em]" fill="currentColor">
              <textPath href="#circlePath" startOffset="0%">
                SCROLL DOWN • SCROLL DOWN • SCROLL DOWN • 
              </textPath>
            </text>
          </svg>
          <ArrowDown size={20} className="text-[var(--accent-cyan)]" />
        </div>

        <div className="bg-bg px-4 py-2 text-mono-tech text-xs tracking-widest text-gray-500 uppercase hidden md:block text-right">
          CREATIVE DIRECTOR
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
