'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, LayoutGrid } from 'lucide-react';
import { useSiteConfig } from '@/lib/SiteConfigContext';

export default function Navbar() {
  const { cfg } = useSiteConfig();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isTienda = pathname === '/tienda';
  const isGaleria = pathname === '/galeria';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const homeLinks = [
    { href: '/#home', label: 'Inicio' },
    { href: '/#work', label: 'Trabajos' },
    { href: '/#about', label: 'Sobre Mí' },
    { href: '/#skills', label: 'Skills' },
    { href: '/#contact', label: 'Contacto' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 bg-black/80 backdrop-blur-2xl border-b border-white/[0.04]'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center group" data-cursor-hover>
            <div className="relative w-32 h-10 flex items-center justify-start group-hover:scale-[1.02] transition-transform duration-300">
              <img src={cfg.logo_url || '/logo.png'} alt="CM Design Logo" className="w-full h-full object-contain object-left" />
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {homeLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-label !text-[12px] transition-colors relative group ${
                  isHome ? '!text-gray-400 hover:!text-white' : '!text-gray-500 hover:!text-gray-300'
                }`}
                data-cursor-hover
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-neon-red group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            {/* Galería CTA Button */}
            <Link
              href="/galeria"
              className={`group flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-300 elastic-press ${
                isGaleria
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
              }`}
              data-cursor-hover
            >
              <LayoutGrid size={13} className={isGaleria ? 'text-white' : 'text-gray-400 group-hover:scale-110 transition-transform'} />
              GALERÍA
            </Link>

            {/* Tienda CTA Button */}
            <Link
              href="/tienda"
              className={`group flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-300 elastic-press ${
                isTienda
                  ? 'bg-neon-red text-white shadow-[0_0_20px_rgba(255,0,51,0.35)]'
                  : 'bg-white/[0.04] border border-white/[0.08] text-gray-300 hover:border-neon-red/40 hover:bg-neon-red/[0.08] hover:text-white hover:shadow-[0_0_15px_rgba(255,0,51,0.15)]'
              }`}
              data-cursor-hover
            >
              <ShoppingBag size={13} className={isTienda ? 'text-white' : 'text-neon-red group-hover:scale-110 transition-transform'} />
              TIENDA
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2"
            data-cursor-hover
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
            className="fixed inset-0 z-50 bg-bg/98 backdrop-blur-2xl md:hidden flex flex-col items-center justify-center gap-6"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-6 text-white p-2"
            >
              <X size={20} />
            </button>
            {homeLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-2xl font-bold tracking-tight-custom hover:text-neon-red transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            {/* Galería mobile link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href="/galeria"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight-custom text-gray-300 hover:text-white transition-colors"
              >
                <LayoutGrid size={22} /> Galería
              </Link>
            </motion.div>
            {/* Tienda mobile link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Link
                href="/tienda"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight-custom text-neon-red hover:text-white transition-colors"
              >
                <ShoppingBag size={22} /> Tienda
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}