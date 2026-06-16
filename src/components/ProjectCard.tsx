'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, Play } from 'lucide-react';
import type { Project } from '@/lib/config';
import { InstagramMockup, PhoneMockup, SpotifyMockup, YouTubeMockup } from './ThemedMockups';

const sanitizeUrl = (url?: string) => {
  if (!url) return '';
  if (url.includes('<iframe') && url.includes('src=')) {
    const match = url.match(/src=["'](.*?)["']/);
    return match ? match[1] : url;
  }
  return url;
};

interface Props { project: Project; index: number; featured?: boolean; }

export default function ProjectCard({ project, index, featured }: Props) {
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const displayMode = project.display_mode || 'default';
  const themed = displayMode !== 'default';

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    cardRef.current.style.transform = `perspective(1200px) rotateX(${(y - .5) * -4}deg) rotateY(${(x - .5) * 4}deg) translateY(-4px)`;
  };
  const handleLeave = () => {
    setHovered(false);
    if (cardRef.current) cardRef.current.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateY(0)';
  };

  if (themed) {
    return (
      <motion.article layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: .45, delay: Math.min(index * .06, .3) }} className={featured ? 'sm:col-span-2' : ''}>
        <div ref={cardRef} className="rounded-2xl border border-white/[0.06] bg-white/[0.01] p-3 overflow-hidden" style={{ transition: 'transform .25s ease-out' }} onMouseEnter={() => setHovered(true)} onMouseMove={handleMouseMove} onMouseLeave={handleLeave}>
          <div className="relative overflow-hidden rounded-xl">
            {displayMode === 'youtube' && <YouTubeMockup project={project} imageLoaded={imageLoaded} onLoad={() => setImageLoaded(true)} />}
            {displayMode === 'spotify' && <SpotifyMockup project={project} imageLoaded={imageLoaded} onLoad={() => setImageLoaded(true)} />}
            {displayMode === 'instagram' && <InstagramMockup project={project} imageLoaded={imageLoaded} onLoad={() => setImageLoaded(true)} />}
            {displayMode === 'phone' && <PhoneMockup project={project} imageLoaded={imageLoaded} onLoad={() => setImageLoaded(true)} />}
            <div className={`absolute inset-0 flex items-center justify-center gap-3 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${hovered ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
              {project.video ? <a href={sanitizeUrl(project.video)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-sm font-semibold"><Play size={14} /> Ver pieza</a> : <Link href={`/projects/${project.id}`} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-sm font-semibold"><ExternalLink size={14} /> Detalles</Link>}
            </div>
          </div>
          <div className="px-1 pb-1 pt-4">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent-cyan)] mb-1.5">{project.category}</div>
            <h3 className="text-lg font-display font-bold text-white">{project.title}</h3>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: .45, delay: Math.min(index * .06, .3) }} className={featured ? 'sm:col-span-2 lg:col-span-2' : ''}>
      <div ref={cardRef} className="group h-full rounded-2xl border border-white/[0.06] bg-white/[0.01] overflow-hidden" style={{ transition: 'transform .25s ease-out, border-color .3s' }} onMouseEnter={() => setHovered(true)} onMouseMove={handleMouseMove} onMouseLeave={handleLeave}>
        <div className={`relative overflow-hidden ${featured ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
          {!imageLoaded && <div className="absolute inset-0 bg-[var(--surface)] animate-pulse" />}
          <img src={project.image} alt={`${project.title} — ${project.category}`} loading="lazy" decoding="async" onLoad={() => setImageLoaded(true)} className={`h-full w-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${hovered ? 'scale-110 brightness-50' : 'scale-100 brightness-75'}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          
          {/* Tags overlay */}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-semibold uppercase tracking-wider text-white">{project.category}</span>
            {project.featured && <span className="px-2.5 py-1.5 rounded-full bg-[var(--accent-cyan)]/10 backdrop-blur-md text-[9px] font-bold uppercase tracking-wider text-[var(--accent-cyan)]">Featured</span>}
          </div>

          {/* Center action */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black shadow-2xl">
              <ArrowUpRight size={22} />
            </div>
          </div>
        </div>
        
        <div className="p-5">
          <div className="text-[9px] font-semibold uppercase tracking-widest text-gray-500 mb-2">{project.client || 'Personal'}</div>
          <h3 className="text-xl font-display font-bold text-white group-hover:text-[var(--accent-cyan)] transition-colors">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-gray-400 font-light">{project.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => <span key={tag} className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-[10px] font-medium text-gray-500">{tag}</span>)}
          </div>
        </div>
        <Link href={`/projects/${project.id}`} className="absolute inset-0 z-10"><span className="sr-only">Ver proyecto {project.title}</span></Link>
      </div>
    </motion.article>
  );
}
