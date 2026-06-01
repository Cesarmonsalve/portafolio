'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import ProjectCard from './ProjectCard';
import { DEFAULT_SECTION_VISUAL, HEADING_SIZE_MAP } from '@/lib/config';
import { useSiteConfig } from '@/lib/SiteConfigContext';

export default function ProjectsGrid() {
  const { projects: source, cfg } = useSiteConfig();
  const [active, setActive] = useState('Todos');
  const visual = cfg.section_projects || DEFAULT_SECTION_VISUAL;
  const hCls = HEADING_SIZE_MAP[cfg.heading_size] || HEADING_SIZE_MAP.md;
  const projects = source.filter((project) => !(project as any).hidden);
  const categories = useMemo(() => ['Todos', ...Array.from(new Set(projects.map((project) => project.category)))], [projects]);
  const filtered = active === 'Todos' ? projects : projects.filter((project) => project.category === active);

  return (
    <SectionWrapper id="work" visual={visual} className="section-shell px-5 py-24 md:px-8 md:py-32">
      <div className="arena-grid absolute inset-0 opacity-35" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="mb-4 flex items-center gap-3"><span className="h-px w-12 bg-neon-red" /><span className="acid-kicker">{cfg.projects_label}</span></div>
            <h2 className={`heading-slashed max-w-3xl font-black uppercase leading-[.95] tracking-[-.045em] text-white ${hCls}`} style={{ fontFamily: `${cfg.font_display}, sans-serif` }}>{cfg.projects_heading}</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-400 md:text-base">{cfg.projects_desc}</p>
          </motion.div>
          <Link href="/galeria" className="ghost-button w-fit"><LayoutGrid size={15} /> Abrir galería <ArrowUpRight size={15} /></Link>
        </div>

        <div className="mt-11 flex flex-col gap-4 border-y border-white/[0.08] py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-gray-500"><SlidersHorizontal size={14} className="text-neon-red" /> Filtrar colección</div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button key={category} onClick={() => setActive(category)} className={`angle-frame-sm border px-3.5 py-2 text-[10px] font-black uppercase tracking-[.1em] transition ${active === category ? 'border-neon-red bg-neon-red text-[#0B0E13]' : 'border-white/[0.1] bg-white/[0.025] text-gray-400 hover:border-neon-red/50 hover:text-neon-red'}`}>
                {category}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => <ProjectCard key={project.id} project={project} index={index} featured={project.featured && active === 'Todos'} />)}
        </motion.div>

        {filtered.length === 0 && <div className="acid-panel angle-frame mt-8 p-8 text-center text-sm text-gray-400">No hay proyectos visibles en esta categoría.</div>}
      </div>
    </SectionWrapper>
  );
}
