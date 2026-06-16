'use client';
import dynamic from 'next/dynamic';
import FloatingDock from '@/components/FloatingDock';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';

import { useSiteConfig } from '@/lib/SiteConfigContext';
import type { ReactElement } from 'react';

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });
const ProjectsGrid = dynamic(() => import('@/components/ProjectsGrid'), { ssr: false });
const About = dynamic(() => import('@/components/About'), { ssr: false });
const Skills = dynamic(() => import('@/components/Skills'), { ssr: false });
const Contact = dynamic(() => import('@/components/Contact'), { ssr: false });
const TimelineControl = dynamic(() => import('@/components/TimelineControl'), { ssr: false });
const TestimonialsWall = dynamic(() => import('@/components/TestimonialsWall'), { ssr: false });
const WorkflowVisualizer = dynamic(() => import('@/components/WorkflowVisualizer'), { ssr: false });
const LabSection = dynamic(() => import('@/components/LabSection'), { ssr: false });

type SectionKey =
  | 'section_hero'
  | 'section_projects'
  | 'section_about'
  | 'section_skills'
  | 'section_workflow'
  | 'section_timeline'
  | 'section_testimonials'
  | 'section_lab'
  | 'section_contact';

const SECTION_COMPONENTS: Record<SectionKey, () => ReactElement> = {
  section_hero: () => <Hero />,
  section_projects: () => <ProjectsGrid />,
  section_about: () => <About />,
  section_skills: () => <Skills />,
  section_workflow: () => <WorkflowVisualizer />,
  section_timeline: () => <TimelineControl />,
  section_testimonials: () => <TestimonialsWall />,
  section_lab: () => <LabSection />,
  section_contact: () => <Contact />,
};

const SECTION_ORDER: SectionKey[] = [
  'section_hero',
  'section_projects',
  'section_about',
  'section_skills',
  'section_workflow',
  'section_timeline',
  'section_testimonials',
  'section_lab',
  'section_contact',
];

export default function Home() {
  const { cfg } = useSiteConfig();

  const ordered = SECTION_ORDER
    .map((key) => ({
      key,
      position: (cfg as any)[key]?.position ?? 0,
      visible: (cfg as any)[key]?.visible ?? true,
      render: SECTION_COMPONENTS[key],
    }))
    .filter((s) => s.visible)
    .sort((a, b) => a.position - b.position);

  return (
    <main id="main-content" className="relative pb-20 lg:pb-0 bg-black">
      {cfg.show_cursor !== false && <CustomCursor />}
      {cfg.show_scroll_progress !== false && <ScrollProgress />}
      <FloatingDock />
      {ordered.map((s, i) => (
        <div key={s.key}>
          {s.render()}
          {i < ordered.length - 1 && (
            <div className="h-[1px] bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mx-auto max-w-[80%]" />
          )}
        </div>
      ))}
      <Footer />
    </main>
  );
}
