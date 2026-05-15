'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, Save, X, Image as ImageIcon,
  Star, Tag, Loader2, Search, Grid3X3, List, Eye, GripVertical
} from 'lucide-react';
import { initialProjects } from '@/data/projects';
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

interface Project {
  id: string; title: string; category: string; description: string;
  image: string; video?: string; tags: string[]; client?: string;
  featured?: boolean; display_mode?: string; created_at?: string;
  hidden?: boolean;
}

interface Props { onUnreadChange?: (n: number) => void; }

const CATEGORIES = ['Motion Graphics', 'Graphic Design', 'Flyer Design', 'Advertising', 'Video', 'Branding'];

const emptyProject: Project = {
  id: '', title: '', category: CATEGORIES[0], description: '',
  image: '', video: '', tags: [], client: '', featured: false,
  display_mode: 'default', created_at: new Date().toISOString(),
  hidden: false,
};

function SortableProjectItem({ p, search, onToggleVisibility, onEdit, onDelete }: { p: Project, search: string, onToggleVisibility: () => void, onEdit: () => void, onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 };

  return (
    <motion.div
      ref={setNodeRef} style={style}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`glass-premium rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 group transition ${p.hidden ? 'opacity-50' : ''} ${isDragging ? 'shadow-2xl ring-2 ring-red-500 scale-[1.02]' : ''}`}
    >
      <div {...attributes} {...listeners} className="p-2 -ml-2 text-zinc-600 hover:text-white cursor-grab active:cursor-grabbing">
        <GripVertical size={20} />
      </div>

      <div className="w-full sm:w-20 h-20 rounded-xl bg-zinc-800 overflow-hidden flex-shrink-0">
        {p.image ? <img src={p.image} alt={p.title} className="w-full h-full object-cover pointer-events-none" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-zinc-600" /></div>}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-white truncate">{p.title}</h3>
          {p.featured && <Star size={14} className="text-yellow-400 fill-yellow-400 flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/30 text-red-400 border border-red-800/30">{p.category}</span>
          {p.client && <span className="text-xs text-zinc-500">• {p.client}</span>}
        </div>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {p.tags.slice(0, 3).map(t => <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">{t}</span>)}
          {p.tags.length > 3 && <span className="text-xs text-zinc-600">+{p.tags.length - 3}</span>}
        </div>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <button onClick={onToggleVisibility} className={`p-2 rounded-lg bg-white/5 transition ${p.hidden ? 'text-zinc-500 hover:text-white' : 'text-green-400 hover:text-green-300'}`} title={p.hidden ? "Publicar" : "Ocultar"}><Eye size={16} /></button>
        <button onClick={onEdit} className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-blue-400 transition"><Edit2 size={16} /></button>
        <button onClick={onDelete} className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:text-red-400 transition"><Trash2 size={16} /></button>
      </div>
    </motion.div>
  );
}

export default function AdminProjects(_props: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    const dbProjects = await loadFromDB<Project[]>('cm_projects', initialProjects as Project[]);
    setProjects(dbProjects);
    if (!localStorage.getItem('cm_projects')) {
      saveConfigData('cm_projects', dbProjects);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const save = (list: Project[]) => {
    setProjects(list);
    saveConfigData('cm_projects', list);
  };

  const openNew = () => {
    setEditing({ ...emptyProject, id: crypto.randomUUID() });
    setShowForm(true);
    setTagInput('');
  };

  const openEdit = (p: Project) => {
    setEditing({ ...p });
    setShowForm(true);
    setTagInput('');
  };

  const handleSave = () => {
    if (!editing) return;
    setSaving(true);
    setTimeout(() => {
      const idx = projects.findIndex(p => p.id === editing.id);
      const updated = idx >= 0
        ? projects.map(p => p.id === editing.id ? editing : p)
        : [...projects, editing];
      save(updated);
      setShowForm(false);
      setEditing(null);
      setSaving(false);
      toast('Proyecto guardado correctamente', 'success');
    }, 400);
  };

  const handleDelete = (id: string) => {
    if (!confirm('¿Eliminar este proyecto?')) return;
    save(projects.filter(p => p.id !== id));
    toast('Proyecto eliminado', 'info');
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);
      const newArr = arrayMove(projects, oldIndex, newIndex);
      save(newArr);
      toast('Orden actualizado', 'success');
    }
  };

  const addTag = () => {
    if (!tagInput.trim() || !editing) return;
    setEditing({ ...editing, tags: [...editing.tags, tagInput.trim()] });
    setTagInput('');
  };

  const removeTag = (idx: number) => {
    if (!editing) return;
    setEditing({ ...editing, tags: editing.tags.filter((_, i) => i !== idx) });
  };

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const updateField = (field: string, value: unknown) => {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-white">Proyectos</h1>
          <p className="text-zinc-500 text-sm">{projects.length} proyectos en total</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 transition shadow-lg shadow-red-900/20 active:scale-95"
        >
          <Plus size={16} /> Nuevo Proyecto
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar proyectos..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/50 transition"
        />
      </div>

      {/* Projects List */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={filtered.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {filtered.map((p, i) => (
              <SortableProjectItem
                key={p.id}
                p={p}
                search={search}
                onToggleVisibility={() => {
                  const updated = projects.map(proj => proj.id === p.id ? { ...proj, hidden: !proj.hidden } : proj);
                  save(updated);
                  toast(p.hidden ? 'Proyecto público' : 'Proyecto oculto', 'info');
                }}
                onEdit={() => openEdit(p)}
                onDelete={() => handleDelete(p.id)}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-zinc-600 py-12">No se encontraron proyectos</p>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {/* EDIT / NEW MODAL */}
      <AnimatePresence>
        {showForm && editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl my-8 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-zinc-800">
                <h2 className="font-bold text-white text-lg">
                  {projects.find(p => p.id === editing.id) ? 'Editar' : 'Nuevo'} Proyecto
                </h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition">
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Title */}
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Título</label>
                  <input
                    value={editing.title}
                    onChange={e => updateField('title', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500/50 transition"
                    placeholder="Nombre del proyecto"
                  />
                </div>

                {/* Category + Client */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Categoría</label>
                    <select
                      value={editing.category}
                      onChange={e => updateField('category', e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500/50 transition"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Cliente</label>
                    <input
                      value={editing.client || ''}
                      onChange={e => updateField('client', e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500/50 transition"
                      placeholder="Nombre del cliente"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Descripción</label>
                  <textarea
                    value={editing.description}
                    onChange={e => updateField('description', e.target.value)}
                    rows={3}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500/50 transition resize-none"
                    placeholder="Describe el proyecto..."
                  />
                </div>

                {/* Image + Video */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">URL Imagen</label>
                    <input
                      value={editing.image}
                      onChange={e => updateField('image', e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500/50 transition"
                      placeholder="/imagen.jpg o URL"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">URL Video</label>
                    <input
                      value={editing.video || ''}
                      onChange={e => updateField('video', e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500/50 transition"
                      placeholder="YouTube / Drive URL"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1 block">Tags</label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {editing.tags.map((t, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-red-900/30 text-red-300 border border-red-800/30">
                        {t}
                        <button onClick={() => removeTag(i)} className="hover:text-white"><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-red-500/50 transition"
                      placeholder="Agregar tag..."
                    />
                    <button onClick={addTag} className="px-3 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center gap-3 py-2">
                  <button
                    onClick={() => updateField('featured', !editing.featured)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${editing.featured ? 'bg-red-600' : 'bg-zinc-700'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${editing.featured ? 'left-5' : 'left-0.5'}`} />
                  </button>
                  <span className="text-sm text-zinc-300">Proyecto destacado</span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-5 border-t border-zinc-800">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!editing.title.trim() || saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 disabled:opacity-50 transition shadow-lg shadow-red-900/20 active:scale-95"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Guardar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
