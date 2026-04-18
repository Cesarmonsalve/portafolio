'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Shield } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '#home', label: 'Inicio' },
    { href: '#work', label: 'Trabajos' },
    { href: '#about', label: 'Sobre Mí' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contacto' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-bg/90 backdrop-blur-xl border-b border-white/5 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="#home" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-neon-red rounded-lg flex items-center justify-center font-display font-black text-lg group-hover:scale-110 transition-transform">
              CM
            </div>
            <span className="font-display font-bold text-lg hidden sm:block">
              DESIGN
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-red group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-xs font-medium hover:bg-neon-red/20 hover:border-neon-red/50 transition-all"
            >
              <Shield size={14} />
              Admin
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
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
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-bg/98 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-8"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-3xl font-bold hover:text-neon-red transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 bg-neon-red/20 border border-neon-red/50 px-6 py-3 rounded-lg text-sm font-medium"
            >
              <Shield size={16} />
              Admin Panel
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}