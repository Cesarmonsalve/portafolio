'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import CommandCenter from './CommandCenter';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { DEFAULT_SECTION_VISUAL } from '@/lib/config';

const ROTATING_TEXTS = [
  'Motion Designer',
  'Graphic Designer',
  'Video Editor',
  'Creative Director'
];

export default function Hero() {
  const { cfg } = useSiteConfig();
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
          <h1 className="font-display font-black text-[18vw] leading-[0.8] tracking-tighter text-white select-none relative z-10">
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-6 md:left-12 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-gray-500"
      >
        <div className="w-8 h-[1px] bg-white/20" />
        <span className="flex items-center gap-2">
          Scroll <ArrowDown size={14} className="animate-bounce text-[var(--accent-cyan)]" />
        </span>
      </motion.div>
    </SectionWrapper>
  );
}
