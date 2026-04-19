'use client';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProjectsGrid from '@/components/ProjectsGrid';
import VideoShowcase from '@/components/VideoShowcase';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false });

export default function Home() {
  return (
    <main className="relative">
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <div className="glow-line max-w-[80%] mx-auto" />
      <ProjectsGrid />
      <div className="glow-line max-w-[80%] mx-auto" />
      <VideoShowcase />
      <div className="glow-line max-w-[80%] mx-auto" />
      <About />
      <Skills />
      <div className="glow-line max-w-[80%] mx-auto" />
      <Contact />
      <Footer />
    </main>
  );
}