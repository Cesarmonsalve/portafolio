'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initialProjects, categories, type Project } from '@/data/projects';
import ProjectCard from './ProjectCard';
import { Filter } from 'lucide-react';

// Read from localStorage if available
function getProjects(): Project[] {
  if (typeof window === 'undefined') return initialProjects;
  const stored = localStorage.getItem('cm_projects');
  if (stored) {
    try { return JSON.parse(stored); } catch { return initialProjects; }
  }
  return initialProjects;
}

export default function ProjectsGrid() {
  const [projects] = useState<Project[]>(getProjects);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = activeCategory === 'Todos'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-neon-red text-sm font-bold tracking-[0.3em] uppercase">Portfolio</span>
          <h2 className="font-display text-5xl md:text-7xl font-black mt-4">
            MIS{' '}
            <span className="neon-text">TRABAJOS</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Cada proyecto es una pieza única diseñada para impactar y comunicar.
          </p>
        </motion.div>

        {/* Filter */}
        <div className="flex items-center justify-center mb-12">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm"
          >
            <Filter size={16} />
            Filtrar
          </button>
          <div className={`flex flex-wrap items-center justify-center gap-2 ${showFilters ? 'flex' : 'hidden'} md:flex`}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
                  activeCategory === cat
                    ? 'bg-neon-red text-white shadow-[0_0_20px_rgba(255,0,51,0.3)]'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No hay proyectos en esta categoría aún.</p>
          </div>
        )}
      </div>
    </section>
  );
}