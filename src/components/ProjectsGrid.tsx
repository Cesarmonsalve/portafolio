'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Film, Image as ImageIcon } from 'lucide-react';
import SectionWrapper from './SectionWrapper';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { initialProjects } from '@/data/projects';
import TiltCard from './ui/TiltCard';
import { HEADING_SIZE_MAP, DEFAULT_SECTION_VISUAL, Project } from '@/lib/config';

// Helper to determine if project is video (for icon)
const isVideoProject = (project: Project): boolean => {
  if (!project.video || project.video.trim() === '') return false;
  const url = project.video.trim().toLowerCase();
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com') || 
         url.includes('drive.google.com') || url.includes('.mp4') || url.includes('.webm');
};

export default function ProjectsGrid() {
  const { projects: contextProjects, cfg } = useSiteConfig();
  const projects = contextProjects.length > 0 ? contextProjects : initialProjects;
  const hCls = HEADING_SIZE_MAP[cfg.heading_size] || HEADING_SIZE_MAP.md;
  const visual = cfg.section_projects || DEFAULT_SECTION_VISUAL;

  // Split projects for the double marquee layout
  const mid = Math.ceil(projects.length / 2);
  const row1 = projects.slice(0, mid);
  const row2 = projects.slice(mid);

  // Duplicate items for seamless infinite scroll
  const marqueeRow1 = [...row1, ...row1, ...row1];
  const marqueeRow2 = [...row2, ...row2, ...row2];

  return (
    <SectionWrapper id="work" visual={visual} className="py-20 md:py-28 overflow-hidden">
      {/* Background orb */}
      <div className="floating-orb" style={{ width: 300, height: 300, top: '30%', right: '-10%', background: 'var(--neon-red)' }} />

      <div className="max-w-[100vw] relative z-10">
        {/* Header (Centered) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 px-6 max-w-3xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-10 h-[1px] bg-neon-red"></span>
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neon-red">{cfg.projects_label}</span>
            <span className="w-10 h-[1px] bg-neon-red"></span>
          </div>
          
          <h2
            className={`font-bold mb-6 leading-tight ${hCls}`}
            style={{ fontFamily: `${cfg.font_display}, sans-serif` }}
          >
            {cfg.projects_heading}
          </h2>
          
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mx-auto max-w-2xl">
            {cfg.projects_desc}
          </p>
        </motion.div>

        {/* ═══ MARQUEE CAROUSEL ═══ */}
        <div className="flex flex-col gap-6 md:gap-8 mt-10">
          
          {/* Row 1: Fast Marquee (Left to Right) */}
          <div className="w-full overflow-hidden flex" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
            <div className="animate-marquee-fast flex gap-4 md:gap-6 px-2 md:px-3">
              {marqueeRow1.map((project, index) => (
                <Link href={`/projects/${project.id}`} key={`${project.id}-r1-${index}`} className="group block shrink-0" data-cursor-hover>
                  <TiltCard maxTilt={5} scale={1.01}>
                    <div className="w-[280px] md:w-[380px] aspect-video relative rounded-2xl md:rounded-3xl overflow-hidden bg-surface border border-white/[0.04] transition-all duration-500 hover:border-neon-red/30">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                      
                      {/* Media Type Icon */}
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-white z-20">
                        {isVideoProject(project) ? <Film size={14} /> : <ImageIcon size={14} />}
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="bg-neon-red/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[9px] font-bold text-white tracking-widest uppercase mb-3 inline-block shadow-[0_0_15px_rgba(255,0,51,0.3)]">
                          {project.category}
                        </span>
                        <h3 className="font-display font-bold text-lg md:text-xl text-white leading-tight group-hover:text-neon-red transition-colors truncate">
                          {project.title}
                        </h3>
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              ))}
            </div>
          </div>

          {/* Row 2: Reverse Marquee (Right to Left) */}
          {row2.length > 0 && (
            <div className="w-full overflow-hidden flex" style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}>
              <div className="animate-marquee-reverse flex gap-4 md:gap-6 px-2 md:px-3">
                {marqueeRow2.map((project, index) => (
                  <Link href={`/projects/${project.id}`} key={`${project.id}-r2-${index}`} className="group block shrink-0" data-cursor-hover>
                    <TiltCard maxTilt={5} scale={1.01}>
                      <div className="w-[280px] md:w-[380px] aspect-video relative rounded-2xl md:rounded-3xl overflow-hidden bg-surface border border-white/[0.04] transition-all duration-500 hover:border-neon-red/30">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                        
                        {/* Media Type Icon */}
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-white z-20">
                          {isVideoProject(project) ? <Film size={14} /> : <ImageIcon size={14} />}
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <span className="bg-neon-red/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[9px] font-bold text-white tracking-widest uppercase mb-3 inline-block shadow-[0_0_15px_rgba(255,0,51,0.3)]">
                            {project.category}
                          </span>
                          <h3 className="font-display font-bold text-lg md:text-xl text-white leading-tight group-hover:text-neon-red transition-colors truncate">
                            {project.title}
                          </h3>
                        </div>
                      </div>
                    </TiltCard>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* View All Gallery Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link href="/galeria" className="inline-flex items-center gap-3 group bg-white/[0.03] border border-white/[0.08] hover:bg-neon-red hover:border-neon-red px-8 py-4 rounded-full transition-all duration-300">
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-colors">Ver Galería Completa</span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
              <ArrowRight size={14} className="text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
