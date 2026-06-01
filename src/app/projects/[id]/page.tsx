'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Layers3 } from 'lucide-react';
import { getProjects, type Project } from '@/lib/config';
import { initialProjects } from '@/data/projects';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const projects = await getProjects();
      setProject((projects.length ? projects : initialProjects).find((item) => item.id === params.id) || null);
      setLoading(false);
    })();
  }, [params.id]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-bg"><div className="h-8 w-8 animate-spin border-2 border-neon-red border-t-transparent" /></div>;
  if (!project) return <div className="flex min-h-screen items-center justify-center bg-bg px-6"><div className="acid-panel angle-frame max-w-lg p-9 text-center"><h1 className="text-2xl font-black uppercase text-white">Proyecto no encontrado</h1><Link href="/#work" className="ghost-button mt-6"><ArrowLeft size={14} /> Volver a trabajos</Link></div></div>;

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg px-5 py-10 md:px-8 md:py-14">
      <div className="arena-grid absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-6xl">
        <Link href="/#work" className="ghost-button !px-4 !py-3"><ArrowLeft size={14} /> Volver a trabajos</Link>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mt-8 grid gap-7 lg:grid-cols-[1.15fr_.85fr]">
          <div className="acid-panel angle-frame overflow-hidden p-3">
            <div className="relative overflow-hidden bg-black angle-frame-sm">
              {project.video && (project.video.endsWith('.mp4') || project.video.endsWith('.webm')) ? <video src={project.video} controls className="w-full" /> : <img src={project.image} alt={project.title} className="w-full object-cover" />}
            </div>
          </div>
          <aside className="acid-panel angle-frame p-6 md:p-8">
            <div className="flex items-center gap-3"><span className="h-px w-10 bg-neon-red" /><span className="acid-kicker">{project.category}</span></div>
            <h1 className="mt-5 text-4xl font-black uppercase leading-[.94] tracking-[-.045em] text-white md:text-5xl">{project.title}</h1>
            {project.client && <div className="mt-5 text-[10px] font-black uppercase tracking-[.16em] text-gray-500">Cliente // <span className="text-neon-red">{project.client}</span></div>}
            <p className="mt-7 border-l-2 border-neon-red/60 pl-4 text-sm leading-7 text-gray-400">{project.description}</p>
            <div className="mt-7 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="border border-white/[0.1] bg-white/[0.025] px-3 py-2 text-[9px] font-black uppercase tracking-[.12em] text-gray-400 angle-frame-sm">{tag}</span>)}</div>
            {project.video && <a href={project.video} target="_blank" rel="noopener noreferrer" className="acid-button mt-8"><Layers3 size={15} /> Ver pieza completa <ArrowUpRight size={15} /></a>}
          </aside>
        </motion.div>
      </div>
    </main>
  );
}
