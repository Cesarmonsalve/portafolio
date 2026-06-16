'use client';
import { motion } from 'framer-motion';
import { FlaskConical, ExternalLink } from 'lucide-react';

const EXPERIMENTS = [
  { title: 'AI Image Generator', desc: 'Prototipo de generador de imágenes con inteligencia artificial para crear assets visuales en tiempo real.', status: 'En progreso', tags: ['IA', 'React', 'API'] },
  { title: 'WebGL Shader Lab', desc: 'Colección de shaders GLSL experimentales para efectos visuales en el navegador.', status: 'Concepto', tags: ['Three.js', 'GLSL', 'WebGL'] },
  { title: 'Motion System', desc: 'Librería de animaciones reutilizables optimizadas para rendimiento en interfaces complejas.', status: 'Beta', tags: ['Framer', 'GSAP', 'React'] },
  { title: 'Design Token Engine', desc: 'Motor de generación automática de design tokens basado en IA y paletas dinámicas.', status: 'Concepto', tags: ['Design', 'CSS', 'IA'] },
];

const STATUS_COLORS: Record<string, string> = {
  'En progreso': 'var(--accent-cyan)',
  'Concepto': 'var(--accent-violet)',
  'Beta': 'var(--accent-blue)',
};

export default function LabSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-12">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute right-0 bottom-1/4 w-[500px] h-[500px] bg-[var(--accent-violet)]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[var(--accent-cyan)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Laboratorio</span>
            <span className="w-8 h-[1px] bg-[var(--accent-cyan)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white">
            Experimentos
          </h2>
          <p className="mt-4 text-gray-400 font-light max-w-md mx-auto">
            Ideas, prototipos y conceptos en fase de exploración. No todo está terminado — y eso es parte del proceso.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {EXPERIMENTS.map((exp, i) => {
            const statusColor = STATUS_COLORS[exp.status] || 'var(--accent-cyan)';
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="glass-panel rounded-2xl p-6 md:p-8 hover:border-white/[0.12] transition-all group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity w-full" style={{ color: statusColor }} />
                
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/[0.05]">
                    <FlaskConical size={18} className="text-gray-400 group-hover:text-[var(--accent-cyan)] transition-colors" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ color: statusColor, background: `${statusColor}12`, border: `1px solid ${statusColor}25` }}>
                    {exp.status}
                  </span>
                </div>

                <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-[var(--accent-cyan)] transition-colors">{exp.title}</h3>
                <p className="text-sm text-gray-400 font-light leading-relaxed mb-5">{exp.desc}</p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.04] text-[10px] font-medium text-gray-500">{tag}</span>
                    ))}
                  </div>
                  <ExternalLink size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
