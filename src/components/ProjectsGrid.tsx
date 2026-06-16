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
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{cfg.projects_label || 'Portfolio'}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white">
              {cfg.projects_heading || 'Trabajos Destacados'}
            </h2>
            <p className="mt-4 max-w-xl text-gray-400 font-light">{cfg.projects_desc}</p>
          </motion.div>

          <Link href="/galeria" className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/[0.08] text-sm font-medium text-gray-300 hover:text-white hover:border-white/20 transition-all w-fit">
            <LayoutGrid size={16} /> Galería <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActive(category)}
              className={`px-4 py-2 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all duration-300 ${
                active === category
                  ? 'bg-white text-black'
                  : 'bg-white/[0.03] text-gray-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
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
