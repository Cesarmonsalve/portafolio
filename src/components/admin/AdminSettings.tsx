'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Loader2, Palette, Type, Mail, Info, Globe, Hash,
  Plus, X, Trash2, GripVertical, ChevronDown, ChevronUp,
  Sparkles, Image as ImageIcon, Link as LinkIcon, Award,
  Eye, RotateCcw, ShoppingBag, CreditCard, Layers3, FlaskConical
} from 'lucide-react';
import {
  FaInstagram, FaYoutube, FaTiktok, FaWhatsapp,
  FaBehance, FaXTwitter, FaLinkedin, FaFacebook,
  FaGithub, FaDribbble, FaTwitch, FaLink, FaDiscord, FaPinterest
} from 'react-icons/fa6';
import { DEFAULT_CONFIG, type SiteConfig, type SocialLink } from '@/lib/config';
import { notifyConfigUpdate, saveConfigData } from '@/lib/SiteConfigContext';
import { loadFromDB } from '@/lib/loadFromDB';
import IconPicker from './IconPicker';

interface Props { onUnreadChange?: (n: number) => void; }

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: FaInstagram, color: '#E4405F' },
  { id: 'youtube', label: 'YouTube', icon: FaYoutube, color: '#FF0000' },
  { id: 'tiktok', label: 'TikTok', icon: FaTiktok, color: '#000000' },
  { id: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, color: '#25D366' },
  { id: 'behance', label: 'Behance', icon: FaBehance, color: '#1769FF' },
  { id: 'twitter', label: 'X / Twitter', icon: FaXTwitter, color: '#000000' },
  { id: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2' },
  { id: 'facebook', label: 'Facebook', icon: FaFacebook, color: '#1877F2' },
  { id: 'github', label: 'GitHub', icon: FaGithub, color: '#181717' },
  { id: 'dribbble', label: 'Dribbble', icon: FaDribbble, color: '#EA4C89' },
  { id: 'twitch', label: 'Twitch', icon: FaTwitch, color: '#9146FF' },
  { id: 'discord', label: 'Discord', icon: FaDiscord, color: '#5865F2' },
  { id: 'pinterest', label: 'Pinterest', icon: FaPinterest, color: '#BD081C' },
  { id: 'other', label: 'Otro', icon: FaLink, color: '#888888' },
];

// ── Extracted Components to fix focus loss ──
const SectionHeader = ({ id, title, icon: Icon, iconColor, count, openSections, toggleSection }: {
  id: string; title: string; icon: any; iconColor: string; count?: number;
  openSections: Record<string, boolean>; toggleSection: (id: string) => void;
}) => (
  <button
    onClick={() => toggleSection(id)}
    className="w-full flex items-center justify-between p-4 rounded-t-2xl hover:bg-surface/30 transition group"
  >
    <h3 className="font-bold text-white flex items-center gap-2 text-sm">
      <Icon size={16} className={iconColor} />
      {title}
      {count !== undefined && (
        <span className="text-xs px-2 py-0.5 rounded-full bg-surface text-gray-500 font-mono">{count}</span>
      )}
    </h3>
    <motion.div animate={{ rotate: openSections[id] ? 180 : 0 }} transition={{ duration: 0.2 }}>
      <ChevronDown size={16} className="text-gray-500 group-hover:text-gray-300 transition" />
    </motion.div>
  </button>
);

const Field = ({ label, field, multi, placeholder, getFieldValue, update }: {
  label: string; field: string; multi?: boolean; placeholder?: string;
  getFieldValue: (f: string) => string; update: (f: string, v: string) => void;
}) => (
  <div>
    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">{label}</label>
    {multi ? (
      <textarea value={getFieldValue(field)} onChange={e => update(field, e.target.value)} rows={3}
        placeholder={placeholder}
        className="w-full bg-surface/50 border border-white/[0.1]/50 angle-frame-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neon-red/60 focus:ring-1 focus:ring-neon-red/25 transition resize-none" />
    ) : (
      <input value={getFieldValue(field)} onChange={e => update(field, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface/50 border border-white/[0.1]/50 angle-frame-sm px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neon-red/60 focus:ring-1 focus:ring-neon-red/25 transition" />
    )}
  </div>
);

const ColorField = ({ label, field, getFieldValue, update }: {
  label: string; field: string;
  getFieldValue: (f: string) => string; update: (f: string, v: string) => void;
}) => (
  <div className="flex items-center gap-3 bg-surface/30 angle-frame-sm p-3 border border-white/[0.1]/30">
    <input type="color" value={getFieldValue(field) || '#ff0033'}
      onChange={e => update(field, e.target.value)}
      className="w-10 h-10 angle-frame-sm border border-white/[0.1] bg-surface cursor-pointer flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-sm text-white font-medium">{label}</p>
      <p className="text-xs text-gray-500 font-mono">{getFieldValue(field) || '#ff0033'}</p>
    </div>
    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: getFieldValue(field) || '#ff0033' }} />
  </div>
);

