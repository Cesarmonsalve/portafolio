'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, MessageSquare, Wrench,
  Settings, LogOut, Menu, X, Eye, EyeOff,
  Lock, Zap, Bell,   Palette, ShoppingBag, ChevronLeft, ShieldCheck, Bot, LayoutGrid,
} from 'lucide-react';

// Secciones del admin
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminProjects from '@/components/admin/AdminProjects';
import AdminMessages from '@/components/admin/AdminMessages';
import AdminSkills from '@/components/admin/AdminSkills';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminAppearance from '@/components/admin/AdminAppearance';
import AdminStore from '@/components/admin/AdminStore';
import AdminBackup from '@/components/admin/AdminBackup';
import AdminSectionBuilder from '@/components/admin/AdminSectionBuilder';
import AdminAIAssistant from '@/components/admin/AdminAIAssistant';
import AdminAuditLogs from '@/components/admin/AdminAuditLogs';

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',   icon: LayoutDashboard, code: '01' },
  { id: 'projects',   label: 'Proyectos',   icon: FolderKanban,    code: '02' },
  { id: 'store',      label: 'Tienda',      icon: ShoppingBag,     code: '03' },
  { id: 'messages',   label: 'Mensajes',    icon: MessageSquare,   code: '04' },
  { id: 'skills',     label: 'Arsenal',     icon: Wrench,          code: '05' },
  { id: 'builder',    label: 'Builder',     icon: LayoutGrid,      code: '06' },
  { id: 'appearance', label: 'Apariencia',  icon: Palette,         code: '07' },
  { id: 'ai',         label: 'AI Assistant',icon: Bot,             code: '08' },
  { id: 'settings',   label: 'Config',      icon: Settings,        code: '09' },
  { id: 'audit',      label: 'Audit Logs',  icon: ShieldCheck,     code: '10' },
  { id: 'backup',     label: 'Respaldo',   icon: ShieldCheck,    code: '11' },
];

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [section, setSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/auth', { cache: 'no-store' });
        const json = await res.json();
        if (mounted) setAuth(Boolean(json.authenticated));
      } catch {
        if (mounted) setAuth(false);
      } finally {
        if (mounted) setCheckingAuth(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (auth) {
      const msgs = JSON.parse(localStorage.getItem('cm_messages') || '[]');
      setUnread(msgs.filter((m: { read: boolean }) => !m.read).length);
    }
  }, [auth, section]);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    if (mq.matches) { setSidebarOpen(false); setCollapsed(false); }
  }, []);

  const login = async () => {
    setLoggingIn(true);
    setError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || 'No fue posible iniciar sesión');
        return;
      }
      setAuth(true);
      setPass('');
    } catch {
      setError('No fue posible conectar con el servidor');
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' }).catch(() => null);
    setAuth(false);
    setPass('');
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin border-2 border-neon-red border-t-transparent" />
      </div>
    );
  }

  // ─── LOGIN SCREEN ────────────────────────────────────────────
  if (!auth) {
    return (
      <div className="section-shell relative flex min-h-screen items-center justify-center overflow-hidden bg-bg p-4">
        <div className="arena-grid absolute inset-0 opacity-60" />
        <div className="absolute -right-24 top-10 h-[360px] w-[360px] rounded-full bg-neon-purple/[0.12] blur-[120px]" />
        <div className="absolute -left-24 bottom-10 h-[300px] w-[300px] rounded-full bg-neon-red/[0.08] blur-[110px]" />

        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center bg-neon-red shadow-[0_0_30px_rgba(203,254,28,.25)] angle-frame-sm">
              <Zap size={28} className="text-[#0B0E13]" />
            </div>
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className="h-px w-8 bg-neon-red" />
              <span className="acid-kicker">Acceso restringido</span>
              <span className="h-px w-8 bg-neon-red" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">CM Design</h1>
            <p className="mt-1 text-sm text-gray-500">Panel de administración</p>
          </div>

          {/* Card */}
          <div className="acid-panel angle-frame p-6">
            <label className="admin-label mb-2 block">Contraseña</label>
            <div className="relative mb-4">
              <Lock size={16} className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-500" />
              <input
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={(e) => { setPass(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && !loggingIn && login()}
                placeholder="••••••••"
                autoFocus
                className="admin-input !pl-9 !pr-10 !py-3"
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-gray-500 transition hover:text-neon-red"
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="mb-4 flex items-center justify-center gap-2 text-sm font-bold text-neon-red">
                {error}
              </motion.p>
            )}

            <button onClick={login} disabled={loggingIn} className="acid-button w-full !py-3 disabled:cursor-not-allowed disabled:opacity-60">{loggingIn ? 'Validando...' : 'Entrar al panel'}</button>
          </div>

          <p className="mt-6 text-center text-[10px] font-black uppercase tracking-[.2em] text-gray-600">CM Design © {new Date().getFullYear()}</p>
        </motion.div>
      </div>
    );
  }

  // ─── MAIN ADMIN LAYOUT ───────────────────────────────────────
  const SectionComponent = {
    dashboard:  AdminDashboard,
    projects:   AdminProjects,
    store:      AdminStore,
    messages:   AdminMessages,
    skills:     AdminSkills,
    builder:    AdminSectionBuilder,
    appearance: AdminAppearance,
    ai:         AdminAIAssistant,
    settings:   AdminSettings,
    audit:      AdminAuditLogs,
    backup:     AdminBackup,
  }[section] || AdminDashboard;

  const sidebarW = collapsed ? 'w-[68px]' : 'w-[252px]';

  return (
    <div className="flex min-h-screen bg-bg text-white">
      {/* ═══ SIDEBAR ═══ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed left-0 top-0 z-40 h-full md:relative ${sidebarW} flex flex-col border-r border-neon-red/15 bg-bg-secondary shadow-2xl transition-all duration-300 md:shadow-none`}
          >
            <div className="absolute left-0 top-0 h-full w-[2px] bg-gradient-to-b from-neon-red/60 via-transparent to-transparent" />

            {/* Header */}
            <div className="flex h-[60px] flex-shrink-0 items-center border-b border-white/[0.05] px-4">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center bg-neon-red angle-frame-sm">
                <Zap size={18} className="text-[#0B0E13]" />
              </div>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3 min-w-0">
                  <h2 className="truncate text-sm font-black uppercase tracking-tight text-white">CM Admin</h2>
                  <p className="truncate text-[9px] font-black uppercase tracking-[.18em] text-gray-500">Control center</p>
                </motion.div>
              )}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="ml-auto hidden flex-shrink-0 p-1.5 text-gray-500 transition hover:text-neon-red md:flex angle-frame-sm hover:bg-white/5"
                aria-label="Colapsar menú"
              >
                <ChevronLeft size={16} className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
              {NAV_ITEMS.map((item) => {
                const active = section === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setSection(item.id); if (window.innerWidth < 768) setSidebarOpen(false); }}
                    className={`group relative flex w-full items-center gap-3 px-3 py-2.5 text-[12px] font-bold uppercase tracking-[.06em] transition-all duration-200 angle-frame-sm ${
                      active
                        ? 'bg-neon-red text-[#0B0E13] shadow-[0_0_18px_rgba(203,254,28,.18)]'
                        : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={17} className="flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="truncate">{item.label}</span>
                        <span className={`ml-auto text-[8px] font-black ${active ? 'text-[#0B0E13]/60' : 'text-neon-red/60'}`}>{item.code}</span>
                        {item.id === 'messages' && unread > 0 && (
                          <span className="absolute right-9 top-1/2 -translate-y-1/2 bg-neon-red px-1.5 py-0.5 text-[9px] font-black text-[#0B0E13]">{unread}</span>
                        )}
                      </>
                    )}
                    {collapsed && item.id === 'messages' && unread > 0 && (
                      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-neon-red" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Bottom */}
            <div className="space-y-1 border-t border-white/[0.05] p-2">
              <a
                href="/"
                target="_blank"
                className="flex w-full items-center gap-3 px-3 py-2.5 text-[12px] font-bold uppercase tracking-[.06em] text-gray-400 transition hover:bg-white/[0.04] hover:text-white angle-frame-sm"
              >
                <Eye size={17} className="flex-shrink-0" />
                {!collapsed && <span>Ver sitio</span>}
              </a>
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-[12px] font-bold uppercase tracking-[.06em] text-gray-400 transition hover:bg-neon-red/[0.08] hover:text-neon-red angle-frame-sm"
              >
                <LogOut size={17} className="flex-shrink-0" />
                {!collapsed && <span>Cerrar sesión</span>}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ═══ MAIN ═══ */}
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-neon-red/15 bg-bg/90 px-5 py-3 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-400 transition hover:bg-white/5 hover:text-neon-red angle-frame-sm"
            aria-label="Alternar menú"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex flex-1 items-center gap-2">
            <span className="text-[9px] font-black text-neon-red/70">{NAV_ITEMS.find((n) => n.id === section)?.code}</span>
            <h2 className="text-sm font-black uppercase tracking-tight text-white">
              {NAV_ITEMS.find((n) => n.id === section)?.label || 'Dashboard'}
            </h2>
          </div>

          <a
            href="/"
            target="_blank"
            className="hidden items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400 transition hover:bg-white/5 hover:text-white sm:flex angle-frame-sm"
          >
            <Eye size={14} /> Ver sitio
          </a>

          {unread > 0 && (
            <button onClick={() => setSection('messages')} className="relative p-2 text-gray-400 transition hover:text-neon-red" aria-label="Mensajes sin leer">
              <Bell size={18} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-neon-red" />
            </button>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SectionComponent onUnreadChange={setUnread} setActiveTab={setSection} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
