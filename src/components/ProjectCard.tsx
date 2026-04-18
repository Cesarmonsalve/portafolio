'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Play, Image as ImageIcon } from 'lucide-react';
import type { Project } from '@/data/projects';

interface Props {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: Props) {
  const [hovered, setHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-surface border border-white/5 gradient-border">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-bg-tertiary">
          {!imageLoaded && (
            <div className="absolute inset-0 shimmer" />
          )}
          <img
            src={project.image}
            alt={project.title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              hovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Hover Overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-neon-red/20 border border-neon-red/30 px-3 py-1 rounded-full text-xs font-medium text-neon-red">
                {project.category}
              </span>
              {project.featured && (
                <span className="bg-neon-purple/20 border border-neon-purple/30 px-3 py-1 rounded-full text-xs font-medium text-neon-purple">
                  ⭐ Featured
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
                <Play size={14} />
                Ver Proyecto
              </button>
              {project.video && (
                <button className="w-10 h-10 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <ImageIcon size={16} />
                </button>
              )}
            </div>
          </motion.div>

          {/* Category tag (always visible) */}
          <div className="absolute top-4 left-4">
            <span className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-300">
              {project.category}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="font-display font-bold text-lg mb-2 group-hover:text-neon-red transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="bg-white/5 px-3 py-1 rounded-full text-xs text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}