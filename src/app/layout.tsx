import type { Metadata } from 'next';
import { getFullConfig } from '@/lib/config';
import ThemeApplier from '@/components/ThemeApplier';
import CommandPalette from '@/components/CommandPalette';
import ToastContainer from '@/components/ui/Toast';
import SmoothScroll from '@/components/SmoothScroll';
import { SiteConfigProvider } from '@/lib/SiteConfigContext';
import { SITE_URL } from './sitemap';
import './globals.css';

const TITLE = 'CM Design — Motion Graphics, Flyers & Branding Visual';
const DESCRIPTION =
  'Estudio de diseño visual especializado en motion graphics, flyers de evento y branding de alto impacto. Piezas cinematográficas que rompen el scroll y elevan marcas. Empieza tu proyecto hoy.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s · CM Design',
  },
  description: DESCRIPTION,
  applicationName: 'CM Design',
  authors: [{ name: 'CM Design' }],
  creator: 'CM Design',
  publisher: 'CM Design',
  keywords: [
    'motion graphics',
    'diseño de flyers',
    'flyer design',
    'gaming design',
    'diseño gráfico',
    'branding visual',
    'After Effects',
    'Cinema 4D',
    'diseñador motion graphics',
    'CM Design',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: 'CM Design',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CM Design — Motion Graphics & Visual Design',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: { telephone: false },
  category: 'design',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: 'CM Design',
                  description: DESCRIPTION,
                  inLanguage: 'es',
                  publisher: { '@id': `${SITE_URL}/#person` },
                },
                {
                  '@type': ['Person', 'ProfessionalService'],
                  '@id': `${SITE_URL}/#person`,
                  name: 'CM Design',
                  url: SITE_URL,
                  image: `${SITE_URL}/logo.png`,
                  jobTitle: 'Director Creativo · Motion Graphics & Visual Design',
                  description:
                    'Diseñador visual especializado en motion graphics, flyers de evento y branding de alto impacto.',
                  knowsAbout: [
                    'Motion Graphics',
                    'Diseño de Flyers',
                    'Branding Visual',
                    'After Effects',
                    'Cinema 4D',
                    'Gaming Design',
                  ],
                  makesOffer: {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Motion Graphics & Diseño Visual',
                      serviceType: 'Diseño gráfico y animación',
                    },
                  },
                },
              ],
            }),
          }}
        />
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