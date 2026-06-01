import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CM Design — Motion Graphics & Visual Design',
    short_name: 'CM Design',
    description:
      'Motion graphics, flyers de evento y branding visual de alto impacto. Diseño que rompe el scroll.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0E13',
    theme_color: '#0B0E13',
    lang: 'es',
    categories: ['design', 'graphics', 'portfolio'],
    icons: [
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/logo.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
