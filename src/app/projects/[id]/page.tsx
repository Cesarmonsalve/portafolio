'use client';
import { use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { initialProjects } from '@/data/projects';

function getProjects() {
  if (typeof window === 'undefined') return initialProjects;
  const stored = localStorage.getItem('cm_projects');
  if (stored) { try { return JSON.parse(stored); } catch {} }
  return initialProjects;
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const projects = getProjects();
  const project = projects.find(p => p.id === id) || initialProjects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-black text-gray-700 mb-4">Proyecto no encontrado</h1>
          <Link href="/" className="text-neon-red hover:underline">← Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Link href="/#work" className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} />
          Volver a trabajos
        </Link>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-neon-red text-xs font-bold tracking-[0.3em] uppercase">{project.category}</span>
          <h1 className="font-display text-4xl md:text-6xl font-black mt-4 mb-6">{project.title}</h1>
          {project.client && <p className="text-gray-500 mb-8">Cliente: {project.client}</p>}

          {/* Media */}
          <div className="rounded-2xl overflow-hidden mb-8 border border-white/5">
            {project.video ? (
              <video src={project.video} controls className="w-full" />
            ) : (
              <img src={project.image} alt={project.title} className="w-full" />
            )}
          </div>

          <p className="text-gray-300 leading-relaxed text-lg mb-8">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map(tag => (
              <span key={tag} className="bg-white/5 px-4 py-2 rounded-full text-xs text-gray-400">{tag}</span>
            ))}
          </div>

          {project.featured && (
            <div className="bg-neon-purple/10 border border-neon-purple/20 rounded-xl px-6 py-4 inline-flex items-center gap-2">
              <span>⭐</span>
              <span className="text-sm font-medium text-neon-purple">Proyecto destacado</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}