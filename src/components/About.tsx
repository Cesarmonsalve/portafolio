'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Crosshair, Layers3, Sparkles, User, Briefcase, BookOpen, Target } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { DEFAULT_SECTION_VISUAL } from '@/lib/config';

export default function About() {
  const { cfg } = useSiteConfig();
  const [activeCard, setActiveCard] = useState<number | null>(0);

  const CARDS = [
    {
      id: 0,
      title: 'Historia',
      icon: User,
      content: cfg.about_bio || 'Diseñador visual y animador con visión estratégica.',
    },
    {
      id: 1,
      title: 'Experiencia',
      icon: Briefcase,
      content: cfg.about_bio_extended || 'Años construyendo experiencias digitales memorables.',
    },
    {
      id: 2,
      title: 'Filosofía',
      icon: BookOpen,
      content: 'El diseño no es solo cómo se ve, sino cómo se siente. Ultra Modern Minimalism en cada frame.',
    },
    {
      id: 3,
      title: 'Especialidades',
      icon: Target,
      content: 'Motion Graphics, Edición de Video de alto impacto, y Dirección de Arte.',
      specialties: cfg.about_specialties || []
    }
  ];

  return (
    <SectionWrapper id="about" visual={cfg.section_about || DEFAULT_SECTION_VISUAL} className="relative py-24 md:py-32 min-h-screen flex items-center">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute right-0 top-1/3 w-[600px] h-[600px] bg-[var(--accent-blue)]/5 rounded-full blur-[100px] animate-float" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 w-full">
        
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-[var(--accent-cyan)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Identity Explorer</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white">
              {cfg.about_heading || 'Sobre mí'}
            </h2>
          </div>
          <div className="max-w-md text-gray-400 font-light">
            Selecciona una tarjeta para explorar mi perfil, experiencia y visión como creador digital.
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_2fr] gap-8 items-start">
          
          {/* Card List */}
          <div className="flex flex-col gap-3">
            {CARDS.map((card, idx) => {
              const isActive = activeCard === idx;
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => setActiveCard(idx)}
                  className={`text-left w-full p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                    isActive 
                      ? 'bg-white/[0.03] border-[var(--accent-cyan)]/30 shadow-[0_0_20px_rgba(0,229,255,0.05)]' 
                      : 'bg-transparent border-white/[0.05] hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Icon size={18} className={isActive ? 'text-[var(--accent-cyan)]' : 'text-gray-500'} />
                    <span className={`font-semibold tracking-wide ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      {card.title}
                    </span>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider font-bold ${isActive ? 'text-[var(--accent-cyan)]' : 'text-gray-600'}`}>
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Card Content Viewer */}
          <div className="glass-panel p-8 md:p-12 rounded-3xl min-h-[400px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-violet)]/5 blur-[80px] pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {CARDS.map((card, idx) => {
                if (idx !== activeCard) return null;
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-8">
                      <Icon size={20} className="text-white" />
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-6">
                      {card.title}
                    </h3>
                    
                    <p className="text-lg text-gray-300 leading-relaxed font-light mb-8 max-w-2xl">
                      {card.content}
                    </p>

                    {card.specialties && card.specialties.length > 0 && (
                      <div className="grid sm:grid-cols-2 gap-4 mt-8">
                        {card.specialties.map((spec, i) => (
                          <div key={i} className="p-4 rounded-xl border border-white/[0.04] bg-white/[0.01]">
                            <div className="text-sm font-bold text-white mb-1">{spec.title}</div>
                            <div className="text-xs text-gray-500">{spec.desc}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div className="relative z-10 mt-12 pt-8 border-t border-white/[0.05] flex items-center justify-between">
              <div className="flex gap-6">
                {(cfg.about_stats || []).map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl font-display font-black text-white">{stat.value}</div>
                    <div className="text-[9px] uppercase tracking-widest text-gray-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              <a href="#contact" className="flex items-center justify-center w-12 h-12 rounded-full border border-white/[0.05] bg-white/[0.02] text-white hover:bg-white/[0.05] transition-colors">
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
}
