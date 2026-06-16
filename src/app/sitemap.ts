import type { MetadataRoute } from 'next';
import { getCachedProjects } from '@/lib/server/cache';
import { initialProjects } from '@/data/projects';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cm-design.vercel.app').replace(/\/$/, '');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let projects = initialProjects;
  try {
    projects = await getCachedProjects();
  } catch {
    /* fallback */
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,        lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/galeria`, lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/tienda`,  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/projects/${p.id}`,
    lastModified: p.created_at ? new Date(p.created_at) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
