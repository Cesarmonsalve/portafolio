'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { DEFAULT_CONFIG, type SiteConfig, type Skill, type SocialLink, type Project, type StoreItem } from './config';
import { initialProjects } from '../data/projects';

// ═══════════════════════════════════════════
// DEFAULT SKILLS (fallback when nothing saved)
// ═══════════════════════════════════════════
const DEFAULT_SKILLS: Skill[] = [
  { id: '1', name: 'After Effects', level: 95, icon: '🎬', category: 'Video', position: 0 },
  { id: '2', name: 'Cinema 4D', level: 80, icon: '🧊', category: '3D', position: 1 },
  { id: '3', name: 'Photoshop', level: 92, icon: '🖼️', category: 'Diseño', position: 2 },
  { id: '4', name: 'Illustrator', level: 85, icon: '✏️', category: 'Diseño', position: 3 },
  { id: '5', name: 'Premiere Pro', level: 88, icon: '🎥', category: 'Video', position: 4 },
  { id: '6', name: 'DaVinci Resolve', level: 75, icon: '🎨', category: 'Video', position: 5 },
  { id: '7', name: 'Blender', level: 70, icon: '🔮', category: '3D', position: 6 },
  { id: '8', name: 'Figma', level: 78, icon: '📐', category: 'Diseño', position: 7 },
];

// ═══════════════════════════════════════════
// DEFAULT STORE ITEMS (fallback when nothing saved)
// ═══════════════════════════════════════════
const DEFAULT_STORE_ITEMS: StoreItem[] = [
  {
    id: '1',
    title: 'Pack Flyers Editables — Eventos',
    description: 'Pack de 10 plantillas editables para eventos, fiestas y discotecas. Archivos PSD + AI incluidos.',
    category: 'Templates',
    price: 'GRATIS',
    tags: ['PSD', 'Illustrator', 'Editable'],
    emoji: '🎨',
    downloadLinks: [{ platform: 'Google Drive', url: '#', color: '#0F9D58' }],
    badge: '🔥 Popular',
  },
  {
    id: '2',
    title: 'Preset Pack — After Effects',
    description: 'Colección de 25 presets de animación para After Effects. Transiciones y efectos glitch.',
    category: 'Presets',
    price: 'GRATIS',
    tags: ['After Effects', 'Motion'],
    emoji: '⚡',
    downloadLinks: [{ platform: 'Mediafire', url: '#', color: '#4285F4' }],
    badge: '⚡ Nuevo',
  }
];

// ═══════════════════════════════════════════
// CONTEXT TYPE
// ═══════════════════════════════════════════
interface SiteConfigContextType {
  cfg: SiteConfig;
  projects: Project[];
  skills: Skill[];
  socials: SocialLink[];
  storeItems: StoreItem[];
  refreshAll: () => void;
}

const SiteConfigCtx = createContext<SiteConfigContextType>({
  cfg: DEFAULT_CONFIG,
  projects: initialProjects,
  skills: DEFAULT_SKILLS,
  socials: [],
  storeItems: DEFAULT_STORE_ITEMS,
  refreshAll: () => {},
});

export const useSiteConfig = () => useContext(SiteConfigCtx);

// ═══════════════════════════════════════════
// PROVIDER
// ═══════════════════════════════════════════
export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [cfg, setCfg] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [skills, setSkills] = useState<Skill[]>(DEFAULT_SKILLS);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [storeItems, setStoreItems] = useState<StoreItem[]>(DEFAULT_STORE_ITEMS);

  const loadAll = useCallback(async () => {
    let serverData: Record<string, any> = {};
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          serverData = json.data;
        }
      }
    } catch (e) {
      console.warn('Could not load from DB, falling back to local');
    }

    // Config
    try {
      const dbCfg = serverData['cm_site_config'];
      const raw = localStorage.getItem('cm_site_config');
      if (dbCfg) setCfg({ ...DEFAULT_CONFIG, ...dbCfg });
      else if (raw) setCfg({ ...DEFAULT_CONFIG, ...JSON.parse(raw) });
    } catch { /* use defaults */ }

    // Projects
    try {
      const dbProjects = serverData['cm_projects'];
      const raw = localStorage.getItem('cm_projects');
      if (dbProjects?.length > 0) setProjects(dbProjects);
      else if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.length > 0) setProjects(parsed);
      }
    } catch { /* use defaults */ }

    // Skills
    try {
      const dbSkills = serverData['cm_skills'];
      const raw = localStorage.getItem('cm_skills');
      if (dbSkills?.length > 0) setSkills(dbSkills);
      else if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.length > 0) setSkills(parsed);
      }
    } catch { /* use defaults */ }

    // Social links
    try {
      const dbSocials = serverData['cm_socials'];
      const raw = localStorage.getItem('cm_socials');
      if (dbSocials) setSocials(dbSocials);
      else if (raw) setSocials(JSON.parse(raw));
    } catch { /* use defaults */ }

    // Store items
    try {
      const dbStore = serverData['cm_store_items'];
      const raw = localStorage.getItem('cm_store_items');
      if (dbStore?.length > 0) setStoreItems(dbStore);
      else if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.length > 0) setStoreItems(parsed);
      }
    } catch { /* use defaults */ }
  }, []);

  useEffect(() => {
    loadAll();

    // Listen for admin changes via storage events (cross-tab)
    const handler = () => loadAll();
    window.addEventListener('storage', handler);

    // Listen for custom event from admin panel (same tab)
    window.addEventListener('cm_config_updated', handler);

    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('cm_config_updated', handler);
    };
  }, [loadAll]);

  return (
    <SiteConfigCtx.Provider value={{ cfg, projects, skills, socials, storeItems, refreshAll: loadAll }}>
      {children}
    </SiteConfigCtx.Provider>
  );
}

// ═══════════════════════════════════════════
// HELPER: Dispatch config update event
// Call this from admin after saving to localStorage
// ═══════════════════════════════════════════
export function notifyConfigUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cm_config_updated'));
  }
}

// ═══════════════════════════════════════════
// DB SAVER UTILITY
// ═══════════════════════════════════════════
export async function saveConfigData(key: string, value: any) {
  try {
    const res = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    if (!res.ok) console.warn('Failed to save to DB');
  } catch (e) {
    console.warn('Network error saving to DB:', e);
  }
  
  // Siempre hacemos fallback a localStorage para que la UI reaccione instantáneo
  localStorage.setItem(key, JSON.stringify(value));
  notifyConfigUpdate();
}
