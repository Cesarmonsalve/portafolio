import { initialProjects } from '../data/projects';

export type DisplayMode = 'default' | 'youtube' | 'spotify' | 'instagram' | 'phone';

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
  display_mode?: DisplayMode;
  created_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  icon: string;
  category: string;
  position: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  enabled: boolean;
  position: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface StoreItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  tags: string[];
  emoji: string;
  image?: string;
  downloadLinks: { platform: string; url: string; color: string }[];
  paymentUrl?: string;
  badge?: string;
  position?: number;
}

export interface LottieSlot {
  source: string;
  enabled: boolean;
  speed: number;
  opacity: number;
}

export const DEFAULT_LOTTIE: LottieSlot = {
  source: '',
  enabled: false,
  speed: 1,
  opacity: 0.6,
};

// ═══════════════════════════════════════════
// SECTION BACKGROUND — per-section bg control
// ═══════════════════════════════════════════

export interface SectionBackground {
  type: 'color' | 'gradient' | 'image' | 'video';
  color: string;
  gradient: string;
  imageUrl: string;
  videoUrl: string;
  mediaOpacity: number;   // 0-100
  overlayColor: string;
  overlayOpacity: number; // 0-100
}

export const DEFAULT_SECTION_BG: SectionBackground = {
  type: 'color',
  color: '#0B0E13',
  gradient: '',
  imageUrl: '',
  videoUrl: '',
  mediaOpacity: 40,
  overlayColor: '#000000',
  overlayOpacity: 60,
};

// ═══════════════════════════════════════════
// SECTION EFFECTS — per-section visual fx
// ═══════════════════════════════════════════

export interface SectionEffects {
  parallax: boolean;
  parallaxIntensity: number; // 0-100
  particles: boolean;
  particleCount: number;
  particleColor: string;
  grain: boolean;
  grainOpacity: number; // 0-100
  floatingOrbs: boolean;
  orbColors: string[];
}

export const DEFAULT_SECTION_FX: SectionEffects = {
  parallax: false,
  parallaxIntensity: 30,
  particles: false,
  particleCount: 25,
  particleColor: '#ffffff',
  grain: false,
  grainOpacity: 3,
  floatingOrbs: false,
  orbColors: ['#818cf8', '#c084fc', '#60a5fa'],
};

// ═══════════════════════════════════════════
// SECTION CONFIG — visibility, order, bg, fx
// ═══════════════════════════════════════════

export interface SectionVisual {
  visible: boolean;
  position: number;
  background: SectionBackground;
  effects: SectionEffects;
}

export const DEFAULT_SECTION_VISUAL: SectionVisual = {
  visible: true,
  position: 0,
  background: { ...DEFAULT_SECTION_BG },
  effects: { ...DEFAULT_SECTION_FX },
};

// ═══════════════════════════════════════════
// SITE CONFIG — Full definition
// ═══════════════════════════════════════════

export interface SiteConfig {
  // ── Hero ──
  hero_name: string;
  hero_name_type?: 'text' | 'image';
  hero_name_image?: string;
  hero_name_align?: 'left' | 'center' | 'right';
  hero_name_scale?: number;

  hero_subtitle: string;
  hero_description: string;
  hero_badge: string;
  hero_stats: { value: string; label: string }[];
  hero_rotating_texts: string[];

  // ── Command Center ──
  command_center_tools: string[];
  command_center_label: string;

  // ── About ──
  about_title: string;
  about_heading: string;
  about_heading_type?: 'text' | 'image';
  about_heading_image?: string;
  about_heading_align?: 'left' | 'center' | 'right';
  about_heading_scale?: number;

  about_label: string;
  about_bio: string;
  about_bio_extended: string;
  about_specialties: { title: string; desc: string }[];
  about_photo: string;
  about_job_title: string;
  about_stats: { value: string; label: string }[];

  // ── Skills ──
  skills_heading: string;
  skills_label: string;
  skills_desc: string;

  // ── Contact ──
  contact_heading: string;
  contact_label: string;
  contact_desc: string;

  // ── Footer ──
  footer_brand: string;
  footer_brand_sub: string;
  footer_text: string;

  // ── Projects heading ──
  projects_heading: string;
  projects_label: string;
  projects_desc: string;

  // ── Store ──
  store_heading: string;
  store_label: string;
  store_desc: string;

  // ── Timeline & Cases ──
  timeline_heading: string;
  timeline_items: { year: string; title: string; desc: string }[];
  cases_heading: string;
  cases_label: string;

  // ── Workflow & Lab ──
  workflow_steps: { title: string; desc: string; icon: string; accent: string }[];
  lab_experiments: { title: string; desc: string; status: string; tags: string[] }[];

