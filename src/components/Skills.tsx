'use client';
import { motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { DEFAULT_SECTION_VISUAL } from '@/lib/config';
import { Layers3, Video, Aperture, Palette, Box } from 'lucide-react';

const CATEGORY_ICONS: Record<string, any> = {
  'Motion': Video,
  'Diseño': Palette,
  'Edición': Aperture,
  '3D': Box,
  'Branding': Layers3
};

export default function Skills() {
  const { cfg, skills } = useSiteConfig();

  // Group skills by category to position them in different orbits
  const categories = [...new Set(skills.map(s => s.category))];
  
  return (
    <SectionWrapper id="skills" visual={cfg.section_skills || DEFAULT_SECTION_VISUAL} className="relative min-h-screen py-24 md:py-32 flex items-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent-violet)]/5 rounded-full blur-[120px] pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 w-full flex flex-col items-center">
        
        <div className="text-center mb-16 md:mb-24">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[var(--accent-cyan)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Skill Galaxy</span>
            <span className="w-8 h-[1px] bg-[var(--accent-cyan)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white">
            {cfg.skills_heading || 'Dominio Técnico'}
          </h2>
          <p className="mt-4 text-gray-400 font-light max-w-lg mx-auto">
            {cfg.skills_desc || 'Un ecosistema en constante expansión de tecnologías y herramientas dominadas.'}
          </p>
        </div>

        {/* Skill Galaxy Orbital System */}
        <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] flex items-center justify-center">
          
          {/* Central Core */}
          <div className="absolute z-20 w-24 h-24 md:w-32 md:h-32 rounded-full glass-premium flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.2)]">
            <div className="text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-cyan)]">Core</div>
              <div className="font-display font-black text-xl text-white">TECH</div>
            </div>
          </div>

          {/* Orbits */}
          {categories.map((category, orbitIndex) => {
            const orbitSkills = skills.filter(s => s.category === category);
            // Increase radius for each orbit
            const radius = 100 + (orbitIndex * 60); 
            const duration = 20 + (orbitIndex * 10);
            // Alternate direction
            const direction = orbitIndex % 2 === 0 ? 360 : -360;

            return (
              <motion.div
                key={category}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{ rotate: direction }}
                transition={{ duration: duration, ease: "linear", repeat: Infinity }}
              >
                {/* Orbit Ring */}
                <div 
                  className="absolute rounded-full border border-white/[0.04]"
                  style={{ width: radius * 2, height: radius * 2 }}
                />

                {orbitSkills.map((skill, index) => {
                  const angle = (index / orbitSkills.length) * 2 * Math.PI;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  const Icon = CATEGORY_ICONS[skill.category] || Layers3;

                  return (
                    <motion.div
                      key={skill.id}
                      className="absolute pointer-events-auto"
                      style={{ x, y }}
                      // Inverse rotation to keep content upright
                      animate={{ rotate: -direction }}
                      transition={{ duration: duration, ease: "linear", repeat: Infinity }}
                    >
                      <div className="relative group cursor-pointer">
                        <div className="w-10 h-10 md:w-12 md:h-12 glass-panel rounded-full flex items-center justify-center transition-transform group-hover:scale-125 border border-white/[0.08] group-hover:border-[var(--accent-cyan)]/50 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                          <span className="text-xs text-white opacity-80 group-hover:opacity-100 truncate w-6 text-center">
                            {skill.name.substring(0, 2)}
                          </span>
                        </div>
                        {/* Tooltip */}
                        <div className="absolute top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B0E13] border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wide text-white whitespace-nowrap shadow-xl">
                          {skill.name}
                          <div className="text-[8px] text-[var(--accent-cyan)] mt-0.5 uppercase tracking-widest">{skill.category}</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            );
          })}
        </div>

      </div>
    </SectionWrapper>
  );
}
