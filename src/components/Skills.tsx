'use client';
import { motion } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { DEFAULT_SECTION_VISUAL } from '@/lib/config';
import { Layers3, Video, Aperture, Palette, Box, Code2, Sparkles } from 'lucide-react';
import { IconRenderer } from './admin/IconPicker';

const CATEGORY_ICONS: Record<string, any> = {
  'Motion': Video,
  'Diseño': Palette,
  'Edición': Aperture,
  '3D': Box,
  'Branding': Layers3,
  'Desarrollo': Code2,
  'Tools': Sparkles
};

export default function Skills() {
  const { cfg, skills } = useSiteConfig();

  // Agrupar skills por categoría
  const categories = [...new Set(skills.map(s => s.category))];
  
  return (
    <SectionWrapper id="skills" visual={cfg.section_skills || DEFAULT_SECTION_VISUAL} className="relative min-h-screen py-24 md:py-32 flex flex-col justify-center overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 w-full">
        
        {/* Encabezado */}
        <div className="mb-16 md:mb-24 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-purple-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Ecosistema Técnico</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tighter text-white leading-tight">
            {cfg.skills_heading || 'Mi Arsenal Creativo'}
          </h2>
          <p className="mt-6 text-gray-400 font-light text-lg">
            {cfg.skills_desc || 'Un conjunto de herramientas de grado industrial diseñadas para transformar conceptos abstractos en realidades visuales asombrosas.'}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {categories.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-3xl">
              Aún no hay skills configuradas. Añádelas desde el Admin.
            </div>
          )}

          {categories.map((category, i) => {
            const catSkills = skills.filter(s => s.category === category);
            const CatIcon = CATEGORY_ICONS[category] || Sparkles;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-surface/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 overflow-hidden hover:bg-surface/60 transition-colors duration-500"
              >
                {/* Subtle internal glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500" />
                
                {/* Background Icon Watermark */}
                <CatIcon className="absolute -bottom-6 -right-6 w-48 h-48 text-white/[0.02] -rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6 pointer-events-none" />

                {/* Header Categoría */}
                <div className="flex items-center gap-4 mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg">
                    <CatIcon size={20} className="text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-wide">{category}</h3>
                </div>

                {/* Lista de Skills */}
                <div className="flex flex-col gap-6 relative z-10">
                  {catSkills.map((skill, j) => (
                    <div key={skill.id} className="group/skill">
                      <div className="flex items-center gap-4 mb-3">
                        {/* Icono del Skill */}
                        <div className="w-10 h-10 rounded-xl bg-bg-secondary border border-white/10 flex items-center justify-center shadow-md transition-transform duration-300 group-hover/skill:scale-110 group-hover/skill:border-purple-500/50 group-hover/skill:bg-purple-900/20">
                          <IconRenderer icon={skill.icon} size={18} />
                        </div>
                        
                        {/* Nombre y Nivel */}
                        <div className="flex-1 flex justify-between items-end">
                          <span className="text-sm font-semibold text-gray-200 group-hover/skill:text-white transition-colors">
                            {skill.name}
                          </span>
                          <span className="text-xs font-bold text-purple-400 font-mono">
                            {skill.level}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + (j * 0.1), ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 relative"
                        >
                          <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30" />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </SectionWrapper>
  );
}
