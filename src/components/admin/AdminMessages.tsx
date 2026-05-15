'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Trash2, Eye, EyeOff, Search, CheckCheck, Clock, User
} from 'lucide-react';
import { notifyConfigUpdate, saveConfigData } from '@/lib/SiteConfigContext';
import { loadFromDB } from '@/lib/loadFromDB';

interface Message {
  id: string; name: string; email: string; message: string;
  read: boolean; created_at: string;
}

interface Props { onUnreadChange?: (n: number) => void; }

export default function AdminMessages({ onUnreadChange }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Message | null>(null);

  const loadData = useCallback(async () => {
    const dbMessages = await loadFromDB<Message[]>('cm_messages', []);
    setMessages(dbMessages);
    onUnreadChange?.(dbMessages.filter((m: Message) => !m.read).length);
  }, [onUnreadChange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const save = (list: Message[]) => {
    setMessages(list);
    saveConfigData('cm_messages', list);
    onUnreadChange?.(list.filter(m => !m.read).length);
  };

  const toggleRead = (id: string) => {
    save(messages.map(m => m.id === id ? { ...m, read: !m.read } : m));
  };

  const markAllRead = () => {
    save(messages.map(m => ({ ...m, read: true })));
  };

  const deleteMsg = (id: string) => {
    save(messages.filter(m => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const openMsg = (msg: Message) => {
    setSelected(msg);
    if (!msg.read) {
      save(messages.map(m => m.id === msg.id ? { ...m, read: true } : m));
    }
  };

  const filtered = messages.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.message.toLowerCase().includes(search.toLowerCase())
  );

  const unread = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Mensajes</h1>
          <p className="text-zinc-500 text-sm">{messages.length} mensajes · {unread} sin leer</p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
          >
            <CheckCheck size={16} /> Marcar todos como leídos
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar mensajes..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 transition"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* List */}
        <div className="lg:col-span-2 space-y-2 max-h-[65vh] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Mail size={32} className="mx-auto text-zinc-700 mb-3" />
              <p className="text-zinc-600 text-sm">No hay mensajes</p>
              <p className="text-zinc-700 text-xs mt-1">Los mensajes del formulario de contacto aparecerán aquí</p>
            </div>
          ) : (
            filtered.map((msg, i) => (
              <motion.button
                key={msg.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => openMsg(msg)}
                className={`w-full text-left p-4 rounded-xl border transition group ${
                  selected?.id === msg.id
                    ? 'bg-red-900/20 border-red-600/30'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${msg.read ? 'bg-zinc-600' : 'bg-red-500 animate-pulse'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm truncate ${msg.read ? 'text-zinc-400' : 'font-bold text-white'}`}>{msg.name}</p>
                      <span className="text-xs text-zinc-600 ml-2 whitespace-nowrap">
                        {new Date(msg.created_at).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{msg.email}</p>
                    <p className="text-xs text-zinc-600 truncate mt-1">{msg.message}</p>
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{selected.name}</h3>
                    <p className="text-sm text-zinc-500">{selected.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(selected.created_at).toLocaleString('es')}
                  </span>
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-xl p-4 mb-4">
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleRead(selected.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition"
                >
                  {selected.read ? <EyeOff size={14} /> : <Eye size={14} />}
                  {selected.read ? 'No leído' : 'Leído'}
                </button>
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 transition"
                >
                  <Mail size={14} /> Responder
                </a>
                <button
                  onClick={() => deleteMsg(selected.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-red-400 hover:text-white hover:bg-red-900/30 transition ml-auto"
                >
                  <Trash2 size={14} /> Eliminar
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <Mail size={40} className="text-zinc-700 mb-3" />
              <p className="text-zinc-500 text-sm">Selecciona un mensaje para ver los detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