export default function AdminSettings(_p: Props) {
  const [cfg, setCfg] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ hero: true });

  const loadData = useCallback(async () => {
    const [dbCfg, dbSocials] = await Promise.all([
      loadFromDB<SiteConfig>('cm_site_config', DEFAULT_CONFIG),
      loadFromDB<SocialLink[]>('cm_socials', []),
    ]);
    setCfg(prev => ({ ...DEFAULT_CONFIG, ...dbCfg }));
    setSocials(dbSocials);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    setSaving(true);
    await saveConfigData('cm_site_config', cfg);
    await saveConfigData('cm_socials', socials);
    notifyConfigUpdate();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('¿Restaurar a valores de fábrica? Perderás tus cambios no guardados.')) {
      setCfg(DEFAULT_CONFIG);
    }
  };

  const toggleSection = (id: string) => setOpenSections(p => ({ ...p, [id]: !p[id] }));

  const getFieldValue = (field: string) => (cfg as any)[field] || '';
  const update = (field: string, value: any) => setCfg(p => ({ ...p, [field]: value }));

  const updateStat = (i: number, field: string, val: string) => {
    const s = [...cfg.hero_stats];
    s[i] = { ...s[i], [field]: val };
    update('hero_stats', s);
  };
  const addStat = () => update('hero_stats', [...cfg.hero_stats, { value: '0', label: 'Nuevo' }]);
  const removeStat = (i: number) => {
    const s = [...cfg.hero_stats];
    s.splice(i, 1);
    update('hero_stats', s);
  };

  const updateSpecialty = (i: number, field: string, val: string) => {
    const s = [...cfg.about_specialties];
    s[i] = { ...s[i], [field]: val };
    update('about_specialties', s);
  };
  const addSpecialty = () => update('about_specialties', [...cfg.about_specialties, { title: 'Nueva', desc: '' }]);
  const removeSpecialty = (i: number) => {
    const s = [...cfg.about_specialties];
    s.splice(i, 1);
    update('about_specialties', s);
  };

  const updateSocial = (id: string, field: string, val: any) => {
    setSocials(p => p.map(s => s.id === id ? { ...s, [field]: val } : s));
  };
  const addSocial = () => setSocials(p => [...p, { id: Date.now().toString(), platform: 'instagram', url: '', icon: 'instagram', enabled: true, position: p.length }]);
  const deleteSocial = (id: string) => setSocials(p => p.filter(s => s.id !== id));

  return (
    <div className="space-y-4 max-w-3xl">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Configuración</h1>
          <p className="text-gray-500 text-sm">Personaliza cada aspecto de tu portafolio</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 angle-frame-sm text-sm text-gray-400 hover:text-white bg-surface hover:bg-surface-hover transition active:scale-95">
            <RotateCcw size={14} /> Reset
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 angle-frame-sm text-sm font-semibold text-[#0B0E13] bg-neon-red hover:bg-[#E2FF75] disabled:opacity-50 transition shadow-lg shadow-[0_8px_24px_rgba(203,254,28,.18)] active:scale-95">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saved ? '¡Guardado!' : 'Guardar Todo'}
          </button>
        </div>
      </div>

      {/* ═══ HERO SECTION ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SectionHeader openSections={openSections} toggleSection={toggleSection} id="hero" title="Sección Hero" icon={Type} iconColor="text-red-400" />
        <AnimatePresence>
          {openSections.hero && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-4">
                <Field getFieldValue={getFieldValue} update={update} label="Nombre / Título Principal" field="hero_name" placeholder="CM DESIGN" />
                <Field getFieldValue={getFieldValue} update={update} label="Subtítulo" field="hero_subtitle" placeholder="Motion Graphics & Visual Design" />
                <Field getFieldValue={getFieldValue} update={update} label="Descripción" field="hero_description" multi placeholder="Describe tu trabajo..." />
                <Field getFieldValue={getFieldValue} update={update} label="Badge (Etiqueta superior)" field="hero_badge" placeholder="Motion Graphics & Flyer Design" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ HERO STATS ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SectionHeader openSections={openSections} toggleSection={toggleSection} id="stats" title="Estadísticas del Hero" icon={Hash} iconColor="text-amber-400" count={cfg.hero_stats.length} />
        <AnimatePresence>
          {openSections.stats && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-3">
                {cfg.hero_stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3 bg-surface/30 angle-frame-sm p-3 border border-white/[0.1]/30">
                    <GripVertical size={14} className="text-gray-600 flex-shrink-0" />
                    <input value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)}
                      className="w-20 bg-surface border border-white/[0.1] angle-frame-sm px-3 py-1.5 text-white text-sm text-center font-bold focus:outline-none focus:border-neon-red/60 transition"
                      placeholder="50+" />
                    <input value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)}
                      className="flex-1 bg-surface border border-white/[0.1] angle-frame-sm px-3 py-1.5 text-white text-sm focus:outline-none focus:border-neon-red/60 transition"
                      placeholder="Proyectos" />
                    <button onClick={() => removeStat(i)} className="p-1.5 angle-frame-sm text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button onClick={addStat}
                  className="w-full flex items-center justify-center gap-2 py-2.5 angle-frame-sm border border-dashed border-white/[0.1] text-gray-500 hover:text-white hover:border-white/20 transition text-sm">
                  <Plus size={14} /> Agregar Estadística
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ HERO ROTATING TEXTS ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SectionHeader openSections={openSections} toggleSection={toggleSection} id="herotexts" title="Roles del Hero" icon={Type} iconColor="text-pink-400" count={(cfg.hero_rotating_texts || []).length} />
        <AnimatePresence>
          {openSections.herotexts && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-3">
                {(cfg.hero_rotating_texts || []).map((text, i) => (
                  <div key={i} className="flex items-center gap-3 bg-surface/30 angle-frame-sm p-3 border border-white/[0.1]/30">
                    <GripVertical size={14} className="text-gray-600 flex-shrink-0" />
                    <input value={text} onChange={e => {
                      const texts = [...(cfg.hero_rotating_texts || [])];
                      texts[i] = e.target.value;
                      update('hero_rotating_texts', texts);
                    }} className="flex-1 bg-surface border border-white/[0.1] angle-frame-sm px-3 py-1.5 text-white text-sm focus:outline-none focus:border-pink-500/50 transition" placeholder="Motion Designer" />
                    <button onClick={() => {
                      const texts = [...(cfg.hero_rotating_texts || [])];
                      texts.splice(i, 1);
                      update('hero_rotating_texts', texts);
                    }} className="p-1.5 angle-frame-sm text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button onClick={() => update('hero_rotating_texts', [...(cfg.hero_rotating_texts || []), 'Nuevo Rol'])}
                  className="w-full flex items-center justify-center gap-2 py-2.5 angle-frame-sm border border-dashed border-white/[0.1] text-gray-500 hover:text-white hover:border-white/20 transition text-sm">
                  <Plus size={14} /> Agregar Rol
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ COMMAND CENTER ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SectionHeader openSections={openSections} toggleSection={toggleSection} id="cmdcenter" title="Command Center" icon={Sparkles} iconColor="text-cyan-400" count={(cfg.command_center_tools || []).length} />
        <AnimatePresence>
          {openSections.cmdcenter && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-4">
                <Field getFieldValue={getFieldValue} update={update} label="Etiqueta Inferior Izquierda" field="command_center_label" placeholder="Campañas" />
                
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">Herramientas (Textos rotativos)</label>
                  <div className="space-y-3">
                    {(cfg.command_center_tools || []).map((tool, i) => (
                      <div key={i} className="flex items-center gap-3 bg-surface/30 angle-frame-sm p-3 border border-white/[0.1]/30">
                        <GripVertical size={14} className="text-gray-600 flex-shrink-0" />
                        <input value={tool} onChange={e => {
                          const tools = [...(cfg.command_center_tools || [])];
                          tools[i] = e.target.value;
                          update('command_center_tools', tools);
                        }} className="flex-1 bg-surface border border-white/[0.1] angle-frame-sm px-3 py-1.5 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition" placeholder="After Effects" />
                        <button onClick={() => {
                          const tools = [...(cfg.command_center_tools || [])];
                          tools.splice(i, 1);
                          update('command_center_tools', tools);
                        }} className="p-1.5 angle-frame-sm text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => update('command_center_tools', [...(cfg.command_center_tools || []), 'Nueva Herramienta'])}
                      className="w-full flex items-center justify-center gap-2 py-2.5 angle-frame-sm border border-dashed border-white/[0.1] text-gray-500 hover:text-white hover:border-white/20 transition text-sm">
                      <Plus size={14} /> Agregar Herramienta
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ ABOUT SECTION ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SectionHeader openSections={openSections} toggleSection={toggleSection} id="about" title="Sección About" icon={Info} iconColor="text-blue-400" />
        <AnimatePresence>
          {openSections.about && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-4">
                <Field getFieldValue={getFieldValue} update={update} label="Label (etiqueta superior)" field="about_label" placeholder="Sobre Mí" />
                <Field getFieldValue={getFieldValue} update={update} label="Heading (título principal)" field="about_heading" placeholder="Impulsando la visión detrás del diseño" />
                <Field getFieldValue={getFieldValue} update={update} label="Cargo / Rol" field="about_job_title" placeholder="Director Creativo" />
                <Field getFieldValue={getFieldValue} update={update} label="Título" field="about_title" placeholder="Diseñador Visual" />
                <Field getFieldValue={getFieldValue} update={update} label="Bio principal" field="about_bio" multi placeholder="Quién eres y qué haces..." />
                <Field getFieldValue={getFieldValue} update={update} label="Bio extendida" field="about_bio_extended" multi placeholder="Más detalles sobre tu enfoque..." />
                <Field getFieldValue={getFieldValue} update={update} label="URL Foto de perfil" field="about_photo" placeholder="https://... o /imagen.jpg" />
                <Field getFieldValue={getFieldValue} update={update} label="URL Logo" field="logo_url" placeholder="/logo.png" />
                <Field getFieldValue={getFieldValue} update={update} label="URL Favicon" field="favicon_url" placeholder="/favicon.ico" />
                <div className="flex gap-4">
                  {cfg.about_photo && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-500 uppercase">Perfil</p>
                      <div className="relative w-20 h-20 angle-frame-sm overflow-hidden border border-white/[0.1]">
                        <img src={cfg.about_photo} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                  {cfg.logo_url && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-500 uppercase">Logo</p>
                      <div className="relative w-20 h-20 angle-frame-sm overflow-hidden border border-white/[0.1] bg-surface flex items-center justify-center p-2">
                        <img src={cfg.logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ ABOUT STATS ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SectionHeader openSections={openSections} toggleSection={toggleSection} id="aboutstats" title="Estadísticas About" icon={Hash} iconColor="text-teal-400" count={(cfg as unknown as Record<string, {value:string;label:string}[]>).about_stats?.length || 0} />
        <AnimatePresence>
          {openSections.aboutstats && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-3">
                {((cfg as unknown as Record<string, {value:string;label:string}[]>).about_stats || []).map((stat: {value:string;label:string}, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-surface/30 angle-frame-sm p-3 border border-white/[0.1]/30">
                    <GripVertical size={14} className="text-gray-600 flex-shrink-0" />
                    <input value={stat.value} onChange={e => {
                      const stats = [...((cfg as unknown as Record<string, {value:string;label:string}[]>).about_stats || [])];
                      stats[i] = { ...stats[i], value: e.target.value };
                      update('about_stats', stats);
                    }} className="w-20 bg-surface border border-white/[0.1] angle-frame-sm px-3 py-1.5 text-white text-sm text-center font-bold focus:outline-none focus:border-teal-500/50 transition" placeholder="5+" />
                    <input value={stat.label} onChange={e => {
                      const stats = [...((cfg as unknown as Record<string, {value:string;label:string}[]>).about_stats || [])];
                      stats[i] = { ...stats[i], label: e.target.value };
                      update('about_stats', stats);
                    }} className="flex-1 bg-surface border border-white/[0.1] angle-frame-sm px-3 py-1.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition" placeholder="Años Exp." />
                    <button onClick={() => {
                      const stats = [...((cfg as unknown as Record<string, {value:string;label:string}[]>).about_stats || [])];
                      stats.splice(i, 1);
                      update('about_stats', stats);
                    }} className="p-1.5 angle-frame-sm text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button onClick={() => update('about_stats', [...((cfg as unknown as Record<string, {value:string;label:string}[]>).about_stats || []), { value: '0', label: 'Nuevo' }])}
                  className="w-full flex items-center justify-center gap-2 py-2.5 angle-frame-sm border border-dashed border-white/[0.1] text-gray-500 hover:text-white hover:border-white/20 transition text-sm">
                  <Plus size={14} /> Agregar Estadística
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ SPECIALTIES ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SectionHeader openSections={openSections} toggleSection={toggleSection} id="specialties" title="Especialidades" icon={Award} iconColor="text-violet-400" count={cfg.about_specialties.length} />
        <AnimatePresence>
          {openSections.specialties && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-3">
                {cfg.about_specialties.map((spec, i) => (
                  <div key={i} className="bg-surface/30 angle-frame-sm p-3 border border-white/[0.1]/30 space-y-2">
                    <div className="flex items-center gap-2">
                      <input value={spec.title} onChange={e => updateSpecialty(i, 'title', e.target.value)}
                        className="flex-1 bg-surface border border-white/[0.1] angle-frame-sm px-3 py-1.5 text-white text-sm font-bold focus:outline-none focus:border-violet-500/50 transition"
                        placeholder="Nombre de especialidad" />
                      <button onClick={() => removeSpecialty(i)} className="p-1.5 angle-frame-sm text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input value={spec.desc} onChange={e => updateSpecialty(i, 'desc', e.target.value)}
                      className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-3 py-1.5 text-gray-300 text-sm focus:outline-none focus:border-violet-500/50 transition"
                      placeholder="Descripción breve" />
                  </div>
                ))}
                <button onClick={addSpecialty}
                  className="w-full flex items-center justify-center gap-2 py-2.5 angle-frame-sm border border-dashed border-white/[0.1] text-gray-500 hover:text-white hover:border-white/20 transition text-sm">
                  <Plus size={14} /> Agregar Especialidad
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ WORKFLOW SECTION ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SectionHeader openSections={openSections} toggleSection={toggleSection} id="workflow" title="Mi Proceso (Workflow)" icon={Layers3} iconColor="text-blue-400" count={(cfg.workflow_steps || []).length} />
        <AnimatePresence>
          {openSections.workflow && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-4">
                {(cfg.workflow_steps || []).map((step, i) => (
                  <div key={i} className="bg-surface/30 angle-frame-sm p-4 border border-white/[0.1]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Paso {i + 1}</span>
                      <button onClick={() => {
                        const steps = [...(cfg.workflow_steps || [])];
                        steps.splice(i, 1);
                        update('workflow_steps', steps);
                      }} className="p-1.5 angle-frame-sm text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <input value={step.title} onChange={e => {
                      const steps = [...(cfg.workflow_steps || [])];
                      steps[i] = { ...steps[i], title: e.target.value };
                      update('workflow_steps', steps);
                    }} className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-3 py-1.5 text-white text-sm font-bold focus:outline-none focus:border-blue-500/50 transition" placeholder="Título" />
                    
                    <textarea value={step.desc} onChange={e => {
                      const steps = [...(cfg.workflow_steps || [])];
                      steps[i] = { ...steps[i], desc: e.target.value };
                      update('workflow_steps', steps);
                    }} className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-3 py-1.5 text-gray-300 text-sm focus:outline-none focus:border-blue-500/50 transition resize-none" placeholder="Descripción del paso" rows={2} />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Color (HEX)</label>
                        <input type="color" value={step.accent || '#60a5fa'} onChange={e => {
                          const steps = [...(cfg.workflow_steps || [])];
                          steps[i] = { ...steps[i], accent: e.target.value };
                          update('workflow_steps', steps);
                        }} className="w-full h-8 angle-frame-sm border border-white/[0.1] bg-surface cursor-pointer" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Ícono</label>
                        <select value={step.icon} onChange={e => {
                          const steps = [...(cfg.workflow_steps || [])];
                          steps[i] = { ...steps[i], icon: e.target.value };
                          update('workflow_steps', steps);
                        }} className="w-full h-8 bg-surface border border-white/[0.1] angle-frame-sm px-2 text-xs text-white focus:outline-none">
                          <option value="Search">Search</option>
                          <option value="Lightbulb">Lightbulb</option>
                          <option value="Palette">Palette</option>
                          <option value="Code2">Code2</option>
                          <option value="BarChart3">BarChart</option>
                          <option value="Monitor">Monitor</option>
                          <option value="PenTool">Pen</option>
                          <option value="Video">Video</option>
                          <option value="Zap">Zap</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => update('workflow_steps', [...(cfg.workflow_steps || []), { title: 'Nuevo', desc: '', icon: 'Search', accent: '#ffffff' }])}
                  className="w-full flex items-center justify-center gap-2 py-2.5 angle-frame-sm border border-dashed border-white/[0.1] text-gray-500 hover:text-white hover:border-white/20 transition text-sm">
                  <Plus size={14} /> Agregar Paso
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ LAB SECTION ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SectionHeader openSections={openSections} toggleSection={toggleSection} id="lab" title="Laboratorio / Experimentos" icon={FlaskConical} iconColor="text-green-400" count={(cfg.lab_experiments || []).length} />
        <AnimatePresence>
          {openSections.lab && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-4">
                {(cfg.lab_experiments || []).map((exp, i) => (
                  <div key={i} className="bg-surface/30 angle-frame-sm p-4 border border-white/[0.1]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Experimento {i + 1}</span>
                      <button onClick={() => {
                        const exps = [...(cfg.lab_experiments || [])];
                        exps.splice(i, 1);
                        update('lab_experiments', exps);
                      }} className="p-1.5 angle-frame-sm text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <input value={exp.title} onChange={e => {
                      const exps = [...(cfg.lab_experiments || [])];
                      exps[i] = { ...exps[i], title: e.target.value };
                      update('lab_experiments', exps);
                    }} className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-3 py-1.5 text-white text-sm font-bold focus:outline-none focus:border-green-500/50 transition" placeholder="Título del experimento" />
                    
                    <textarea value={exp.desc} onChange={e => {
                      const exps = [...(cfg.lab_experiments || [])];
                      exps[i] = { ...exps[i], desc: e.target.value };
                      update('lab_experiments', exps);
                    }} className="w-full bg-surface border border-white/[0.1] angle-frame-sm px-3 py-1.5 text-gray-300 text-sm focus:outline-none focus:border-green-500/50 transition resize-none" placeholder="Descripción breve" rows={2} />
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 block mb-1">Estado</label>
                        <select value={exp.status} onChange={e => {
                          const exps = [...(cfg.lab_experiments || [])];
                          exps[i] = { ...exps[i], status: e.target.value };
                          update('lab_experiments', exps);
                        }} className="w-full h-8 bg-surface border border-white/[0.1] angle-frame-sm px-2 text-xs text-white focus:outline-none">
                          <option value="En progreso">En progreso</option>
                          <option value="Concepto">Concepto</option>
                          <option value="Beta">Beta</option>
                        </select>
                      </div>
                      <div className="flex-[2]">
                        <label className="text-xs text-gray-500 block mb-1">Tags (separados por coma)</label>
                        <input value={exp.tags?.join(', ') || ''} onChange={e => {
                          const exps = [...(cfg.lab_experiments || [])];
                          exps[i] = { ...exps[i], tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) };
                          update('lab_experiments', exps);
                        }} className="w-full h-8 bg-surface border border-white/[0.1] angle-frame-sm px-3 text-xs text-white focus:outline-none" placeholder="C4D, Motion, Design..." />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={() => update('lab_experiments', [...(cfg.lab_experiments || []), { title: 'Nuevo', desc: '', status: 'Concepto', tags: [] }])}
                  className="w-full flex items-center justify-center gap-2 py-2.5 angle-frame-sm border border-dashed border-white/[0.1] text-gray-500 hover:text-white hover:border-white/20 transition text-sm">
                  <Plus size={14} /> Agregar Experimento
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ SKILLS SECTION TEXT ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SectionHeader openSections={openSections} toggleSection={toggleSection} id="skillstext" title="Textos de Skills" icon={Sparkles} iconColor="text-orange-400" />
        <AnimatePresence>
          {openSections.skillstext && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-4">
                <Field getFieldValue={getFieldValue} update={update} label="Label (etiqueta)" field="skills_label" placeholder="Expertise" />
                <Field getFieldValue={getFieldValue} update={update} label="Heading" field="skills_heading" placeholder="Dominio Técnico" />
                <Field getFieldValue={getFieldValue} update={update} label="Descripción" field="skills_desc" multi placeholder="Herramientas de nivel profesional..." />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ PROJECTS SECTION TEXT ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SectionHeader openSections={openSections} toggleSection={toggleSection} id="projectstext" title="Textos de Proyectos" icon={Info} iconColor="text-yellow-400" />
        <AnimatePresence>
          {openSections.projectstext && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-4">
                <Field getFieldValue={getFieldValue} update={update} label="Label (etiqueta)" field="projects_label" placeholder="Portfolio" />
                <Field getFieldValue={getFieldValue} update={update} label="Heading" field="projects_heading" placeholder="Trabajos Destacados" />
                <Field getFieldValue={getFieldValue} update={update} label="Descripción" field="projects_desc" multi placeholder="Una selección curada..." />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ STORE SECTION TEXT ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SectionHeader openSections={openSections} toggleSection={toggleSection} id="storetext" title="Textos de Tienda" icon={ShoppingBag} iconColor="text-teal-400" />
        <AnimatePresence>
          {openSections.storetext && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-4">
                <Field getFieldValue={getFieldValue} update={update} label="Label (etiqueta)" field="store_label" placeholder="Tienda CM Design" />
                <Field getFieldValue={getFieldValue} update={update} label="Heading" field="store_heading" placeholder="Recursos Gratuitos" />
                <Field getFieldValue={getFieldValue} update={update} label="Descripción" field="store_desc" multi placeholder="Templates, presets y assets para elevar tus diseños..." />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ CONTACT ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SectionHeader openSections={openSections} toggleSection={toggleSection} id="contact" title="Contacto & Footer" icon={Mail} iconColor="text-green-400" />
        <AnimatePresence>
          {openSections.contact && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-4">
                <Field getFieldValue={getFieldValue} update={update} label="Contact Label" field="contact_label" placeholder="Contacto" />
                <Field getFieldValue={getFieldValue} update={update} label="Contact Heading" field="contact_heading" placeholder="¿Tienes una idea en mente?" />
                <Field getFieldValue={getFieldValue} update={update} label="Contact Descripción" field="contact_desc" multi placeholder="Estoy disponible para..." />
                <Field getFieldValue={getFieldValue} update={update} label="Email de contacto" field="contact_email" placeholder="tu@email.com" />
                <Field getFieldValue={getFieldValue} update={update} label="WhatsApp (Link o Número)" field="contact_whatsapp" placeholder="https://wa.me/..." />
                <div className="border-t border-white/[0.08] pt-4 mt-4" />
                <Field getFieldValue={getFieldValue} update={update} label="Footer marca" field="footer_brand" placeholder="CM Design Studio" />
                <Field getFieldValue={getFieldValue} update={update} label="Footer subtítulo" field="footer_brand_sub" placeholder="Diseño & Movimiento" />
                <Field getFieldValue={getFieldValue} update={update} label="Footer texto legal" field="footer_text" placeholder="Diseñado con ❤ por CM" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ SOCIAL LINKS ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SectionHeader openSections={openSections} toggleSection={toggleSection} id="socials" title="Redes Sociales" icon={Globe} iconColor="text-cyan-400" count={socials.filter(s => s.enabled).length} />
        <AnimatePresence>
          {openSections.socials && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-3">
                {socials.length === 0 && (
                  <p className="text-center text-gray-600 text-sm py-4">No hay redes sociales. Agrega tus perfiles.</p>
                )}
                {socials.map((social) => {
                  const platform = PLATFORMS.find(p => p.id === social.platform) || PLATFORMS[PLATFORMS.length - 1];
                  const PIcon = platform.icon;
                  return (
                    <div key={social.id} className="bg-surface/30 angle-frame-sm p-3 border border-white/[0.1]/30">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 angle-frame-sm flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: platform.color + '22', border: `1px solid ${platform.color}44` }}>
                          <PIcon size={16} style={{ color: platform.color }} />
                        </div>
                        <select value={social.platform} onChange={e => {
                          updateSocial(social.id, 'platform', e.target.value);
                          updateSocial(social.id, 'icon', e.target.value);
                        }}
                          className="bg-surface border border-white/[0.1] angle-frame-sm px-2 py-1.5 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition w-32">
                          {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                        </select>
                        <input value={social.url} onChange={e => updateSocial(social.id, 'url', e.target.value)}
                          className="flex-1 bg-surface border border-white/[0.1] angle-frame-sm px-3 py-1.5 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition"
                          placeholder="https://..." />
                        <button onClick={() => updateSocial(social.id, 'enabled', !social.enabled)}
                          className={`p-1.5 angle-frame-sm transition ${social.enabled ? 'text-green-400 bg-green-900/20' : 'text-gray-600 bg-surface'}`}>
                          <Eye size={14} />
                        </button>
                        <button onClick={() => deleteSocial(social.id)}
                          className="p-1.5 angle-frame-sm text-gray-500 hover:text-red-400 hover:bg-red-900/20 transition">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                <button onClick={addSocial}
                  className="w-full flex items-center justify-center gap-2 py-2.5 angle-frame-sm border border-dashed border-white/[0.1] text-gray-500 hover:text-white hover:border-white/20 transition text-sm">
                  <Plus size={14} /> Agregar Red Social
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ═══ THEME COLORS ═══ */}
      <motion.div className="bg-bg-secondary border border-white/[0.08] angle-frame overflow-hidden">
        <SectionHeader openSections={openSections} toggleSection={toggleSection} id="theme" title="Colores del Tema" icon={Palette} iconColor="text-pink-400" />
        <AnimatePresence>
          {openSections.theme && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-5 pb-5 space-y-3">
                <ColorField getFieldValue={getFieldValue} update={update} label="Color Primario" field="theme_primary" />
                <ColorField getFieldValue={getFieldValue} update={update} label="Color Secundario" field="theme_secondary" />
                <ColorField getFieldValue={getFieldValue} update={update} label="Color Acento" field="theme_accent" />

                {/* Theme preview */}
                <div className="mt-4 bg-surface/30 angle-frame-sm p-4 border border-white/[0.1]/30">
                  <p className="text-xs text-gray-500 mb-3 uppercase tracking-widest font-semibold">Vista Previa</p>
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1 h-8 angle-frame-sm" style={{ backgroundColor: cfg.theme_primary || '#ff0033' }} />
                    <div className="flex-1 h-8 angle-frame-sm" style={{ backgroundColor: cfg.theme_secondary || '#a855f7' }} />
                    <div className="flex-1 h-8 angle-frame-sm" style={{ backgroundColor: cfg.theme_accent || '#ec4899' }} />
                  </div>
                  <div className="h-2 rounded-full overflow-hidden">
                    <div className="h-full w-full" style={{
                      background: `linear-gradient(90deg, ${cfg.theme_primary || '#ff0033'}, ${cfg.theme_secondary || '#a855f7'}, ${cfg.theme_accent || '#ec4899'})`,
                    }} />
                  </div>
                </div>

                <p className="text-xs text-gray-600">
                  💡 Los colores se aplican en tiempo real al guardar. El color primario afecta botones, badges y acentos principales.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bottom spacer for comfortable scrolling */}
      <div className="h-8" />
    </div>
  );
}
