'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Home, FolderKanban, User, Wrench, Mail, ShoppingBag, Menu, X } from 'lucide-react';
import { useActiveSection } from '@/hooks/useActiveSection';

const NAV_ITEMS = [
  { href: '/#home', label: 'Inicio', icon: Home, section: 'home' },
  { href: '/#work', label: 'Proyectos', icon: FolderKanban, section: 'work' },
  { href: '/#about', label: 'Perfil', icon: User, section: 'about' },
  { href: '/#skills', label: 'Skills', icon: Wrench, section: 'skills' },
  { href: '/#contact', label: 'Contacto', icon: Mail, section: 'contact' },
];

export default function FloatingDock() {
  const pathname = usePathname();
  const activeSection = useActiveSection();
  const onHome = pathname === '/';
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Dock */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden lg:block">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel px-4 py-3 rounded-2xl flex items-center gap-3 border border-white/[0.08]"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = onHome && activeSection === item.section;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  className="relative group flex items-center justify-center w-12 h-12 rounded-xl transition-colors hover:bg-white/[0.06]"
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon 
                    size={20} 
                    className={`transition-colors duration-300 ${active ? 'text-[var(--accent-cyan)]' : 'text-gray-400 group-hover:text-white'}`} 
                  />
                  {active && (
                    <motion.div 
                      layoutId="dock-indicator"
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan)]"
                    />
                  )}
                  {/* Tooltip */}
                  <div className="absolute -top-10 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 glass-panel px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide text-white pointer-events-none">
                    {item.label}
                  </div>
                </motion.div>
              </Link>
            );
          })}

          <div className="w-[1px] h-8 bg-white/[0.1] mx-2" />

          <Link href="/galeria">
            <motion.div
              className="relative group flex items-center justify-center w-12 h-12 rounded-xl transition-colors hover:bg-white/[0.06]"
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <LayoutGrid size={20} className="text-gray-400 group-hover:text-white" />
              <div className="absolute -top-10 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 glass-panel px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide text-white pointer-events-none whitespace-nowrap">
                Galería
              </div>
            </motion.div>
          </Link>

          <Link href="/tienda">
            <motion.div
              className="relative group flex items-center justify-center w-12 h-12 rounded-xl transition-colors hover:bg-white/[0.06]"
              whileHover={{ scale: 1.15, y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={20} className="text-gray-400 group-hover:text-white" />
              <div className="absolute -top-10 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 glass-panel px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wide text-white pointer-events-none whitespace-nowrap">
                Tienda
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 w-full z-50 lg:hidden glass-panel rounded-none border-t-0 border-x-0 px-5 py-4 flex items-center justify-between">
        <Link href="/" className="font-display font-black text-xl tracking-tighter">
          CESAR<span className="text-[var(--accent-cyan)]">.</span>
        </Link>
        <button onClick={() => setMobileOpen(true)} className="text-white p-1">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-2xl flex flex-col px-6 py-8"
          >
            <div className="flex justify-end">
              <button onClick={() => setMobileOpen(false)} className="text-gray-400 hover:text-white p-2 bg-white/5 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-6">
              {NAV_ITEMS.map((item, i) => (
                <motion.div 
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link 
                    href={item.href} 
                    onClick={() => setMobileOpen(false)}
                    className="text-4xl font-display font-black tracking-tight text-white flex items-center gap-4"
                  >
                    <item.icon size={28} className="text-[var(--accent-cyan)] opacity-70" />
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="h-[1px] w-full bg-white/10 my-4" />
              <Link href="/galeria" onClick={() => setMobileOpen(false)} className="text-xl font-display font-bold text-gray-400">Galería</Link>
              <Link href="/tienda" onClick={() => setMobileOpen(false)} className="text-xl font-display font-bold text-gray-400">Tienda</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
