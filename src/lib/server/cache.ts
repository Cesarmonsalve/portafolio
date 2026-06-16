import { sql } from '@/lib/db';
import { DEFAULT_CONFIG, type SiteConfig, type Project, type Skill, type SocialLink, type StoreItem } from '@/lib/config';
import { initialProjects } from '@/data/projects';
import type { SiteData } from '@/domain/services/config.service';

export async function getCachedProjects(): Promise<Project[]> {
  try {
    if (!sql) return initialProjects;
    const records = await sql`SELECT value FROM app_data WHERE key = 'cm_projects'`;
    if (records.length > 0 && Array.isArray(records[0].value)) {
      return records[0].value as Project[];
    }
  } catch {}
  return initialProjects;
}

export async function getCachedSiteData(): Promise<SiteData> {
  if (!sql) return getStaticFallback();

  const records = await sql`SELECT key, value FROM app_data`;
  const data: Record<string, any> = {};
  records.forEach((row: any) => {
    data[row.key] = row.value;
  });

  return {
    config: { ...DEFAULT_CONFIG, ...(data['cm_site_config'] || {}) } as SiteConfig,
    projects: (data['cm_projects'] as Project[]) || initialProjects,
    skills: (data['cm_skills'] as Skill[]) || [],
    socials: (data['cm_socials'] as SocialLink[]) || [],
    storeItems: (data['cm_store_items'] as StoreItem[]) || [],
  };
}

export function getStaticFallback(): SiteData {
  return {
    config: { ...DEFAULT_CONFIG },
    projects: initialProjects,
    skills: [],
    socials: [],
    storeItems: [],
  };
}
