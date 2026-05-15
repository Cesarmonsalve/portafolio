'use client';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProjectsGrid from '@/components/ProjectsGrid';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import { SiteConfigProvider, useSiteConfig } from '@/lib/SiteConfigContext';
import type { ReactElement } from 'react';

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });

/**
 * Inner component that reads config for section ordering, visibility, and global effects.
 */
function HomeContent() {
  const { cfg } = useSiteConfig();

  // Section registry
  const sections: { id: string; component: () => ReactElement; position: number; visible: boolean }[] = [
    { id: 'hero',     component: () => <Hero />,         position: cfg.section_hero?.position     ?? 0, visible: cfg.section_hero?.visible     ?? true },
    { id: 'projects', component: () => <ProjectsGrid />, position: cfg.section_projects?.position ?? 1, visible: cfg.section_projects?.visible ?? true },
    { id: 'about',    component: () => <About />,        position: cfg.section_about?.position    ?? 2, visible: cfg.section_about?.visible    ?? true },
    { id: 'skills',   component: () => <Skills />,       position: cfg.section_skills?.position   ?? 3, visible: cfg.section_skills?.visible   ?? true },
    { id: 'contact',  component: () => <Contact />,      position: cfg.section_contact?.position  ?? 4, visible: cfg.section_contact?.visible  ?? true },
  ];

  // Sort by position, filter hidden
  const ordered = sections
    .filter(s => s.visible)
    .sort((a, b) => a.position - b.position);

  return (
    <main className="relative">
      {cfg.show_cursor !== false && <CustomCursor />}
      {cfg.show_scroll_progress !== false && <ScrollProgress />}
      <Navbar />
      {ordered.map((s, i) => (
        <div key={s.id}>
          {s.component()}
          {/* Glow line divider between sections (skip after last) */}
          {i < ordered.length - 1 && <div className="glow-line max-w-[80%] mx-auto" />}
        </div>
      ))}
      <Footer />
    </main>
  );
}

export default function Home() {
  return (
    <SiteConfigProvider>
      <HomeContent />
    </SiteConfigProvider>
  );
}