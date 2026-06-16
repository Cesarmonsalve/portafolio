'use client';
import { motion } from 'framer-motion';
import { Layers3, Users, Zap, Terminal } from 'lucide-react';
import { useSiteConfig } from '@/lib/SiteConfigContext';

export default function CommandCenter() {
  const { projects, cfg } = useSiteConfig();
  
  const techStack = cfg.command_center_tools?.length > 0 
    ? cfg.command_center_tools 
    : ['After Effects', 'Cinema 4D', 'Premiere Pro', 'Illustrator'];
  const label = cfg.command_center_label || 'Campañas';
  const clients = 12; // Example static value or derived from data

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="w-full max-w-[320px] bg-surface/80 brutal-border backdrop-blur-md rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6 border-b-2 border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[var(--accent-cyan)]" />
          <span className="text-mono-tech text-[10px] font-bold uppercase tracking-widest text-white">Command Center</span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Status */}
        <div>
          <div className="text-mono-tech text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">System Status</div>
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-cyan)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-cyan)]"></span>
            </span>
            Available for mission
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/[0.02] brutal-border p-3 rounded-xl border border-white/[0.04]">
            <Layers3 size={14} className="text-[var(--accent-cyan)] mb-2" />
            <div className="text-brutal text-2xl text-white">{projects.length}</div>
            <div className="text-mono-tech text-[9px] uppercase tracking-wider text-gray-500">{label}</div>
          </div>
          <div className="bg-white/[0.02] brutal-border p-3 rounded-xl border border-white/[0.04]">
            <Users size={14} className="text-[var(--accent-cyan)] mb-2" />
            <div className="text-brutal text-2xl text-white">{clients}</div>
            <div className="text-mono-tech text-[9px] uppercase tracking-wider text-gray-500">Partners</div>
          </div>
        </div>

        {/* Stack */}
        <div>
          <div className="text-mono-tech text-[10px] uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
            <Zap size={12} className="text-yellow-400" />
            Core Stack
          </div>
          <div className="flex flex-wrap gap-2">
            {techStack.map(tech => (
              <span key={tech} className="text-mono-tech text-[9px] font-bold uppercase tracking-wider px-2 py-1 bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 rounded-md text-[var(--accent-cyan)]">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
