import React, { useState, useMemo } from 'react';
import * as SiIcons from 'react-icons/si';
import * as LucideIcons from 'lucide-react';
import { Search } from 'lucide-react';

const COMMON_SI = [
  'SiAdobephotoshop', 'SiAdobeaftereffects', 'SiAdobeillustrator', 'SiAdobepremierepro',
  'SiBlender', 'SiCinema4d', 'SiFigma', 'SiCanva', 'SiDavinciresolve', 'SiObsstudio',
  'SiYoutube', 'SiInstagram', 'SiTiktok', 'SiBehance', 'SiReact', 'SiGithub'
];

const EMOJIS = ['🎨','🎬','✏️','🖥️','📐','🎯','🔥','💎','⚡','🎮','📸','🎵', '💬', '🚀', '🧪'];

interface IconPickerProps {
  value: string;
  onChange: (iconId: string) => void;
  defaultColor?: string;
}

export default function IconPicker({ value, onChange, defaultColor = '#a78bfa' }: IconPickerProps) {
  const [search, setSearch] = useState('');
  
  const results = useMemo(() => {
    if (!search.trim()) {
      return COMMON_SI;
    }
    const q = search.toLowerCase().replace(/\s+/g, '');
    const keys = Object.keys(SiIcons).filter(key => key.toLowerCase().includes(q) || key.toLowerCase().includes('si' + q));
    return keys.slice(0, 100); // Limit to 100 to prevent lag
  }, [search]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
        <input 
          type="text" 
          placeholder="Buscar ícono (ej: Photoshop, Spotify)..."
          className="w-full bg-surface border border-white/[0.1] angle-frame-sm pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-surface/50 angle-frame-sm border border-white/[0.1]/50 custom-scrollbar">
        {results.map(ic => {
          const Icon = (SiIcons as any)[ic];
          if (!Icon) return null;
          return (
            <button 
              key={ic} 
              onClick={() => onChange(ic)}
              title={ic.replace('Si', '')}
              className={`w-full aspect-square angle-frame-sm flex items-center justify-center transition ${value === ic ? 'bg-purple-600 ring-2 ring-purple-400 text-white' : 'bg-surface hover:bg-surface-hover text-gray-400 hover:text-white'}`}
            >
              <Icon size={18} />
            </button>
          );
        })}
        
        {/* Separator */}
        <div className="col-span-6 h-px bg-surface-hover/50 my-2" />
        
        {/* Emojis as fallback */}
        {EMOJIS.map(ic => (
          <button key={ic} onClick={() => onChange(ic)}
            className={`w-full aspect-square angle-frame-sm flex items-center justify-center text-lg transition ${value === ic ? 'bg-purple-600 ring-2 ring-purple-400' : 'bg-surface hover:bg-surface-hover'}`}>
            {ic}
          </button>
        ))}
      </div>
      
      {/* Selected Preview */}
      <div className="mt-3 flex items-center gap-3 p-3 bg-surface/30 angle-frame-sm border border-white/[0.1]/30">
        <div className="w-10 h-10 bg-surface angle-frame-sm flex items-center justify-center text-xl">
          {value.startsWith('Si') ? (() => {
              const Icon = (SiIcons as any)[value];
              return Icon ? <Icon size={24} style={{ color: defaultColor }} /> : <span>{value}</span>;
            })() : value}
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Seleccionado</p>
          <p className="text-sm text-white font-medium">
            {value.startsWith('Si') ? value.replace('Si', '') : 'Emoji / Custom'}
          </p>
        </div>
      </div>
    </div>
  );
}
