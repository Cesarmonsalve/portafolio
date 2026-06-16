'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban, MessageSquare, Wrench, ShoppingBag, Mail,
  Plus, Settings, ExternalLink, BarChart3, CheckCircle2, Circle,
  Share2, ArrowUpRight,
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import AdminActivityFeed from './AdminActivityFeed';

interface Props {
  onUnreadChange?: (n: number) => void;
  setActiveTab?: (tab: string) => void;
}

export default function AdminDashboard({ onUnreadChange, setActiveTab }: Props) {
  const { projects, skills, socials, storeItems, cfg } = useSiteConfig();
  const [messages, setMessages] = useState<any[]>([]);

  const loadMessages = useCallback(async () => {
    let msgs: any[] = [];
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.['cm_messages']) {
          msgs = json.data['cm_messages'];
          localStorage.setItem('cm_messages', JSON.stringify(msgs));
        }
      }
    } catch { /* fallback */ }
    if (msgs.length === 0) msgs = JSON.parse(localStorage.getItem('cm_messages') || '[]');
    setMessages(msgs);
    onUnreadChange?.(msgs.filter((m: any) => !m.read).length);
  }, [onUnreadChange]);

  useEffect(() => {
    loadMessages();
    window.addEventListener('cm_config_updated', loadMessages);
    return () => window.removeEventListener('cm_config_updated', loadMessages);
  }, [loadMessages]);

  const unread = messages.filter((m) => !m.read).length;
  const recentMessages = [...messages].slice(-5).reverse();
  const enabledSocials = socials.filter((s) => s.enabled).length;

  // Real category distribution from projects
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return Object.entries(counts).map(([name, total]) => ({ name, total }));
  }, [projects]);

  const cards = [
    { label: 'Proyectos', value: projects.length, icon: FolderKanban, tab: 'projects', accent: '#CBFE1C' },
    { label: 'Recursos', value: storeItems.length, icon: ShoppingBag, tab: 'store', accent: '#8B5CF6' },
    { label: 'Skills', value: skills.length, icon: Wrench, tab: 'skills', accent: '#00E5FF' },
    { label: 'Mensajes', value: messages.length, icon: MessageSquare, tab: 'messages', accent: '#CBFE1C', badge: unread },
  ];

  // Real setup-completeness checklist
  const checklist = [
    { done: projects.length > 0, label: 'Al menos un proyecto publicado', tab: 'projects' },
    { done: !!cfg.about_photo, label: 'Foto de perfil cargada', tab: 'appearance' },
    { done: enabledSocials > 0, label: 'Redes sociales activas', tab: 'settings' },
    { done: !!cfg.contact_whatsapp && !cfg.contact_whatsapp.includes('1234567890'), label: 'WhatsApp de contacto real', tab: 'settings' },
    { done: !!cfg.contact_email && cfg.contact_email !== 'cm@design.com', label: 'Email de contacto personalizado', tab: 'settings' },
    { done: storeItems.length > 0, label: 'Recursos en la tienda', tab: 'store' },
  ];
  const doneCount = checklist.filter((c) => c.done).length;
  const completeness = Math.round((doneCount / checklist.length) * 100);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.4 },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="h-px w-10 bg-neon-red" />
            <span className="acid-kicker">Panel // Resumen</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Estado general de tu portafolio en tiempo real.</p>
        </div>
        <a href="/" target="_blank" className="ghost-button !py-2.5 !text-[10px]">
          Ver sitio <ExternalLink size={13} />
        </a>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.button
              key={card.label}
              {...fade(i * 0.07)}
              onClick={() => setActiveTab?.(card.tab)}
              className="admin-card admin-card-tap admin-stat-glow relative overflow-hidden p-5 text-left"
            >
              <div className="relative flex items-start justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center border angle-frame-sm"
                  style={{ borderColor: `${card.accent}33`, background: `${card.accent}12`, color: card.accent }}
                >
                  <Icon size={18} />
                </span>
                {!!card.badge && card.badge > 0 && (
                  <span className="border border-neon-red/40 bg-neon-red/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-neon-red angle-frame-sm">
                    {card.badge} sin leer
                  </span>
                )}
              </div>
              <p className="relative mt-5 text-4xl font-black text-white">{card.value}</p>
              <p className="relative mt-0.5 text-[10px] font-black uppercase tracking-[.18em] text-gray-500">{card.label}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Recent Messages */}
        <motion.div {...fade(0.3)} className="admin-card p-5 lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-white">
              <Mail size={15} className="text-neon-red" /> Mensajes recientes
            </h3>
            <button onClick={() => setActiveTab?.('messages')} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-gray-500 transition hover:text-neon-red">
              Ver todos <ArrowUpRight size={12} />
            </button>
          </div>
          {recentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-600">
              <MessageSquare size={36} className="mb-3 opacity-20" />
              <p className="text-sm">Aún no hay mensajes.</p>
              <p className="mt-1 text-xs text-gray-700">Los envíos del formulario de contacto aparecerán aquí.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {recentMessages.map((msg: any) => (
                <button
                  key={msg.id}
                  onClick={() => setActiveTab?.('messages')}
                  className="flex w-full items-start gap-3 border border-transparent p-3 text-left transition hover:border-white/[0.08] hover:bg-white/[0.02] angle-frame-sm"
                >
                  <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${msg.read ? 'bg-white/15' : 'bg-neon-red shadow-[0_0_10px_rgba(203,254,28,.6)]'}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-white">{msg.name}</span>
                    <span className="mt-0.5 block truncate text-xs text-gray-500">{msg.message}</span>
                  </span>
                  <span className="flex-shrink-0 font-mono text-[10px] uppercase text-gray-600">
                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString('es', { day: '2-digit', month: 'short' }) : ''}
                  </span>
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fade(0.4)} className="admin-card p-5">
          <h3 className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-white">
            <Plus size={15} className="text-neon-red" /> Acciones rápidas
          </h3>
          <div className="space-y-2">
            {[
              { icon: FolderKanban, label: 'Gestionar proyectos', tab: 'projects' },
              { icon: ShoppingBag, label: 'Editar tienda', tab: 'store' },
              { icon: Wrench, label: 'Editar arsenal', tab: 'skills' },
              { icon: Settings, label: 'Tema y configuración', tab: 'settings' },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.tab}
                  onClick={() => setActiveTab?.(a.tab)}
                  className="group flex w-full items-center gap-3 border border-white/[0.08] bg-white/[0.02] p-3 text-sm font-medium text-gray-300 transition hover:border-neon-red/40 hover:text-white angle-frame-sm"
                >
                  <Icon size={15} className="text-gray-500 transition group-hover:text-neon-red" />
                  <span className="flex-1 text-left">{a.label}</span>
                  <ArrowUpRight size={14} className="text-gray-700 transition group-hover:text-neon-red" />
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Projects by category (REAL data) */}
        <motion.div {...fade(0.5)} className="admin-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-white">
              <BarChart3 size={15} className="text-neon-red" /> Proyectos por categoría
            </h3>
            <span className="admin-chip">{projects.length} totales</span>
          </div>
          {categoryData.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-600">Sin proyectos para graficar.</div>
          ) : (
            <div className="mt-2 h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#7a828f', fontSize: 10, fontWeight: 700 }}
                    axisLine={{ stroke: 'rgba(255,255,255,.08)' }}
                    tickLine={false}
                    interval={0}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(203,254,28,.06)' }}
                    contentStyle={{ background: '#0B0E13', border: '1px solid rgba(203,254,28,.3)', borderRadius: 0, fontSize: 12, color: '#fff' }}
                    itemStyle={{ color: '#CBFE1C', fontWeight: 800 }}
                    labelStyle={{ color: '#9aa3b0' }}
                  />
                  <Bar dataKey="total" radius={[0, 0, 0, 0]} maxBarSize={48}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={i % 2 === 0 ? '#CBFE1C' : '#8B5CF6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Setup completeness (REAL checklist) */}
        <motion.div {...fade(0.6)} className="admin-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-white">
              <Share2 size={15} className="text-neon-red" /> Configuración
            </h3>
            <span className="text-lg font-black text-neon-red">{completeness}%</span>
          </div>
          <div className="mb-4 h-1.5 overflow-hidden bg-white/[0.06]">
            <div className="h-full bg-neon-red shadow-[0_0_12px_rgba(203,254,28,.4)] transition-all duration-700" style={{ width: `${completeness}%` }} />
          </div>
          <div className="space-y-1">
            {checklist.map((c) => (
              <button
                key={c.label}
                onClick={() => setActiveTab?.(c.tab)}
                className="flex w-full items-center gap-2.5 py-1.5 text-left text-xs transition hover:text-white"
              >
                {c.done
                  ? <CheckCircle2 size={15} className="flex-shrink-0 text-neon-red" />
                  : <Circle size={15} className="flex-shrink-0 text-gray-600" />}
                <span className={c.done ? 'text-gray-400 line-through decoration-white/20' : 'text-gray-300'}>{c.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Premium widgets row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AdminActivityFeed />
        <motion.div {...fade(0.65)} className="admin-card p-5">
          <h3 className="mb-4 text-xs font-black uppercase tracking-[.14em] text-white">Analytics avanzados</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Destacados', value: projects.filter((p) => p.featured).length },
              { label: 'Socials', value: enabledSocials },
              { label: 'Completitud', value: `${completeness}%` },
            ].map((w) => (
              <div key={w.label} className="border border-white/[0.08] p-3 text-center angle-frame-sm">
                <p className="text-2xl font-black text-neon-red">{w.value}</p>
                <p className="mt-1 text-[9px] font-black uppercase tracking-wider text-gray-500">{w.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
