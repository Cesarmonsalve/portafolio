'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, Sparkles, Users, Settings,
  LogOut, Plus, Edit2, Trash2, Eye, EyeOff, Image as ImageIcon,
  Video, Save, X, ChevronDown, ChevronUp, Copy, Check
} from 'lucide-react';
import type { Project, categories as catList } from '@/data/projects';

const CATEGORIES = ['Motion Graphics', 'Graphic Design', 'Flyer Design', 'Advertising', 'Video', 'Branding'];

function getProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('cm_projects');
  if (stored) { try { return JSON.parse(stored); } catch {} }
  return [];
}
function saveProjects(projects: Project[]) {
  localStorage.setItem('cm_projects', JSON.stringify(projects));
}

type AdminSection = 'dashboard' | 'projects' | 'add-project' | 'settings';

export default function AdminPage() {
  const [section, setSection] = useState<AdminSection>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formVideo, setFormVideo] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formClient, setFormClient] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const resetForm = () => {
    setFormTitle(''); setFormCategory(''); setFormDesc('');
    setFormImage(''); setFormVideo(''); setFormTags('');
    setFormClient(''); setFormFeatured(false);
    setEditingProject(null);
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setFormTitle(p.title); setFormCategory(p.category);
    setFormDesc(p.description); setFormImage(p.image);
    setFormVideo(p.video || ''); setFormTags(p.tags.join(', '));
    setFormClient(p.client || ''); setFormFeatured(p.featured || false);
    setSection('add-project');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFormVideo(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const saveProject = () => {
    if (!formTitle || !formCategory || !formDesc) {
      alert('Completa los campos obligatorios: Título, Categoría y Descripción');
      return;
    }
    const project: Project = {
      id: editingProject?.id || Date.now().toString(),
      title: formTitle,
      category: formCategory,
      description: formDesc,
      image: formImage || '/images/placeholder.jpg',
      video: formVideo || undefined,
      tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
      client: formClient || undefined,
      featured: formFeatured,
    };

    let updated: Project[];
    if (editingProject) {
      updated = projects.map(p => p.id === project.id ? project : p);
    } else {
      updated = [...projects, project];
    }
    saveProjects(updated);
    setProjects(updated);
    resetForm();
    setSection('projects');
  };

  const deleteProject = (id: string) => {
    if (!confirm('¿Eliminar este proyecto?')) return;
    const updated = projects.filter(p => p.id !== id);
    saveProjects(updated);
    setProjects(updated);
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const navItems = [
    { id: 'dashboard' as AdminSection, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'projects' as AdminSection, icon: FolderKanban, label: 'Proyectos', badge: projects.length },
    { id: 'add-project' as AdminSection, icon: Plus, label: 'Nuevo Proyecto' },
    { id: 'settings' as AdminSection, icon: Settings, label: 'Ajustes' },
  ];

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 72 }}
        className="bg-bg-secondary border-r border-white/5 flex flex-col flex-shrink-0 overflow-hidden"
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/5 flex items-center gap-3">
          <div className="w-9 h-9 bg-neon-red rounded-lg flex items-center justify-center font-display font-black text-sm flex-shrink-0">
            CM
          </div>
          {sidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="font-display font-bold text-sm">CM DESIGN</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Admin Panel</p>
            </motion.div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setSection(item.id); if (item.id === 'add-project') resetForm(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                section === item.id
                  ? 'bg-neon-red/15 text-neon-red border border-neon-red/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-neon-red/20 text-neon-red text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </motion.span>
              )}
            </button>
          ))}
        </nav>

        {/* Collapse + Logout */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            {sidebarOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            {sidebarOpen && <span>Colapsar</span>}
          </button>
          <a
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Volver al sitio</span>}
          </a>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">

            {/* ===== DASHBOARD ===== */}
            {section === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h1 className="font-display text-3xl font-black mb-2">Dashboard</h1>
                <p className="text-gray-500 mb-8">Resumen de tu portfolio</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  {[
                    { label: 'Proyectos', value: projects.length, color: 'neon-red' },
                    { label: 'Featured', value: projects.filter(p => p.featured).length, color: 'neon-purple' },
                    { label: 'Categorías', value: new Set(projects.map(p => p.category)).size, color: 'neon-pink' },
                    { label: 'Con Video', value: projects.filter(p => p.video).length, color: 'neon-gold' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-bg-secondary border border-white/5 rounded-xl p-5">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
                      <p className={`font-display text-3xl font-black text-${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Projects */}
                <h3 className="font-display font-bold text-lg mb-4">Proyectos Recientes</h3>
                <div className="space-y-3">
                  {projects.slice(-5).reverse().map((p) => (
                    <div key={p.id} className="bg-bg-secondary border border-white/5 rounded-xl p-4 flex items-center gap-4">
                      <img src={p.image} alt="" className="w-16 h-12 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{p.title}</p>
                        <p className="text-xs text-gray-500">{p.category}</p>
                      </div>
                      <button onClick={() => openEdit(p)} className="text-gray-500 hover:text-neon-red transition-colors">
                        <Edit2 size={16} />
                      </button>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-gray-600 text-sm text-center py-8">Aún no hay proyectos. ¡Crea el primero!</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* ===== PROJECTS LIST ===== */}
            {section === 'projects' && (
              <motion.div key="projects" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="font-display text-3xl font-black mb-1">Proyectos</h1>
                    <p className="text-gray-500 text-sm">{projects.length} proyectos en tu portfolio</p>
                  </div>
                  <button
                    onClick={() => { resetForm(); setSection('add-project'); }}
                    className="flex items-center gap-2 bg-neon-red hover:bg-red-600 px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
                  >
                    <Plus size={16} />
                    Nuevo
                  </button>
                </div>

                <div className="space-y-3">
                  {projects.map((p) => (
                    <div key={p.id} className="bg-bg-secondary border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/10 transition-colors">
                      <img src={p.image} alt="" className="w-20 h-14 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">{p.title}</p>
                          {p.featured && <span className="text-[10px] bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded-full">★ Featured</span>}
                        </div>
                        <p className="text-xs text-gray-500">{p.category} • {p.client || 'Sin cliente'}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => copyUrl(p.image, p.id)} className="text-gray-500 hover:text-white transition-colors p-2" title="Copiar URL imagen">
                          {copiedId === p.id ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        </button>
                        <button onClick={() => openEdit(p)} className="text-gray-500 hover:text-neon-red transition-colors p-2" title="Editar">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteProject(p.id)} className="text-gray-500 hover:text-red-500 transition-colors p-2" title="Eliminar">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-16">
                      <ImageIcon size={48} className="mx-auto text-gray-700 mb-4" />
                      <p className="text-gray-500 mb-4">No hay proyectos aún</p>
                      <button
                        onClick={() => { resetForm(); setSection('add-project'); }}
                        className="bg-neon-red/20 text-neon-red px-6 py-3 rounded-lg text-sm font-bold"
                      >
                        Crear primer proyecto
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ===== ADD / EDIT PROJECT ===== */}
            {section === 'add-project' && (
              <motion.div key="add-project" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="font-display text-3xl font-black mb-1">
                      {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                    </h1>
                    <p className="text-gray-500 text-sm">
                      {editingProject ? 'Modifica los detalles del proyecto' : 'Agrega un nuevo proyecto a tu portfolio'}
                    </p>
                  </div>
                  <button onClick={() => { resetForm(); setSection('projects'); }} className="text-gray-500 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Título del Proyecto *</label>
                      <input
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Ej: DISTRICT 909 — Event Motion"
                        className="w-full bg-bg-secondary border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-red focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Categoría *</label>
                      <select
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full bg-bg-secondary border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-red focus:outline-none transition-all text-gray-300"
                      >
                        <option value="">Seleccionar categoría</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Descripción *</label>
                      <textarea
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        rows={4}
                        placeholder="Describe el proyecto, las herramientas usadas, el resultado..."
                        className="w-full bg-bg-secondary border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-red focus:outline-none transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Cliente</label>
                      <input
                        value={formClient}
                        onChange={(e) => setFormClient(e.target.value)}
                        placeholder="Nombre del cliente o marca"
                        className="w-full bg-bg-secondary border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-red focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Tags (separados por coma)</label>
                      <input
                        value={formTags}
                        onChange={(e) => setFormTags(e.target.value)}
                        placeholder="After Effects, Cinema 4D, Motion Design"
                        className="w-full bg-bg-secondary border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-red focus:outline-none transition-all"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setFormFeatured(!formFeatured)}
                        className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${formFeatured ? 'bg-neon-red' : 'bg-white/10'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${formFeatured ? 'translate-x-6' : ''}`} />
                      </button>
                      <span className="text-sm text-gray-400">Marcar como Featured</span>
                    </div>
                  </div>

                  {/* Right Column - Media */}
                  <div className="space-y-5">
                    {/* Image Upload */}
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Imagen Principal *</label>
                      <div
                        className="relative border-2 border-dashed border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-neon-red/50 transition-colors group"
                        style={{ minHeight: 200 }}
                      >
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        {formImage ? (
                          <img src={formImage} alt="Preview" className="w-full h-48 object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-48 text-gray-600">
                            <ImageIcon size={32} className="mb-3" />
                            <p className="text-sm">Arrastra una imagen o haz clic</p>
                            <p className="text-xs mt-1">PNG, JPG, WEBP</p>
                          </div>
                        )}
                      </div>
                      {formImage && (
                        <p className="text-xs text-gray-600 mt-2 truncate">{formImage.substring(0, 50)}...</p>
                      )}
                    </div>

                    {/* Video Upload */}
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Video (opcional)</label>
                      <div
                        className="relative border-2 border-dashed border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-neon-purple/50 transition-colors"
                        style={{ minHeight: 150 }}
                      >
                        <input type="file" accept="video/*" onChange={handleVideoUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        {formVideo ? (
                          <video src={formVideo} className="w-full h-36 object-cover" muted />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-36 text-gray-600">
                            <Video size={28} className="mb-2" />
                            <p className="text-sm">Subir video</p>
                            <p className="text-xs mt-1">MP4, MOV, WEBM</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Image URL alternative */}
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">O pega URL de imagen</label>
                      <input
                        value={formImage.startsWith('data:') ? '' : formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-bg-secondary border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-neon-red focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                {formTitle && formImage && (
                  <div className="mt-8">
                    <h3 className="font-display font-bold text-sm mb-3">Vista Previa</h3>
                    <div className="bg-bg-secondary border border-white/5 rounded-xl overflow-hidden max-w-sm">
                      <img src={formImage} alt="" className="w-full aspect-[4/3] object-cover" />
                      <div className="p-4">
                        <p className="text-xs text-neon-red font-medium mb-1">{formCategory}</p>
                        <h4 className="font-display font-bold text-sm">{formTitle}</h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{formDesc}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-white/5">
                  <button
                    onClick={() => { resetForm(); setSection('projects'); }}
                    className="px-6 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveProject}
                    className="flex items-center gap-2 bg-neon-red hover:bg-red-600 px-8 py-3 rounded-xl text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(255,0,51,0.3)]"
                  >
                    <Save size={16} />
                    {editingProject ? 'Guardar Cambios' : 'Publicar Proyecto'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ===== SETTINGS ===== */}
            {section === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h1 className="font-display text-3xl font-black mb-2">Ajustes</h1>
                <p className="text-gray-500 mb-8">Configuración del portfolio</p>

                <div className="space-y-6 max-w-lg">
                  <div className="bg-bg-secondary border border-white/5 rounded-xl p-6">
                    <h3 className="font-display font-bold text-sm mb-4">Datos</h3>
                    <button
                      onClick={() => {
                        const data = JSON.stringify(getProjects(), null, 2);
                        const blob = new Blob([data], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url; a.download = 'cm-projects-backup.json'; a.click();
                      }}
                      className="text-sm text-neon-red hover:underline mb-3 block"
                    >
                      📥 Exportar respaldo (JSON)
                    </button>
                    <label className="text-sm text-neon-purple hover:underline cursor-pointer block">
                      📤 Importar respaldo
                      <input type="file" accept=".json" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          try {
                            const imported = JSON.parse(ev.target?.result as string);
                            saveProjects(imported);
                            setProjects(imported);
                            alert('✓ Datos importados correctamente');
                          } catch { alert('Error: archivo JSON inválido'); }
                        };
                        reader.readAsText(file);
                      }} />
                    </label>
                  </div>

                  <div className="bg-bg-secondary border border-white/5 rounded-xl p-6">
                    <h3 className="font-display font-bold text-sm mb-4">Limpiar Todo</h3>
                    <p className="text-xs text-gray-500 mb-4">Esto eliminará todos los proyectos. Esta acción no se puede deshacer.</p>
                    <button
                      onClick={() => {
                        if (confirm('¿Estás seguro? Se eliminarán TODOS los proyectos.')) {
                          saveProjects([]);
                          setProjects([]);
                          alert('Todos los proyectos han sido eliminados.');
                        }
                      }}
                      className="text-sm text-red-400 hover:underline"
                    >
                      🗑️ Eliminar todos los proyectos
                    </button>
                  </div>

                  <div className="bg-bg-secondary border border-white/5 rounded-xl p-6">
                    <h3 className="font-display font-bold text-sm mb-4">Cómo funciona</h3>
                    <ul className="text-xs text-gray-400 space-y-2">
                      <li>• Los proyectos se guardan en <strong className="text-gray-300">localStorage</strong> de tu navegador</li>
                      <li>• Haz <strong className="text-gray-300">exportar respaldo</strong> para guardar una copia</li>
                      <li>• Puedes <strong className="text-gray-300">importar</strong> ese archivo en otro navegador</li>
                      <li>• Para producción real, conecta una base de datos (Supabase, Firebase, etc.)</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}