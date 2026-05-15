'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, Loader2, Wrench, ArrowUp, ArrowDown } from 'lucide-react';
import { notifyConfigUpdate, saveConfigData } from '@/lib/SiteConfigContext';
import { loadFromDB } from '@/lib/loadFromDB';
import { toast } from '@/components/ui/Toast';

interface Skill {
  id: string; name: string; level: number; icon: string;
  category: string; position: number;
}

interface Props { onUnreadChange?: (n: number) => void; }

const CATS = ['Design', 'Motion', '3D', 'Tools', 'Other'];
const ICONS = ['🎨','🎬','✏️','🖥️','📐','🎯','🔥','💎','⚡','🎮','📸','🎵'];

export default function AdminSkills(_p: Props) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    const dbSkills = await loadFromDB<Skill[]>('cm_skills', []);
    setSkills(dbSkills);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const persist = (list: Skill[]) => { setSkills(list); saveConfigData('cm_skills', list); };

  const openNew = () => { setEditing({ id: crypto.randomUUID(), name: '', level: 80, icon: '🎨', category: 'Design', position: skills.length }); setShowForm(true); };
  const openEdit = (s: Skill) => { setEditing({ ...s }); setShowForm(true); };

  const handleSave = () => {
    if (!editing) return;
    setSaving(true);
    setTimeout(() => {
      const idx = skills.findIndex(s => s.id === editing.id);
      persist(idx >= 0 ? skills.map(s => s.id === editing.id ? editing : s) : [...skills, editing]);
      setShowForm(false); setEditing(null); setSaving(false);
      toast('Skill guardado', 'success');
    }, 300);
  };

  const del = (id: string) => { 
    if (confirm('¿Eliminar?')) {
      persist(skills.filter(s => s.id !== id)); 
      toast('Skill eliminado', 'info');
    }
  };

  const moveUp = (sk: Skill) => {
    const idx = skills.findIndex(s => s.id === sk.id);
    if (idx <= 0) return;
    const newArr = [...skills];
    [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
    persist(newArr);
  };

  const moveDown = (sk: Skill) => {
    const idx = skills.findIndex(s => s.id === sk.id);
    if (idx === -1 || idx === skills.length - 1) return;
    const newArr = [...skills];
    [newArr[idx + 1], newArr[idx]] = [newArr[idx], newArr[idx + 1]];
    persist(newArr);
  };

  const grouped = CATS.reduce((a, c) => {
    const items = skills.filter(s => s.category === c).sort((x, y) => x.position - y.position);
    if (items.length) a[c] = items;
    return a;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Arsenal / Skills</h1>
          <p className="text-zinc-500 text-sm">{skills.length} habilidades</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 transition shadow-lg shadow-purple-900/20 active:scale-95">
          <Plus size={16} /> Nuevo Skill
        </button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <Wrench size={32} className="mx-auto text-zinc-700 mb-3" />
          <p className="text-zinc-600 text-sm">No hay skills. Agrega tus herramientas.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3">{cat}</h3>
            <div className="space-y-2">
              {items.map((sk, i) => (
                <motion.div key={sk.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-premium border border-zinc-800/50 rounded-xl p-4 flex items-center gap-4 group hover:border-zinc-700 transition">
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition mr-1">
                    <button onClick={() => moveUp(sk)} className="text-zinc-500 hover:text-white p-0.5"><ArrowUp size={12} /></button>
                    <button onClick={() => moveDown(sk)} className="text-zinc-500 hover:text-white p-0.5"><ArrowDown size={12} /></button>
                  </div>
                  <span className="text-xl">{sk.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{sk.name}</p>
                    <div className="mt-1.5 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${sk.level}%` }} transition={{ duration: 0.8 }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-600 to-violet-400" />
                    </div>
                  </div>
                  <span className="text-sm font-mono text-zinc-500">{sk.level}%</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => openEdit(sk)} className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-blue-900/20 transition"><Edit2 size={14} /></button>
                    <button onClick={() => del(sk.id)} className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-900/20 transition"><Trash2 size={14} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}

      <AnimatePresence>
        {showForm && editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-zinc-800">
                <h2 className="font-bold text-white">{skills.find(s => s.id === editing.id) ? 'Editar' : 'Nuevo'} Skill</h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Nombre</label>
                  <input value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition" placeholder="Ej: After Effects" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Categoría</label>
                  <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition">
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Ícono</label>
                  <div className="flex gap-1 flex-wrap">
                    {ICONS.map(ic => (
                      <button key={ic} onClick={() => setEditing({ ...editing, icon: ic })}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition ${editing.icon === ic ? 'bg-purple-600 ring-2 ring-purple-400' : 'bg-zinc-800 hover:bg-zinc-700'}`}>{ic}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Nivel: {editing.level}%</label>
                  <input type="range" min={10} max={100} step={5} value={editing.level} onChange={e => setEditing({ ...editing, level: Number(e.target.value) })} className="w-full accent-purple-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 p-5 border-t border-zinc-800">
                <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition">Cancelar</button>
                <button onClick={handleSave} disabled={!editing.name.trim() || saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-500 disabled:opacity-50 transition shadow-lg shadow-purple-900/20 active:scale-95">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Guardar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
