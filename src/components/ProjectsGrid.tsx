'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Image as ImageIcon, LayoutGrid } from 'lucide-react';
import LottieRenderer from './LottieRenderer';
import { getProjects, getFullConfig, type Project, type SiteConfig, DEFAULT_CONFIG } from '@/lib/config';
import { initialProjects } from '@/data/projects';
import ProjectCard from './ProjectCard';

// ═══════════════════════════════════════════
// MEDIA TYPE FILTERS
// ═══════════════════════════════════════════

type MediaFilter = 'all' | 'videos' | 'images';

const MEDIA_FILTERS: { id: MediaFilter; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'all', label: 'Todos', icon: LayoutGrid },
  { id: 'videos', label: 'Videos', icon: Film },
  { id: 'images', label: 'Imágenes', icon: ImageIcon },
];

// Smart detection: determine if a project is a video or image project
const isVideoProject = (project: Project): boolean => {
  // 1. Has an explicit video URL
  if (project.video && project.video.trim() !== '') return true;

  // 2. Category hints at video content
  const cat = project.category.toLowerCase();
  if (cat.includes('motion') || cat.includes('video') || cat.includes('animation') || cat.includes('reel')) return true;

  // 3. Tags hint at video content
  const videoTags = ['after effects', 'premiere', 'motion', 'animation', 'video', 'reel', 'vfx', 'cinema 4d', 'motion design', 'edición', 'edicion'];
  const hasVideoTag = project.tags.some(tag => videoTags.some(vt => tag.toLowerCase().includes(vt)));
  if (hasVideoTag) return true;

  // 4. Title hints
  const title = project.title.toLowerCase();
  if (title.includes('motion') || title.includes('animation') || title.includes('reel') || title.includes('video') || title.includes('edit')) return true;

  // 5. Display mode hints
  if (project.display_mode === 'youtube') return true;

  return false;
};

export default function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');
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

  // Calculate counts for badges
  const videoCount = projects.filter(p => isVideoProject(p)).length;
  const imageCount = projects.filter(p => !isVideoProject(p)).length;

  // Apply both filters: category + media type
  const filtered = projects.filter((p) => {
    // Category filter
    const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;

    // Media type filter
    let matchesMedia = true;
    if (mediaFilter === 'videos') matchesMedia = isVideoProject(p);
    if (mediaFilter === 'images') matchesMedia = !isVideoProject(p);

    return matchesCategory && matchesMedia;
  });

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

        {/* ═══ MEDIA TYPE FILTER (Videos / Imágenes) ═══ */}
        <motion.div
          className="flex items-center justify-center gap-1 mb-6"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-flex items-center bg-white/[0.02] border border-white/[0.06] rounded-2xl p-1 gap-0.5">
            {MEDIA_FILTERS.map((filter) => {
              const isActive = mediaFilter === filter.id;
              const count = filter.id === 'all' ? projects.length : filter.id === 'videos' ? videoCount : imageCount;
              return (
                <motion.button
                  key={filter.id}
                  onClick={() => setMediaFilter(filter.id)}
                  className={`relative flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-medium tracking-wide transition-all duration-300 ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                  data-cursor-hover
                  whileTap={{ scale: 0.97 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mediaFilterBg"
                      className={`absolute inset-0 rounded-xl ${
                        filter.id === 'videos'
                          ? 'bg-gradient-to-r from-neon-red to-red-700'
                          : filter.id === 'images'
                            ? 'bg-gradient-to-r from-neon-purple to-purple-700'
                            : 'bg-white/[0.08]'
                      }`}
                      transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <filter.icon size={14} />
                    {filter.label}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white/[0.04] text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ CATEGORY FILTERS ═══ */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-1.5 mb-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {['Todos', ...Array.from(new Set([
            'Motion Graphics', 'Graphic Design', 'Flyer Design', 'Advertising', 'Video', 'Branding', '3D',
            ...projects.map(p => p.category)
          ]))].map((cat, i) => (
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
              key={`${activeCategory}-${mediaFilter}`}
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-white/[0.03] rounded-2xl flex items-center justify-center">
              {mediaFilter === 'videos' ? <Film size={28} className="text-gray-700" /> : 
               mediaFilter === 'images' ? <ImageIcon size={28} className="text-gray-700" /> :
               <LayoutGrid size={28} className="text-gray-700" />}
            </div>
            <p className="text-gray-400 text-sm mb-1">
              No hay {mediaFilter === 'videos' ? 'videos' : mediaFilter === 'images' ? 'imágenes' : 'proyectos'} en esta categoría.
            </p>
            <p className="text-gray-600 text-xs">Prueba con otra combinación de filtros</p>
          </motion.div>
        )}

        {/* Result counter */}
        {!loading && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">
              Mostrando {filtered.length} {filtered.length === 1 ? 'proyecto' : 'proyectos'}
              {mediaFilter !== 'all' && (
                <span className="text-gray-500">
                  {' '}• {mediaFilter === 'videos' ? '🎬 Videos' : '🖼️ Imágenes'}
                </span>
              )}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
