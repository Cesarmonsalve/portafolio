'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, Loader2, Wrench, ArrowUp, ArrowDown, GripVertical, Search } from 'lucide-react';
import * as SiIcons from 'react-icons/si';
import { notifyConfigUpdate, saveConfigData } from '@/lib/SiteConfigContext';
import { loadFromDB } from '@/lib/loadFromDB';
import { toast } from '@/components/ui/Toast';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Skill {
  id: string; name: string; level: number; icon: string;
  category: string; position: number;
}

interface Props { onUnreadChange?: (n: number) => void; }

const CATS = ['Design', 'Motion', '3D', 'Tools', 'Other'];

// Professional Icon Library (Si = Simple Icons) with brand colors
const ICON_LIBRARY: { id: string; label: string; color: string }[] = [
  { id: 'SiAdobephotoshop', label: 'Photoshop', color: '#31A8FF' },
  { id: 'SiAdobeaftereffects', label: 'After Effects', color: '#9999FF' },
  { id: 'SiAdobeillustrator', label: 'Illustrator', color: '#FF9A00' },
  { id: 'SiAdobepremierepro', label: 'Premiere Pro', color: '#9999FF' },
  { id: 'SiAdobelightroom', label: 'Lightroom', color: '#31A8FF' },
  { id: 'SiAdobeindesign', label: 'InDesign', color: '#FF3366' },
  { id: 'SiAdobeaudition', label: 'Audition', color: '#9999FF' },
  { id: 'SiAdobexd', label: 'Adobe XD', color: '#FF61F6' },
  { id: 'SiBlender', label: 'Blender', color: '#F5792A' },
  { id: 'SiCinema4d', label: 'Cinema 4D', color: '#011A6A' },
  { id: 'SiAutodesk', label: 'Autodesk', color: '#0696D7' },
  { id: 'SiUnrealengine', label: 'Unreal Engine', color: '#FFFFFF' },
  { id: 'SiUnity', label: 'Unity', color: '#FFFFFF' },
  { id: 'SiHoudini', label: 'Houdini', color: '#FF4713' },
  { id: 'SiFigma', label: 'Figma', color: '#F24E1E' },
  { id: 'SiSketch', label: 'Sketch', color: '#F7B500' },
  { id: 'SiCanva', label: 'Canva', color: '#00C4CC' },
  { id: 'SiInvision', label: 'InVision', color: '#FF3366' },
  { id: 'SiAffinitydesigner', label: 'Affinity Designer', color: '#1B72BE' },
  { id: 'SiAffinityphoto', label: 'Affinity Photo', color: '#7E4DD2' },
  { id: 'SiAffinitypublisher', label: 'Affinity Publisher', color: '#C9514D' },
  { id: 'SiDavinciresolve', label: 'DaVinci Resolve', color: '#E12E2E' },
  { id: 'SiObsstudio', label: 'OBS', color: '#302E31' },
  { id: 'SiCapcut', label: 'CapCut', color: '#FFFFFF' },
  { id: 'SiGimp', label: 'GIMP', color: '#5C5543' },
  { id: 'SiInkscape', label: 'Inkscape', color: '#000000' },
  { id: 'SiCoreldraw', label: 'CorelDRAW', color: '#000000' },
  { id: 'SiVimeo', label: 'Vimeo', color: '#1AB7EA' },
  { id: 'SiYoutube', label: 'YouTube', color: '#FF0000' },
  { id: 'SiInstagram', label: 'Instagram', color: '#E4405F' },
  { id: 'SiTiktok', label: 'TikTok', color: '#000000' },
  { id: 'SiBehance', label: 'Behance', color: '#1769FF' },
  { id: 'SiDribbble', label: 'Dribbble', color: '#EA4C89' },
  { id: 'SiJavascript', label: 'JavaScript', color: '#F7DF1E' },
  { id: 'SiTypescript', label: 'TypeScript', color: '#3178C6' },
  { id: 'SiReact', label: 'React', color: '#61DAFB' },
  { id: 'SiNextdotjs', label: 'Next.js', color: '#FFFFFF' },
  { id: 'SiTailwindcss', label: 'Tailwind CSS', color: '#06B6D4' },
  { id: 'SiThreedotjs', label: 'Three.js', color: '#FFFFFF' },
  { id: 'SiVite', label: 'Vite', color: '#646CFF' },
  { id: 'SiGithub', label: 'GitHub', color: '#FFFFFF' },
  { id: 'SiDiscord', label: 'Discord', color: '#5865F2' },
  { id: 'SiSlack', label: 'Slack', color: '#4A154B' },
  { id: 'SiSpotify', label: 'Spotify', color: '#1DB954' },
  { id: 'SiApple', label: 'Apple', color: '#FFFFFF' },
  { id: 'SiWindows', label: 'Windows', color: '#0078D4' },
  { id: 'SiAndroid', label: 'Android', color: '#3DDC84' },
  { id: 'SiWordpress', label: 'WordPress', color: '#21759B' },
  { id: 'SiShopify', label: 'Shopify', color: '#7AB55C' },
  { id: 'SiNotion', label: 'Notion', color: '#FFFFFF' },
  { id: 'SiLinkedin', label: 'LinkedIn', color: '#0A66C2' },
  { id: 'SiTwitter', label: 'Twitter', color: '#1DA1F2' },
  { id: 'SiFacebook', label: 'Facebook', color: '#1877F2' },
  { id: 'SiPinterest', label: 'Pinterest', color: '#BD081C' },
  { id: 'SiWhatsapp', label: 'WhatsApp', color: '#25D366' },
  { id: 'SiTelegram', label: 'Telegram', color: '#26A5E4' },
];

