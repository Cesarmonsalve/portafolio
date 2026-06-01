'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Image as ImageIcon, LayoutGrid, Play, X, Volume2, VolumeX, Maximize2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { type Project } from '@/lib/config';
import { initialProjects } from '@/data/projects';
import ProjectCard from './ProjectCard';
import { useSiteConfig } from '@/lib/SiteConfigContext';

// SMART VIDEO DETECTION
const isVideoProject = (project: Project): boolean => {
  if (!project.video || project.video.trim() === '') return false;
  const url = project.video.trim().toLowerCase();
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') ||
         url.includes('drive.google.com') || url.includes('.mp4') || url.includes('.webm');
};

const sanitizeUrl = (url?: string) => {
  if (!url) return '';
  if (url.includes('<iframe') && url.includes('src=')) {
    const match = url.match(/src=["'](.*?)["']/);
    return match ? match[1] : url;
  }
  return url;
};

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

type MediaFilter = 'all' | 'videos' | 'images';

function VideoLightbox({ project, onClose }: { project: Project; onClose: () => void }) {
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoUrl = sanitizeUrl(project.video);
  const isEmbed = videoUrl.includes('youtube') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo');

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
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative z-10 w-[92vw] max-w-5xl aspect-video overflow-hidden shadow-[0_0_100px_rgba(203,254,28,0.12)] angle-frame"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 bg-black angle-frame-sm">
          {isEmbed ? (
            <iframe src={getEmbedUrl(videoUrl)} className="w-full h-full" allow="autoplay; encrypted-media; fullscreen" allowFullScreen title={project.title} />
          ) : videoUrl ? (
            <video ref={videoRef} src={videoUrl} className="w-full h-full object-contain bg-black" autoPlay muted={muted} controls playsInline />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play size={48} className="text-gray-700" />
            </div>
          )}
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/60 backdrop-blur angle-frame-sm flex items-center justify-center text-white hover:bg-neon-red/80 transition-all group">
          <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-16 pointer-events-none">
          <h3 className="text-heading text-lg text-white mb-1">{project.title}</h3>
          <span className="bg-neon-red/20 border border-neon-red/30 px-2.5 py-0.5 angle-frame-sm text-[10px] font-medium text-neon-red">{project.category}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VideoCard({ project, index, onPlay }: { project: Project; index: number; onPlay: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2), ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div
        className="relative overflow-hidden project-arena-card bg-surface border border-white/[0.08] transition-all duration-500 hover:border-neon-red/20 cursor-pointer video-card-glow"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onPlay}
      >
        <div className="relative overflow-hidden aspect-video">
          {!imageLoaded && <div className="absolute inset-0 shimmer" />}
          <img
            src={project.image}
            alt={project.title}
            className={`w-full h-full object-cover transition-all duration-700 ${hovered ? 'scale-110 brightness-[0.3]' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div animate={{ scale: hovered ? 1.15 : 1, opacity: hovered ? 1 : 0.6 }} className="relative">
              <div className="relative w-16 h-16 bg-neon-red/90 backdrop-blur-sm angle-frame-sm flex items-center justify-center shadow-[0_0_30px_rgba(203,254,28,0.3)] group-hover:shadow-[0_0_50px_rgba(203,254,28,0.55)] transition-shadow duration-500">
                <Play size={22} className="text-white ml-1" fill="white" />
              </div>
            </motion.div>
          </div>
          <div className="absolute top-3 right-3 bg-neon-red/90 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] text-white font-bold uppercase tracking-wider flex items-center gap-1">
            <Film size={10} /> Video
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-subheading text-sm text-white group-hover:text-neon-red transition-colors mb-1 truncate">{project.title}</h3>
          <p className="text-[11px] text-gray-500 line-clamp-1 mb-2">{project.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-white/[0.03] px-2 py-0.5 angle-frame-sm text-[10px] text-gray-500">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function GalleryGrid() {
  const { projects: allProjects } = useSiteConfig();
  // Filter out hidden projects for public display
  const projects = allProjects.filter(p => !(p as any).hidden);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');
  const [selectedVideo, setSelectedVideo] = useState<Project | null>(null);

  const videoCount = projects.filter(isVideoProject).length;
  const imageCount = projects.filter(p => !isVideoProject(p)).length;

  const filtered = projects.filter((p) => {
    const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
    let matchesMedia = true;
    if (mediaFilter === 'videos') matchesMedia = isVideoProject(p);
    if (mediaFilter === 'images') matchesMedia = !isVideoProject(p);
    return matchesCategory && matchesMedia;
  });

  const MEDIA_FILTERS: { id: MediaFilter; label: string; icon: typeof LayoutGrid; count: number }[] = [
    { id: 'all', label: 'Todos', icon: LayoutGrid, count: projects.length },
    { id: 'videos', label: 'Videos', icon: Film, count: videoCount },
    { id: 'images', label: 'Imágenes', icon: ImageIcon, count: imageCount },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg px-6 pb-20 pt-32 text-white">
      <div className="arena-grid absolute inset-0 opacity-35" />
      <div className="relative mx-auto max-w-7xl">
        <Link href="/#work" className="ghost-button mb-12 !px-4 !py-3">
          <ArrowLeft size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Volver al inicio</span>
        </Link>

        <div className="mb-16">
          <h1 className="heading-slashed text-display mb-4 text-4xl font-black uppercase leading-[.95] tracking-[-.04em] md:text-6xl">
            Galería de <span className="gradient-text-animated">Trabajos</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Explora la colección completa de proyectos, diseños visuales, motion graphics y campañas desarrolladas.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-white/[0.05] pb-8">
          <div className="acid-panel angle-frame-sm flex items-center gap-0.5 p-1">
            {MEDIA_FILTERS.map((filter) => {
              const isActive = mediaFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => { setMediaFilter(filter.id); setActiveCategory('Todos'); }}
                  className={`relative flex items-center gap-2 px-5 py-2.5 angle-frame-sm text-[11px] font-black uppercase tracking-wide transition-colors duration-300 ${isActive ? 'bg-neon-red text-[#0B0E13]' : 'text-gray-500 hover:text-neon-red'}`}
                >
                  <filter.icon size={14} />
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['Todos', ...Array.from(new Set(projects.filter(p => mediaFilter === 'all' || (mediaFilter === 'videos' ? isVideoProject(p) : !isVideoProject(p))).map(p => p.category)))].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 angle-frame-sm border px-4 py-1.5 text-[11px] font-black uppercase tracking-wide transition-all duration-300 ${activeCategory === cat ? 'border-neon-red bg-neon-red text-[#0B0E13]' : 'border-white/[0.08] bg-white/[0.03] text-gray-400 hover:border-neon-red/50 hover:text-neon-red'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${mediaFilter}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, index) =>
              mediaFilter === 'videos' ? (
                <VideoCard key={project.id} project={project} index={index} onPlay={() => setSelectedVideo(project)} />
              ) : (
                <ProjectCard key={project.id} project={project} index={index} />
              )
            )}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="acid-panel angle-frame mt-8 py-20 text-center text-gray-500">No se encontraron proyectos.</div>
        )}
      </div>

      <AnimatePresence>
        {selectedVideo && <VideoLightbox project={selectedVideo} onClose={() => setSelectedVideo(null)} />}
      </AnimatePresence>
    </div>
  );
}
