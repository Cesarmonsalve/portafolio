'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Loader2, Palette, Image as ImageIcon, Film, Layers,
  ChevronDown, Eye, EyeOff, Monitor, Type, Sparkles,
  ArrowUp, ArrowDown, MousePointer, ScanLine, GripVertical, RotateCcw
} from 'lucide-react';
import { DEFAULT_CONFIG, DEFAULT_SECTION_BG, DEFAULT_SECTION_FX, type SiteConfig, type SectionVisual, type SectionBackground, type SectionEffects } from '@/lib/config';
import { notifyConfigUpdate, saveConfigData } from '@/lib/SiteConfigContext';
import { loadFromDB } from '@/lib/loadFromDB';

interface Props { onUnreadChange?: (n: number) => void; }

const SECTION_NAMES: Record<string, string> = {
  hero: '🎬 Hero',
  projects: '📁 Proyectos',
  about: '👤 About',
  skills: '🛠️ Skills',
  contact: '✉️ Contacto',
  store: '🛍️ Tienda',
  timeline: '⏳ Timeline',
  workflow: '⚡ Workflow',
  testimonials: '💬 Testimonios',
  lab: '🧪 Laboratorio',
  cases: '📁 Casos',
};

const FONT_OPTIONS = [
  'Syne', 'Inter', 'Montserrat', 'Poppins', 'Outfit', 'Space Grotesk',
  'Raleway', 'Playfair Display', 'Oswald', 'Bebas Neue', 'DM Sans',
  'Roboto', 'Nunito', 'Lato', 'Work Sans', 'Anton', 'Teko', 'Cinzel',
  'Cormorant Garamond', 'Josefin Sans', 'Prompt', 'Archivo Black', 'Lexend', 
  'Plus Jakarta Sans', 'Figtree', 'Sora', 'Manrope', 'Urbanist', 'Outfit'
];

const BG_TYPES = [
  { id: 'color', label: 'Color', icon: Palette },
  { id: 'gradient', label: 'Degradado', icon: Sparkles },
  { id: 'image', label: 'Imagen', icon: ImageIcon },
  { id: 'video', label: 'Video', icon: Film },
];

// ── Extracted Components to fix focus loss ──
const SH = ({ id, title, icon: Icon, color, openSections, toggleSection }: {
  id: string; title: string; icon: any; color: string;
  openSections: Record<string, boolean>; toggleSection: (id: string) => void;
}) => (
  <button onClick={() => toggleSection(id)} className="w-full flex items-center justify-between p-4 rounded-t-2xl hover:bg-surface/30 transition group">
    <h3 className="font-bold text-white flex items-center gap-2 text-sm">
      <Icon size={16} className={color} /> {title}
    </h3>
    <motion.div animate={{ rotate: openSections[id] ? 180 : 0 }} transition={{ duration: 0.2 }}>
      <ChevronDown size={16} className="text-gray-500 group-hover:text-gray-300 transition" />
    </motion.div>
  </button>
);

const Slider = ({ label, value, onChange, min = 0, max = 100, suffix = '%' }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; suffix?: string }) => (
  <div>
    <div className="flex justify-between mb-1.5">
      <span className="text-xs text-gray-400 font-medium">{label}</span>
      <span className="text-xs text-gray-500 font-mono">{value}{suffix}</span>
    </div>
    <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-surface rounded-full appearance-none cursor-pointer accent-red-500" />
  </div>
);

