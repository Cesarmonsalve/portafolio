import type { SiteConfig, Project, Skill, SocialLink, StoreItem } from '@/lib/config';

export interface SiteData {
  config: SiteConfig;
  projects: Project[];
  skills: Skill[];
  socials: SocialLink[];
  storeItems: StoreItem[];
}
