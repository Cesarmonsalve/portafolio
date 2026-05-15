'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, Loader2, Store, ShoppingBag, Link as LinkIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { notifyConfigUpdate, saveConfigData } from '@/lib/SiteConfigContext';
import type { StoreItem } from '@/lib/config';
import { loadFromDB } from '@/lib/loadFromDB';
import { toast } from '@/components/ui/Toast';

interface Props { onUnreadChange?: (n: number) => void; }

const CATS = ['Templates', 'Presets', 'Assets', 'Plugins', 'Otros'];
const EMOJIS = ['🎨','⚡','🖼️','🎮','📱','🎬','🔥','💎','🎵','📦'];

export default function AdminStore(_p: Props) {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [editing, setEditing] = useState<StoreItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    const dbItems = await loadFromDB<StoreItem[]>('cm_store_items', []);
    setItems(dbItems);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const persist = (list: StoreItem[]) => { 
    setItems(list); 
    saveConfigData('cm_store_items', list); 
  };

  const openNew = () => { 
    setEditing({ 
      id: crypto.randomUUID(), 
      title: '', 
      description: '', 
      category: 'Templates', 
      price: 'GRATIS',
      tags: [],
      emoji: '🎨',
      downloadLinks: [],
      paymentUrl: '',
      badge: '',
      position: items.length 
    }); 
    setShowForm(true); 
  };
  
  const openEdit = (i: StoreItem) => { setEditing({ ...i }); setShowForm(true); };

  const handleSave = () => {
    if (!editing) return;
    setSaving(true);
    setTimeout(() => {
      const idx = items.findIndex(i => i.id === editing.id);
      persist(idx >= 0 ? items.map(i => i.id === editing.id ? editing : i) : [...items, editing]);
      setShowForm(false); setEditing(null); setSaving(false);
      toast('Recurso guardado', 'success');
    }, 300);
  };

  const del = (id: string) => { 
    if (confirm('¿Eliminar recurso?')) {
      persist(items.filter(i => i.id !== id)); 
      toast('Recurso eliminado', 'info');
    }
  };

  const moveUp = (item: StoreItem) => {
    const idx = items.findIndex(i => i.id === item.id);
    if (idx <= 0) return;
    const newArr = [...items];
    [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
    persist(newArr);
    toast('Orden actualizado', 'success');
  };

  const moveDown = (item: StoreItem) => {
    const idx = items.findIndex(i => i.id === item.id);
    if (idx === -1 || idx === items.length - 1) return;
    const newArr = [...items];
    [newArr[idx + 1], newArr[idx]] = [newArr[idx], newArr[idx + 1]];
    persist(newArr);
    toast('Orden actualizado', 'success');
  };

  const grouped = CATS.reduce((a, c) => {
    const catItems = items.filter(i => i.category === c).sort((x, y) => (x.position || 0) - (y.position || 0));
    if (catItems.length) a[c] = catItems;
    return a;
  }, {} as Record<string, StoreItem[]>);

  // If there are items that don't match standard categories
  const otherItems = items.filter(i => !CATS.includes(i.category));
  if (otherItems.length) {
    grouped['Otros'] = [...(grouped['Otros'] || []), ...otherItems];
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Tienda / Recursos</h1>
          <p className="text-zinc-500 text-sm">{items.length} elementos</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 transition shadow-lg shadow-teal-900/20 active:scale-95">
          <Plus size={16} /> Nuevo Recurso
        </button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <Store size={32} className="mx-auto text-zinc-700 mb-3" />
          <p className="text-zinc-600 text-sm">No hay recursos en la tienda. Empieza a agregar contenido.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, catItems]) => (
          <div key={cat}>
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-3">{cat}</h3>
            <div className="space-y-2">
              {catItems.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass-premium border border-zinc-800/50 rounded-xl p-4 flex items-center gap-4 group hover:border-zinc-700 transition">
                  <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => moveUp(item)} className="text-zinc-500 hover:text-white p-0.5"><ArrowUp size={12} /></button>
                    <button onClick={() => moveDown(item)} className="text-zinc-500 hover:text-white p-0.5"><ArrowDown size={12} /></button>
                  </div>
                  <span className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-2xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-white truncate">{item.title}</p>
                      {item.badge && <span className="bg-neon-red/20 text-neon-red px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide">{item.badge}</span>}
                    </div>
                    <p className="text-xs text-zinc-400 truncate">{item.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">{item.price}</span>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1"><LinkIcon size={10} /> {item.downloadLinks.length} Links</span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-blue-900/20 transition"><Edit2 size={14} /></button>
                    <button onClick={() => del(item.id)} className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-900/20 transition"><Trash2 size={14} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}

      <AnimatePresence>
        {showForm && editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl my-8">
              <div className="flex items-center justify-between p-5 border-b border-zinc-800">
                <h2 className="font-bold text-white flex items-center gap-2"><ShoppingBag size={18} className="text-teal-400" /> {items.find(i => i.id === editing.id) ? 'Editar' : 'Nuevo'} Recurso</h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Título</label>
                    <input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition" placeholder="Pack de Assets..." />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Categoría</label>
                    <select value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition">
                      {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Descripción</label>
                  <textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition min-h-[80px]" placeholder="Breve descripción del recurso..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Precio (Ej: GRATIS o $10.00)</label>
                    <input value={editing.price} onChange={e => setEditing({ ...editing, price: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition" placeholder="GRATIS" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Badge (Opcional: 🔥 Popular)</label>
                    <input value={editing.badge || ''} onChange={e => setEditing({ ...editing, badge: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition" placeholder="⚡ Nuevo" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Tags (separados por coma)</label>
                  <input value={editing.tags.join(', ')} onChange={e => setEditing({ ...editing, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition" placeholder="PSD, Illustrator, Motion..." />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">Emoji Icon</label>
                  <div className="flex gap-2 flex-wrap">
                    {EMOJIS.map(ic => (
                      <button key={ic} onClick={() => setEditing({ ...editing, emoji: ic })}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition ${editing.emoji === ic ? 'bg-teal-600 ring-2 ring-teal-400' : 'bg-zinc-800 hover:bg-zinc-700'}`}>{ic}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Imagen de Portada (URL)</label>
                  <input value={editing.image || ''} onChange={e => setEditing({ ...editing, image: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-teal-500/50 transition" placeholder="https://i.imgur.com/ejemplo.jpg" />
                  {editing.image && (
                    <div className="mt-2 relative rounded-xl overflow-hidden border border-zinc-700 h-32">
                      <img src={editing.image} alt="Preview" className="w-full h-full object-cover" />
                      <button onClick={() => setEditing({ ...editing, image: '' })} className="absolute top-2 right-2 p-1 rounded-lg bg-black/70 text-white hover:bg-red-600 transition"><X size={14} /></button>
                    </div>
                  )}
                  <p className="text-[10px] text-zinc-500 mt-1">Opcional. Si no pones imagen se mostrará el emoji como portada.</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Links de Descarga / Compra</label>
                    <button onClick={() => setEditing({...editing, downloadLinks: [...editing.downloadLinks, {platform: 'Mediafire', url: '', color: '#4285F4'}]})} 
                            className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1">
                      <Plus size={12}/> Agregar Link
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editing.downloadLinks.length === 0 && (
                      <p className="text-xs text-zinc-500 italic bg-zinc-800/50 p-3 rounded-xl border border-dashed border-zinc-700 text-center">No hay links agregados.</p>
                    )}
                    {editing.downloadLinks.map((link, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-zinc-800 p-2 rounded-xl border border-zinc-700">
                        <input value={link.platform} onChange={e => {
                          const nl = [...editing.downloadLinks]; nl[idx].platform = e.target.value;
                          setEditing({...editing, downloadLinks: nl});
                        }} className="w-1/3 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-teal-500/50" placeholder="Plataforma" />
                        
                        <input value={link.url} onChange={e => {
                          const nl = [...editing.downloadLinks]; nl[idx].url = e.target.value;
                          setEditing({...editing, downloadLinks: nl});
                        }} className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-teal-500/50" placeholder="https://..." />
                        
                        <input type="color" value={link.color} onChange={e => {
                          const nl = [...editing.downloadLinks]; nl[idx].color = e.target.value;
                          setEditing({...editing, downloadLinks: nl});
                        }} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                        
                        <button onClick={() => {
                          const nl = [...editing.downloadLinks]; nl.splice(idx, 1);
                          setEditing({...editing, downloadLinks: nl});
                        }} className="p-1.5 text-zinc-500 hover:text-red-400 transition"><Trash2 size={14}/></button>
                      </div>
                    ))}
                  </div>
                </div>

                {editing.price.toUpperCase() !== 'GRATIS' && (
                  <div className="pt-2 border-t border-zinc-800">
                    <label className="text-xs font-semibold text-neon-red uppercase tracking-widest mb-1 block flex items-center gap-2">
                      <LinkIcon size={12} /> Link de Compra Automática (Gumroad, Hotmart, etc.)
                    </label>
                    <input value={editing.paymentUrl || ''} onChange={e => setEditing({ ...editing, paymentUrl: e.target.value })}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-neon-red/50 transition" placeholder="https://gumroad.com/l/..." />
                    <p className="text-[10px] text-zinc-500 mt-1">Este link se abrirá automáticamente al hacer clic en "COMPRAR AHORA".</p>
                  </div>
                )}

              </div>
              <div className="flex justify-end gap-3 p-5 border-t border-zinc-800">
                <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition">Cancelar</button>
                <button onClick={handleSave} disabled={!editing.title.trim() || saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-500 disabled:opacity-50 transition shadow-lg shadow-teal-900/20 active:scale-95">
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
