'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, LayoutGrid } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import ProjectCard from './ProjectCard';
import { DEFAULT_SECTION_VISUAL } from '@/lib/config';
import { useSiteConfig } from '@/lib/SiteConfigContext';

export default function ProjectsGrid() {
  const { projects: source, cfg } = useSiteConfig();
  const [active, setActive] = useState('Todos');
  const visual = cfg.section_projects || DEFAULT_SECTION_VISUAL;
  const projects = source.filter((project) => !(project as any).hidden);
  const categories = useMemo(() => ['Todos', ...Array.from(new Set(projects.map((project) => project.category)))], [projects]);
  const filtered = active === 'Todos' ? projects : projects.filter((project) => project.category === active);

  return (
    <SectionWrapper id="work" visual={visual} className="relative px-6 py-24 md:px-12 md:py-32">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-0 top-1/4 w-[500px] h-[500px] bg-[var(--accent-blue)]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[1px] bg-[var(--accent-cyan)]" />
              <span className="text-mono-tech text-[10px] font-bold uppercase tracking-widest text-gray-400">{cfg.projects_label || 'Portfolio'}</span>
            </div>
            <h2 className="text-brutal text-[10vw] md:text-[8vw] tracking-tighter text-white leading-[0.85]">
              {cfg.projects_heading || 'TRABAJOS DESTACADOS'}
            </h2>
            <p className="mt-4 max-w-xl text-gray-400 font-light leading-relaxed">{cfg.projects_desc}</p>
          </motion.div>

          <Link href="/galeria" className="group flex items-center gap-2 px-8 py-4 rounded-full brutal-border bg-white text-black text-mono-tech text-sm font-bold uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all w-fit whitespace-nowrap">
            <LayoutGrid size={16} /> VER GALERÍA <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActive(category)}
              className={`px-6 py-2 rounded-xl text-mono-tech text-[11px] font-bold uppercase tracking-wider transition-all duration-300 border-2 hover:scale-105 active:scale-95 ${
                active === category
                  ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)] shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : 'bg-white/[0.03] text-gray-400 border-white/[0.06] hover:border-white/20 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.slice(0, 3).map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} featured={project.featured && active === 'Todos'} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="glass-panel rounded-2xl mt-8 p-12 text-center text-gray-400">
            No hay proyectos en esta categoría.
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}