  // ── General ──
  logo_url: string;
  favicon_url: string;
  contact_email: string;
  contact_whatsapp: string;

  // ── Payments ──
  payment_methods: {
    paypal: string;
    zinli: string;
    binance: string;
    pago_movil: string;
    nequi: string;
    whatsapp: string;
  };

  // ── Theme ──
  theme_primary: string;
  theme_secondary: string;
  theme_accent: string;
  heading_size: string;       // 'sm' | 'md' | 'lg' | 'xl'
  font_display: string;      // e.g. 'Syne'
  font_body: string;         // e.g. 'Inter'

  // ── Marquee ──
  marquee_items: string[];
  marquee_style: string; // 'minimal' | 'neon' | 'lasso' | 'cyberpunk' | 'glitch'

  // ── Global Effects ──
  show_cursor: boolean;
  show_scroll_progress: boolean;
  show_scanlines: boolean;
  show_grain: boolean;

  // ── Section visuals ──
  section_hero: SectionVisual;
  section_projects: SectionVisual;
  section_about: SectionVisual;
  section_skills: SectionVisual;
  section_contact: SectionVisual;
  section_store: SectionVisual;
  section_timeline: SectionVisual;
  section_cases: SectionVisual;
  section_workflow: SectionVisual;
  section_testimonials: SectionVisual;
  section_lab: SectionVisual;

  // ── Lottie ──
  lottie_hero: LottieSlot;
  lottie_about: LottieSlot;
  lottie_skills: LottieSlot;
  lottie_projects: LottieSlot;
  lottie_contact: LottieSlot;
  lottie_footer: LottieSlot;
}

