import type { Metadata } from 'next';
import ProjectDetailClient from '@/components/ProjectDetailClient';
import { getProjects } from '@/lib/config';
import { initialProjects } from '@/data/projects';

export async function generateStaticParams() {
  const projects = await getProjects();
  const all = projects.length ? projects : initialProjects;
  return all.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const projects = await getProjects();
  const all = projects.length ? projects : initialProjects;
  const project = all.find((item) => item.id === params.id);

  if (!project) {
    return {
      title: 'Proyecto no encontrado',
      description: 'El proyecto solicitado no existe en el portafolio de CM Design.',
      robots: { index: false, follow: false },
    };
  }

  const title = `${project.title} · CM Design`;
  const description = `${project.category} — ${project.description}`;
  const image = project.image || '/og-image.png';

  return {
    title,
    description,
    alternates: { canonical: `/projects/${project.id}` },
    openGraph: {
      title,
      description,
      type: 'article',
      images: [{ url: image, width: 1200, height: 630, alt: `${project.title} — ${project.category}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default function ProjectPage({ params }: { params: { id: string } }) {
  return <ProjectDetailClient id={params.id} />;
}
