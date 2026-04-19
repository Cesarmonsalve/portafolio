'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { getProjects, type Project } from '@/lib/config';
import { initialProjects } from '@/data/projects';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const projects = await getProjects();
      const allProjects = projects.length > 0 ? projects : initialProjects;
      const found = allProjects.find(p => p.id === id);
      setProject(found || null);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-neon-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-heading text-2xl text-gray-600 mb-4">Proyecto no encontrado</h1>
          <Link href="/" className="text-neon-red hover:underline text-sm">← Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/#work" className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-xs mb-8 transition-colors tracking-wide" data-cursor-hover>
          <ArrowLeft size={14} />
          Volver a trabajos
        </Link>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-label text-neon-red text-[10px]">{project.category}</span>
          <h1 className="text-display text-3xl md:text-4xl mt-3 mb-5">{project.title}</h1>
          {project.client && <p className="text-caption mb-6">Cliente: {project.client}</p>}

          {/* Media */}
          <div className="rounded-2xl overflow-hidden mb-8 border border-white/[0.04]">
            {project.video ? (
              <video src={project.video} controls className="w-full" />
            ) : (
              <img src={project.image} alt={project.title} className="w-full" />
            )}
          </div>

          <p className="text-gray-300 leading-body text-sm mb-8">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map(tag => (
              <span key={tag} className="bg-white/[0.03] px-3 py-1.5 rounded-full text-[11px] text-gray-400">{tag}</span>
            ))}
          </div>

          {project.featured && (
            <div className="bg-neon-purple/[0.06] border border-neon-purple/10 rounded-xl px-5 py-3 inline-flex items-center gap-2">
              <span>⭐</span>
              <span className="text-xs font-medium text-neon-purple">Proyecto destacado</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}