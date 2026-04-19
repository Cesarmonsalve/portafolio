'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LottieRenderer from './LottieRenderer';
import { getProjects, getFullConfig, CATEGORIES, type Project, type SiteConfig, DEFAULT_CONFIG } from '@/lib/config';
import { initialProjects } from '@/data/projects';
import ProjectCard from './ProjectCard';

export default function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [cfg, setCfg] = useState<SiteConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    async function fetchData() {
      const [data, config] = await Promise.all([getProjects(), getFullConfig()]);
      if (data.length > 0) {
        setProjects(data);
      } else {
        setProjects(initialProjects);
      }
      setCfg(config);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = activeCategory === 'Todos'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="py-20 md:py-28 px-6 relative overflow-hidden">
      {/* Background orb */}
      <div className="floating-orb" style={{ width: 300, height: 300, top: '30%', right: '-10%', background: 'var(--neon-red)' }} />

      {/* Lottie decoration */}
      {cfg.lottie_projects?.enabled && cfg.lottie_projects?.source && (
        <div className="lottie-section" style={{ opacity: cfg.lottie_projects.opacity || 0.35 }}>
          <LottieRenderer source={cfg.lottie_projects.source} speed={cfg.lottie_projects.speed} />
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-label text-neon-red">Portfolio</span>
          <h2 className="text-heading text-3xl md:text-4xl mt-3 mb-3">
            Trabajos{' '}
            <span className="gradient-text-animated">Seleccionados</span>
          </h2>
          <p className="text-caption text-sm max-w-md mx-auto">
            Cada proyecto es una pieza única diseñada para impactar y comunicar.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-1.5 mb-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all duration-300 elastic-press ${
                activeCategory === cat
                  ? 'bg-neon-red text-white shadow-[0_0_15px_rgba(255,0,51,0.3)]'
                  : 'bg-white/[0.03] text-gray-400 hover:text-gray-200 hover:bg-white/[0.06]'
              }`}
              data-cursor-hover
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-surface border border-white/[0.04] overflow-hidden">
                <div className="aspect-[4/3] shimmer" />
                <div className="p-4 space-y-2">
                  <div className="h-4 shimmer rounded w-2/3" />
                  <div className="h-3 shimmer rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  featured={project.featured && index === 0}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No hay proyectos en esta categoría.</p>
          </div>
        )}
      </div>
    </section>
  );
}
