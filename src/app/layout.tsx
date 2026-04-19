import type { Metadata } from 'next';
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#060606" />
      </head>
      <body className="bg-bg antialiased">
        <div className="scanlines" />
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}