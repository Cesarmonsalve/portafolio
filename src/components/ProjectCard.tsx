'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { Project } from '@/lib/config';
import { YouTubeMockup, SpotifyMockup, InstagramMockup, PhoneMockup } from './ThemedMockups';

// Helper to extract proper URL if user pasted an iframe embed code
const sanitizeUrl = (url?: string) => {
  if (!url) return '';
  if (url.includes('<iframe') && url.includes('src=')) {
    const match = url.match(/src=["'](.*?)["']/);
    return match ? match[1] : url;
  }
  return url;
};

interface Props {
  project: Project;
  index: number;
  featured?: boolean;
}

export default function ProjectCard({ project, index, featured }: Props) {
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const displayMode = project.display_mode || 'default';
  const isThemed = displayMode !== 'default';

  // 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -8;
    const rotateY = (x - 0.5) * 8;
    cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    }
  };

  // ═══════════════════════════════════════════
  // THEMED CARD RENDER
  // ═══════════════════════════════════════════

  if (isThemed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, delay: index * 0.08 }}
        className={`group relative ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}
      >
        <div
          ref={cardRef}
          style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out' }}
          onMouseEnter={() => setHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          data-cursor-hover
          className="relative"
        >
          {/* Themed mockup */}
          {displayMode === 'youtube' && (
            <YouTubeMockup project={project} imageLoaded={imageLoaded} onLoad={() => setImageLoaded(true)} />
          )}
          {displayMode === 'spotify' && (
            <SpotifyMockup project={project} imageLoaded={imageLoaded} onLoad={() => setImageLoaded(true)} />
          )}
          {displayMode === 'instagram' && (
            <InstagramMockup project={project} imageLoaded={imageLoaded} onLoad={() => setImageLoaded(true)} />
          )}
          {displayMode === 'phone' && (
            <PhoneMockup project={project} imageLoaded={imageLoaded} onLoad={() => setImageLoaded(true)} />
          )}

          {/* Hover overlay with actions */}
          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ pointerEvents: hovered ? 'auto' : 'none', transform: 'translateZ(40px)' }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center gap-3 z-10"
          >
            {project.video ? (
              <a
                href={sanitizeUrl(project.video)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 bg-white text-black px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors elastic-press cursor-pointer"
              >
                <Play size={14} />
                Ver Video
              </a>
            ) : (
              <Link
                href={`/projects/${project.id}`}
                className="flex items-center gap-1.5 bg-white text-black px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors elastic-press"
              >
                <Play size={14} />
                Ver Proyecto
              </Link>
            )}
            <Link
              href={`/projects/${project.id}`}
              className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
              title="Detalles del proyecto"
            >
              <ExternalLink size={16} />
            </Link>
          </motion.div>

          {/* Theme badge */}
          <div className="absolute top-2 right-2 z-20">
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm ${
              displayMode === 'youtube' ? 'bg-red-600/80 text-white' :
              displayMode === 'spotify' ? 'bg-[#1DB954]/80 text-white' :
              displayMode === 'instagram' ? 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white' :
              'bg-white/20 text-white'
            }`}>
              {displayMode === 'youtube' ? '▶ YouTube' :
               displayMode === 'spotify' ? '♫ Spotify' :
               displayMode === 'instagram' ? '◎ Instagram' :
               '📱 Mobile'}
            </span>
          </div>
        </div>

        {/* Tags below themed card */}
        <div className="flex flex-wrap gap-1.5 mt-2.5 px-1">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="bg-white/[0.03] px-2 py-0.5 rounded-full text-[10px] text-gray-400">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    );
  }

  // ═══════════════════════════════════════════
  // DEFAULT CARD RENDER (CARTAGENAPLAY POSTER STYLE)
  // ═══════════════════════════════════════════

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className={`group relative h-full ${featured ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl bg-surface border border-white/[0.04] transition-[border-color] duration-500 hover:border-white/[0.15] h-[350px] md:h-[450px] w-full"
        style={{ transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out, border-color 0.5s' }}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={(e) => {
          handleMouseMove(e);
        }}
        onMouseLeave={handleMouseLeave}
        data-cursor-hover
      >
        {/* Full Cover Image */}
        {!imageLoaded && <div className="absolute inset-0 shimmer bg-surface" />}
        <img
          src={project.image}
          alt={project.title}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            hovered ? 'scale-110 brightness-75' : 'scale-100 brightness-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Strong Gradient Overlay for text readability (CartagenaPlay style) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          <span className="bg-neon-red/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white tracking-wide shadow-[0_0_15px_rgba(255,0,51,0.3)]">
            {project.category}
          </span>
          
          {project.featured && (
            <span className="bg-white/[0.1] border border-white/[0.1] backdrop-blur-sm px-2 py-1 rounded-md text-[9px] font-bold text-white tracking-widest uppercase">
              ★ Destacado
            </span>
          )}
        </div>

        {/* Hover Action Center */}
        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ pointerEvents: hovered ? 'auto' : 'none', transform: 'translateZ(40px)' }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
           <div className="w-16 h-16 bg-neon-red text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,0,51,0.5)] transition-transform duration-300 group-hover:scale-110">
             <Play size={24} className="ml-1" />
           </div>
        </motion.div>

        {/* Bottom Info Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-20 transform transition-transform duration-500">
          <h3 className="font-display font-bold text-xl md:text-2xl text-white mb-2 leading-tight group-hover:text-neon-red transition-colors">
            {project.title}
          </h3>
          
          <p className="text-gray-300 text-xs md:text-sm line-clamp-2 mb-4 font-body leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
            {project.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-white/[0.05] border border-white/[0.08] px-2.5 py-1 rounded-md text-[10px] text-gray-400 font-medium tracking-wide uppercase"
              >
              {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Invisible Click Area */}
        <Link href={`/projects/${project.id}`} className="absolute inset-0 z-30" onClick={(e) => {
          if (project.video) {
            // Optional: If we want it to open video lightbox, we'd handle it via parent.
            // For now, it goes to project page
          }
        }}>
          <span className="sr-only">Ver proyecto {project.title}</span>
        </Link>
      </div>
    </motion.div>
  );
}