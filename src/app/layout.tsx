import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CM Design — Motion Graphics & Flyer Design',
  description: 'Transformo conceptos en experiencias visuales de alto impacto. Motion graphics, flyers y diseño que rompe el scroll.',
  keywords: 'motion graphics, flyer design, gaming design, graphic design, After Effects',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-bg antialiased">
        <div className="scanlines" />
        {children}
      </body>
    </html>
  );
}