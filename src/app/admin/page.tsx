'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, MessageSquare, Wrench,
  Settings, LogOut, Menu, X, Eye, EyeOff,
  Lock, Zap, Bell, Palette, ShoppingBag, ChevronLeft
} from 'lucide-react';

// Secciones del admin
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminProjects from '@/components/admin/AdminProjects';
import AdminMessages from '@/components/admin/AdminMessages';
import AdminSkills from '@/components/admin/AdminSkills';
import AdminSettings from '@/components/admin/AdminSettings';
import AdminAppearance from '@/components/admin/AdminAppearance';
import AdminStore from '@/components/admin/AdminStore';

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { id: 'projects',   label: 'Proyectos',   icon: FolderKanban },
  { id: 'store',      label: 'Tienda',      icon: ShoppingBag },
  { id: 'messages',   label: 'Mensajes',    icon: MessageSquare },
  { id: 'skills',     label: 'Arsenal',     icon: Wrench },
  { id: 'appearance', label: 'Apariencia',  icon: Palette },
  { id: 'settings',   label: 'Config',      icon: Settings },
];

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || 'cm2026';

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [section, setSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const saved = sessionStorage.getItem('cm_admin_auth');
    if (saved === 'ok') setAuth(true);
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

  const login = () => {
    if (pass === ADMIN_PASS) {
      sessionStorage.setItem('cm_admin_auth', 'ok');
      setAuth(true);
      setError('');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('cm_admin_auth');
    setAuth(false);
    setPass('');
  };

  // ─── LOGIN SCREEN ────────────────────────────────────────────
  if (!auth) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#0B0E13] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 angle-frame-sm bg-neon-red mb-4 shadow-lg shadow-neon-red/20">
              <Zap size={28} className="text-[#0B0E13]" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">CM Design</h1>
            <p className="text-zinc-500 text-sm mt-1">Panel de Administración</p>
          </div>

          {/* Card */}
          <div className="acid-panel angle-frame p-6 shadow-2xl">
            <label className="block text-zinc-400 text-xs font-semibold mb-2 uppercase tracking-widest">
              Contraseña
            </label>
            <div className="relative mb-4">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={e => { setPass(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && login()}
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-10 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-neon-red focus:ring-1 focus:ring-neon-red/30 transition"
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mb-4 text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              onClick={login}
              className="acid-button w-full !py-3"
            >
              Entrar al Admin
            </button>
          </div>

          <p className="text-center text-zinc-600 text-xs mt-6">CM Design © 2026</p>
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
    appearance: AdminAppearance,
    settings:   AdminSettings,
  }[section] || AdminDashboard;

  const sidebarW = collapsed ? 'w-[68px]' : 'w-[260px]';

  return (
    <div className="min-h-screen bg-[#0B0E13] flex text-white">
      {/* ═══ UNIFIED SIDEBAR ═══ */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed md:relative z-40 top-0 left-0 h-full ${sidebarW} bg-[#10151D] border-r border-neon-red/15 flex flex-col transition-all duration-300 shadow-2xl md:shadow-none`}
          >
            {/* Header */}
            <div className="h-[64px] flex items-center px-4 border-b border-white/[0.04] flex-shrink-0">
              <div className="w-9 h-9 angle-frame-sm bg-neon-red flex items-center justify-center shadow-md flex-shrink-0">
                <Zap size={18} className="text-[#0B0E13]" />
              </div>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ml-3 min-w-0">
                  <h2 className="text-sm font-bold text-white truncate">CM Admin</h2>
                  <p className="text-[10px] text-zinc-500 truncate">Panel de Control</p>
                </motion.div>
              )}
              {/* Collapse toggle — desktop only */}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden md:flex ml-auto p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition flex-shrink-0"
              >
                <ChevronLeft size={16} className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
              {NAV_ITEMS.map(item => {
                const active = section === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setSection(item.id); if (window.innerWidth < 768) setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative ${
                      active
                        ? 'bg-neon-red text-[#0B0E13] shadow-md shadow-neon-red/20'
                        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {item.id === 'messages' && unread > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5 font-bold min-w-[20px] text-center">
                            {unread}
                          </span>
                        )}
                      </>
                    )}
                    {collapsed && item.id === 'messages' && unread > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Bottom actions */}
            <div className="p-2 border-t border-white/[0.04] space-y-0.5">
              <a
                href="/"
                target="_blank"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] transition`}
              >
                <Eye size={18} className="flex-shrink-0" />
                {!collapsed && <span>Ver Sitio</span>}
              </a>
              <button
                onClick={logout}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/[0.06] transition`}
              >
                <LogOut size={18} className="flex-shrink-0" />
                {!collapsed && <span>Cerrar Sesión</span>}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-[#0B0E13]/90 backdrop-blur-sm border-b border-neon-red/15 px-5 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex-1">
            <h2 className="font-bold text-sm text-white">
              {NAV_ITEMS.find(n => n.id === section)?.label || 'Dashboard'}
            </h2>
          </div>

          <a
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-zinc-800"
          >
            <Eye size={14} />
            Ver sitio
          </a>

          {unread > 0 && (
            <button
              onClick={() => setSection('messages')}
              className="relative p-2 text-zinc-400 hover:text-white"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          )}
        </header>

        {/* Section Content */}
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