const Toggle = ({ label, value, onChange, desc }: { label: string; value: boolean; onChange: (v: boolean) => void; desc?: string }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <span className="text-sm text-white font-medium">{label}</span>
      {desc && <p className="text-[10px] text-gray-600 mt-0.5">{desc}</p>}
    </div>
    <button onClick={() => onChange(!value)}
      className={`w-10 h-5 rounded-full transition-colors relative ${value ? 'bg-red-600' : 'bg-surface-hover'}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  </div>
);

export default function AdminAppearance(_p: Props) {
  const [cfg, setCfg] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    backgrounds: true,
    titles: false,
  });

  const loadData = useCallback(async () => {
    const dbCfg = await loadFromDB<SiteConfig>('cm_site_config', DEFAULT_CONFIG);
    setCfg({ ...DEFAULT_CONFIG, ...dbCfg });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const save = async () => {
    setSaving(true);
    await saveConfigData('cm_site_config', cfg);
    notifyConfigUpdate();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleSection = (id: string) => setOpenSections(p => ({ ...p, [id]: !p[id] }));

  const getSectionVisual = (section: string): SectionVisual => {
    const key = `section_${section}` as keyof SiteConfig;
    return (cfg[key] as SectionVisual) || {};
  };

  const updateSectionVisual = (section: string, field: keyof SectionVisual, val: any) => {
    const current = getSectionVisual(section);
    setCfg(prev => ({
      ...prev,
      [`section_${section}`]: { ...current, [field]: val },
    }));
  };

  const updateBg = (section: string, field: string, val: unknown) => {
    const current = getSectionVisual(section);
    setCfg(prev => ({
      ...prev,
      [`section_${section}`]: {
        ...current,
        background: { ...current.background, [field]: val },
      },
    }));
  };

  const updateFx = (section: string, field: string, val: unknown) => {
    const current = getSectionVisual(section);
    setCfg(prev => ({
      ...prev,
      [`section_${section}`]: {
        ...current,
        effects: { ...current.effects, [field]: val },
      },
    }));
  };

  const sectionKeys = ['hero', 'projects', 'about', 'skills', 'workflow', 'timeline', 'testimonials', 'lab', 'contact', 'store', 'cases'];

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Apariencia</h1>
          <p className="text-gray-500 text-sm">Fondos, videos, efectos, tipografía y más</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 angle-frame-sm text-sm font-semibold text-[#0B0E13] bg-neon-red hover:bg-[#E2FF75] disabled:opacity-50 transition shadow-lg shadow-[0_8px_24px_rgba(203,254,28,.18)] active:scale-95">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saved ? '¡Guardado!' : 'Guardar'}
        </button>
      </div>

      {/* ═══ BACKGROUNDS & VIDEOS ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SH openSections={openSections} toggleSection={toggleSection} id="backgrounds" title="Fondos & Videos" icon={Film} color="text-red-400" />
        <AnimatePresence>
          {openSections.backgrounds && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-6">
                {sectionKeys.map(sk => {
                  const sv = getSectionVisual(sk);
                  const bg = sv.background || DEFAULT_SECTION_BG;
                  return (
                    <div key={sk} className="bg-surface/30 angle-frame-sm p-4 border border-white/[0.1]/30">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-bold text-white">{SECTION_NAMES[sk]}</span>
                        {/* Live preview dot */}
                        <div className="flex items-center gap-2">
                          {bg.type === 'video' && bg.videoUrl && <span className="text-[9px] text-green-400 bg-green-900/30 px-2 py-0.5 rounded-full">Video activo</span>}
                          {bg.type === 'image' && bg.imageUrl && <span className="text-[9px] text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded-full">Imagen activa</span>}
                        </div>
                      </div>

                      {/* Type selector */}
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {BG_TYPES.map(t => {
                          const Icon = t.icon;
                          const active = bg.type === t.id;
                          return (
                            <button key={t.id} onClick={() => updateBg(sk, 'type', t.id)}
                              className={`flex flex-col items-center gap-1 py-2.5 angle-frame-sm text-xs font-medium transition ${active ? 'bg-red-600/20 text-red-400 border border-red-600/30' : 'bg-surface text-gray-500 border border-white/[0.1]/30 hover:border-white/[0.14]'}`}>
                              <Icon size={16} />
                              {t.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Type-specific controls */}
                      {bg.type === 'color' && (
                        <div className="flex items-center gap-3">
                          <input type="color" value={bg.color || '#060606'} onChange={e => updateBg(sk, 'color', e.target.value)}
                            className="w-10 h-10 angle-frame-sm border border-white/[0.1] bg-surface cursor-pointer" />
                          <div>
                            <p className="text-sm text-white">Color de fondo</p>
                            <p className="text-xs text-gray-500 font-mono">{bg.color || '#060606'}</p>
                          </div>
                        </div>
                      )}

                      {bg.type === 'gradient' && (
                        <div>
                          <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1.5 block">Degradado CSS</label>
                          <input value={bg.gradient || ''} onChange={e => updateBg(sk, 'gradient', e.target.value)}
                            placeholder="linear-gradient(135deg, #0a0a0a, #1a0a1a)"
                            className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-neon-red/60 transition" />
                          {bg.gradient && (
                            <div className="mt-2 h-8 angle-frame-sm border border-white/[0.1]" style={{ background: bg.gradient }} />
                          )}
                        </div>
                      )}

                      {bg.type === 'image' && (
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1.5 block">URL de Imagen</label>
                            <input value={bg.imageUrl || ''} onChange={e => updateBg(sk, 'imageUrl', e.target.value)}
                              placeholder="https://... o /imagen.jpg"
                              className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neon-red/60 transition" />
                          </div>
                          <Slider label="Opacidad de imagen" value={bg.mediaOpacity ?? 40} onChange={v => updateBg(sk, 'mediaOpacity', v)} />
                          <div className="flex items-center gap-3">
                            <input type="color" value={bg.overlayColor || '#000000'} onChange={e => updateBg(sk, 'overlayColor', e.target.value)}
                              className="w-8 h-8 angle-frame-sm border border-white/[0.1] bg-surface cursor-pointer" />
                            <span className="text-xs text-gray-400">Overlay</span>
                          </div>
                          <Slider label="Opacidad de overlay" value={bg.overlayOpacity ?? 60} onChange={v => updateBg(sk, 'overlayOpacity', v)} />
                          {bg.imageUrl && (
                            <div className="mt-2 h-20 angle-frame-sm border border-white/[0.1] overflow-hidden relative">
                              <img src={bg.imageUrl} alt="Preview" className="w-full h-full object-cover" style={{ opacity: (bg.mediaOpacity ?? 40) / 100 }} />
                              <div className="absolute inset-0" style={{ backgroundColor: bg.overlayColor || '#000', opacity: (bg.overlayOpacity ?? 60) / 100 }} />
                            </div>
                          )}
                        </div>
                      )}

                      {bg.type === 'video' && (
                        <div className="space-y-3">
                          <div>
                            <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1.5 block">URL de Video (MP4/WebM)</label>
                            <input value={bg.videoUrl || ''} onChange={e => updateBg(sk, 'videoUrl', e.target.value)}
                              placeholder="https://cdn.example.com/video.mp4"
                              className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neon-red/60 transition" />
                          </div>
                          <Slider label="Opacidad de video" value={bg.mediaOpacity ?? 40} onChange={v => updateBg(sk, 'mediaOpacity', v)} />
                          <div className="flex items-center gap-3">
                            <input type="color" value={bg.overlayColor || '#000000'} onChange={e => updateBg(sk, 'overlayColor', e.target.value)}
                              className="w-8 h-8 angle-frame-sm border border-white/[0.1] bg-surface cursor-pointer" />
                            <span className="text-xs text-gray-400">Color overlay</span>
                          </div>
                          <Slider label="Opacidad de overlay" value={bg.overlayOpacity ?? 60} onChange={v => updateBg(sk, 'overlayOpacity', v)} />
                          <p className="text-[10px] text-gray-600">💡 Usa videos cortos (5-15s), muted, en loop. Formatos: MP4 o WebM.</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ VISUAL EFFECTS ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SH openSections={openSections} toggleSection={toggleSection} id="effects" title="Efectos Visuales" icon={Sparkles} color="text-violet-400" />
        <AnimatePresence>
          {openSections.effects && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-6">
                {sectionKeys.map(sk => {
                  const sv = getSectionVisual(sk);
                  const fx = sv.effects || DEFAULT_SECTION_FX;
                  return (
                    <div key={sk} className="bg-surface/30 angle-frame-sm p-4 border border-white/[0.1]/30">
                      <span className="text-sm font-bold text-white block mb-3">{SECTION_NAMES[sk]}</span>
                      <div className="space-y-2">
                        <Toggle label="Parallax" value={fx.parallax} onChange={v => updateFx(sk, 'parallax', v)} desc="Movimiento de fondo al hacer scroll" />
                        {fx.parallax && (
                          <Slider label="Intensidad parallax" value={fx.parallaxIntensity ?? 30} onChange={v => updateFx(sk, 'parallaxIntensity', v)} suffix="px" />
                        )}
                        <Toggle label="Partículas" value={fx.particles} onChange={v => updateFx(sk, 'particles', v)} desc="Puntos flotantes animados" />
                        {fx.particles && (
                          <Slider label="Cantidad" value={fx.particleCount ?? 25} onChange={v => updateFx(sk, 'particleCount', v)} min={5} max={100} suffix="" />
                        )}
                        <Toggle label="Grain / Ruido" value={fx.grain} onChange={v => updateFx(sk, 'grain', v)} desc="Textura cinematográfica" />
                        {fx.grain && (
                          <Slider label="Opacidad grain" value={fx.grainOpacity ?? 3} onChange={v => updateFx(sk, 'grainOpacity', v)} min={1} max={20} />
                        )}
                        <Toggle label="Orbs Flotantes" value={fx.floatingOrbs} onChange={v => updateFx(sk, 'floatingOrbs', v)} desc="Esferas de color difuminadas" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ SECTION VISIBILITY & ORDER ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SH openSections={openSections} toggleSection={toggleSection} id="sections" title="Secciones (Visibilidad & Orden)" icon={Layers} color="text-cyan-400" />
        <AnimatePresence>
          {openSections.sections && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-2">
                <p className="text-[10px] text-gray-600 mb-3">Muestra/oculta secciones y cambia su orden. El número más bajo aparece primero.</p>
                {sectionKeys.map(sk => {
                  const sv = getSectionVisual(sk);
                  return (
                    <div key={sk} className="flex items-center gap-3 bg-surface/30 angle-frame-sm p-3 border border-white/[0.1]/30">
                      <GripVertical size={14} className="text-gray-600 shrink-0" />
                      <span className="text-sm font-medium text-white flex-1">{SECTION_NAMES[sk]}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => {
                          const pos = sv.position ?? 0;
                          if (pos > 0) updateSectionVisual(sk, 'position', pos - 1);
                        }} className="p-1 text-gray-500 hover:text-white transition"><ArrowUp size={14} /></button>
                        <span className="text-xs text-gray-500 font-mono w-6 text-center">{sv.position ?? 0}</span>
                        <button onClick={() => {
                          const pos = sv.position ?? 0;
                          if (pos < 4) updateSectionVisual(sk, 'position', pos + 1);
                        }} className="p-1 text-gray-500 hover:text-white transition"><ArrowDown size={14} /></button>
                      </div>
                      <button onClick={() => updateSectionVisual(sk, 'visible', !sv.visible)}
                        className={`p-1.5 angle-frame-sm transition ${sv.visible ? 'text-green-400 bg-green-900/20' : 'text-gray-600 bg-surface'}`}>
                        {sv.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ TYPOGRAPHY ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SH openSections={openSections} toggleSection={toggleSection} id="typography" title="Tipografía" icon={Type} color="text-amber-400" />
        <AnimatePresence>
          {openSections.typography && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-4">
                {/* Display font */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">Fuente Display (Títulos)</label>
                  <select value={cfg.font_display || 'Syne'} onChange={e => setCfg(p => ({ ...p, font_display: e.target.value }))}
                    className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition">
                    {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <div className="mt-2 p-3 bg-surface/50 angle-frame-sm border border-white/[0.1]/30">
                    <p className="text-lg text-white" style={{ fontFamily: `${cfg.font_display || 'Syne'}, sans-serif` }}>Vista previa: {cfg.font_display || 'Syne'}</p>
                  </div>
                </div>

                {/* Body font */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">Fuente Body (Cuerpo)</label>
                  <select value={cfg.font_body || 'Inter'} onChange={e => setCfg(p => ({ ...p, font_body: e.target.value }))}
                    className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition">
                    {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                {/* Heading size */}
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">Tamaño de Títulos</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['sm', 'md', 'lg', 'xl'] as const).map(sz => (
                      <button key={sz} onClick={() => setCfg(p => ({ ...p, heading_size: sz }))}
                        className={`py-2 angle-frame-sm text-sm font-bold uppercase transition ${cfg.heading_size === sz ? 'bg-red-600/20 text-red-400 border border-red-600/30' : 'bg-surface text-gray-500 border border-white/[0.1]/30 hover:border-white/[0.14]'}`}>
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ TEXTOS Y TÍTULOS PRINCIPALES ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SH openSections={openSections} toggleSection={toggleSection} id="titles" title="Títulos y Logos (Hero & About)" icon={ImageIcon} color="text-blue-400" />
        <AnimatePresence>
          {openSections.titles && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-6 mt-4">
                 {/* Hero Title */}
                 <div className="bg-surface/30 angle-frame-sm p-4 border border-white/[0.1]/30 space-y-3">
                   <span className="text-sm font-bold text-white block mb-3">TÍTULO HERO (Inicio)</span>
                   <div className="grid grid-cols-2 gap-2 mb-2">
                     <button onClick={() => setCfg(p => ({ ...p, hero_name_type: 'text' }))} className={`py-2 angle-frame-sm text-xs font-medium transition ${cfg.hero_name_type !== 'image' ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'bg-surface text-gray-500 border border-white/[0.1]/30'}`}>Texto Glitch</button>
                     <button onClick={() => setCfg(p => ({ ...p, hero_name_type: 'image' }))} className={`py-2 angle-frame-sm text-xs font-medium transition ${cfg.hero_name_type === 'image' ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'bg-surface text-gray-500 border border-white/[0.1]/30'}`}>Imagen (PNG/Logo)</button>
                   </div>
                   
                   {cfg.hero_name_type === 'image' ? (
                     <div>
                       <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1.5 block">URL del Logotipo (PNG)</label>
                       <input value={cfg.hero_name_image || ''} onChange={e => setCfg(p => ({ ...p, hero_name_image: e.target.value }))} placeholder="https://... o /logo.png" className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition mb-3" />
                       {cfg.hero_name_image && <img src={cfg.hero_name_image} alt="Logo preview" className="h-12 object-contain bg-surface/50 angle-frame-sm p-2 border border-white/[0.1]/30" />}
                     </div>
                   ) : (
                     <div>
                       <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1.5 block">Texto del Título</label>
                       <input value={cfg.hero_name || ''} onChange={e => setCfg(p => ({ ...p, hero_name: e.target.value }))} className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition mb-3" />
                     </div>
                   )}
                   
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1.5 block">Alineación</label>
                       <select value={cfg.hero_name_align || 'center'} onChange={e => setCfg(p => ({ ...p, hero_name_align: e.target.value as any }))} className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition">
                         <option value="left">Izquierda</option>
                         <option value="center">Centro</option>
                         <option value="right">Derecha</option>
                       </select>
                     </div>
                     <div>
                        <Slider label="Escala / Tamaño" value={cfg.hero_name_scale || 100} onChange={v => setCfg(p => ({ ...p, hero_name_scale: v }))} min={20} max={300} />
                     </div>
                   </div>
                 </div>

                 {/* About Title */}
                 <div className="bg-surface/30 angle-frame-sm p-4 border border-white/[0.1]/30 space-y-3">
                   <span className="text-sm font-bold text-white block mb-3">TÍTULO SOBRE MÍ</span>
                   <div className="grid grid-cols-2 gap-2 mb-2">
                     <button onClick={() => setCfg(p => ({ ...p, about_heading_type: 'text' }))} className={`py-2 angle-frame-sm text-xs font-medium transition ${cfg.about_heading_type !== 'image' ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'bg-surface text-gray-500 border border-white/[0.1]/30'}`}>Texto</button>
                     <button onClick={() => setCfg(p => ({ ...p, about_heading_type: 'image' }))} className={`py-2 angle-frame-sm text-xs font-medium transition ${cfg.about_heading_type === 'image' ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'bg-surface text-gray-500 border border-white/[0.1]/30'}`}>Imagen (PNG/Logo)</button>
                   </div>
                   
                   {cfg.about_heading_type === 'image' ? (
                     <div>
                       <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1.5 block">URL del Logotipo (PNG)</label>
                       <input value={cfg.about_heading_image || ''} onChange={e => setCfg(p => ({ ...p, about_heading_image: e.target.value }))} placeholder="https://... o /logo.png" className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition mb-3" />
                       {cfg.about_heading_image && <img src={cfg.about_heading_image} alt="Logo preview" className="h-12 object-contain bg-surface/50 angle-frame-sm p-2 border border-white/[0.1]/30" />}
                     </div>
                   ) : (
                     <div>
                       <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1.5 block">Texto del Título</label>
                       <input value={cfg.about_heading || ''} onChange={e => setCfg(p => ({ ...p, about_heading: e.target.value }))} className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition mb-3" />
                     </div>
                   )}

                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1.5 block">Alineación</label>
                       <select value={cfg.about_heading_align || 'left'} onChange={e => setCfg(p => ({ ...p, about_heading_align: e.target.value as any }))} className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition">
                         <option value="left">Izquierda</option>
                         <option value="center">Centro</option>
                         <option value="right">Derecha</option>
                       </select>
                     </div>
                     <div>
                        <Slider label="Escala / Tamaño" value={cfg.about_heading_scale || 100} onChange={v => setCfg(p => ({ ...p, about_heading_scale: v }))} min={20} max={300} />
                     </div>
                   </div>
                 </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ GLOBAL EFFECTS ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SH openSections={openSections} toggleSection={toggleSection} id="global" title="Efectos Globales" icon={Monitor} color="text-green-400" />
        <AnimatePresence>
          {openSections.global && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-2">
                <Toggle label="Cursor Personalizado" value={cfg.show_cursor !== false} onChange={v => setCfg(p => ({ ...p, show_cursor: v }))} desc="Cursor magnético con anillo" />
                <Toggle label="Barra de Progreso" value={cfg.show_scroll_progress !== false} onChange={v => setCfg(p => ({ ...p, show_scroll_progress: v }))} desc="Barra roja en la parte superior al scrollear" />
                <Toggle label="Scanlines" value={cfg.show_scanlines === true} onChange={v => setCfg(p => ({ ...p, show_scanlines: v }))} desc="Líneas CRT retro sobre toda la página" />
                <Toggle label="Grain Global" value={cfg.show_grain !== false} onChange={v => setCfg(p => ({ ...p, show_grain: v }))} desc="Textura de ruido sobre toda la página" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ MARQUEE ITEMS ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SH openSections={openSections} toggleSection={toggleSection} id="marquee" title="Marquee (Barra Inferior Hero)" icon={ScanLine} color="text-pink-400" />
        <AnimatePresence>
          {openSections.marquee && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-3">
                <div className="mb-4">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Estilo de Animación</label>
                  <select
                    value={cfg.marquee_style || 'lasso'}
                    onChange={e => setCfg(p => ({ ...p, marquee_style: e.target.value }))}
                    className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500/50 transition appearance-none"
                  >
                    <option value="minimal">Minimalista (Limpio)</option>
                    <option value="neon">Neón (Brillante)</option>
                    <option value="lasso">Lazo (Motion Graphic)</option>
                    <option value="cyberpunk">Cyberpunk (Agresivo)</option>
                    <option value="glitch">Glitch (Señal Rota)</option>
                  </select>
                </div>
                <div className="h-px w-full bg-surface my-4" />
                <p className="text-[10px] text-gray-600">Los textos que aparecen en la barra animada al fondo del Hero. Separados por item.</p>
                {(cfg.marquee_items || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input value={item} onChange={e => {
                      const items = [...(cfg.marquee_items || [])];
                      items[i] = e.target.value;
                      setCfg(p => ({ ...p, marquee_items: items }));
                    }} className="flex-1 bg-surface border border-white/[0.1] angle-frame-sm px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500/50 transition" />
                    <button onClick={() => {
                      const items = [...(cfg.marquee_items || [])];
                      items.splice(i, 1);
                      setCfg(p => ({ ...p, marquee_items: items }));
                    }} className="p-1.5 angle-frame-sm text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition text-xs">✕</button>
                  </div>
                ))}
                <button onClick={() => setCfg(p => ({ ...p, marquee_items: [...(p.marquee_items || []), 'Nuevo Item'] }))}
                  className="w-full flex items-center justify-center gap-2 py-2 angle-frame-sm border border-dashed border-white/[0.1] text-gray-500 hover:text-white hover:border-white/20 transition text-sm">
                  + Agregar Item
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="h-8" />
    </div>
  );
}
