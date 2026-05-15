'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Volume2, VolumeX, Maximize2, ChevronRight } from 'lucide-react';
import { getProjects, type Project } from '@/lib/config';
import { initialProjects } from '@/data/projects';

// ═══════════════════════════════════════════
// VIDEO CATEGORIES
// ═══════════════════════════════════════════

const VIDEO_CATEGORIES = [
  { id: 'all', label: 'Todos', icon: '🎬' },
  { id: 'motion', label: 'Motion Graphics', icon: '✦' },
  { id: 'ediciones', label: 'Ediciones', icon: '🎞️' },
  { id: 'vfx', label: 'VFX', icon: '⚡' },
  { id: 'reels', label: 'Reels', icon: '📱' },
  { id: 'branding', label: 'Branding', icon: '◆' },
  { id: 'advertising', label: 'Advertising', icon: '📢' },
];

// Map project categories to video categories
const mapToVideoCategory = (category: string): string => {
  const lower = category.toLowerCase();
  if (lower.includes('motion')) return 'motion';
  if (lower.includes('edit') || lower.includes('video') || lower.includes('edic')) return 'ediciones';
  if (lower.includes('vfx') || lower.includes('effect')) return 'vfx';
  if (lower.includes('reel') || lower.includes('instagram') || lower.includes('social')) return 'reels';
  if (lower.includes('brand')) return 'branding';
  if (lower.includes('advert') || lower.includes('flyer') || lower.includes('3d')) return 'advertising';
  return 'motion'; // default
};

