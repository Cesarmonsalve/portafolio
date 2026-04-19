'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, Plus, Edit2, Trash2,
  Image as ImageIcon, Video, Save, X, ChevronLeft, ChevronRight,
  Check, Settings, LogOut, Loader2, User, Wrench,
  MessageSquare, Palette, Rocket, Mail, Eye, EyeOff,
  Lock, Globe, Zap, Clapperboard
} from 'lucide-react';
import LottieRenderer from '@/components/LottieRenderer';
import ProjectCard from '@/components/ProjectCard';
import {
  getFullConfig, setConfigValue, getProjects, upsertProject, deleteProject as dbDeleteProject,
  getSkills, upsertSkill, deleteSkill as dbDeleteSkill,
  getSocialLinks, upsertSocialLink, deleteSocialLink as dbDeleteSocial,
  getMessages, markMessageRead, deleteMessage as dbDeleteMessage,
  DEFAULT_CONFIG, DEFAULT_LOTTIE, CATEGORIES,
  type Project, type Skill, type SocialLink, type Message, type SiteConfig, type LottieSlot
} from '@/lib/config';

type Section = 'dashboard' | 'projects' | 'add-project' | 'hero' | 'about' | 'skills' | 'contact' | 'messages' | 'appearance' | 'lottie' | 'deploy';

const LOTTIE_SLOTS = [
  { key: 'lottie_hero' as const, label: 'Hero', desc: 'Fondo animado del encabezado' },
  { key: 'lottie_about' as const, label: 'Sobre Mí', desc: 'Decoración lateral en Sobre Mí' },
  { key: 'lottie_skills' as const, label: 'Skills', desc: 'Decoración en la sección de herramientas' },
  { key: 'lottie_projects' as const, label: 'Proyectos', desc: 'Decoración en el portfolio' },
  { key: 'lottie_contact' as const, label: 'Contacto', desc: 'Decoración en la sección de contacto' },
  { key: 'lottie_footer' as const, label: 'Footer', desc: 'Animación sutil en el pie de página' },
];

// ═══════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════

const Input = ({ label, value, onChange, placeholder, textarea, type }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean; type?: string;
}) => (
  <div>
    <label className="text-label text-[10px] mb-1.5 block">{label}</label>
    {textarea ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder}
        className="w-full bg-bg border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm focus:border-neon-red/40 focus:outline-none transition-all resize-none placeholder:text-gray-600" />
    ) : (
      <input type={type || 'text'} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-bg border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm focus:border-neon-red/40 focus:outline-none transition-all placeholder:text-gray-600" />
    )}
  </div>
);

const Toggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center gap-2.5">
    <button onClick={() => onChange(!value)}
      className={`w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${value ? 'bg-neon-red' : 'bg-white/[0.08]'}`}>
      <div className={`w-4 h-4 bg-white rounded-full transition-all ${value ? 'translate-x-5' : ''}`} />
    </button>
    <span className="text-xs text-gray-400">{label}</span>
  </div>
);

// ═══════════════════════════════════════════
// ADMIN PAGE
// ═══════════════════════════════════════════

