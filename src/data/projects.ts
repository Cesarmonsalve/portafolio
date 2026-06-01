export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  video?: string;
  tags: string[];
  client?: string;
  featured?: boolean;
  display_mode?: 'default' | 'youtube' | 'spotify' | 'instagram' | 'phone';
}

export const initialProjects: Project[] = [
  {
    id: '1',
    title: 'DISTRICT 909 — Event Motion',
    category: 'Motion Graphics',
    description: 'Motion graphics cinematográfico para evento underground. Glitch effects, partículas de fuego y tipografía animada con estética urbana.',
    // Use the WebP version of the asset for better compression and faster loads
    image: '/WhatsApp Image 2026-03-30 at 5.28.21 AM (1).webp',
    tags: ['After Effects', 'Cinema 4D', 'Motion Design'],
    client: 'Evento Privado',
    featured: true,
  },
  {
    id: '2',
    title: 'MVP ARISE — Gaming Card',
    category: 'Graphic Design',
    description: 'Diseño de tarjeta MVP para torneo gaming. Estética neón púrpura con elementos dorados y composición premium.',
    // Replace heavy PNG with compressed WebP
    image: '/1.webp',
    tags: ['Photoshop', 'Illustrator', 'Gaming Design'],
    client: 'Torneo Gaming',
    featured: true,
  },
  {
    id: '3',
    title: 'AlarakoCup 2 — Tournament Flyer',
    category: 'Flyer Design',
    description: 'Flyer promocional para torneo Battle Royale con prize pool. Diseño de alto impacto con calavera y estética dark.',
    // Use compressed WebP
    image: '/ssstik.io_1774866683303.webp',
    tags: ['Photoshop', 'Flyer Design', 'Gaming'],
    client: 'AlarakoCup',
    featured: true,
  },
  {
    id: '4',
    title: 'Día Nacional del Rap — Tribute',
    category: 'Graphic Design',
    description: 'Diseño conmemorativo con texturas grunge, tipografía impactante y composición cinematográfica.',
    image: '/ssstik.io_1774866711452.webp',
    tags: ['Photoshop', 'Typography', 'Music'],
    client: 'Personal',
  },
  {
    id: '5',
    title: 'Compra de Oro — Commercial',
    category: 'Advertising',
    description: 'Pieza publicitaria para negocio de compra de oro. Render 3D fotorrealista con iluminación premium.',
    // Replace with compressed WebP
    image: '/oro.webp',
    tags: ['3D Render', 'Advertising', 'Photoshop'],
    client: 'Negocio Local',
  },
];

export const categories = ['Todos', 'Motion Graphics', 'Graphic Design', 'Flyer Design', 'Advertising', 'Video', 'Branding'];