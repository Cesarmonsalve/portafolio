import { Metadata } from 'next';
import GalleryGrid from '@/components/GalleryGrid';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Galería de Trabajos - CM Design',
  description: 'Explora la colección completa de proyectos, diseños visuales, motion graphics y campañas de César Monsalve.',
};

export default function GaleriaPage() {
  return (
    <main className="bg-bg">
      <Navbar />
      <GalleryGrid />
    </main>
  );
}
