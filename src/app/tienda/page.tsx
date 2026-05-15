'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Download, ExternalLink, ArrowRight, Package, Tag, Search, Sparkles, CreditCard, X, Check, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionWrapper from '@/components/SectionWrapper';
import { SiteConfigProvider, useSiteConfig } from '@/lib/SiteConfigContext';
import type { StoreItem } from '@/lib/config';

// ═══════════════════════════════════════════
// CATEGORIES
// ═══════════════════════════════════════════
const CATEGORIES = ['Todos', 'Templates', 'Presets', 'Assets', 'Plugins', 'Otros'];

// ═══════════════════════════════════════════
// STORE CARD
// ═══════════════════════════════════════════
function StoreCard({ item, index }: { item: StoreItem; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
    >
      {item.badge && (
        <div className="absolute top-4 right-4 z-20 bg-neon-red/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold tracking-wide text-white">
          {item.badge}
        </div>
      )}

      {/* Top — Emoji + Category visual */}
      <div className="relative p-6 pb-4 bg-gradient-to-br from-white/[0.02] to-transparent">
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-neon-red/[0.08] border border-neon-red/20 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-neon-red/[0.15] transition-all duration-300">
            {item.emoji}
          </div>
          <span className="bg-white/[0.06] border border-white/[0.08] px-3 py-1 rounded-full text-[10px] font-medium text-gray-400 tracking-wide">
            {item.category}
          </span>
        </div>

        <h3 className="font-display font-bold text-[15px] text-white mb-2 group-hover:text-neon-red transition-colors leading-tight">
          {item.title}
        </h3>
        <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>

      {/* Tags + Actions */}
      <div className="px-6 pb-5">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.tags.map((tag) => (
            <span key={tag} className="bg-white/[0.03] border border-white/[0.04] px-2.5 py-0.5 rounded-full text-[10px] text-gray-500">
              {tag}
            </span>
          ))}
        </div>

        {/* Price + Download */}
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-neon-red/10 border border-neon-red/20 text-neon-red px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide">
            {item.price}
          </span>
        </div>

        {item.price.toUpperCase() === 'GRATIS' ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-2 bg-white/[0.04] border border-white/[0.08] hover:bg-neon-red hover:border-neon-red px-4 py-3 rounded-xl text-[11px] font-bold text-gray-300 hover:text-white tracking-wide transition-all duration-300 elastic-press"
          >
            <Download size={13} />
            {expanded ? 'OCULTAR LINKS' : 'VER DESCARGAS'}
            <ArrowRight size={12} className={`transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
          </button>
        ) : (
          <a
            href={item.paymentUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-neon-red to-pink-600 hover:from-red-500 hover:to-pink-500 shadow-lg shadow-neon-red/20 px-4 py-3 rounded-xl text-[11px] font-bold text-white tracking-wide transition-all duration-300 elastic-press"
          >
            <ShoppingBag size={13} />
            COMPRAR AHORA
          </a>
        )}

        <AnimatePresence>
          {expanded && item.price.toUpperCase() === 'GRATIS' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-3 space-y-2">
                {item.downloadLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 w-full bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.15] px-4 py-3 rounded-xl transition-all duration-300 group/link"
                  >
                    <span className="text-[11px] font-bold tracking-wide flex items-center gap-2 text-gray-300">
                      <span className="w-2 h-2 rounded-full" style={{ background: link.color }} />
                      {link.platform}
                    </span>
                    <ExternalLink size={12} className="text-gray-600 group-hover/link:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// MAIN STORE PAGE
// ═══════════════════════════════════════════
function TiendaContent() {
  const { cfg, storeItems } = useSiteConfig();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = storeItems.filter((item) => {
    const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="relative min-h-screen font-body">
      <Navbar />

      <SectionWrapper visual={cfg.section_store}>
        {/* Hero */}
        <section className="relative pt-32 pb-16 px-6 z-10">
          <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-neon-red/[0.06] border border-neon-red/20 px-5 py-2 rounded-full mb-8"
          >
            <ShoppingBag size={14} className="text-neon-red" />
            <span className="text-[10px] font-medium tracking-[0.12em] uppercase text-neon-red">{cfg.store_label || 'Tienda'}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-display text-4xl sm:text-5xl md:text-6xl mb-5 font-bold"
            style={{ fontFamily: `${cfg.font_display}, sans-serif` }}
          >
            {cfg.store_heading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 text-sm max-w-lg mx-auto mb-10"
          >
            {cfg.store_desc}
          </motion.p>

          {/* Search */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="max-w-md mx-auto relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar recursos..."
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white focus:border-neon-red/40 focus:outline-none transition-all placeholder:text-gray-600"
            />
          </motion.div>
        </div>
        </section>

        {/* Filters + Grid */}
        <section className="px-6 pb-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div className="flex flex-wrap items-center justify-center gap-2 mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-xl text-[11px] font-medium tracking-wide transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-neon-red text-white shadow-[0_0_20px_rgba(255,0,51,0.3)]'
                    : 'bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.04]'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((item, i) => (
                <StoreCard key={item.id} item={item} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>



          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Package size={32} className="mx-auto mb-4 text-gray-700" />
              <p className="text-gray-400 text-sm">No se encontraron recursos.</p>
            </div>
          )}

          {filtered.length > 0 && (
            <p className="text-center mt-8 text-[10px] text-gray-600 uppercase tracking-widest">
              {filtered.length} {filtered.length === 1 ? 'recurso' : 'recursos'}
            </p>
          )}
        </div>
        </section>
      </SectionWrapper>

      <Footer />
    </main>
  );
}

export default function TiendaPage() {
  return (
    <SiteConfigProvider>
      <TiendaContent />
    </SiteConfigProvider>
  );
}