export default function AdminPage() {
  // ─── Auth ───
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // ─── Navigation ───
  const [section, setSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ─── Data ───
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // ─── Project form ───
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [pTitle, setPTitle] = useState('');
  const [pCategory, setPCategory] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pImage, setPImage] = useState('');
  const [pVideo, setPVideo] = useState('');
  const [pTags, setPTags] = useState('');
  const [pClient, setPClient] = useState('');
  const [pFeatured, setPFeatured] = useState(false);
  const [pDisplayMode, setPDisplayMode] = useState<string>('default');

  // ─── Skill form ───
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [sName, setSName] = useState('');
  const [sLevel, setSLevel] = useState(50);
  const [sIcon, setSIcon] = useState('🔧');
  const [sCategory, setSCategory] = useState('General');

  // ─── Social form ───
  const [editSocial, setEditSocial] = useState<SocialLink | null>(null);
  const [socPlatform, setSocPlatform] = useState('');
  const [socUrl, setSocUrl] = useState('');
  const [socEnabled, setSocEnabled] = useState(true);

  // ─── Config editor ───
  const [cfgDraft, setCfgDraft] = useState<SiteConfig>(DEFAULT_CONFIG);

  // ─── Global ───
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState('');
  const [deployStatus, setDeployStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [deployLog, setDeployLog] = useState('');
  const [deployMessage, setDeployMessage] = useState('');

  // ─── Check session ───
  useEffect(() => {
    if (sessionStorage.getItem('cm_admin_auth') === 'true') {
      setAuthenticated(true);
    }
  }, []);

  // ─── Load all data ───
  useEffect(() => {
    if (!authenticated) return;
    async function loadAll() {
      setLoading(true);
      const [cfg, prj, sk, soc, msg] = await Promise.all([
        getFullConfig(), getProjects(), getSkills(), getSocialLinks(), getMessages()
      ]);
      setConfig(cfg);
      setCfgDraft(cfg);
      setProjects(prj);
      setSkills(sk);
      setSocials(soc);
      setMessages(msg);
      setLoading(false);
    }
    loadAll();
  }, [authenticated]);

  // ─── Auth handler ───
  const handleLogin = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthenticated(true);
        sessionStorage.setItem('cm_admin_auth', 'true');
      } else {
        setAuthError(data.error || 'Contraseña incorrecta');
      }
    } catch {
      setAuthError('Error de conexión');
    }
    setAuthLoading(false);
  };

  // ─── Notification helper ───
  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // ─── Project CRUD ───
  const resetProjectForm = () => {
    setPTitle(''); setPCategory(''); setPDesc(''); setPImage('');
    setPVideo(''); setPTags(''); setPClient(''); setPFeatured(false);
    setPDisplayMode('default');
    setEditProject(null);
  };

  const openEditProject = (p: Project) => {
    setEditProject(p);
    setPTitle(p.title); setPCategory(p.category); setPDesc(p.description);
    setPImage(p.image); setPVideo(p.video || ''); setPTags(p.tags.join(', '));
    setPClient(p.client || ''); setPFeatured(p.featured || false);
    setPDisplayMode(p.display_mode || 'default');
    setSection('add-project');
  };

  const saveProject = async () => {
    if (!pTitle || !pCategory || !pDesc) { alert('Completa título, categoría y descripción'); return; }
    setSaving(true);
    const project: Project = {
      id: editProject?.id || Date.now().toString(),
      title: pTitle, category: pCategory, description: pDesc,
      image: pImage || '/images/placeholder.jpg',
      video: pVideo || undefined,
      tags: pTags.split(',').map(t => t.trim()).filter(Boolean),
      client: pClient || undefined, featured: pFeatured,
      display_mode: (pDisplayMode as Project['display_mode']) || 'default',
    };
    const ok = await upsertProject(project);
    if (ok) {
      const data = await getProjects();
      setProjects(data);
      resetProjectForm();
      setSection('projects');
      notify('Proyecto guardado ✓');
    } else { alert('Error guardando proyecto'); }
    setSaving(false);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('¿Eliminar este proyecto?')) return;
    await dbDeleteProject(id);
    setProjects(prev => prev.filter(p => p.id !== id));
    notify('Proyecto eliminado');
  };

  // ─── Skill CRUD ───
  const resetSkillForm = () => { setSName(''); setSLevel(50); setSIcon('🔧'); setSCategory('General'); setEditSkill(null); };

  const openEditSkillForm = (s: Skill) => {
    setEditSkill(s); setSName(s.name); setSLevel(s.level); setSIcon(s.icon); setSCategory(s.category);
  };

  const saveSkill = async () => {
    if (!sName) return;
    setSaving(true);
    const skill: Partial<Skill> = {
      id: editSkill?.id || crypto.randomUUID(),
      name: sName, level: sLevel, icon: sIcon, category: sCategory,
      position: editSkill?.position ?? skills.length,
    };
    const ok = await upsertSkill(skill);
    if (ok) {
      setSkills(await getSkills());
      resetSkillForm();
      notify('Skill guardado ✓');
    }
    setSaving(false);
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('¿Eliminar?')) return;
    await dbDeleteSkill(id);
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  // ─── Social CRUD ───
  const resetSocialForm = () => { setSocPlatform(''); setSocUrl(''); setSocEnabled(true); setEditSocial(null); };

  const openEditSocialForm = (s: SocialLink) => {
    setEditSocial(s); setSocPlatform(s.platform); setSocUrl(s.url); setSocEnabled(s.enabled);
  };

  const autoDetectPlatform = (url: string) => {
    const lower = url.toLowerCase();
    if (lower.includes('wa.me') || /^[0-9+\s]+$/.test(lower)) return 'WhatsApp';
    if (lower.includes('instagram.com')) return 'Instagram';
    if (lower.includes('tiktok.com')) return 'TikTok';
    if (lower.includes('youtube.com')) return 'YouTube';
    if (lower.includes('behance.net')) return 'Behance';
    if (lower.includes('linkedin.com')) return 'LinkedIn';
    if (lower.includes('twitter.com') || lower.includes('x.com')) return 'X';
    if (lower.includes('facebook.com')) return 'Facebook';
    if (lower.includes('github.com')) return 'GitHub';
    if (lower.includes('dribbble.com')) return 'Dribbble';
    if (lower.includes('twitch.tv')) return 'Twitch';
    return 'Website';
  };

  const handleSocUrlChange = (val: string) => {
    setSocUrl(val);
    setSocPlatform(autoDetectPlatform(val));
  };

  const saveSocial = async () => {
    if (!socUrl) return;
    setSaving(true);

    let finalUrl = socUrl.trim();
    const finalPlatform = autoDetectPlatform(finalUrl);
    
    // Auto WhatsApp Link Generator
    if (finalPlatform === 'WhatsApp' && /^[0-9+\s]+$/.test(finalUrl)) {
      const cleanNumber = finalUrl.replace(/[\s+]/g, '');
      finalUrl = `https://wa.me/${cleanNumber}`;
    }

    const link: Partial<SocialLink> = {
      id: editSocial?.id || crypto.randomUUID(),
      platform: finalPlatform, url: finalUrl, icon: finalPlatform.toLowerCase(),
      enabled: socEnabled, position: editSocial?.position ?? socials.length,
    };
    const ok = await upsertSocialLink(link);
    if (ok) {
      setSocials(await getSocialLinks());
      resetSocialForm();
      notify('Red social guardada ✓');
    }
    setSaving(false);
  };

  const handleDeleteSocial = async (id: string) => {
    if (!confirm('¿Eliminar?')) return;
    await dbDeleteSocial(id);
    setSocials(prev => prev.filter(s => s.id !== id));
  };

  // ─── Config save ───
  const saveConfig = async (keys: (keyof SiteConfig)[]) => {
    setSaving(true);
    for (const key of keys) {
      await setConfigValue(key, cfgDraft[key]);
    }
    setConfig({ ...cfgDraft });
    notify('Configuración guardada ✓');
    setSaving(false);
  };

  // ─── Deploy ───
  const handleDeploy = async () => {
    setDeployStatus('loading');
    setDeployLog('Ejecutando deploy...');
    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: deployMessage || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setDeployStatus('success');
        setDeployLog(data.output || 'Deploy completado exitosamente');
      } else {
        setDeployStatus('error');
        setDeployLog(data.error || 'Error desconocido');
      }
    } catch (e) {
      setDeployStatus('error');
      setDeployLog('Error de conexión: ' + (e instanceof Error ? e.message : ''));
    }
  };

  // ─── Handle message ───
  const handleReadMessage = async (id: string) => {
    await markMessageRead(id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('¿Eliminar mensaje?')) return;
    await dbDeleteMessage(id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  // ─── File upload helper ───
  const handleFileToBase64 = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ═══════════════════════════════════════════
  // LOGIN SCREEN
  // ═══════════════════════════════════════════

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 relative mx-auto mb-4">
              <img src="/logo.png" alt="CM Design Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,0,51,0.3)]" />
            </div>
            <h1 className="text-heading text-xl">Admin Panel</h1>
            <p className="text-caption mt-1">Acceso restringido</p>
          </div>

          <div className="bg-surface border border-white/[0.04] rounded-2xl p-6">
            <div className="relative mb-4">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Contraseña"
                className="w-full bg-bg border border-white/[0.06] rounded-lg pl-9 pr-4 py-3 text-sm focus:border-neon-red/40 focus:outline-none transition-all placeholder:text-gray-600"
                autoFocus
              />
            </div>
            {authError && <p className="text-red-400 text-xs mb-3">{authError}</p>}
            <button
              onClick={handleLogin}
              disabled={authLoading || !password}
              className="w-full flex items-center justify-center gap-2 bg-neon-red hover:bg-red-600 disabled:opacity-50 py-3 rounded-lg font-display font-bold text-xs tracking-label transition-all"
            >
              {authLoading ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
              {authLoading ? 'VERIFICANDO...' : 'ACCEDER'}
            </button>
          </div>

          <p className="text-center text-[10px] text-gray-700 mt-6">
            Contraseña definida en .env.local
          </p>
        </motion.div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // NAV ITEMS
  // ═══════════════════════════════════════════

  const navItems: { id: Section; icon: typeof LayoutDashboard; label: string; badge?: number }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'projects', icon: FolderKanban, label: 'Proyectos', badge: projects.length },
    { id: 'add-project', icon: Plus, label: 'Nuevo Proyecto' },
    { id: 'hero', icon: Zap, label: 'Hero / Perfil' },
    { id: 'about', icon: User, label: 'Sobre Mí' },
    { id: 'skills', icon: Wrench, label: 'Skills' },
    { id: 'contact', icon: Globe, label: 'Contacto / Social' },
    { id: 'messages', icon: MessageSquare, label: 'Mensajes', badge: messages.filter(m => !m.read).length },
    { id: 'appearance', icon: Palette, label: 'Apariencia' },
    { id: 'lottie', icon: Clapperboard, label: 'Motion Graphics' },
    { id: 'deploy', icon: Rocket, label: 'Publicar' },
  ];

  // ═══════════════════════════════════════════
  // MAIN ADMIN LAYOUT
  // ═══════════════════════════════════════════

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2"
          >
            <Check size={14} /> {notification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        className="bg-bg-secondary border-r border-white/[0.04] flex flex-shrink-0 overflow-hidden h-screen sticky top-0"
      >
        <div className="p-4 border-b border-white/[0.04] flex items-center gap-2.5">
          <div className="w-9 h-9 relative flex-shrink-0">
            <img src="/logo.png" alt="CM Design Logo" className="w-full h-full object-contain" />
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-display font-bold text-xs">CM DESIGN</p>
              <p className="text-[9px] text-gray-600 uppercase tracking-widest">Admin</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto admin-sidebar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setSection(item.id); if (item.id === 'add-project') resetProjectForm(); }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all ${
                section === item.id
                  ? 'bg-neon-red/10 text-neon-red border border-neon-red/15'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
              }`}
            >
              <item.icon size={15} className="flex-shrink-0" />
              {sidebarOpen && (
                <span className="flex items-center gap-1.5 truncate">
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-neon-red/15 text-neon-red text-[9px] px-1.5 py-0.5 rounded-full font-bold">{item.badge}</span>
                  )}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-white/[0.04] space-y-0.5">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-gray-600 hover:text-gray-400 hover:bg-white/[0.03] transition-all">
            {sidebarOpen ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
            {sidebarOpen && <span>Colapsar</span>}
          </button>
          <a href="/"
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-gray-600 hover:text-gray-400 hover:bg-white/[0.03] transition-all">
            <LogOut size={15} />
            {sidebarOpen && <span>Ver sitio</span>}
          </a>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-5xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={20} className="animate-spin text-neon-red" />
            </div>
          ) : (
            <AnimatePresence mode="wait">

              {/* ═══ DASHBOARD ═══ */}
              {section === 'dashboard' && (
                <motion.div key="dash" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                  <h1 className="text-heading text-2xl mb-1">Dashboard</h1>
                  <p className="text-caption mb-8">Resumen de tu portfolio</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                    {[
                      { label: 'Proyectos', value: projects.length, color: 'text-neon-red' },
                      { label: 'Featured', value: projects.filter(p => p.featured).length, color: 'text-neon-purple' },
                      { label: 'Skills', value: skills.length, color: 'text-neon-pink' },
                      { label: 'Mensajes', value: messages.filter(m => !m.read).length, color: 'text-neon-gold' },
                    ].map((s) => (
                      <div key={s.label} className="card p-4">
                        <p className="text-label text-[9px] mb-1">{s.label}</p>
                        <p className={`text-heading text-2xl ${s.color}`}>{s.value}</p>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-subheading text-sm mb-3">Proyectos Recientes</h3>
                  <div className="space-y-2">
                    {projects.slice(0, 5).map((p) => (
                      <div key={p.id} className="card p-3 flex items-center gap-3 !rounded-xl">
                        <img src={p.image} alt="" className="w-14 h-10 object-cover rounded-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{p.title}</p>
                          <p className="text-[10px] text-gray-600">{p.category}</p>
                        </div>
                        <button onClick={() => openEditProject(p)} className="text-gray-600 hover:text-neon-red transition-colors p-1">
                          <Edit2 size={13} />
                        </button>
                      </div>
                    ))}
                    {projects.length === 0 && <p className="text-caption text-center py-8">No hay proyectos aún</p>}
                  </div>

                  {messages.filter(m => !m.read).length > 0 && (
                    <>
                      <h3 className="text-subheading text-sm mt-8 mb-3">Mensajes Sin Leer</h3>
                      {messages.filter(m => !m.read).slice(0, 3).map((m) => (
                        <div key={m.id} className="card p-3 mb-2 !rounded-xl">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium">{m.name}</p>
                            <p className="text-[10px] text-gray-600">{new Date(m.created_at).toLocaleDateString('es')}</p>
                          </div>
                          <p className="text-[11px] text-gray-500 line-clamp-1">{m.message}</p>
                        </div>
                      ))}
                    </>
                  )}
                </motion.div>
              )}

              {/* ═══ PROJECTS LIST ═══ */}
              {section === 'projects' && (
                <motion.div key="prj" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-heading text-2xl mb-1">Proyectos</h1>
                      <p className="text-caption">{projects.length} en tu portfolio</p>
                    </div>
                    <button onClick={() => { resetProjectForm(); setSection('add-project'); }}
                      className="flex items-center gap-1.5 bg-neon-red hover:bg-red-600 px-4 py-2 rounded-lg text-xs font-bold transition-all">
                      <Plus size={14} /> Nuevo
                    </button>
                  </div>
                  <div className="space-y-2">
                    {projects.map((p) => (
                      <div key={p.id} className="card p-3 flex items-center gap-3 !rounded-xl hover:!border-white/[0.08]">
                        <img src={p.image} alt="" className="w-16 h-11 object-cover rounded-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="text-xs font-medium truncate">{p.title}</p>
                            {p.featured && <span className="text-[9px] bg-neon-purple/15 text-neon-purple px-1.5 py-0.5 rounded-full">★</span>}
                          </div>
                          <p className="text-[10px] text-gray-600">{p.category} • {p.client || 'Sin cliente'}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => openEditProject(p)} className="text-gray-600 hover:text-neon-red transition-colors p-1.5"><Edit2 size={13} /></button>
                          <button onClick={() => handleDeleteProject(p.id)} className="text-gray-600 hover:text-red-500 transition-colors p-1.5"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <div className="text-center py-14">
                        <ImageIcon size={36} className="mx-auto text-gray-800 mb-3" />
                        <p className="text-caption mb-3">No hay proyectos</p>
                        <button onClick={() => { resetProjectForm(); setSection('add-project'); }}
                          className="bg-neon-red/10 text-neon-red px-5 py-2 rounded-lg text-xs font-bold">Crear primero</button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ═══ ADD/EDIT PROJECT ═══ */}
              {section === 'add-project' && (
                <motion.div key="add-prj" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-heading text-2xl mb-1">{editProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h1>
                      <p className="text-caption">{editProject ? 'Modifica los detalles' : 'Agrega un proyecto'}</p>
                    </div>
                    <button onClick={() => { resetProjectForm(); setSection('projects'); }} className="text-gray-600 hover:text-white p-1"><X size={20} /></button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-4">
                      <Input label="Título *" value={pTitle} onChange={setPTitle} placeholder="DISTRICT 909 — Event Motion" />
                      <div>
                        <label className="text-label text-[10px] mb-1.5 block">Categoría *</label>
                        <input
                          list="category-options"
                          value={pCategory}
                          onChange={(e) => setPCategory(e.target.value)}
                          placeholder="Selecciona o escribe una nueva..."
                          className="w-full bg-bg border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm focus:border-neon-red/40 focus:outline-none transition-all text-gray-300"
                        />
                        <datalist id="category-options">
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c} />
                          ))}
                          {Array.from(new Set(projects.map(p => p.category))).filter(c => !CATEGORIES.includes(c)).map(c => (
                            <option key={c} value={c} />
                          ))}
                        </datalist>
                      </div>
                      <Input label="Descripción *" value={pDesc} onChange={setPDesc} textarea placeholder="Describe el proyecto..." />
                      <Input label="Cliente" value={pClient} onChange={setPClient} placeholder="Nombre del cliente" />
                      <Input label="Tags (separados por coma)" value={pTags} onChange={setPTags} placeholder="After Effects, Cinema 4D" />
                      <Toggle label="Marcar como Featured" value={pFeatured} onChange={setPFeatured} />
                      <div>
                        <label className="text-label text-[10px] mb-1.5 block">Estilo de Presentación</label>
                        <select value={pDisplayMode} onChange={(e) => setPDisplayMode(e.target.value)}
                          className="w-full bg-bg border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm focus:border-neon-red/40 focus:outline-none transition-all text-gray-300">
                          <option value="default">🖼️ Normal (Tarjeta clásica)</option>
                          <option value="youtube">▶️ YouTube (Player de video)</option>
                          <option value="spotify">🎵 Spotify (Reproductor musical)</option>
                          <option value="instagram">📸 Instagram (Post de IG)</option>
                          <option value="phone">📱 Phone (Mockup de celular)</option>
                        </select>
                        <p className="text-[9px] text-gray-500 mt-1">Elige cómo se verá tu proyecto en el portfolio</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {/* Live Preview Panel */}
                      <div className="bg-bg border border-white/[0.06] rounded-xl p-4 sticky top-6">
                        <h3 className="text-subheading text-[11px] mb-4 flex items-center gap-1.5 uppercase"><Eye size={14}/> Preview en Vivo</h3>
                        <div className="max-w-[320px] mx-auto opacity-90 transition-opacity pointer-events-none">
                          <ProjectCard 
                            index={0} 
                            project={{
                              id: editProject?.id || 'preview',
                              title: pTitle || 'Título del Proyecto',
                              category: pCategory || 'Categoría',
                              description: pDesc || 'Descripción del proyecto se mostrará aquí.',
                              image: pImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
                              video: pVideo,
                              tags: pTags ? pTags.split(',').map(t => t.trim()).filter(Boolean) : ['Motion', 'Design'],
                              client: pClient || 'Cliente Ejemplo',
                              featured: pFeatured,
                              display_mode: (pDisplayMode as Project['display_mode']) || 'default',
                              created_at: new Date().toISOString()
                            }} 
                          />
                        </div>
                        <p className="text-[10px] text-gray-500 text-center mt-3">Así se expone tu trabajo en vivo.</p>
                      </div>
                      
                      <div>
                        <label className="text-label text-[10px] mb-1.5 block">Imagen</label>
                        <div className="relative border border-dashed border-white/[0.08] rounded-xl overflow-hidden cursor-pointer hover:border-neon-red/30 transition-colors" style={{ minHeight: 160 }}>
                          <input type="file" accept="image/*" onChange={(e) => handleFileToBase64(e, setPImage)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                          {pImage ? <img src={pImage} alt="" className="w-full h-40 object-cover" /> : (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-700">
                              <ImageIcon size={24} className="mb-2" />
                              <p className="text-xs">Arrastra o haz clic</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-label text-[10px] mb-1.5 block">Video (opcional)</label>
                        <div className="relative border border-dashed border-white/[0.08] rounded-xl overflow-hidden cursor-pointer hover:border-neon-purple/30 transition-colors" style={{ minHeight: 120 }}>
                          <input type="file" accept="video/*" onChange={(e) => handleFileToBase64(e, setPVideo)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                          {pVideo ? <video src={pVideo} className="w-full h-28 object-cover" muted /> : (
                            <div className="flex flex-col items-center justify-center h-28 text-gray-700">
                              <Video size={20} className="mb-2" />
                              <p className="text-xs">Subir video</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <Input label="O pega URL de imagen" value={pImage.startsWith('data:') ? '' : pImage} onChange={setPImage} placeholder="https://..." />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-6 pt-5 border-t border-white/[0.04]">
                    <button onClick={() => { resetProjectForm(); setSection('projects'); }}
                      className="px-5 py-2.5 rounded-lg text-xs font-medium text-gray-500 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] transition-all">Cancelar</button>
                    <button onClick={saveProject} disabled={saving}
                      className="flex items-center gap-1.5 bg-neon-red hover:bg-red-600 disabled:opacity-50 px-6 py-2.5 rounded-lg text-xs font-bold transition-all">
                      {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                      {saving ? 'Guardando...' : editProject ? 'Guardar' : 'Publicar'}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ═══ HERO / PERFIL ═══ */}
              {section === 'hero' && (
                <motion.div key="hero" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                  <h1 className="text-heading text-2xl mb-1">Hero / Perfil</h1>
                  <p className="text-caption mb-6">Edita la sección principal de tu portafolio</p>
                  <div className="space-y-4 max-w-lg">
                    <Input label="Nombre / Marca" value={cfgDraft.hero_name} onChange={(v) => setCfgDraft({ ...cfgDraft, hero_name: v })} />
                    <Input label="Subtítulo" value={cfgDraft.hero_subtitle} onChange={(v) => setCfgDraft({ ...cfgDraft, hero_subtitle: v })} />
                    <Input label="Badge (etiqueta superior)" value={cfgDraft.hero_badge} onChange={(v) => setCfgDraft({ ...cfgDraft, hero_badge: v })} />
                    <Input label="Descripción" value={cfgDraft.hero_description} onChange={(v) => setCfgDraft({ ...cfgDraft, hero_description: v })} textarea />

                    <div>
                      <label className="text-label text-[10px] mb-2 block">Estadísticas</label>
                      {cfgDraft.hero_stats.map((st, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input value={st.value} onChange={(e) => {
                            const stats = [...cfgDraft.hero_stats];
                            stats[i] = { ...stats[i], value: e.target.value };
                            setCfgDraft({ ...cfgDraft, hero_stats: stats });
                          }} className="w-20 bg-bg border border-white/[0.06] rounded-lg px-2 py-1.5 text-xs" placeholder="50+" />
                          <input value={st.label} onChange={(e) => {
                            const stats = [...cfgDraft.hero_stats];
                            stats[i] = { ...stats[i], label: e.target.value };
                            setCfgDraft({ ...cfgDraft, hero_stats: stats });
                          }} className="flex-1 bg-bg border border-white/[0.06] rounded-lg px-2 py-1.5 text-xs" placeholder="Proyectos" />
                          <button onClick={() => {
                            const stats = cfgDraft.hero_stats.filter((_, idx) => idx !== i);
                            setCfgDraft({ ...cfgDraft, hero_stats: stats });
                          }} className="text-gray-600 hover:text-red-400 p-1"><Trash2 size={12} /></button>
                        </div>
                      ))}
                      <button onClick={() => setCfgDraft({ ...cfgDraft, hero_stats: [...cfgDraft.hero_stats, { value: '', label: '' }] })}
                        className="text-[10px] text-neon-red hover:underline mt-1">+ Agregar stat</button>
                    </div>
                  </div>
                  <div className="mt-6 pt-5 border-t border-white/[0.04]">
                    <button onClick={() => saveConfig(['hero_name', 'hero_subtitle', 'hero_badge', 'hero_description', 'hero_stats'])}
                      disabled={saving}
                      className="flex items-center gap-1.5 bg-neon-red hover:bg-red-600 disabled:opacity-50 px-6 py-2.5 rounded-lg text-xs font-bold transition-all">
                      {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Guardar Hero
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ═══ ABOUT ═══ */}
              {section === 'about' && (
                <motion.div key="about" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                  <h1 className="text-heading text-2xl mb-1">Sobre Mí</h1>
                  <p className="text-caption mb-6">Edita tu sección personal</p>
                  <div className="space-y-4 max-w-lg">
                    <Input label="Título de sección" value={cfgDraft.about_title} onChange={(v) => setCfgDraft({ ...cfgDraft, about_title: v })} />
                    <Input label="Bio principal" value={cfgDraft.about_bio} onChange={(v) => setCfgDraft({ ...cfgDraft, about_bio: v })} textarea />
                    <Input label="Bio extendida" value={cfgDraft.about_bio_extended} onChange={(v) => setCfgDraft({ ...cfgDraft, about_bio_extended: v })} textarea />
                    <div>
                      <label className="text-label text-[10px] mb-1.5 block">Foto de perfil</label>
                      <div className="flex items-center gap-3">
                        {cfgDraft.about_photo && <img src={cfgDraft.about_photo} alt="" className="w-16 h-16 object-cover rounded-lg" />}
                        <div className="relative">
                          <input type="file" accept="image/*" onChange={(e) => handleFileToBase64(e, (v) => setCfgDraft({ ...cfgDraft, about_photo: v }))} className="absolute inset-0 opacity-0 cursor-pointer" />
                          <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-xs text-gray-500 cursor-pointer hover:bg-white/[0.06]">
                            Subir foto
                          </div>
                        </div>
                        <Input label="" value={cfgDraft.about_photo?.startsWith('data:') ? '' : (cfgDraft.about_photo || '')} onChange={(v) => setCfgDraft({ ...cfgDraft, about_photo: v })} placeholder="O pega URL" />
                      </div>
                    </div>

                    <div>
                      <label className="text-label text-[10px] mb-2 block">Especialidades</label>
                      {cfgDraft.about_specialties.map((sp, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input value={sp.title} onChange={(e) => {
                            const specs = [...cfgDraft.about_specialties];
                            specs[i] = { ...specs[i], title: e.target.value };
                            setCfgDraft({ ...cfgDraft, about_specialties: specs });
                          }} className="w-36 bg-bg border border-white/[0.06] rounded-lg px-2 py-1.5 text-xs" placeholder="Motion Graphics" />
                          <input value={sp.desc} onChange={(e) => {
                            const specs = [...cfgDraft.about_specialties];
                            specs[i] = { ...specs[i], desc: e.target.value };
                            setCfgDraft({ ...cfgDraft, about_specialties: specs });
                          }} className="flex-1 bg-bg border border-white/[0.06] rounded-lg px-2 py-1.5 text-xs" placeholder="Descripción" />
                          <button onClick={() => {
                            setCfgDraft({ ...cfgDraft, about_specialties: cfgDraft.about_specialties.filter((_, idx) => idx !== i) });
                          }} className="text-gray-600 hover:text-red-400 p-1"><Trash2 size={12} /></button>
                        </div>
                      ))}
                      <button onClick={() => setCfgDraft({ ...cfgDraft, about_specialties: [...cfgDraft.about_specialties, { title: '', desc: '' }] })}
                        className="text-[10px] text-neon-red hover:underline mt-1">+ Agregar especialidad</button>
                    </div>
                  </div>
                  <div className="mt-6 pt-5 border-t border-white/[0.04]">
                    <button onClick={() => saveConfig(['about_title', 'about_bio', 'about_bio_extended', 'about_photo', 'about_specialties'])}
                      disabled={saving}
                      className="flex items-center gap-1.5 bg-neon-red hover:bg-red-600 disabled:opacity-50 px-6 py-2.5 rounded-lg text-xs font-bold transition-all">
                      {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Guardar About
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ═══ SKILLS ═══ */}
              {section === 'skills' && (
                <motion.div key="skills" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                  <h1 className="text-heading text-2xl mb-1">Skills</h1>
                  <p className="text-caption mb-6">Administra tus herramientas</p>

                  {/* Form */}
                  <div className="card p-4 !rounded-xl mb-6">
                    <p className="text-subheading text-xs mb-3">{editSkill ? 'Editar Skill' : 'Agregar Skill'}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Input label="Nombre" value={sName} onChange={setSName} placeholder="After Effects" />
                      <div>
                        <label className="text-label text-[10px] mb-1.5 block">Nivel ({sLevel}%)</label>
                        <input type="range" min={0} max={100} value={sLevel} onChange={(e) => setSLevel(Number(e.target.value))}
                          className="w-full accent-neon-red" />
                      </div>
                      <Input label="Emoji" value={sIcon} onChange={setSIcon} placeholder="🎬" />
                      <Input label="Categoría" value={sCategory} onChange={setSCategory} placeholder="Video" />
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={saveSkill} disabled={saving || !sName}
                        className="flex items-center gap-1.5 bg-neon-red hover:bg-red-600 disabled:opacity-50 px-4 py-2 rounded-lg text-xs font-bold transition-all">
                        <Save size={12} /> {editSkill ? 'Actualizar' : 'Agregar'}
                      </button>
                      {editSkill && (
                        <button onClick={resetSkillForm} className="px-4 py-2 rounded-lg text-xs text-gray-500 bg-white/[0.03]">Cancelar</button>
                      )}
                    </div>
                  </div>

                  {/* List */}
                  <div className="space-y-1.5">
                    {skills.map((s) => (
                      <div key={s.id} className="card p-3 !rounded-xl flex items-center gap-3">
                        <span className="text-xl">{s.icon}</span>
                        <div className="flex-1">
                          <p className="text-xs font-medium">{s.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1 bg-white/[0.04] rounded-full overflow-hidden max-w-[120px]">
                              <div className="h-full bg-neon-purple rounded-full" style={{ width: `${s.level}%` }} />
                            </div>
                            <span className="text-[10px] text-gray-600">{s.level}%</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-600 px-2 py-0.5 bg-white/[0.03] rounded-full">{s.category}</span>
                        <button onClick={() => openEditSkillForm(s)} className="text-gray-600 hover:text-neon-red transition-colors p-1"><Edit2 size={12} /></button>
                        <button onClick={() => handleDeleteSkill(s.id)} className="text-gray-600 hover:text-red-500 transition-colors p-1"><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ═══ CONTACT / SOCIAL ═══ */}
              {section === 'contact' && (
                <motion.div key="contact" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                  <h1 className="text-heading text-2xl mb-1">Contacto & Social</h1>
                  <p className="text-caption mb-6">Email y redes sociales</p>

                  {/* Email */}
                  <div className="card p-4 !rounded-xl mb-6">
                    <Input label="Email de contacto" value={cfgDraft.contact_email} onChange={(v) => setCfgDraft({ ...cfgDraft, contact_email: v })} placeholder="tu@email.com" />
                    <button onClick={() => saveConfig(['contact_email'])} disabled={saving}
                      className="flex items-center gap-1.5 bg-neon-red hover:bg-red-600 disabled:opacity-50 px-4 py-2 rounded-lg text-xs font-bold transition-all mt-3">
                      <Save size={12} /> Guardar Email
                    </button>
                  </div>

                  {/* Social form */}
                  <div className="card p-4 !rounded-xl mb-6">
                    <p className="text-subheading text-xs mb-3">{editSocial ? 'Editar Red Social' : 'Agregar Red Social'}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Input label="URL del perfil o Número de Whatsapp" value={socUrl} onChange={handleSocUrlChange} placeholder="https://tiktok.com/@... o +34600000" />
                        {socPlatform && (
                          <p className="text-[9px] text-neon-red mt-1 ml-1 font-bold">DETECTADO: {socPlatform.toUpperCase()}</p>
                        )}
                      </div>
                      <div className="flex items-end pb-1 md:pl-4">
                        <Toggle label="Visible en la Web" value={socEnabled} onChange={setSocEnabled} />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={saveSocial} disabled={saving || !socUrl}
                        className="flex items-center gap-1.5 bg-neon-red hover:bg-red-600 disabled:opacity-50 px-4 py-2 rounded-lg text-xs font-bold transition-all">
                        <Save size={12} /> {editSocial ? 'Actualizar' : 'Agregar'}
                      </button>
                      {editSocial && <button onClick={resetSocialForm} className="px-4 py-2 rounded-lg text-xs text-gray-500 bg-white/[0.03]">Cancelar</button>}
                    </div>
                  </div>

                  {/* Social list */}
                  <div className="space-y-1.5">
                    {socials.map((s) => (
                      <div key={s.id} className="card p-3 !rounded-xl flex items-center gap-3">
                        <Globe size={16} className="text-gray-500" />
                        <div className="flex-1">
                          <p className="text-xs font-medium">{s.platform}</p>
                          <p className="text-[10px] text-gray-600 truncate">{s.url}</p>
                        </div>
                        {s.enabled ? <Eye size={13} className="text-green-500" /> : <EyeOff size={13} className="text-gray-600" />}
                        <button onClick={() => openEditSocialForm(s)} className="text-gray-600 hover:text-neon-red transition-colors p-1"><Edit2 size={12} /></button>
                        <button onClick={() => handleDeleteSocial(s.id)} className="text-gray-600 hover:text-red-500 transition-colors p-1"><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ═══ MESSAGES ═══ */}
              {section === 'messages' && (
                <motion.div key="msgs" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                  <h1 className="text-heading text-2xl mb-1">Mensajes</h1>
                  <p className="text-caption mb-6">{messages.length} mensajes recibidos</p>
                  <div className="space-y-2">
                    {messages.map((m) => (
                      <div key={m.id} className={`card p-4 !rounded-xl ${!m.read ? 'border-neon-red/20' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">{m.name}</span>
                            {!m.read && <span className="w-1.5 h-1.5 bg-neon-red rounded-full" />}
                          </div>
                          <span className="text-[10px] text-gray-600">{new Date(m.created_at).toLocaleDateString('es')}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mb-1">{m.email}</p>
                        <p className="text-xs text-gray-300 mb-3">{m.message}</p>
                        <div className="flex gap-2">
                          {!m.read && <button onClick={() => handleReadMessage(m.id)} className="text-[10px] text-neon-red hover:underline">Marcar leído</button>}
                          <button onClick={() => handleDeleteMessage(m.id)} className="text-[10px] text-gray-600 hover:text-red-400">Eliminar</button>
                          <a href={`mailto:${m.email}`} className="text-[10px] text-gray-500 hover:text-white flex items-center gap-1"><Mail size={10} /> Responder</a>
                        </div>
                      </div>
                    ))}
                    {messages.length === 0 && <p className="text-caption text-center py-12">No hay mensajes aún</p>}
                  </div>
                </motion.div>
              )}

              {/* ═══ APPEARANCE ═══ */}
              {section === 'appearance' && (
                <motion.div key="appearance" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                  <h1 className="text-heading text-2xl mb-1">Apariencia</h1>
                  <p className="text-caption mb-6">Personaliza los colores y textos de tu sitio</p>
                  <div className="space-y-4 max-w-lg">
                    <div className="card p-4 !rounded-xl">
                      <p className="text-subheading text-xs mb-3">Colores</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-label text-[9px] mb-1 block">Primario</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={cfgDraft.theme_primary} onChange={(e) => setCfgDraft({ ...cfgDraft, theme_primary: e.target.value })}
                              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                            <span className="text-[10px] text-gray-500">{cfgDraft.theme_primary}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-label text-[9px] mb-1 block">Secundario</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={cfgDraft.theme_secondary} onChange={(e) => setCfgDraft({ ...cfgDraft, theme_secondary: e.target.value })}
                              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                            <span className="text-[10px] text-gray-500">{cfgDraft.theme_secondary}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-label text-[9px] mb-1 block">Acento</label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={cfgDraft.theme_accent} onChange={(e) => setCfgDraft({ ...cfgDraft, theme_accent: e.target.value })}
                              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                            <span className="text-[10px] text-gray-500">{cfgDraft.theme_accent}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card p-4 !rounded-xl">
                      <p className="text-subheading text-xs mb-3">Footer</p>
                      <Input label="Texto del footer" value={cfgDraft.footer_text} onChange={(v) => setCfgDraft({ ...cfgDraft, footer_text: v })} />
                    </div>
                  </div>
                  <div className="mt-6 pt-5 border-t border-white/[0.04]">
                    <button onClick={() => saveConfig(['theme_primary', 'theme_secondary', 'theme_accent', 'footer_text'])}
                      disabled={saving}
                      className="flex items-center gap-1.5 bg-neon-red hover:bg-red-600 disabled:opacity-50 px-6 py-2.5 rounded-lg text-xs font-bold transition-all">
                      {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Guardar Apariencia
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ═══ LOTTIE / MOTION GRAPHICS ═══ */}
              {section === 'lottie' && (
                <motion.div key="lottie" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                  <h1 className="text-heading text-2xl mb-1">Motion Graphics (AE)</h1>
                  <p className="text-caption mb-6">Agrega animaciones Lottie de After Effects a tu portafolio</p>

                  <div className="card p-4 !rounded-xl mb-6">
                    <p className="text-subheading text-xs mb-2">¿Cómo funciona?</p>
                    <ol className="text-[11px] text-gray-400 space-y-1.5 list-decimal list-inside">
                      <li>Exporta tu animación de After Effects con el plugin <code className="text-neon-red bg-white/[0.03] px-1 rounded">Bodymovin</code></li>
                      <li>Sube el archivo .json a <a href="https://lottiefiles.com" target="_blank" className="text-neon-red hover:underline">LottieFiles.com</a> y copia la URL</li>
                      <li>Pega la URL aquí abajo, actívala y dale a guardar</li>
                      <li>¡Listo! Tu animación aparecerá en la sección elegida</li>
                    </ol>
                  </div>

                  <div className="space-y-4">
                    {LOTTIE_SLOTS.map((slot) => {
                      const lottieData = cfgDraft[slot.key] || { ...DEFAULT_LOTTIE };
                      return (
                        <div key={slot.key} className="card p-4 !rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-subheading text-xs">{slot.label}</p>
                              <p className="text-caption text-[10px]">{slot.desc}</p>
                            </div>
                            <button
                              onClick={() => {
                                const updated = { ...lottieData, enabled: !lottieData.enabled };
                                setCfgDraft({ ...cfgDraft, [slot.key]: updated });
                              }}
                              className={`w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${lottieData.enabled ? 'bg-neon-red' : 'bg-white/[0.08]'}`}
                            >
                              <div className={`w-4 h-4 bg-white rounded-full transition-all ${lottieData.enabled ? 'translate-x-5' : ''}`} />
                            </button>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div>
                                <label className="text-label text-[10px] mb-1.5 block">URL del Lottie JSON</label>
                                <input
                                  type="text"
                                  value={lottieData.source}
                                  onChange={(e) => {
                                    setCfgDraft({ ...cfgDraft, [slot.key]: { ...lottieData, source: e.target.value } });
                                  }}
                                  placeholder="https://lottie.host/xxx/animation.json"
                                  className="w-full bg-bg border border-white/[0.06] rounded-lg px-3 py-2.5 text-sm focus:border-neon-red/40 focus:outline-none transition-all placeholder:text-gray-500 text-white"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-label text-[10px] mb-1.5 block">Velocidad ({lottieData.speed}x)</label>
                                  <input type="range" min={0.1} max={3} step={0.1} value={lottieData.speed}
                                    onChange={(e) => setCfgDraft({ ...cfgDraft, [slot.key]: { ...lottieData, speed: Number(e.target.value) } })}
                                    className="w-full accent-neon-red" />
                                </div>
                                <div>
                                  <label className="text-label text-[10px] mb-1.5 block">Opacidad ({Math.round(lottieData.opacity * 100)}%)</label>
                                  <input type="range" min={0.05} max={1} step={0.05} value={lottieData.opacity}
                                    onChange={(e) => setCfgDraft({ ...cfgDraft, [slot.key]: { ...lottieData, opacity: Number(e.target.value) } })}
                                    className="w-full accent-neon-purple" />
                                </div>
                              </div>
                            </div>

                            {/* Live Preview */}
                            <div className="bg-bg-secondary border border-white/[0.06] rounded-xl overflow-hidden flex items-center justify-center" style={{ minHeight: 140 }}>
                              {lottieData.source ? (
                                <div className="w-full h-full" style={{ opacity: lottieData.opacity }}>
                                  <LottieRenderer source={lottieData.source} speed={lottieData.speed} />
                                </div>
                              ) : (
                                <div className="text-center text-gray-600">
                                  <Clapperboard size={24} className="mx-auto mb-2" />
                                  <p className="text-[10px]">Preview</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/[0.04]">
                    <button onClick={() => saveConfig(['lottie_hero', 'lottie_about', 'lottie_skills', 'lottie_projects', 'lottie_contact', 'lottie_footer'])}
                      disabled={saving}
                      className="flex items-center gap-1.5 bg-neon-red hover:bg-red-600 disabled:opacity-50 px-6 py-2.5 rounded-lg text-xs font-bold transition-all">
                      {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Guardar Animaciones
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ═══ DEPLOY ═══ */}
              {section === 'deploy' && (
                <motion.div key="deploy" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                  <h1 className="text-heading text-2xl mb-1">Publicar Cambios</h1>
                  <p className="text-caption mb-6">Sube tus cambios a GitHub con un click</p>

                  <div className="card p-6 !rounded-xl max-w-lg">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 bg-neon-red/[0.08] rounded-xl flex items-center justify-center">
                        <Rocket size={20} className="text-neon-red" />
                      </div>
                      <div>
                        <p className="text-subheading text-sm">Deploy a Producción</p>
                        <p className="text-caption text-[10px]">git push → GitHub → Auto-deploy</p>
                      </div>
                    </div>

                    <Input label="Mensaje de commit (opcional)" value={deployMessage} onChange={setDeployMessage}
                      placeholder="Actualización del portfolio" />

                    <button onClick={handleDeploy}
                      disabled={deployStatus === 'loading'}
                      className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-xs tracking-label transition-all mt-4 ${
                        deployStatus === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                        deployStatus === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                        'bg-neon-red hover:bg-red-600 hover:shadow-[0_0_30px_rgba(255,0,51,0.3)]'
                      }`}
                    >
                      {deployStatus === 'loading' && <Loader2 size={14} className="animate-spin" />}
                      {deployStatus === 'success' && <Check size={14} />}
                      {deployStatus === 'idle' && <Rocket size={14} />}
                      {deployStatus === 'loading' ? 'PUBLICANDO...' :
                       deployStatus === 'success' ? 'PUBLICADO ✓' :
                       deployStatus === 'error' ? 'ERROR — REINTENTAR' :
                       'PUBLICAR AHORA'}
                    </button>

                    {deployLog && (
                      <div className={`mt-4 p-3 rounded-lg text-[11px] font-mono ${
                        deployStatus === 'error' ? 'bg-red-500/5 text-red-400' : 'bg-green-500/5 text-green-400'
                      }`}>
                        <pre className="whitespace-pre-wrap">{deployLog}</pre>
                      </div>
                    )}
                  </div>

                  <div className="card p-4 !rounded-xl max-w-lg mt-4">
                    <p className="text-subheading text-xs mb-2">¿Cómo funciona?</p>
                    <ol className="text-[11px] text-gray-500 space-y-1.5 list-decimal list-inside">
                      <li>Haz clic en &quot;Publicar Ahora&quot;</li>
                      <li>Se ejecuta: <code className="text-gray-400 bg-white/[0.03] px-1 rounded">git add + commit + push</code></li>
                      <li>GitHub recibe los cambios</li>
                      <li>Si tienes Vercel/Netlify conectado, se redespliega automático</li>
                    </ol>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