const EMOJIS = ['🎨','🎬','✏️','🖥️','📐','🎯','🔥','💎','⚡','🎮','📸','🎵'];

function SortableSkillItem({ skill, onEdit, onDelete }: { skill: Skill, onEdit: () => void, onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: skill.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 };

  return (
    <motion.div ref={setNodeRef} style={style} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`glass-premium border border-zinc-800/50 rounded-xl p-3 flex items-center gap-4 group hover:border-zinc-700 transition ${isDragging ? 'shadow-2xl ring-2 ring-purple-500 scale-[1.02]' : ''}`}>
      <div {...attributes} {...listeners} className="p-2 -ml-2 text-zinc-600 hover:text-white cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition">
        <GripVertical size={20} />
      </div>
      <span className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
        {skill.icon.startsWith('Si') ? (() => {
            const Icon = (SiIcons as any)[skill.icon];
            const brandColor = ICON_LIBRARY.find(i => i.id === skill.icon)?.color || '#fff';
            return Icon ? <Icon size={20} style={{ color: brandColor }} /> : <span>{skill.icon}</span>;
          })() : skill.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate mb-1">{skill.name}</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-600 to-violet-500" style={{ width: `${skill.level}%` }} />
          </div>
          <span className="text-[10px] font-bold text-zinc-500 w-8">{skill.level}%</span>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
        <button onClick={onEdit} className="p-1.5 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-blue-900/20 transition"><Edit2 size={14} /></button>
        <button onClick={onDelete} className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-900/20 transition"><Trash2 size={14} /></button>
      </div>
    </motion.div>
  );
}

export default function AdminSkills(_p: Props) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [iconSearch, setIconSearch] = useState('');

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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent, catItems: Skill[]) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = catItems.findIndex((i) => i.id === active.id);
      const newIndex = catItems.findIndex((i) => i.id === over.id);
      const newCatArr = arrayMove(catItems, oldIndex, newIndex);
      
      // Update positions
      const updatedCatArr = newCatArr.map((item, idx) => ({ ...item, position: idx }));
      
      // Merge with main items array
      const nonCatItems = skills.filter(i => i.category !== (catItems[0]?.category || ''));
      persist([...nonCatItems, ...updatedCatArr]);
      toast('Orden actualizado', 'success');
    }
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
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, items)}>
              <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {items.map((skill) => (
                    <SortableSkillItem key={skill.id} skill={skill} onEdit={() => openEdit(skill)} onDelete={() => del(skill.id)} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
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
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 block">Ícono</label>
                  
                  {/* Search icons */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                    <input 
                      type="text" 
                      placeholder="Buscar logo (ej: Photoshop)..."
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50 transition"
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-zinc-800/50 rounded-xl border border-zinc-700/50 custom-scrollbar">
                    {/* Brand Icons */}
                    {ICON_LIBRARY.filter(ic => ic.label.toLowerCase().includes(iconSearch.toLowerCase())).map(ic => {
                      const Icon = (SiIcons as any)[ic.id];
                      return (
                        <button key={ic.id} onClick={() => setEditing({ ...editing, icon: ic.id })}
                          title={ic.label}
                          className={`w-full aspect-square rounded-lg flex items-center justify-center transition ${editing.icon === ic.id ? 'bg-purple-600 ring-2 ring-purple-400 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white'}`}>
                          {Icon ? <Icon size={18} style={{ color: editing.icon === ic.id ? '#fff' : ic.color }} /> : ic.label.charAt(0)}
                        </button>
                      );
                    })}
                    
                    {/* Separator */}
                    <div className="col-span-6 h-px bg-zinc-700/50 my-2" />
                    
                    {/* Emojis as fallback */}
                    {EMOJIS.map(ic => (
                      <button key={ic} onClick={() => setEditing({ ...editing, icon: ic })}
                        className={`w-full aspect-square rounded-lg flex items-center justify-center text-lg transition ${editing.icon === ic ? 'bg-purple-600 ring-2 ring-purple-400' : 'bg-zinc-800 hover:bg-zinc-700'}`}>
                        {ic}
                      </button>
                    ))}
                  </div>
                  
                  {/* Selected Preview */}
                  <div className="mt-3 flex items-center gap-3 p-3 bg-zinc-800/30 rounded-xl border border-zinc-700/30">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-xl">
                      {editing.icon.startsWith('Si') ? (() => {
                          const Icon = (SiIcons as any)[editing.icon];
                          const brandColor = ICON_LIBRARY.find(i => i.id === editing.icon)?.color || '#a78bfa';
                          return Icon ? <Icon size={24} style={{ color: brandColor }} /> : <span>{editing.icon}</span>;
                        })() : editing.icon}
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Seleccionado</p>
                      <p className="text-sm text-white font-medium">
                        {ICON_LIBRARY.find(i => i.id === editing.icon)?.label || 'Emoji / Custom'}
                      </p>
                    </div>
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