// Helper to extract proper URL if user pasted an iframe embed code
const sanitizeUrl = (url?: string) => {
  if (!url) return '';
  if (url.includes('<iframe') && url.includes('src=')) {
    const match = url.match(/src=["'](.*?)["']/);
    return match ? match[1] : url;
  }
  return url;
};

// ═══════════════════════════════════════════
// VIDEO PLAYER OVERLAY (fullscreen lightbox)
// ═══════════════════════════════════════════

function VideoPlayer({ project, onClose }: { project: Project; onClose: () => void }) {
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrl = sanitizeUrl(project.video);
  const isEmbed = videoUrl.includes('youtube') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo');

  // Convert YouTube watch URL to embed URL
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch')) {
      const id = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    }
    return url;
  };

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[9990] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Dark backdrop with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/92 backdrop-blur-2xl"
      />

      {/* Video container */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0, rotateX: 15 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.7, opacity: 0, rotateX: -15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative z-10 w-[90vw] max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(255,0,51,0.15)]"
        onClick={(e) => e.stopPropagation()}
        style={{ perspective: '1200px' }}
      >
        {/* Glowing border */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-neon-red via-neon-purple to-neon-pink opacity-50" />
        <div className="absolute inset-0 rounded-2xl bg-black">
          {isEmbed ? (
            <iframe
              src={getEmbedUrl(videoUrl)}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              title={project.title}
            />
          ) : videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain bg-black"
              autoPlay
              muted={muted}
              controls
              playsInline
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-surface">
              <div className="text-center">
                <Play size={48} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-500 text-sm">Video no disponible</p>
              </div>
            </div>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/60 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-neon-red/80 transition-all group"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Bottom info bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 pt-16">
          <h3 className="text-heading text-lg text-white mb-1">{project.title}</h3>
          <div className="flex items-center gap-3">
            <span className="bg-neon-red/20 border border-neon-red/30 px-2.5 py-0.5 rounded-full text-[10px] font-medium text-neon-red tracking-wide">
              {project.category}
            </span>
            {project.client && (
              <span className="text-gray-400 text-xs">{project.client}</span>
            )}
          </div>
        </div>

        {/* Video controls (for non-embed) */}
        {!isEmbed && videoUrl && (
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <button
              onClick={() => setMuted(!muted)}
              className="w-9 h-9 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <button
              onClick={() => videoRef.current?.requestFullscreen()}
              className="w-9 h-9 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <Maximize2 size={15} />
            </button>
          </div>
        )}
      </motion.div>

      {/* Project info below video on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-6 left-0 right-0 flex justify-center z-10"
      >
        <div className="flex items-center gap-2 text-gray-500 text-[10px] uppercase tracking-widest">
          <span>ESC para cerrar</span>
          <span>•</span>
          <span>Click fuera para cerrar</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// VIDEO CARD
// ═══════════════════════════════════════════

function VideoCard({ project, index, onPlay }: { project: Project; index: number; onPlay: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -6;
    const rotateY = (x - 0.5) * 6;
    cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={cardRef}
        className="group relative overflow-hidden rounded-2xl bg-surface border border-white/[0.04] transition-[border-color] duration-500 hover:border-white/[0.12] card-spotlight video-card-glow"
        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out, border-color 0.5s' }}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={(e) => {
          handleMouseMove(e);
          const rect = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
          e.currentTarget.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        }}
        onMouseLeave={handleMouseLeave}
        data-cursor-hover
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden aspect-video bg-bg-tertiary">
          {!imageLoaded && <div className="absolute inset-0 shimmer" />}
          <img
            src={project.image}
            alt={project.title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              hovered ? 'scale-110 brightness-50' : 'scale-100 brightness-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Play button overlay - always visible */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: hovered ? 1.1 : 1,
                opacity: hovered ? 1 : 0.7,
              }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Pulsing ring */}
              <div className={`absolute inset-0 rounded-full bg-neon-red/30 ${hovered ? 'animate-ping' : ''}`}
                style={{ animationDuration: '1.5s' }}
              />
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-neon-red/20 backdrop-blur-md border border-neon-red/40 rounded-full flex items-center justify-center group-hover:bg-neon-red/40 transition-all duration-300">
                <Play size={24} className="text-white ml-1" fill="white" />
              </div>
            </motion.div>
          </div>

          {/* Duration badge (decorative) */}
          <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white font-medium">
            {project.video ? '▶' : '—'}
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-medium text-gray-300 tracking-wide">
              {project.category}
            </span>
          </div>

          {/* Hover overlay with "Ver Video" button */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 flex flex-col justify-end p-5"
              >
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                >
                  <h3 className="text-subheading text-sm text-white mb-2">{project.title}</h3>
                  <p className="text-[11px] text-gray-300 line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlay();
                      }}
                      className="flex items-center gap-2 bg-neon-red hover:bg-red-600 px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all elastic-press group/btn"
                    >
                      <Play size={14} className="group-hover/btn:scale-110 transition-transform" fill="white" />
                      Ver Video
                    </button>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="bg-white/10 px-2 py-0.5 rounded-full text-[9px] text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card bottom info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="text-subheading text-sm text-white group-hover:text-neon-red transition-colors truncate mr-2">
              {project.title}
            </h3>
            <ChevronRight size={14} className="text-gray-600 group-hover:text-neon-red group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-white/[0.03] px-2 py-0.5 rounded-full text-[10px] text-gray-500">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// MAIN VIDEO SHOWCASE SECTION
// ═══════════════════════════════════════════

export default function VideoShowcase() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getProjects();
      if (data.length > 0) {
        setProjects(data);
      } else {
        setProjects(initialProjects);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = activeCategory === 'all'
    ? projects
    : projects.filter((p) => mapToVideoCategory(p.category) === activeCategory);

  const handlePlay = useCallback((project: Project) => {
    if (project.video) {
      setSelectedProject(project);
    } else {
      // If no video, open project link or show message
      window.open(`/projects/${project.id}`, '_blank');
    }
  }, []);

  return (
    <>
      <section id="videos" className="py-24 md:py-32 px-6 relative overflow-hidden">
        {/* Background effects */}
        <div className="floating-orb" style={{ width: 400, height: 400, top: '10%', left: '-15%', background: 'var(--neon-purple)' }} />
        <div className="floating-orb" style={{ width: 300, height: 300, bottom: '10%', right: '-10%', background: 'var(--neon-red)' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <span className="text-label text-neon-red flex items-center justify-center gap-2 mb-4">
              <span className="w-8 h-px bg-neon-red" />
              Video Reel
              <span className="w-8 h-px bg-neon-red" />
            </span>
            <h2 className="text-heading text-4xl md:text-5xl lg:text-6xl mt-3 mb-4">
              mis{' '}
              <span className="gradient-text-animated">videos</span>
            </h2>
            <p className="text-caption text-sm max-w-lg mx-auto leading-relaxed">
              Cada proyecto cobra vida en movimiento. Motion graphics, ediciones y efectos visuales
              que transforman ideas en experiencias cinematográficas.
            </p>
          </motion.div>

          {/* Category Filters - Pill style horizontal scroll */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-2 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {VIDEO_CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-5 py-2 rounded-full text-[11px] font-medium tracking-wide transition-all duration-400 elastic-press ${
                  activeCategory === cat.id
                    ? 'text-white shadow-[0_0_20px_rgba(255,0,51,0.25)]'
                    : 'bg-white/[0.03] text-gray-400 hover:text-gray-200 hover:bg-white/[0.06] border border-white/[0.04]'
                }`}
                data-cursor-hover
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                {activeCategory === cat.id && (
                  <motion.div
                    layoutId="activeVideoCategory"
                    className="absolute inset-0 bg-neon-red rounded-full"
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>{cat.icon}</span>
                  {cat.label}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Loading skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl bg-surface border border-white/[0.04] overflow-hidden">
                  <div className="aspect-video shimmer" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 shimmer rounded w-2/3" />
                    <div className="h-3 shimmer rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Video Grid */}
          {!loading && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((project, index) => (
                  <VideoCard
                    key={project.id}
                    project={project}
                    index={index}
                    onPlay={() => handlePlay(project)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-white/[0.03] rounded-2xl flex items-center justify-center">
                <Play size={32} className="text-gray-600" />
              </div>
              <p className="text-gray-400 text-sm mb-2">No hay videos en esta categoría.</p>
              <p className="text-gray-600 text-xs">Prueba seleccionando otra categoría</p>
            </motion.div>
          )}

          {/* Counter */}
          {!loading && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-10"
            >
              <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                Mostrando {filtered.length} {filtered.length === 1 ? 'proyecto' : 'proyectos'}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Video Player Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <VideoPlayer
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
