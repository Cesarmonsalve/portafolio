import React, { useState, useMemo } from 'react';
import * as SiIcons from 'react-icons/si';
import * as LucideIcons from 'lucide-react';
import { Search } from 'lucide-react';

const CustomAdobeIcon = ({ size = 24, color = '#31A8FF', text }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" />
    <text x="12" y="16.5" fill="#000000" fontSize="13" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">{text}</text>
  </svg>
);

export const CUSTOM_ICONS: Record<string, any> = {
  'CustomPhotoshop': (props: any) => <CustomAdobeIcon text="Ps" color="#31A8FF" {...props} />,
  'CustomAfterEffects': (props: any) => <CustomAdobeIcon text="Ae" color="#9999FF" {...props} />,
  'CustomIllustrator': (props: any) => <CustomAdobeIcon text="Ai" color="#FF9A00" {...props} />,
  'CustomPremiere': (props: any) => <CustomAdobeIcon text="Pr" color="#9999FF" {...props} />,
  'CustomLightroom': (props: any) => <CustomAdobeIcon text="Lr" color="#31A8FF" {...props} />,
  'CustomInDesign': (props: any) => <CustomAdobeIcon text="Id" color="#FF3366" {...props} />,
};

export const IconRenderer = ({ icon, size = 24, defaultColor = '#fff' }: { icon: string, size?: number, defaultColor?: string }) => {
  if (icon.startsWith('Custom')) {
    const CustomIcon = CUSTOM_ICONS[icon];
    return CustomIcon ? <CustomIcon size={size} /> : <span>{icon}</span>;
  }
  if (icon.startsWith('Si')) {
    const SiIcon = (SiIcons as any)[icon];
    return SiIcon ? <SiIcon size={size} style={{ color: defaultColor }} /> : <span>{icon}</span>;
  }
  return <span style={{ fontSize: size }}>{icon}</span>;
};

const COMMON_SI = [
  'CustomPhotoshop', 'CustomAfterEffects', 'CustomIllustrator', 'CustomPremiere',
  'SiBlender', 'SiCinema4d', 'SiFigma', 'SiCanva', 'SiDavinciresolve', 'SiObsstudio',
  'SiYoutube', 'SiInstagram', 'SiTiktok', 'SiBehance', 'SiReact', 'SiGithub'
];

const ADOBE_ALIASES = ['photoshop', 'aftereffects', 'illustrator', 'premiere', 'lightroom', 'indesign', 'adobe'];

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
    let keys = Object.keys(SiIcons).filter(key => key.toLowerCase().includes(q) || key.toLowerCase().includes('si' + q));
    
    // Check Custom Icons
    const customMatches = Object.keys(CUSTOM_ICONS).filter(key => key.toLowerCase().includes(q));
    keys = [...customMatches, ...keys];
    
    if (q.includes('adobe')) {
      keys = [...Object.keys(CUSTOM_ICONS), ...keys];
    }
    
    // Remove duplicates
    keys = Array.from(new Set(keys));
    return keys.slice(0, 100);
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
          return (
            <button 
              key={ic} 
              onClick={() => onChange(ic)}
              title={ic.replace('Si', '').replace('Custom', '')}
              className={`w-full aspect-square angle-frame-sm flex items-center justify-center transition ${value === ic ? 'bg-purple-600 ring-2 ring-purple-400 text-white' : 'bg-surface hover:bg-surface-hover text-gray-400 hover:text-white'}`}
            >
              <IconRenderer icon={ic} size={18} defaultColor={value === ic ? '#fff' : 'currentColor'} />
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
          <IconRenderer icon={value} size={24} defaultColor={defaultColor} />
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Seleccionado</p>
          <p className="text-sm text-white font-medium">
            {value.startsWith('Si') || value.startsWith('Custom') ? value.replace('Si', '').replace('Custom', '') : 'Emoji / Custom'}
          </p>
        </div>
      </div>
    </div>
  );
}
