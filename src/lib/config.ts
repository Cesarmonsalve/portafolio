import { supabase } from './supabase';

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════

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
}

export const DEFAULT_CONFIG: SiteConfig = {
  hero_name: 'CM DESIGN',
  hero_subtitle: 'Motion Graphics & Visual Design',
  hero_description: 'Transformo conceptos en experiencias visuales de alto impacto. Diseño que rompe el scroll y construye atmósferas que elevan marcas.',
  hero_badge: 'Motion Graphics & Flyer Design',
  hero_stats: [
    { value: '50+', label: 'Proyectos' },
    { value: '30+', label: 'Clientes' },
    { value: '3+', label: 'Años Exp.' },
  ],
  about_title: 'Diseñador Visual',
  about_bio: 'Soy CM Design — un diseñador visual especializado en motion graphics y diseño de flyers que capturan la atención desde el primer frame.',
  about_bio_extended: 'Mi enfoque combina una estética cinematográfica con una ejecución técnica precisa. No solo diseño piezas; construyo atmósferas visuales que elevan la identidad de marcas y comunidades competitivas.',
  about_specialties: [
    { title: 'Motion Graphics', desc: 'Animaciones que capturan y retienen' },
    { title: 'Flyer Design', desc: 'Diseños de alto impacto para eventos' },
    { title: 'Branding Visual', desc: 'Identidades que comunican poder' },
  ],
  about_photo: '',
  contact_email: 'cm@design.com',
  footer_text: 'Diseñado con 🔥 por CM',
  theme_primary: '#ff0033',
  theme_secondary: '#a855f7',
  theme_accent: '#ec4899',
};

// ═══════════════════════════════════════════
// CONFIG HELPERS
// ═══════════════════════════════════════════

export async function getFullConfig(): Promise<SiteConfig> {
  const config = { ...DEFAULT_CONFIG };
  try {
    const { data } = await supabase.from('site_config').select('*');
    if (data) {
      for (const row of data) {
        const key = row.key as keyof SiteConfig;
        if (key in config) {
          (config as Record<string, unknown>)[key] = row.value;
        }
      }
    }
  } catch (e) {
    console.error('Config fetch error:', e);
  }
  return config;
}

export async function setConfigValue(key: string, value: unknown): Promise<boolean> {
  const { error } = await supabase
    .from('site_config')
    .upsert({ key, value: JSON.parse(JSON.stringify(value)), updated_at: new Date().toISOString() }, { onConflict: 'key' });
  return !error;
}

// ═══════════════════════════════════════════
// SKILLS HELPERS
// ═══════════════════════════════════════════

export async function getSkills(): Promise<Skill[]> {
  const { data } = await supabase.from('skills').select('*').order('position');
  return (data as Skill[]) || [];
}

export async function upsertSkill(skill: Partial<Skill>): Promise<boolean> {
  const { error } = await supabase.from('skills').upsert(skill, { onConflict: 'id' });
  return !error;
}

export async function deleteSkill(id: string): Promise<boolean> {
  const { error } = await supabase.from('skills').delete().eq('id', id);
  return !error;
}

// ═══════════════════════════════════════════
// SOCIAL LINKS HELPERS
// ═══════════════════════════════════════════

export async function getSocialLinks(): Promise<SocialLink[]> {
  const { data } = await supabase.from('social_links').select('*').order('position');
  return (data as SocialLink[]) || [];
}

export async function upsertSocialLink(link: Partial<SocialLink>): Promise<boolean> {
  const { error } = await supabase.from('social_links').upsert(link, { onConflict: 'id' });
  return !error;
}

export async function deleteSocialLink(id: string): Promise<boolean> {
  const { error } = await supabase.from('social_links').delete().eq('id', id);
  return !error;
}

// ═══════════════════════════════════════════
// PROJECTS HELPERS
// ═══════════════════════════════════════════

export async function getProjects(): Promise<Project[]> {
  const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  return (data as Project[]) || [];
}

export async function upsertProject(project: Project): Promise<boolean> {
  const { error } = await supabase.from('projects').upsert(project, { onConflict: 'id' });
  return !error;
}

export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await supabase.from('projects').delete().eq('id', id);
  return !error;
}

// ═══════════════════════════════════════════
// MESSAGES HELPERS
// ═══════════════════════════════════════════

export async function getMessages(): Promise<Message[]> {
  const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
  return (data as Message[]) || [];
}

export async function sendMessage(msg: { name: string; email: string; message: string }): Promise<boolean> {
  const { error } = await supabase.from('messages').insert({ ...msg, id: crypto.randomUUID() });
  return !error;
}

export async function markMessageRead(id: string): Promise<boolean> {
  const { error } = await supabase.from('messages').update({ read: true }).eq('id', id);
  return !error;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const { error } = await supabase.from('messages').delete().eq('id', id);
  return !error;
}

// ═══════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════

export const CATEGORIES = [
  'Todos', 'Motion Graphics', 'Graphic Design', 'Flyer Design',
  'Advertising', 'Video', 'Branding', '3D',
];
