'use client';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { useSiteConfig } from '@/lib/SiteConfigContext';

const nav = [
  { href: '/#home', label: 'Inicio' }, { href: '/#work', label: 'Proyectos' }, { href: '/#about', label: 'Perfil' },
  { href: '/#skills', label: 'Skills' }, { href: '/#contact', label: 'Contacto' }, { href: '/galeria', label: 'Galería' }, { href: '/tienda', label: 'Tienda' },
];

export default function Footer() {
  const { cfg } = useSiteConfig();
  return (
    <footer className="relative border-t border-white/[0.06] px-6 py-16 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div className="text-3xl font-display font-black tracking-tighter text-white">
              {cfg.footer_brand || 'CESAR'}<span className="text-[var(--accent-cyan)]">.</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">{cfg.footer_brand_sub || 'Digital Creator'}</div>
          </div>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/[0.08] text-sm font-medium text-gray-400 hover:text-white hover:border-white/20 transition-all w-fit">
            Volver arriba <ArrowUp size={14} />
          </button>
        </div>

        <div className="flex flex-wrap gap-6 mb-12">
          {nav.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8 border-t border-white/[0.06] text-xs text-gray-600">
          <span>© {new Date().getFullYear()} {cfg.footer_brand || 'Cesar'}. All rights reserved.</span>
          <span>{cfg.footer_text || 'Crafted with precision.'}</span>
        </div>
      </div>
    </footer>
  );
}
