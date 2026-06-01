import type { Metadata } from 'next';
import { getFullConfig } from '@/lib/config';
import ThemeApplier from '@/components/ThemeApplier';
import CommandPalette from '@/components/CommandPalette';
import ToastContainer from '@/components/ui/Toast';
import SmoothScroll from '@/components/SmoothScroll';
import { SiteConfigProvider } from '@/lib/SiteConfigContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'CM Design — Motion Graphics & Visual Design',
  description: 'Transformo conceptos en experiencias visuales de alto impacto. Motion graphics, flyers y diseño que rompe el scroll.',
  keywords: 'motion graphics, flyer design, gaming design, graphic design, After Effects, CM Design',
  openGraph: {
    title: 'CM Design — Motion Graphics & Visual Design',
    description: 'Portfolio de diseño visual, motion graphics y branding.',
    type: 'website',
    locale: 'es_VE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CM Design — Motion Graphics & Visual Design',
  },
};

// Tailwind alpha-value requiere componentes "R G B" (ej. 255 0 51)
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '255 255 255';
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cfg = await getFullConfig();

  return (
    <html lang="es" style={{
      '--theme-primary': hexToRgb(cfg.theme_primary || '#CBFE1C'),
      '--theme-secondary': hexToRgb(cfg.theme_secondary || '#8B5CF6'),
      '--theme-accent': hexToRgb(cfg.theme_accent || '#00E5FF'),
    } as React.CSSProperties}>
      <head>
        <meta name="theme-color" content="#0B0E13" />
      </head>
      <body className="bg-bg antialiased">
        <SiteConfigProvider>
          <SmoothScroll>
            <ThemeApplier />
            <CommandPalette />
            <ToastContainer />
            <div className="scanlines hidden md:block" />
            <div className="grain-overlay hidden md:block" />
            {children}
          </SmoothScroll>
        </SiteConfigProvider>
      </body>
    </html>
  );
}