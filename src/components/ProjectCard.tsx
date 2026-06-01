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
    cardRef.current.style.transform = `perspective(900px) rotateX(${(y - .5) * -5}deg) rotateY(${(x - .5) * 5}deg) translateY(-5px)`;
  };
  const handleLeave = () => {
    setHovered(false);
    if (cardRef.current) cardRef.current.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
  };

  if (themed) {
    return (
      <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-35px' }} transition={{ duration: .45, delay: Math.min(index * .06, .3) }} className={featured ? 'sm:col-span-2' : ''}>
        <div ref={cardRef} className="project-arena-card p-3" style={{ transition: 'transform .18s ease-out' }} onMouseEnter={() => setHovered(true)} onMouseMove={handleMouseMove} onMouseLeave={handleLeave}>
          <div className="relative overflow-hidden angle-frame-sm">
            {displayMode === 'youtube' && <YouTubeMockup project={project} imageLoaded={imageLoaded} onLoad={() => setImageLoaded(true)} />}
            {displayMode === 'spotify' && <SpotifyMockup project={project} imageLoaded={imageLoaded} onLoad={() => setImageLoaded(true)} />}
            {displayMode === 'instagram' && <InstagramMockup project={project} imageLoaded={imageLoaded} onLoad={() => setImageLoaded(true)} />}
            {displayMode === 'phone' && <PhoneMockup project={project} imageLoaded={imageLoaded} onLoad={() => setImageLoaded(true)} />}
            <div className={`absolute inset-0 flex items-center justify-center gap-3 bg-black/65 backdrop-blur-sm transition-opacity ${hovered ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
              {project.video ? <a href={sanitizeUrl(project.video)} target="_blank" rel="noopener noreferrer" className="acid-button !px-4 !py-3"><Play size={14} /> Ver pieza</a> : <Link href={`/projects/${project.id}`} className="acid-button !px-4 !py-3"><ExternalLink size={14} /> Detalles</Link>}
            </div>
          </div>
          <div className="px-2 pb-1 pt-4">
            <div className="acid-kicker mb-2">{project.category}</div>
            <h3 className="text-lg font-black uppercase leading-tight text-white">{project.title}</h3>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-35px' }} transition={{ duration: .45, delay: Math.min(index * .06, .3) }} className={featured ? 'sm:col-span-2 lg:col-span-2' : ''}>
      <div ref={cardRef} className="project-arena-card group h-full" style={{ transition: 'transform .18s ease-out, border-color .38s ease, box-shadow .38s ease' }} onMouseEnter={() => setHovered(true)} onMouseMove={handleMouseMove} onMouseLeave={handleLeave} data-cursor-hover>
        <div className={`relative overflow-hidden ${featured ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
          {!imageLoaded && <div className="absolute inset-0 shimmer bg-surface" />}
          <img src={project.image} alt={`${project.title} — ${project.category} por CM Design`} loading="lazy" decoding="async" onLoad={() => setImageLoaded(true)} className={`h-full w-full object-cover transition duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${hovered ? 'scale-110 brightness-[.42]' : 'scale-100 brightness-[.8]'}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E13] via-[#0B0E13]/30 to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span className="angle-frame-sm bg-neon-red px-3 py-1.5 text-[9px] font-black uppercase tracking-[.14em] text-[#0B0E13]">{project.category}</span>
            {project.featured && <span className="angle-frame-sm border border-white/20 bg-black/40 px-2.5 py-1.5 text-[8px] font-black uppercase tracking-[.12em] text-white backdrop-blur">Selected</span>}
          </div>
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex h-14 w-14 items-center justify-center border border-neon-red bg-neon-red text-[#0B0E13] shadow-[0_0_26px_rgba(203,254,28,.22)] angle-frame-sm"><ArrowUpRight size={22} /></div>
          </div>
        </div>
        <div className="p-5">
          <div className="mb-2 text-[9px] font-black uppercase tracking-[.2em] text-neon-red">{project.client || 'CM Design Studio'}</div>
          <h3 className="text-xl font-black uppercase leading-[1.03] text-white transition group-hover:text-neon-red">{project.title}</h3>
          <p className="mt-3 line-clamp-2 text-xs leading-6 text-gray-400">{project.description}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => <span key={tag} className="border border-white/[0.08] bg-white/[0.025] px-2 py-1 text-[9px] font-bold uppercase tracking-[.08em] text-gray-500 angle-frame-sm">{tag}</span>)}
          </div>
        </div>
        <Link href={`/projects/${project.id}`} className="absolute inset-0 z-10"><span className="sr-only">Ver proyecto {project.title}</span></Link>
      </div>
    </motion.article>
  );
}
