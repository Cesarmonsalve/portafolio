'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FolderKanban, MessageSquare, Wrench, Eye, TrendingUp,
  Clock, Activity, ArrowUpRight, BarChart3, Plus, Settings, ExternalLink
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useSiteConfig } from '@/lib/SiteConfigContext';

const mockChartData = [
  { name: 'Lun', visitas: 120 },
  { name: 'Mar', visitas: 210 },
  { name: 'Mié', visitas: 180 },
  { name: 'Jue', visitas: 340 },
  { name: 'Vie', visitas: 280 },
  { name: 'Sáb', visitas: 410 },
  { name: 'Dom', visitas: 520 },
];

interface Props { 
  onUnreadChange?: (n: number) => void;
  setActiveTab?: (tab: string) => void;
}

export default function AdminDashboard({ onUnreadChange, setActiveTab }: Props) {
  const { projects, skills, socials } = useSiteConfig();
  const [stats, setStats] = useState({ projects: 0, messages: 0, unread: 0, skills: 0 });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);

  const loadLocalStats = useCallback(async () => {
    // Try to load messages from DB first for cross-device sync
    let messages: any[] = [];
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data && json.data['cm_messages']) {
          messages = json.data['cm_messages'];
          localStorage.setItem('cm_messages', JSON.stringify(messages));
        }
      }
    } catch { /* fallback */ }
    
    if (messages.length === 0) {
      messages = JSON.parse(localStorage.getItem('cm_messages') || '[]');
    }
    
    const unread = messages.filter((m: any) => !m.read).length;
    
    setStats({
      projects: projects.length,
      messages: messages.length,
      unread,
      skills: skills.length
    });
    
    setRecentMessages(messages.slice(-5).reverse());
    onUnreadChange?.(unread);
  }, [projects, skills, onUnreadChange]);

  useEffect(() => {
    loadLocalStats();
    window.addEventListener('cm_config_updated', loadLocalStats);
    return () => window.removeEventListener('cm_config_updated', loadLocalStats);
  }, [loadLocalStats]);

  const cards = [
    { label: 'Proyectos', value: stats.projects, icon: FolderKanban, color: 'from-red-600 to-pink-600', shadow: 'shadow-red-900/30', tab: 'projects' },
    { label: 'Mensajes', value: stats.messages, icon: MessageSquare, color: 'from-blue-600 to-cyan-500', shadow: 'shadow-blue-900/30', tab: 'messages' },
    { label: 'Sin leer', value: stats.unread, icon: Eye, color: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-900/30', tab: 'messages' },
    { label: 'Skills', value: stats.skills, icon: Wrench, color: 'from-purple-600 to-violet-500', shadow: 'shadow-purple-900/30', tab: 'skills' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Resumen general de tu portafolio</p>
        </div>
        <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition">
          Ver Sitio <ExternalLink size={12} />
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.button
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveTab?.(card.tab)}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 relative overflow-hidden group hover:border-zinc-700 transition text-left w-full"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-5 rounded-bl-[3rem] group-hover:opacity-10 transition`} />
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} ${card.shadow} shadow-lg mb-3`}>
                <Icon size={18} className="text-white" />
              </div>
              <p className="text-3xl font-black text-white">{card.value}</p>
              <p className="text-zinc-500 text-sm font-medium">{card.label}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-400" />
              Mensajes Recientes
            </h3>
            <button onClick={() => setActiveTab?.('messages')} className="text-xs text-blue-400 hover:underline">Ver todos</button>
          </div>
          {recentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
              <MessageSquare size={40} className="mb-3 opacity-20" />
              <p className="text-sm">No hay mensajes aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg: any) => (
                <div key={msg.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition border border-transparent hover:border-white/5">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${msg.read ? 'bg-zinc-700' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{msg.name}</p>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{msg.message}</p>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-mono uppercase">
                    {new Date(msg.created_at).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions & Site Status */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
          >
            <h3 className="font-bold text-white flex items-center gap-2 mb-4">
              <Plus size={16} className="text-red-400" />
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button onClick={() => setActiveTab?.('projects')} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition text-sm text-zinc-300">
                <FolderKanban size={14} /> Nuevo Proyecto
              </button>
              <button onClick={() => setActiveTab?.('skills')} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition text-sm text-zinc-300">
                <Wrench size={14} /> Editar Skills
              </button>
              <button onClick={() => setActiveTab?.('settings')} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition text-sm text-zinc-300">
                <Settings size={14} /> Cambiar Tema
              </button>
            </div>
          </motion.div>

          {/* Analytics Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <BarChart3 size={16} className="text-green-400" />
                Tráfico Estimado
              </h3>
              <span className="text-xs text-green-400 font-bold bg-green-400/10 px-2 py-1 rounded-md">+24%</span>
            </div>
            
            <div className="h-[120px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                    itemStyle={{ color: '#4ade80', fontWeight: 'bold' }}
                    cursor={{ stroke: '#27272a', strokeWidth: 1 }}
                  />
                  <Area type="monotone" dataKey="visitas" stroke="#4ade80" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitas)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