export const DEFAULT_CONFIG: SiteConfig = {
  hero_name: 'CM DESIGN',
  hero_name_type: 'text',
  hero_name_image: '',
  hero_name_align: 'center',
  hero_name_scale: 100,
  
  hero_subtitle: 'Motion Graphics & Visual Design',
  hero_description: 'Transformo conceptos en experiencias visuales de alto impacto. Diseño que rompe el scroll y construye atmósferas que elevan marcas.',
  hero_badge: 'Motion Graphics & Flyer Design',
  hero_stats: [
    { value: '50+', label: 'Proyectos' },
    { value: '30+', label: 'Clientes' },
    { value: '3+', label: 'Años Exp.' },
  ],
  hero_rotating_texts: [
    'Motion Designer',
    'Graphic Designer',
    'Video Editor',
    'Creative Director'
  ],

  command_center_tools: ['After Effects', 'Cinema 4D', 'Premiere Pro', 'Illustrator'],
  command_center_label: 'Campañas',

  about_title: 'Diseñador Visual',
  about_heading: 'Impulsando la visión detrás del diseño',
  about_heading_type: 'text',
  about_heading_image: '',
  about_heading_align: 'left',
  about_heading_scale: 100,

  about_label: 'Sobre Mí',
  about_bio: 'Soy CM Design — un diseñador visual especializado en motion graphics y diseño de flyers que capturan la atención desde el primer frame.',
  about_bio_extended: 'Mi enfoque combina una estética cinematográfica con una ejecución técnica precisa. No solo diseño piezas; construyo atmósferas visuales que elevan la identidad de marcas y comunidades competitivas.',
  about_specialties: [
    { title: 'Motion Graphics', desc: 'Animaciones que capturan y retienen' },
    { title: 'Flyer Design', desc: 'Diseños de alto impacto para eventos' },
    { title: 'Branding Visual', desc: 'Identidades que comunican poder' },
  ],
  about_photo: '',
  about_job_title: 'Director Creativo',
  about_stats: [
    { value: '5+', label: 'Años de Exp.' },
    { value: '100+', label: 'Proyectos' },
    { value: 'Global', label: 'Disponibilidad' },
  ],

  skills_heading: 'Dominio Técnico',
  skills_label: 'Expertise',
  skills_desc: 'Herramientas de nivel profesional que utilizo para dar vida a ideas complejas en animación y diseño.',

  contact_heading: '¿Tienes una idea en mente?',
  contact_label: 'Contacto',
  contact_desc: 'Estoy disponible para nuevos proyectos y colaboraciones creativas. Cuéntame sobre tu visión y hagámosla realidad juntos.',

  footer_brand: 'CM Design Studio',
  footer_brand_sub: 'Diseño & Movimiento',
  footer_text: 'Diseñado con ❤ por CM',

  projects_heading: 'Trabajos Destacados',
  projects_label: 'Portfolio',
  projects_desc: 'Una selección curada de mis mejores proyectos en diseño y animación.',

  store_heading: 'Recursos Gratuitos',
  store_label: 'Tienda CM Design',
  store_desc: 'Templates, presets y assets para elevar tus diseños. Descarga directa desde Mediafire y Google Drive.',

  timeline_heading: 'Evolución creativa',
  timeline_items: [
    { year: '2021', title: 'Primeros motion graphics', desc: 'Inicio en animación para eventos y gaming.' },
    { year: '2022', title: 'Branding competitivo', desc: 'Identidades visuales para equipos y organizadores.' },
    { year: '2023', title: 'Expansión global', desc: 'Clientes internacionales y piezas cinematográficas.' },
    { year: '2024', title: 'CM Design Studio', desc: 'Portafolio premium + recursos para la comunidad.' },
    { year: '2025', title: 'Arena visual', desc: 'Experiencias inmersivas y tienda de assets.' },
  ],
  cases_heading: 'Proyectos que definieron el estándar',
  cases_label: 'Casos de estudio',

  workflow_steps: [
    { title: 'Descubrimiento', desc: 'Análisis profundo de necesidades, marca, audiencia y objetivos del proyecto. Investigación de mercado y benchmarking.', icon: 'Search', accent: '#60a5fa' },
    { title: 'Estrategia', desc: 'Definición de la dirección creativa, wireframes conceptuales y arquitectura de información.', icon: 'Lightbulb', accent: '#818cf8' },
    { title: 'Diseño', desc: 'Creación visual con UI premium, motion design y prototipos interactivos de alta fidelidad.', icon: 'Palette', accent: '#c084fc' },
    { title: 'Producción', desc: 'Ejecución visual, animación cuadro por cuadro y renderizado optimizado.', icon: 'Code2', accent: '#60a5fa' },
    { title: 'Optimización', desc: 'Renderizado final, color grading, diseño sonoro y entrega de masters en alta resolución.', icon: 'BarChart3', accent: '#818cf8' },
  ],

  lab_experiments: [
    { title: 'CGI Product Reveal', desc: 'Exploración de iluminación y texturas 3D aplicadas a revelación de productos.', status: 'En progreso', tags: ['C4D', 'Octane', 'After Effects'] },
    { title: 'Kinetic Typography', desc: 'Sistemas de tipografía animada para títulos de crédito cinematográficos.', status: 'Concepto', tags: ['Typography', 'Motion', 'Design'] },
    { title: 'VFX Compositing', desc: 'Integración de elementos CGI en metraje real con corrección de color avanzada.', status: 'Beta', tags: ['Nuke', 'Premiere', 'VFX'] },
    { title: 'Design Token Engine', desc: 'Motor de generación automática de paletas dinámicas y sistemas de color.', status: 'Concepto', tags: ['Design', 'Color', 'Branding'] },
  ],

  logo_url: '/logo.png',
  favicon_url: '/favicon.ico',
  contact_email: 'cm@design.com',
  contact_whatsapp: 'https://wa.me/1234567890',

  payment_methods: {
    paypal: '',
    zinli: '',
    binance: '',
    pago_movil: '',
    nequi: '',
    whatsapp: '',
  },

  theme_primary: '#818cf8',
  theme_secondary: '#c084fc',
  theme_accent: '#60a5fa',
  heading_size: 'md',
  font_display: 'Syne',
  font_body: 'Inter',

  marquee_items: ['Motion Graphics', 'Visual Design', 'Branding', 'Flyer Design', 'After Effects', '3D Animation', 'Cinema 4D', 'Video Editing'],
  marquee_style: 'cyberpunk',

  show_cursor: true,
  show_scroll_progress: true,
  show_scanlines: false,
  show_grain: true,

  section_hero:     { visible: true, position: 0, background: { ...DEFAULT_SECTION_BG },                                               effects: { ...DEFAULT_SECTION_FX, particles: true, particleCount: 28, floatingOrbs: true } },
  section_projects: { visible: true, position: 1, background: { ...DEFAULT_SECTION_BG },                                               effects: { ...DEFAULT_SECTION_FX } },
  section_about:    { visible: true, position: 2, background: { ...DEFAULT_SECTION_BG, color: '#0a0a0a' },                              effects: { ...DEFAULT_SECTION_FX } },
  section_skills:   { visible: true, position: 3, background: { ...DEFAULT_SECTION_BG },                                               effects: { ...DEFAULT_SECTION_FX } },
  section_workflow: { visible: true, position: 4, background: { ...DEFAULT_SECTION_BG, color: '#000000' },                              effects: { ...DEFAULT_SECTION_FX } },
  section_timeline: { visible: true, position: 5, background: { ...DEFAULT_SECTION_BG, color: '#0a0a0a' },                              effects: { ...DEFAULT_SECTION_FX } },
  section_testimonials: { visible: true, position: 6, background: { ...DEFAULT_SECTION_BG, color: '#000000' },                          effects: { ...DEFAULT_SECTION_FX } },
  section_lab:      { visible: true, position: 7, background: { ...DEFAULT_SECTION_BG, color: '#0a0a0a' },                              effects: { ...DEFAULT_SECTION_FX } },
  section_contact:  { visible: true, position: 8, background: { ...DEFAULT_SECTION_BG, color: '#000000' },                              effects: { ...DEFAULT_SECTION_FX } },
  section_store:    { visible: false, position: 9, background: { ...DEFAULT_SECTION_BG, color: '#000000' },                              effects: { ...DEFAULT_SECTION_FX, particles: true, particleCount: 30 } },
  section_cases:    { visible: false, position: 10, background: { ...DEFAULT_SECTION_BG, color: '#0a0a0a' },                            effects: { ...DEFAULT_SECTION_FX, parallax: true, parallaxIntensity: 20 } },

  lottie_hero:     { ...DEFAULT_LOTTIE },
  lottie_about:    { ...DEFAULT_LOTTIE },
  lottie_skills:   { ...DEFAULT_LOTTIE },
  lottie_projects: { ...DEFAULT_LOTTIE },
  lottie_contact:  { ...DEFAULT_LOTTIE },
  lottie_footer:   { ...DEFAULT_LOTTIE },
};

