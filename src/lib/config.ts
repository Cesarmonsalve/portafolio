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

export interface SiteConfig {
  hero_name: string;
  hero_subtitle: string;
  hero_description: string;
  hero_badge: string;
  hero_stats: { value: string; label: string }[];
  about_title: string;
  about_bio: string;
  about_bio_extended: string;
  about_specialties: { title: string; desc: string }[];
  about_photo: string;
  contact_email: string;
  footer_text: string;
  theme_primary: string;
  theme_secondary: string;
  theme_accent: string;
  lottie_hero: LottieSlot;
  lottie_about: LottieSlot;
  lottie_skills: LottieSlot;
  lottie_projects: LottieSlot;
  lottie_contact: LottieSlot;
  lottie_footer: LottieSlot;
}

export const DEFAULT_CONFIG: SiteConfig = {
  hero_name: 'CM DESIGN',
  hero_subtitle: 'Motion Graphics & Visual Design',
  hero_description: 'Transformo conceptos en experiencias visuales de alto impacto. Dise\u00f1o que rompe el scroll y construye atm\u00f3sferas que elevan marcas.',
  hero_badge: 'Motion Graphics & Flyer Design',
  hero_stats: [
    { value: '50+', label: 'Proyectos' },
    { value: '30+', label: 'Clientes' },
    { value: '3+', label: 'A\u00f1os Exp.' },
  ],
  about_title: 'Dise\u00f1ador Visual',
  about_bio: 'Soy CM Design \u2014 un dise\u00f1ador visual especializado en motion graphics y dise\u00f1o de flyers que capturan la atenci\u00f3n desde el primer frame.',
  about_bio_extended: 'Mi enfoque combina una est\u00e9tica cinematogr\u00e1fica con una ejecuci\u00f3n t\u00e9cnica precisa. No solo dise\u00f1o piezas; construyo atm\u00f3sferas visuales que elevan la identidad de marcas y comunidades competitivas.',
  about_specialties: [
    { title: 'Motion Graphics', desc: 'Animaciones que capturan y retienen' },
    { title: 'Flyer Design', desc: 'Dise\u00f1os de alto impacto para eventos' },
    { title: 'Branding Visual', desc: 'Identidades que comunican poder' },
  ],
  about_photo: '',
  contact_email: 'cm@design.com',
  footer_text: 'Dise\u00f1ado con fire por CM',
  theme_primary: '#ff0033',
  theme_secondary: '#a855f7',
  theme_accent: '#ec4899',
  lottie_hero: { ...DEFAULT_LOTTIE },
  lottie_about: { ...DEFAULT_LOTTIE },
  lottie_skills: { ...DEFAULT_LOTTIE },
  lottie_projects: { ...DEFAULT_LOTTIE },
  lottie_contact: { ...DEFAULT_LOTTIE },
  lottie_footer: { ...DEFAULT_LOTTIE },
};

// CONFIG HELPERS (Payload CMS integration pending - using defaults)
export async function getFullConfig(): Promise<SiteConfig> {
  return { ...DEFAULT_CONFIG };
}

export async function setConfigValue(key: string, value: unknown): Promise<boolean> {
  return true;
}

export async function getSkills(): Promise<Skill[]> {
  return [];
}

export async function upsertSkill(skill: Partial<Skill>): Promise<boolean> {
  return true;
}

export async function deleteSkill(id: string): Promise<boolean> {
  return true;
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  return [];
}

export async function upsertSocialLink(link: Partial<SocialLink>): Promise<boolean> {
  return true;
}

export async function deleteSocialLink(id: string): Promise<boolean> {
  return true;
}

export async function getProjects(): Promise<Project[]> {
  return initialProjects;
}

export async function upsertProject(project: Project): Promise<{ ok: boolean; error?: string }> {
  return { ok: true };
}

export async function deleteProject(id: string): Promise<boolean> {
  return true;
}
export async function markMessageRead(id: string): Promise<boolean> {
  return true;
}

export async function deleteMessage(id: string): Promise<boolean> {
  return true
}
