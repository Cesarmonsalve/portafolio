'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import LottieRenderer from './LottieRenderer';
import { useSiteConfig } from '@/lib/SiteConfigContext';

export default function Footer() {
  const { cfg } = useSiteConfig();

  const navLinks = [
    { href: '/#home', label: 'Inicio' },
    { href: '/#work', label: 'Trabajos' },
    { href: '/#about', label: 'Sobre Mí' },
    { href: '/#skills', label: 'Skills' },
    { href: '/#contact', label: 'Contacto' },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative pt-20 pb-10 px-6 overflow-hidden bg-bg">
      {cfg.lottie_footer?.enabled && cfg.lottie_footer?.source && (
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ opacity: (cfg.lottie_footer.opacity || 0.6) * 0.1 }}>
          <LottieRenderer source={cfg.lottie_footer.source} speed={cfg.lottie_footer.speed} />
        </div>
      )}

      <div className="glow-line absolute top-0 left-0 right-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(255,0,51,0.04),transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Top */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div className="text-[9px] font-bold tracking-[0.25em] text-neon-red uppercase mb-3">{cfg.footer_brand}</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight" style={{ fontFamily: `${cfg.font_display}, sans-serif` }}>
              {cfg.footer_brand_sub}
            </h2>
          </motion.div>

          <motion.button onClick={scrollToTop} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-3 px-5 py-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:border-neon-red/30 hover:bg-neon-red/[0.05] transition-all duration-300">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors">Volver al inicio</span>
            <div className="w-8 h-8 bg-white/[0.04] rounded-xl flex items-center justify-center group-hover:bg-neon-red transition-all duration-300">
              <ArrowUp size={14} />
            </div>
          </motion.button>
        </div>

        {/* Logo + Nav */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <motion.a href="/#home" className="flex items-center" whileHover={{ scale: 1.05 }}>
            <div className="relative w-28 h-8 flex items-center justify-start">
              <img src={cfg.logo_url || '/logo.png'} alt="Logo" className="w-full h-full object-contain object-left" />
            </div>
          </motion.a>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-[11px] font-medium tracking-[0.12em] uppercase text-gray-600 hover:text-white transition-colors relative group">
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-neon-red group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-600">© {new Date().getFullYear()} {cfg.footer_brand}. Todos los derechos reservados.</p>
          <p className="text-[11px] text-gray-700">{cfg.footer_text}</p>
        </div>
      </div>
    </footer>
  );
}