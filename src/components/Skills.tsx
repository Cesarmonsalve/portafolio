'use client';
import { motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { DEFAULT_SECTION_VISUAL } from '@/lib/config';
import { Layers3, Sparkles } from 'lucide-react';
import { IconRenderer } from './admin/IconPicker';

// Remove CATEGORY_ICONS since we use real icons now

export default function Skills() {
  const { cfg, skills } = useSiteConfig();

  // Group skills by category to position them in different orbits
  const categories = [...new Set(skills.map(s => s.category))];
  
  return (
    <SectionWrapper id="skills" visual={cfg.section_skills || DEFAULT_SECTION_VISUAL} className="relative min-h-screen py-24 md:py-32 flex items-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 w-full flex flex-col items-center">
        
        <div className="text-center mb-16 md:mb-24">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-purple-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Skill Galaxy</span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-purple-500" />
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
          <div className="absolute z-20 w-28 h-28 md:w-36 md:h-36 rounded-full bg-surface border border-purple-500/30 flex items-center justify-center shadow-[0_0_60px_rgba(168,85,247,0.2)]">
            <motion.div 
              animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/20 to-blue-600/20 blur-md"
            />
            <div className="relative text-center flex flex-col items-center">
              <Sparkles className="text-purple-400 mb-1" size={20} />
              <div className="font-display font-black text-xl text-white tracking-widest">SKILLS</div>
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
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-surface border border-white/10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:border-purple-500/50 group-hover:bg-purple-900/20 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] z-10 relative">
                          <IconRenderer icon={skill.icon} size={22} />
                        </div>
                        
                        {/* Status/Level dot indicator */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-surface border border-white/10 flex items-center justify-center z-20">
                          <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                        </div>

                        {/* Premium Tooltip */}
                        <div className="absolute top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-surface/90 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl flex flex-col items-center shadow-2xl pointer-events-none scale-95 group-hover:scale-100 z-50">
                          <span className="text-[11px] font-bold tracking-wide text-white whitespace-nowrap">
                            {skill.name}
                          </span>
                          <span className="text-[9px] text-purple-400 mt-0.5 uppercase tracking-widest font-semibold">{skill.category}</span>
                          {/* Level bar */}
                          <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${skill.level}%` }} />
                          </div>
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
