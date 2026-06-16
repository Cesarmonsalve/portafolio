'use client';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import ConversionCTA from '@/components/home/ConversionCTA';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import type { ReactElement } from 'react';

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });
const ProjectsGrid = dynamic(() => import('@/components/ProjectsGrid'), { ssr: false });
const FeaturedCases = dynamic(() => import('@/components/home/FeaturedCases'), { ssr: false });
const About = dynamic(() => import('@/components/About'), { ssr: false });
const Skills = dynamic(() => import('@/components/Skills'), { ssr: false });
const StorePreview = dynamic(() => import('@/components/home/StorePreview'), { ssr: false });
const Timeline = dynamic(() => import('@/components/home/Timeline'), { ssr: false });
const Contact = dynamic(() => import('@/components/Contact'), { ssr: false });

type SectionKey =
  | 'section_hero'
  | 'section_projects'
  | 'section_cases'
  | 'section_about'
  | 'section_skills'
  | 'section_store'
  | 'section_timeline'
  | 'section_contact';

const SECTION_COMPONENTS: Record<SectionKey, () => ReactElement> = {
  section_hero: () => <Hero />,
  section_projects: () => <ProjectsGrid />,
  section_cases: () => <FeaturedCases />,
  section_about: () => <About />,
  section_skills: () => <Skills />,
  section_store: () => <StorePreview />,
  section_timeline: () => <Timeline />,
  section_contact: () => <Contact />,
};

const SECTION_ORDER: SectionKey[] = [
  'section_hero',
  'section_projects',
  'section_cases',
  'section_about',
  'section_skills',
  'section_store',
  'section_timeline',
  'section_contact',
];

export default function Home() {
  const { cfg } = useSiteConfig();

  const ordered = SECTION_ORDER
    .map((key) => ({
      key,
      position: cfg[key]?.position ?? 0,
      visible: cfg[key]?.visible ?? true,
      render: SECTION_COMPONENTS[key],
    }))
    .filter((s) => s.visible)
    .sort((a, b) => a.position - b.position);

  return (
    <main id="main-content" className="relative pb-20 lg:pb-0">
      {cfg.show_cursor !== false && <CustomCursor />}
      {cfg.show_scroll_progress !== false && <ScrollProgress />}
      <Navbar />
      {ordered.map((s, i) => (
        <div key={s.key}>
          {s.render()}
          {i < ordered.length - 1 && <div className="glow-line mx-auto max-w-[80%]" />}
        </div>
      ))}
      <ConversionCTA />
      <Footer />
      <MobileBottomNav />
    </main>
  );
}
