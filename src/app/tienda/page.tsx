'use client';
import { useState, useRef } from 'react';
import {
  ShoppingBag, Download, ExternalLink, ArrowRight, Package, Search,
  Sparkles, X, MessageCircle, Zap, Star, ArrowUpRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionWrapper from '@/components/SectionWrapper';
import { SiteConfigProvider, useSiteConfig } from '@/lib/SiteConfigContext';
import type { StoreItem } from '@/lib/config';

// ═══════════════════════════════════════════
// CATEGORY COLOR SYSTEM
// ═══════════════════════════════════════════
const CAT_COLORS: Record<string, { bg: string; text: string; border: string; gradient: string; glow: string }> = {
  Templates: { bg: 'rgba(0,209,255,0.08)', text: '#00D1FF', border: 'rgba(0,209,255,0.2)', gradient: 'from-cyan-500/20 to-blue-600/5', glow: 'rgba(0,209,255,0.15)' },
  Presets:   { bg: 'rgba(168,85,247,0.08)', text: '#a855f7', border: 'rgba(168,85,247,0.2)', gradient: 'from-violet-500/20 to-purple-600/5', glow: 'rgba(168,85,247,0.15)' },
  Assets:    { bg: 'rgba(245,158,11,0.08)', text: '#f59e0b', border: 'rgba(245,158,11,0.2)', gradient: 'from-amber-500/20 to-orange-600/5', glow: 'rgba(245,158,11,0.15)' },
  Plugins:   { bg: 'rgba(34,197,94,0.08)',  text: '#22c55e', border: 'rgba(34,197,94,0.2)',  gradient: 'from-green-500/20 to-emerald-600/5', glow: 'rgba(34,197,94,0.15)' },
  Otros:     { bg: 'rgba(236,72,153,0.08)', text: '#ec4899', border: 'rgba(236,72,153,0.2)', gradient: 'from-pink-500/20 to-rose-600/5', glow: 'rgba(236,72,153,0.15)' },
};

const getCatColor = (cat: string) => CAT_COLORS[cat] || CAT_COLORS.Otros;

const CATEGORIES = ['Todos', 'Templates', 'Presets', 'Assets', 'Plugins', 'Otros'];

// ═══════════════════════════════════════════
// STORE CARD — Premium Glassmorphism
// ═══════════════════════════════════════════
function StoreCard({ item, index }: { item: StoreItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const catColor = getCatColor(item.category);
  const isFree = item.price.toUpperCase() === 'GRATIS';

  // Mouse spotlight effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="store-card card-spotlight rounded-2xl bg-white/[0.02] border border-white/[0.06] group opacity-0 animate-slide-up"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Shimmer sweep */}
      <div className="store-shimmer rounded-2xl" />

      {/* ═══ COVER IMAGE / HEADER ═══ */}
      <div className="relative overflow-hidden rounded-t-2xl">
        {item.image ? (
          /* Cover image */
          <div className="relative h-44 overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Category pill — on image */}
            <span
              className="absolute bottom-3 left-4 z-10 px-3 py-1.5 rounded-full text-[9px] font-semibold tracking-[0.12em] uppercase border backdrop-blur-md"
              style={{ background: `${catColor.bg.replace('0.08', '0.6')}`, color: '#fff', borderColor: `${catColor.border}` }}
            >
              {item.category}
            </span>

            {/* Emoji floating on image */}
            <div
              className="absolute bottom-3 right-4 z-10 w-10 h-10 rounded-xl flex items-center justify-center text-lg border backdrop-blur-md"
              style={{ background: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              {item.emoji}
            </div>
          </div>
        ) : (
          /* Fallback: mesh gradient header with big emoji */
          <div
            className="store-header-mesh relative p-6 pb-5"
            style={{ '--cat-color': catColor.glow } as React.CSSProperties}
          >
            <div className="absolute top-3 right-3 opacity-[0.04] pointer-events-none">
              <div className="grid grid-cols-4 gap-1.5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-white" />
                ))}
              </div>
            </div>
          <div className="flex items-start justify-between mb-3 relative z-10">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border hover:scale-110 transition-transform"
                style={{
                  background: catColor.bg,
                  borderColor: catColor.border,
                  boxShadow: `0 8px 32px ${catColor.glow}`,
                }}
              >
                {item.emoji}
              </div>
              <span
                className="px-3 py-1.5 rounded-full text-[9px] font-semibold tracking-[0.12em] uppercase border backdrop-blur-sm"
                style={{ background: catColor.bg, color: catColor.text, borderColor: catColor.border }}
              >
                {item.category}
              </span>
            </div>
          </div>
        )}

        {/* Badge — always on top right, never overlapping category */}
        {item.badge && (
          <div
            className="absolute top-3 right-3 z-30 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider text-white border shadow-lg animate-fade-in"
            style={{
              background: 'rgba(255,0,51,0.85)',
              borderColor: 'rgba(255,255,255,0.15)',
              boxShadow: '0 4px 16px rgba(255,0,51,0.3)',
              animationDelay: `${index * 0.08 + 0.3}s`,
            }}
          >
            {item.badge}
          </div>
        )}
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="px-6 pt-4 pb-2 relative z-10">
        <h3 className="font-display font-bold text-[16px] text-white mb-1.5 leading-tight group-hover:text-neon-red transition-colors">
          {item.title}
        </h3>
        <p className="text-[12px] text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg text-[10px] font-medium border backdrop-blur-sm"
              style={{
                background: catColor.bg,
                color: catColor.text,
                borderColor: catColor.border,
                opacity: 0.7,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ═══ ACTIONS — Free vs Paid ═══ */}
      <div className="px-6 pb-6 relative z-10">
        {/* Price badge */}
        <div className="flex items-center gap-3 mb-4">
          {isFree ? (
            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-xl text-[11px] font-bold tracking-wider flex items-center gap-1.5">
              <Sparkles size={11} />
              GRATIS
            </span>
          ) : (
            <span className="bg-neon-red/10 border border-neon-red/20 text-neon-red px-4 py-1.5 rounded-xl text-[12px] font-bold tracking-wide">
              {item.price}
            </span>
          )}
          {isFree && item.downloadLinks.length > 0 && (
            <span className="text-[10px] text-gray-600 flex items-center gap-1">
              <Download size={10} />
              {item.downloadLinks.length} {item.downloadLinks.length === 1 ? 'link' : 'links'}
            </span>
          )}
        </div>

        {isFree ? (
          /* ── FREE: Show download button + expandable links ── */
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-center gap-2.5 backdrop-blur-sm border px-4 py-3.5 rounded-xl text-[11px] font-bold tracking-wider transition-all duration-300 active:scale-[0.97]"
              style={{
                background: expanded ? catColor.bg : 'rgba(255,255,255,0.03)',
                borderColor: expanded ? catColor.border : 'rgba(255,255,255,0.06)',
                color: expanded ? catColor.text : '#d1d5db',
              }}
            >
              <Download size={13} />
              {expanded ? 'OCULTAR LINKS' : 'VER DESCARGAS'}
              <span className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
                <ArrowRight size={12} />
              </span>
            </button>

            {expanded && (
              <div className="animate-slide-up pt-3 space-y-2">
                {item.downloadLinks.map((link, idx) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 w-full bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.04] px-4 py-3 rounded-xl transition-all duration-300 group/link opacity-0 animate-fade-in"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    <span className="text-[11px] font-bold tracking-wide flex items-center gap-2.5 text-gray-300">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: link.color }}
                      />
                      {link.platform}
                    </span>
                    <ExternalLink size={12} className="text-gray-600 group-hover/link:text-white transition-colors" />
                  </a>
                ))}
              </div>
            )}
          </>
        ) : (
          /* ── PAID: Only show buy button, no download links ── */
          item.paymentUrl && item.paymentUrl.trim() !== '' ? (
            <a
              href={item.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-neon-red to-pink-600 hover:from-red-500 hover:to-pink-500 shadow-lg shadow-neon-red/20 px-4 py-3.5 rounded-xl text-[11px] font-bold text-white tracking-wider transition-all duration-300"
            >
              <ShoppingBag size={13} />
              COMPRAR AHORA
              <ArrowUpRight size={12} />
            </a>
          ) : (
            <div className="w-full flex flex-col items-center gap-2">
              <div
                className="w-full flex items-center justify-center gap-2.5 bg-white/[0.04] border border-white/[0.08] px-4 py-3.5 rounded-xl text-[11px] font-bold text-gray-500 tracking-wider cursor-not-allowed"
              >
                <ShoppingBag size={13} />
                PRÓXIMAMENTE
              </div>
              <span className="text-[10px] text-gray-600">Contacta para más info</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN STORE PAGE
// ═══════════════════════════════════════════
function TiendaContent() {
  const { cfg, storeItems } = useSiteConfig();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const filtered = storeItems.filter((item) => {
    const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Count items per category
  const catCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = cat === 'Todos'
      ? storeItems.length
      : storeItems.filter(i => i.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <main className="relative min-h-screen font-body">
      <Navbar />

      <SectionWrapper visual={cfg.section_store}>
        {/* ═══ HERO ═══ */}
        <section className="relative pt-32 pb-16 px-6 z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2.5 bg-neon-red/[0.06] border border-neon-red/20 px-6 py-2.5 rounded-full mb-8 opacity-0 animate-fade-in"
            >
              <ShoppingBag size={14} className="text-neon-red" />
              <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-neon-red">
                {cfg.store_label || 'Tienda'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-neon-red/60 animate-pulse" />
            </div>

            {/* Title */}
            <h1
              className="text-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 opacity-0 animate-slide-up"
              style={{ fontFamily: `${cfg.font_display}, sans-serif`, animationDelay: '0.15s' }}
            >
              {cfg.store_heading}
            </h1>

            {/* Description */}
            <p
              className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto mb-12 leading-relaxed opacity-0 animate-slide-up"
              style={{ animationDelay: '0.3s' }}
            >
              {cfg.store_desc}
            </p>

            {/* Search bar with glow */}
            <div
              className="max-w-lg mx-auto relative opacity-0 animate-slide-up"
              style={{ animationDelay: '0.4s' }}
            >
              <div
                className="absolute -inset-0.5 rounded-2xl transition-opacity duration-500 blur-md"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,0,51,0.2), rgba(168,85,247,0.2))',
                  opacity: searchFocused ? 1 : 0,
                }}
              />
              <div className="relative">
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-transform duration-300 ${searchFocused ? 'rotate-90' : ''}`}
                >
                  <Search size={16} className={`transition-colors duration-300 ${searchFocused ? 'text-neon-red' : 'text-gray-500'}`} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Buscar recursos, templates, presets..."
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl pl-12 pr-20 py-4 text-sm text-white focus:border-neon-red/40 focus:outline-none transition-all placeholder:text-gray-600 backdrop-blur-sm"
                />
                {/* Results counter */}
                {searchQuery && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 animate-fade-in">
                    <span className="text-[10px] text-gray-500 font-mono">{filtered.length}</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FILTERS + GRID ═══ */}
        <section className="px-6 pb-12 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Category filters with pill indicator */}
            <div
              ref={filterRef}
              className="flex flex-wrap items-center justify-center gap-2 mb-12 opacity-0 animate-fade-in"
              style={{ animationDelay: '0.5s' }}
            >
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                const color = cat === 'Todos' ? null : getCatColor(cat);
                const count = catCounts[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-5 py-2.5 rounded-xl text-[11px] font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 active:scale-95 ${
                      isActive
                        ? 'text-white shadow-lg'
                        : 'bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.04]'
                    }`}
                    style={isActive ? {
                      background: cat === 'Todos'
                        ? 'linear-gradient(135deg, rgba(255,0,51,0.9), rgba(236,72,153,0.9))'
                        : color?.bg.replace('0.08', '0.9'),
                      boxShadow: cat === 'Todos'
                        ? '0 4px 20px rgba(255,0,51,0.3)'
                        : `0 4px 20px ${color?.glow}`,
                    } : undefined}
                  >
                    {cat}
                    {count > 0 && (
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md ${
                        isActive ? 'bg-white/20' : 'bg-white/[0.06] text-gray-500'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Grid */}
            <div
              key={activeCategory + searchQuery}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((item, i) => (
                <StoreCard key={item.id} item={item} index={i} />
              ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="text-center py-24 animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <Package size={32} className="text-gray-600" />
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">No se encontraron recursos</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                  {searchQuery
                    ? `No hay resultados para "${searchQuery}". Intenta con otro término.`
                    : '¡Próximamente se agregarán recursos en esta categoría!'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('Todos'); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-neon-red border border-neon-red/20 hover:bg-neon-red/10 transition"
                  >
                    <X size={14} /> Limpiar búsqueda
                  </button>
                )}
              </div>
            )}

            {/* Results counter */}
            {filtered.length > 0 && (
              <p className="text-center mt-10 text-[10px] text-gray-600 uppercase tracking-[0.2em] font-medium animate-fade-in">
                {filtered.length} {filtered.length === 1 ? 'recurso disponible' : 'recursos disponibles'}
              </p>
            )}
          </div>
        </section>

        {/* ═══ CTA BANNER ═══ */}
        <section className="px-6 pb-24 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div
              className="cta-gradient rounded-3xl border border-white/[0.06] p-10 md:p-14 relative overflow-hidden opacity-0 animate-slide-up"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-neon-red/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-purple/5 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] px-4 py-1.5 rounded-full mb-4">
                    <Zap size={12} className="text-neon-red" />
                    <span className="text-[9px] font-semibold tracking-[0.12em] uppercase text-gray-400">Packs Personalizados</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                    ¿Necesitas algo <span className="neon-text">a medida</span>?
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                    Puedo crear packs exclusivos de templates, presets o assets diseñados específicamente para tu marca o proyecto.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <a
                    href="/#contacto"
                    className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-neon-red to-pink-600 hover:from-red-500 hover:to-pink-500 text-white text-sm font-bold tracking-wide shadow-lg shadow-neon-red/20 transition-all duration-300 elastic-press"
                  >
                    <MessageCircle size={16} />
                    Contáctame
                    <ArrowRight size={14} />
                  </a>
                  <span className="text-[10px] text-gray-600 text-center tracking-wide">Respuesta en menos de 24h</span>
                </div>
              </div>
            </div>
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
