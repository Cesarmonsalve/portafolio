'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Image as ImageIcon, LayoutGrid, Play, X, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import LottieRenderer from './LottieRenderer';
import { getProjects, getFullConfig, type Project, type SiteConfig, DEFAULT_CONFIG } from '@/lib/config';
import { initialProjects } from '@/data/projects';
import ProjectCard from './ProjectCard';

// ═══════════════════════════════════════════
// SMART VIDEO DETECTION
// Only projects with an ACTUAL video URL are videos.
// Thumbnails, YouTube mockups, etc. are IMAGES.
// ═══════════════════════════════════════════

const isVideoProject = (project: Project): boolean => {
  // ONLY a real video URL counts as a video project
  if (!project.video || project.video.trim() === '') return false;

  const url = project.video.trim().toLowerCase();

  // Must be a real video URL (not just an image pasted in the video field)
  const isRealVideo =
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('vimeo.com') ||
    url.includes('drive.google.com') ||
    url.includes('tiktok.com') ||
    url.includes('instagram.com/reel') ||
    url.includes('.mp4') ||
    url.includes('.webm') ||
    url.includes('.mov') ||
    url.includes('.avi') ||
    url.startsWith('data:video/') ||
    url.startsWith('blob:');

  return isRealVideo;
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

// ═══════════════════════════════════════════
// MEDIA TYPE
// ═══════════════════════════════════════════

type MediaFilter = 'all' | 'videos' | 'images';

// ═══════════════════════════════════════════
// FULLSCREEN VIDEO LIGHTBOX
// ═══════════════════════════════════════════

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
        initial={{ scale: 0.6, opacity: 0, rotateX: 20 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.6, opacity: 0, rotateX: -20 }}
        transition={{ type: 'spring', damping: 22, stiffness: 180 }}
        className="relative z-10 w-[92vw] max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(255,0,51,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-neon-red via-neon-purple to-neon-pink opacity-40" />
        <div className="absolute inset-0 rounded-2xl bg-black">
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

        <button onClick={onClose} className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/60 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-neon-red/80 transition-all group">
          <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-16">
          <h3 className="text-heading text-lg text-white mb-1">{project.title}</h3>
          <span className="bg-neon-red/20 border border-neon-red/30 px-2.5 py-0.5 rounded-full text-[10px] font-medium text-neon-red">{project.category}</span>
        </div>

        {!isEmbed && videoUrl && (
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <button onClick={() => setMuted(!muted)} className="w-9 h-9 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors">
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <button onClick={() => videoRef.current?.requestFullscreen()} className="w-9 h-9 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white/80 hover:text-white transition-colors">
              <Maximize2 size={15} />
            </button>
          </div>
        )}
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="absolute bottom-6 text-[10px] text-gray-600 uppercase tracking-widest z-10">
        ESC para cerrar
      </motion.p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// VIDEO-ONLY CARD (used in video mode)
// ═══════════════════════════════════════════

function VideoCard({ project, index, onPlay, instant }: { project: Project; index: number; onPlay: () => void; instant?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={instant ? false : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={instant ? { duration: 0 } : { duration: 0.35, delay: Math.min(index * 0.04, 0.2), ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div
        className="relative overflow-hidden rounded-2xl bg-surface border border-white/[0.04] transition-all duration-500 hover:border-neon-red/20 cursor-pointer video-card-glow"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onPlay}
        data-cursor-hover
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden aspect-video">
          {!imageLoaded && <div className="absolute inset-0 shimmer" />}
          <img
            src={project.image}
            alt={project.title}
            className={`w-full h-full object-cover transition-all duration-700 ${hovered ? 'scale-110 brightness-[0.3]' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Centered play button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              animate={{ scale: hovered ? 1.15 : 1, opacity: hovered ? 1 : 0.6 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {hovered && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-neon-red/30"
                />
              )}
              <div className="relative w-16 h-16 bg-neon-red/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,0,51,0.4)] group-hover:shadow-[0_0_50px_rgba(255,0,51,0.6)] transition-shadow duration-500">
                <Play size={22} className="text-white ml-1" fill="white" />
              </div>
            </motion.div>
          </div>

          {/* "VER VIDEO" text on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent p-5 pt-12"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-neon-red px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                    <Play size={11} fill="white" /> Ver Video
                  </span>
                  <span className="text-[10px] text-gray-400">{project.category}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video indicator badge */}
          <div className="absolute top-3 right-3 bg-neon-red/90 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] text-white font-bold uppercase tracking-wider flex items-center gap-1">
            <Film size={10} /> Video
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-subheading text-sm text-white group-hover:text-neon-red transition-colors mb-1 truncate">{project.title}</h3>
          <p className="text-[11px] text-gray-500 line-clamp-1 mb-2">{project.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-white/[0.03] px-2 py-0.5 rounded-full text-[10px] text-gray-500">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// CINEMATIC MODE TRANSITION (FAST VERSION)
// Total: ~700ms. Switch at ~220ms (screen fully black).
// Content is already rendered behind the wipe, so it
// appears INSTANTLY when the black curtain slides away.
// ═══════════════════════════════════════════

const TRANSITION_TOTAL = 700;
const TRANSITION_SWITCH = 220;

function ModeTransition({ mode, onSwitch, onDone }: { mode: MediaFilter; onSwitch: () => void; onDone: () => void }) {
  const switchedRef = useRef(false);

  useEffect(() => {
    // Switch content ASAP — screen is fully covered at ~220ms
    const switchTimer = setTimeout(() => {
      if (!switchedRef.current) {
        switchedRef.current = true;
        onSwitch();
      }
    }, TRANSITION_SWITCH);

    // Remove overlay right after reveal animation finishes
    const doneTimer = setTimeout(onDone, TRANSITION_TOTAL);

    return () => {
      clearTimeout(switchTimer);
      clearTimeout(doneTimer);
    };
  }, [onSwitch, onDone]);

  const label = mode === 'videos' ? 'VIDEOS' : mode === 'images' ? 'IMÁGENES' : 'PORTFOLIO';
  const subtitle = mode === 'videos' ? 'Motion Graphics & Ediciones' : mode === 'images' ? 'Diseño Visual & Branding' : 'Trabajos Seleccionados';

  const dur = TRANSITION_TOTAL / 1000; // 0.7s

  return (
    <motion.div
      className="fixed inset-0 z-[9980] pointer-events-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
    >
      {/* Black wipe — fast cover + reveal */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{
          clipPath: [
            'inset(0 100% 0 0)',   // start: nothing
            'inset(0 0% 0 0)',     // fully covered
            'inset(0 0% 0 0)',     // hold briefly
            'inset(0 0 0 100%)',   // reveal from left
          ],
        }}
        transition={{ duration: dur, times: [0, 0.3, 0.45, 1], ease: [0.7, 0, 0.3, 1] }}
      />

      {/* Scan lines */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0.5, 0] }}
        transition={{ duration: dur, times: [0, 0.25, 0.55, 1] }}
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,51,0.04) 2px, rgba(255,0,51,0.04) 4px)' }}
      />

      {/* Center content — appears and disappears faster */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 40, skewY: 5 }}
            animate={{ opacity: [0, 1, 1, 0], y: [40, 0, 0, -20], skewY: [5, 0, 0, -2] }}
            transition={{ duration: dur, times: [0.05, 0.28, 0.55, 0.85], ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="text-display text-6xl md:text-8xl lg:text-9xl tracking-tighter glitch"
              data-text={label}
              style={{
                background: mode === 'videos'
                  ? 'linear-gradient(135deg, #ff0033, #ff4466, #ff0033)'
                  : mode === 'images'
                    ? 'linear-gradient(135deg, #a855f7, #ec4899, #a855f7)'
                    : 'linear-gradient(135deg, #fff, #888, #fff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {label}
            </h2>
          </motion.div>

          <motion.p
            className="text-label text-gray-400 mt-3 tracking-[0.3em]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -12] }}
            transition={{ duration: dur, times: [0.1, 0.3, 0.55, 0.85], ease: [0.16, 1, 0.3, 1] }}
          >
            {subtitle}
          </motion.p>

          <motion.div
            className="mx-auto mt-5 h-[2px] rounded-full"
            style={{
              background: mode === 'videos'
                ? 'linear-gradient(90deg, transparent, #ff0033, transparent)'
                : mode === 'images'
                  ? 'linear-gradient(90deg, transparent, #a855f7, transparent)'
                  : 'linear-gradient(90deg, transparent, #fff, transparent)',
            }}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: [0, 180, 180, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: dur, times: [0.15, 0.32, 0.55, 0.82] }}
          />
        </div>
      </div>

      {/* Corner accents */}
      <motion.div
        className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-neon-red/60"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
        transition={{ duration: dur, times: [0.18, 0.35, 0.55, 0.78] }}
      />
      <motion.div
        className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-neon-red/60"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
        transition={{ duration: dur, times: [0.18, 0.35, 0.55, 0.78] }}
      />
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════

export default function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');
  const [loading, setLoading] = useState(true);
  const [cfg, setCfg] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [transitioning, setTransitioning] = useState(false);
  const [pendingMode, setPendingMode] = useState<MediaFilter | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Project | null>(null);
  const [instantCards, setInstantCards] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [data, config] = await Promise.all([getProjects(), getFullConfig()]);
      if (data.length > 0) setProjects(data);
      else setProjects(initialProjects);
      setCfg(config);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Counts
  const videoCount = projects.filter(isVideoProject).length;
  const imageCount = projects.filter(p => !isVideoProject(p)).length;

  // Handle mode switch with transition
  const handleModeSwitch = useCallback((mode: MediaFilter) => {
    if (mode === mediaFilter) return;

    // Only do cinematic transition when switching TO videos or images (not back to all)
    if (mode !== 'all') {
      setPendingMode(mode);
      setTransitioning(true);
    } else {
      setMediaFilter(mode);
      setActiveCategory('Todos');
    }
  }, [mediaFilter]);

  // Content switches at MIDPOINT (screen is fully covered by black wipe)
  // Cards are set to "instant" mode so they render with zero delay
  const handleTransitionSwitch = useCallback(() => {
    if (pendingMode) {
      setInstantCards(true);
      setMediaFilter(pendingMode);
      setActiveCategory('Todos');
    }
  }, [pendingMode]);

  // Overlay removed at END — clear instant flag after a tick
  const handleTransitionDone = useCallback(() => {
    setTransitioning(false);
    setPendingMode(null);
    // Keep instantCards true briefly so the cards don't re-animate
    requestAnimationFrame(() => setInstantCards(false));
  }, []);

  // Combined filter
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
    <>
      <section id="work" className="py-20 md:py-28 px-6 relative overflow-hidden">
        {/* Background orb */}
        <div className="floating-orb" style={{ width: 300, height: 300, top: '30%', right: '-10%', background: mediaFilter === 'videos' ? 'var(--neon-red)' : 'var(--neon-purple)' }} />

        {/* Lottie decoration */}
        {cfg.lottie_projects?.enabled && cfg.lottie_projects?.source && (
          <div className="lottie-section" style={{ opacity: cfg.lottie_projects.opacity || 0.35 }}>
            <LottieRenderer source={cfg.lottie_projects.source} speed={cfg.lottie_projects.speed} />
          </div>
        )}

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header — changes based on mode */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-label text-neon-red">Portfolio</span>
            <AnimatePresence mode="wait">
              <motion.h2
                key={mediaFilter}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="text-heading text-3xl md:text-4xl mt-3 mb-3"
              >
                {mediaFilter === 'videos' ? (
                  <>Mis <span className="gradient-text-animated">Videos</span></>
                ) : mediaFilter === 'images' ? (
                  <>Diseños <span className="gradient-text-animated">Visuales</span></>
                ) : (
                  <>Trabajos <span className="gradient-text-animated">Seleccionados</span></>
                )}
              </motion.h2>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={mediaFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-caption text-sm max-w-md mx-auto"
              >
                {mediaFilter === 'videos'
                  ? 'Motion graphics, ediciones y piezas audiovisuales que cobran vida.'
                  : mediaFilter === 'images'
                    ? 'Diseños estáticos, flyers, branding y composiciones de alto impacto.'
                    : 'Cada proyecto es una pieza única diseñada para impactar y comunicar.'}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* ═══ MEDIA TYPE FILTER ═══ */}
          <motion.div
            className="flex items-center justify-center mb-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="inline-flex items-center bg-white/[0.02] border border-white/[0.06] rounded-2xl p-1 gap-0.5">
              {MEDIA_FILTERS.map((filter) => {
                const isActive = mediaFilter === filter.id;
                return (
                  <motion.button
                    key={filter.id}
                    onClick={() => handleModeSwitch(filter.id)}
                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-medium tracking-wide transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                    }`}
                    data-cursor-hover
                    whileTap={{ scale: 0.97 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="mediaFilterPill"
                        className={`absolute inset-0 rounded-xl ${
                          filter.id === 'videos'
                            ? 'bg-gradient-to-r from-neon-red/90 to-red-800/90 shadow-[0_0_25px_rgba(255,0,51,0.25)]'
                            : filter.id === 'images'
                              ? 'bg-gradient-to-r from-neon-purple/90 to-purple-800/90 shadow-[0_0_25px_rgba(168,85,247,0.25)]'
                              : 'bg-white/[0.08]'
                        }`}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <filter.icon size={14} />
                      {filter.label}
                      <span className={`text-[9px] min-w-[20px] text-center px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20' : 'bg-white/[0.04] text-gray-600'
                      }`}>
                        {filter.count}
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
            {['Todos', ...Array.from(new Set(
              projects
                .filter(p => {
                  if (mediaFilter === 'videos') return isVideoProject(p);
                  if (mediaFilter === 'images') return !isVideoProject(p);
                  return true;
                })
                .map(p => p.category)
            ))].map((cat, i) => (
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

          {/* ═══ GRID ═══ */}
          {!loading && (
            <AnimatePresence mode={transitioning ? 'sync' : 'wait'}>
              <motion.div
                key={`${activeCategory}-${mediaFilter}`}
                initial={instantCards ? false : { opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={transitioning ? { opacity: 0 } : { opacity: 0, y: -20 }}
                transition={instantCards ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filtered.map((project, index) =>
                  mediaFilter === 'videos' ? (
                    <VideoCard
                      key={project.id}
                      project={project}
                      index={index}
                      onPlay={() => setSelectedVideo(project)}
                      instant={instantCards}
                    />
                  ) : (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index}
                      featured={project.featured && index === 0}
                    />
                  )
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
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
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-8">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                {filtered.length} {filtered.length === 1 ? 'proyecto' : 'proyectos'}
                {mediaFilter !== 'all' && (
                  <span className="text-gray-500"> • {mediaFilter === 'videos' ? '🎬 Videos' : '🖼️ Imágenes'}</span>
                )}
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══ CINEMATIC TRANSITION ═══ */}
      <AnimatePresence>
        {transitioning && pendingMode && (
          <ModeTransition
            mode={pendingMode}
            onSwitch={handleTransitionSwitch}
            onDone={handleTransitionDone}
          />
        )}
      </AnimatePresence>

      {/* ═══ VIDEO LIGHTBOX ═══ */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoLightbox
            project={selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
