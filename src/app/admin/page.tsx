'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, MessageSquare, Wrench,
  Settings, LogOut, Menu, X, ChevronRight, Eye, EyeOff,
  Lock, Zap, Bell, User, Palette, ShoppingBag
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
      <div className="min-h-screen bg-[#060606] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-900/40">
              <Zap size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">CM Design</h1>
            <p className="text-zinc-500 text-sm mt-1">Panel de Administración</p>
          </div>

          {/* Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
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
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-10 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition"
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
              className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-900/30 active:scale-95"
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex text-white">
      {/* SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed md:relative z-40 top-0 left-0 h-full flex"
          >
            {/* LEFT RAIL (Icons) */}
            <div className="w-[68px] bg-[#1a1a1c] border-r border-white/5 flex flex-col items-center py-4 gap-4 flex-shrink-0 z-10">
              {/* Logo */}
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg mb-2">
                <Zap size={20} className="text-white" />
              </div>

              {/* Icons List */}
              <div className="flex flex-col gap-2 w-full px-3">
                {NAV_ITEMS.map(item => {
                  const active = section === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={`icon-${item.id}`}
                      onClick={() => setSection(item.id)}
                      className={`w-11 h-11 mx-auto flex items-center justify-center rounded-xl transition-colors relative ${
                        active 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                      title={item.label}
                    >
                      <Icon size={20} />
                      {item.id === 'messages' && unread > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1a1a1c]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Icons */}
              <div className="mt-auto flex flex-col gap-2 w-full px-3">
                <a
                  href="/"
                  target="_blank"
                  className="w-11 h-11 mx-auto flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Ver sitio"
                >
                  <Eye size={20} />
                </a>
                <button
                  onClick={logout}
                  className="w-11 h-11 mx-auto flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>

            {/* RIGHT RAIL (Text) */}
            <div className="w-[240px] bg-[#1e1e20] border-r border-white/5 flex flex-col flex-shrink-0 shadow-2xl md:shadow-none">
              {/* Header */}
              <div className="h-[72px] flex items-center px-6">
                <h2 className="text-white font-bold text-lg tracking-wide">
                  Panel Admin
                </h2>
              </div>

              {/* Menu Items */}
              <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map(item => {
                  const active = section === item.id;
                  return (
                    <button
                      key={`text-${item.id}`}
                      onClick={() => setSection(item.id)}
                      className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.label}
                      {item.id === 'messages' && unread > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                          {unread}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
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

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 px-5 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex-1">
            <h2 className="font-bold text-sm capitalize text-white">
              {NAV_ITEMS.find(n => n.id === section)?.label || 'Dashboard'}
            </h2>
          </div>

          <a
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-zinc-800"
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
