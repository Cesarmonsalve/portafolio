'use client';
import Link from 'next/link';
import { ArrowUp, Sparkles } from 'lucide-react';
import { useSiteConfig } from '@/lib/SiteConfigContext';

const nav = [
  { href: '/#home', label: 'Inicio' }, { href: '/#work', label: 'Trabajos' }, { href: '/#about', label: 'Perfil' },
  { href: '/#skills', label: 'Skills' }, { href: '/#contact', label: 'Contacto' }, { href: '/galeria', label: 'Galería' }, { href: '/tienda', label: 'Tienda' },
];

export default function Footer() {
  const { cfg } = useSiteConfig();
  return (
    <footer className="relative overflow-hidden border-t border-neon-red/15 bg-[#080B0F] px-5 py-10 md:px-8">
      <div className="arena-grid absolute inset-0 opacity-25" />
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-9 border-b border-white/[0.08] pb-9 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-center gap-5">
            <img src={cfg.logo_url || '/logo.png'} alt="CM Design" className="h-12 w-36 object-contain object-left" />
            <div className="hidden border-l border-white/10 pl-5 sm:block">
              <div className="acid-kicker">{cfg.footer_brand}</div>
              <div className="mt-1 text-lg font-black uppercase tracking-[-.03em] text-white">{cfg.footer_brand_sub}</div>
            </div>
          </div>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="ghost-button w-fit">Volver arriba <ArrowUp size={15} /></button>
        </div>
        <div className="flex flex-col gap-7 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-3">{nav.map((link) => <Link key={link.href} href={link.href} className="text-[10px] font-black uppercase tracking-[.15em] text-gray-500 transition hover:text-neon-red">{link.label}</Link>)}</div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.15em] text-neon-red"><Sparkles size={13} /> Built for visual impact</div>
        </div>
        <div className="flex flex-col gap-2 border-t border-white/[0.08] pt-5 text-[10px] text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {cfg.footer_brand}. Todos los derechos reservados.</span><span>{cfg.footer_text}</span>
        </div>
      </div>
    </footer>
  );
}
