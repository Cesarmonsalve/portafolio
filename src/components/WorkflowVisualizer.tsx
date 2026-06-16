'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Lightbulb, Palette, Code2, BarChart3 } from 'lucide-react';

const STEPS = [
  { num: '01', title: 'Descubrimiento', desc: 'Análisis profundo de necesidades, marca, audiencia y objetivos del proyecto. Investigación de mercado y benchmarking.', icon: Search, accent: 'var(--accent-cyan)' },
  { num: '02', title: 'Estrategia', desc: 'Definición de la dirección creativa, wireframes conceptuales y arquitectura de información.', icon: Lightbulb, accent: 'var(--accent-blue)' },
  { num: '03', title: 'Diseño', desc: 'Creación visual con UI premium, motion design y prototipos interactivos de alta fidelidad.', icon: Palette, accent: 'var(--accent-violet)' },
  { num: '04', title: 'Desarrollo', desc: 'Implementación técnica con código limpio, optimización de rendimiento y animaciones fluidas.', icon: Code2, accent: 'var(--accent-cyan)' },
  { num: '05', title: 'Optimización', desc: 'Testing exhaustivo, métricas de conversión, ajustes iterativos y entrega final impecable.', icon: BarChart3, accent: 'var(--accent-blue)' },
];

export default function WorkflowVisualizer() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="relative py-24 md:py-32 px-6 md:px-12">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-0 top-1/2 w-[500px] h-[500px] bg-[var(--accent-blue)]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[var(--accent-cyan)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Workflow</span>
            <span className="w-8 h-[1px] bg-[var(--accent-cyan)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white">
            Mi Proceso
          </h2>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
          {/* Steps List */}
          <div className="flex flex-col gap-2">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
                    isActive
                      ? 'bg-white/[0.03] border-white/[0.12] shadow-lg'
                      : 'border-transparent hover:bg-white/[0.02]'
                  }`}
                >
                  <span className={`text-2xl font-display font-black transition-colors ${isActive ? 'gradient-text' : 'text-gray-700'}`}>
                    {step.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold transition-colors ${isActive ? 'text-white' : 'text-gray-500'}`}>{step.title}</div>
                  </div>
                  <Icon size={18} className={`transition-colors ${isActive ? 'text-[var(--accent-cyan)]' : 'text-gray-700'}`} />
                </button>
              );
            })}

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-6">
              {STEPS.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${activeStep === i ? 'w-8 bg-[var(--accent-cyan)]' : 'w-1.5 bg-white/10'}`} />
              ))}
            </div>
          </div>

          {/* Active Step Detail */}
          <div className="glass-panel rounded-3xl p-8 md:p-12 min-h-[400px] flex items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent-cyan)] via-[var(--accent-blue)] to-[var(--accent-violet)]" />
            
            <AnimatePresence mode="wait">
              {STEPS.map((step, idx) => {
                if (idx !== activeStep) return null;
                const Icon = step.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8" style={{ background: `${step.accent}10`, border: `1px solid ${step.accent}25` }}>
                      <Icon size={28} style={{ color: step.accent }} />
                    </div>
                    <div className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: step.accent }}>
                      Fase {step.num}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-display font-black text-white mb-6">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-300 font-light leading-relaxed max-w-lg">
                      {step.desc}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
