'use client';
import { motion } from 'framer-motion';
import { Layers3, Users, Zap, Terminal } from 'lucide-react';
import { useSiteConfig } from '@/lib/SiteConfigContext';

export default function CommandCenter() {
  const { projects, cfg } = useSiteConfig();
  
  const techStack = ['After Effects', 'Cinema 4D', 'Premiere Pro', 'Illustrator'];
  const clients = 12; // Example static value or derived from data

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="absolute right-8 top-1/2 -translate-y-1/2 w-64 glass-panel rounded-2xl p-5 hidden xl:block"
    >
      <div className="flex items-center gap-2 mb-6">
        <Terminal size={14} className="text-[var(--accent-cyan)]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Command Center</span>
      </div>

      <div className="space-y-5">
        {/* Status */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">System Status</div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-cyan)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-cyan)]"></span>
            </span>
            Available for mission
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-panel p-3 rounded-xl border border-white/[0.04]">
            <Layers3 size={14} className="text-gray-400 mb-2" />
            <div className="text-xl font-display font-bold">{projects.length}</div>
            <div className="text-[9px] uppercase tracking-wider text-gray-500">Campañas</div>
          </div>
          <div className="glass-panel p-3 rounded-xl border border-white/[0.04]">
            <Users size={14} className="text-gray-400 mb-2" />
            <div className="text-xl font-display font-bold">{clients}</div>
            <div className="text-[9px] uppercase tracking-wider text-gray-500">Partners</div>
          </div>
        </div>

        {/* Stack */}
        <div>
          <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
            <Zap size={12} />
            Core Stack
          </div>
          <div className="flex flex-wrap gap-1.5">
            {techStack.map(tech => (
              <span key={tech} className="text-[10px] font-medium px-2 py-1 bg-white/[0.03] border border-white/[0.05] rounded-md text-gray-300">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
