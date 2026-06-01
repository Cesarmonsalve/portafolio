'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, Menu, Search, ShoppingBag, X, Zap } from 'lucide-react';
import { useSiteConfig } from '@/lib/SiteConfigContext';

const links = [
  { href: '/#home', label: 'Inicio', code: '01' },
  { href: '/#work', label: 'Trabajos', code: '02' },
  { href: '/#about', label: 'Perfil', code: '03' },
  { href: '/#skills', label: 'Skills', code: '04' },
  { href: '/#contact', label: 'Contacto', code: '05' },
];

export default function Navbar() {
  const { cfg } = useSiteConfig();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 22);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${scrolled ? 'border-neon-red/20 bg-[#0B0E13]/95 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,.24)] backdrop-blur-xl' : 'border-white/[0.05] bg-[#0B0E13]/70 py-4 backdrop-blur-md'}`}>
        <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-neon-red to-transparent opacity-70" />
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center gap-3" data-cursor-hover>
              <div className="relative h-10 w-32">
                <img src={cfg.logo_url || '/logo.png'} alt="CM Design" className="h-full w-full object-contain object-left" />
              </div>
              <span className="hidden border-l border-white/10 pl-3 text-[9px] font-extrabold uppercase tracking-[0.24em] text-gray-500 xl:block">Visual Lab</span>
            </Link>
            <div className="hidden items-center gap-2 border border-neon-red/20 bg-neon-red/[0.04] px-3 py-1.5 lg:flex angle-frame-sm">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-red opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-neon-red" /></span>
              <span className="text-[9px] font-black uppercase tracking-[0.16em] text-neon-red">Disponible</span>
            </div>
          </div>

          <div className="hidden items-center gap-5 lg:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="group flex items-center gap-1.5 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-gray-400 transition hover:text-white" data-cursor-hover>
                <span className="text-[8px] text-neon-red/70">{link.code}</span>
                <span>{link.label}</span>
                <span className="ml-0.5 h-[2px] w-0 bg-neon-red transition-all duration-300 group-hover:w-4" />
              </Link>
            ))}
            <div className="hidden items-center gap-1 border-l border-white/10 pl-5 text-[9px] font-bold tracking-wider text-gray-600 xl:flex"><Search size={11} /> CMD+K</div>
            <Link href="/galeria" className={`ghost-button !px-3.5 !py-2.5 ${pathname === '/galeria' ? '!border-neon-red/60 !text-neon-red' : ''}`}><LayoutGrid size={13} /> Galería</Link>
            <Link href="/tienda" className="acid-button !px-3.5 !py-2.5"><ShoppingBag size={13} /> Tienda</Link>
          </div>

          <button onClick={() => setMobileOpen(true)} className="flex h-10 w-10 items-center justify-center border border-white/10 text-white angle-frame-sm lg:hidden" aria-label="Abrir menú"><Menu size={20} /></button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ duration: .28 }} className="fixed inset-0 z-[60] overflow-hidden bg-[#0B0E13] px-6 py-7 lg:hidden">
            <div className="arena-grid absolute inset-0 opacity-50" />
            <div className="relative flex items-center justify-between border-b border-white/10 pb-5">
              <img src={cfg.logo_url || '/logo.png'} alt="CM Design" className="h-10 w-32 object-contain object-left" />
              <button onClick={() => setMobileOpen(false)} className="flex h-10 w-10 items-center justify-center border border-neon-red/40 text-neon-red angle-frame-sm" aria-label="Cerrar menú"><X size={20} /></button>
            </div>
            <div className="relative mt-16 space-y-3">
              {links.map((link, index) => (
                <motion.div key={link.href} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .05 * index }}>
                  <Link href={link.href} onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-b border-white/[0.07] py-4 text-2xl font-black uppercase tracking-tight text-white">
                    <span>{link.label}</span><span className="acid-number">{link.code}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="relative mt-12 grid gap-3">
              <Link href="/galeria" onClick={() => setMobileOpen(false)} className="ghost-button"><LayoutGrid size={15} /> Ver galería completa</Link>
              <Link href="/tienda" onClick={() => setMobileOpen(false)} className="acid-button"><ShoppingBag size={15} /> Explorar recursos</Link>
            </div>
            <div className="relative mt-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-neon-red"><Zap size={14} /> CM Design Visual Lab</div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