// ═══════════════════════════════════════════
// HEADING SIZE MAP
// ═══════════════════════════════════════════

export const HEADING_SIZE_MAP: Record<string, string> = {
  sm: 'text-xl md:text-2xl',
  md: 'text-2xl md:text-3xl lg:text-4xl',
  lg: 'text-3xl md:text-4xl lg:text-5xl',
  xl: 'text-4xl md:text-5xl lg:text-6xl',
};

// ═══════════════════════════════════════════
// CONFIG HELPERS — localStorage on client
// ═══════════════════════════════════════════

function isClient() {
  return typeof window !== 'undefined';
}

export async function getFullConfig(): Promise<SiteConfig> {
  if (isClient()) {
    try {
      const raw = localStorage.getItem('cm_site_config');
      if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    } catch { /* fallback */ }
  }
  return { ...DEFAULT_CONFIG };
}

export async function setConfigValue(key: string, value: unknown): Promise<boolean> {
  if (isClient()) {
    const cfg = await getFullConfig();
    (cfg as unknown as Record<string, unknown>)[key] = value;
    localStorage.setItem('cm_site_config', JSON.stringify(cfg));
  }
  return true;
}

export async function getSkills(): Promise<Skill[]> {
  if (isClient()) {
    try {
      const raw = localStorage.getItem('cm_skills');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.length > 0) return parsed;
      }
    } catch { /* fallback */ }
  }
  return [];
}

export async function upsertSkill(skill: Partial<Skill>): Promise<boolean> { return true; }
export async function deleteSkill(id: string): Promise<boolean> { return true; }

export async function getSocialLinks(): Promise<SocialLink[]> {
  if (isClient()) {
    try {
      const raw = localStorage.getItem('cm_socials');
      if (raw) return JSON.parse(raw);
    } catch { /* fallback */ }
  }
  return [];
}

export async function upsertSocialLink(link: Partial<SocialLink>): Promise<boolean> { return true; }
export async function deleteSocialLink(id: string): Promise<boolean> { return true; }

export async function getProjects(): Promise<Project[]> {
  if (isClient()) {
    try {
      const raw = localStorage.getItem('cm_projects');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.length > 0) return parsed;
      }
    } catch { /* fallback */ }
  }
  return initialProjects;
}

export async function upsertProject(project: Project): Promise<{ ok: boolean; error?: string }> { return { ok: true }; }
export async function deleteProject(id: string): Promise<boolean> { return true; }
export async function markMessageRead(id: string): Promise<boolean> { return true; }
export async function deleteMessage(id: string): Promise<boolean> { return true; }

export async function getMessages(): Promise<Message[]> {
  if (isClient()) {
    try {
      const raw = localStorage.getItem('cm_messages');
      if (raw) return JSON.parse(raw);
    } catch { /* fallback */ }
  }
  return [];
}

export async function sendMessage(data: { name: string; email: string; message: string }): Promise<boolean> {
  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) return false;

    if (isClient()) {
      const messages = JSON.parse(localStorage.getItem('cm_messages') || '[]');
      messages.unshift({
        id: json.id ?? crypto.randomUUID(),
        ...data,
        read: false,
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('cm_messages', JSON.stringify(messages));
    }
    return true;
  } catch {
    return false;
  }
}
