'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Home, LayoutGrid, ShoppingBag, Mail, Settings, X, ExternalLink } from 'lucide-react';
import { useSiteConfig } from '@/lib/SiteConfigContext';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { projects, cfg } = useSiteConfig();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!isOpen) return null;

  const quickLinks = [
    { id: 'home', title: 'Inicio', icon: Home, action: () => router.push('/') },
    { id: 'galeria', title: 'Galería', icon: LayoutGrid, action: () => router.push('/galeria') },
    { id: 'tienda', title: 'Tienda', icon: ShoppingBag, action: () => router.push('/tienda') },
    { id: 'contact', title: 'Contacto', icon: Mail, action: () => router.push('/#contact') },
    { id: 'admin', title: 'Panel de Administración', icon: Settings, action: () => router.push('/admin') },
  ];

  const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));
  const filteredLinks = quickLinks.filter(l => l.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-premium animate-slide-up">
        <div className="flex items-center px-4 border-b border-white/10">
          <Search size={20} className="text-gray-400" />
          <input
            autoFocus
            className="w-full bg-transparent border-0 px-4 py-5 text-white placeholder-gray-500 focus:outline-none focus:ring-0 text-lg"
            placeholder="Buscar proyectos o navegar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query === '' && (
            <div className="px-2 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
              Navegación Rápida
            </div>
          )}

          {filteredLinks.length > 0 && (
            <div className="mb-4">
              {filteredLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      link.action();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left rounded-xl hover:bg-white/5 transition-colors group text-gray-300 hover:text-white"
                  >
                    <div className="bg-white/5 p-2 rounded-lg group-hover:bg-neon-red/20 group-hover:text-neon-red transition-colors">
                      <Icon size={18} />
                    </div>
                    <span className="font-medium text-sm">{link.title}</span>
                  </button>
                );
              })}
            </div>
          )}

          {filteredProjects.length > 0 && (
            <div>
              <div className="px-2 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Proyectos ({filteredProjects.length})
              </div>
              {filteredProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    router.push(`/projects/${project.id}`);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-3 px-3 py-3 text-left rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5">
                      {project.image && <img src={project.image} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-200 group-hover:text-neon-red transition-colors">{project.title}</h4>
                      <p className="text-xs text-gray-500">{project.category}</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}

          {filteredLinks.length === 0 && filteredProjects.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <p>No se encontraron resultados para "{query}"</p>
            </div>
          )}
        </div>
        
        <div className="border-t border-white/5 px-4 py-3 flex items-center justify-between text-xs text-gray-600 bg-black/20">
          <div className="flex items-center gap-2">
            <span>Navega con <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 font-sans text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 font-sans text-[10px]">↓</kbd></span>
          </div>
          <span>Presiona <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 font-sans text-[10px]">ESC</kbd> para cerrar</span>
        </div>
      </div>
    </div>
  );
}
