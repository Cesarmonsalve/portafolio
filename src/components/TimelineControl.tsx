'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Award, Briefcase, GraduationCap, Rocket } from 'lucide-react';

const TIMELINE_DATA = [
  { year: '2024', title: 'Director Creativo — Studio Propio', desc: 'Lanzamiento de marca personal con foco en motion graphics y experiencias digitales premium.', icon: Rocket, accent: 'var(--accent-cyan)' },
  { year: '2023', title: 'Lead Designer — Agencia XYZ', desc: 'Dirección artística de campañas visuales para marcas internacionales. +40 proyectos entregados.', icon: Briefcase, accent: 'var(--accent-blue)' },
  { year: '2022', title: 'Certificación — Motion Design Avanzado', desc: 'Especialización en After Effects, Cinema 4D y animación UI/UX de alto rendimiento.', icon: GraduationCap, accent: 'var(--accent-violet)' },
  { year: '2021', title: 'Primer Premio — Concurso de Diseño', desc: 'Reconocimiento por innovación visual en la categoría de identidad corporativa y branding digital.', icon: Award, accent: 'var(--accent-cyan)' },
];

export default function TimelineControl() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="relative py-24 md:py-32 px-6 md:px-12" ref={containerRef}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute right-1/4 top-0 w-[600px] h-[600px] bg-[var(--accent-violet)]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[var(--accent-cyan)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mission Control</span>
            <span className="w-8 h-[1px] bg-[var(--accent-cyan)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white">
            Trayectoria
          </h2>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/[0.06]">
            <motion.div className="w-full bg-gradient-to-b from-[var(--accent-cyan)] to-[var(--accent-violet)]" style={{ height: lineHeight }} />
          </div>

          {TIMELINE_DATA.map((item, index) => {
            const Icon = item.icon;
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex items-start gap-8 mb-16 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
              >
                {/* Node */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 bg-black z-10" style={{ borderColor: item.accent }} />
                
                {/* Content card */}
                <div className={`ml-20 md:ml-0 md:w-[45%] ${isLeft ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                  <div className="glass-panel rounded-2xl p-6 hover:border-white/[0.12] transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3" style={{ justifyContent: isLeft ? 'flex-end' : 'flex-start' }}>
                      <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: item.accent }}>{item.year}</span>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${item.accent}15`, border: `1px solid ${item.accent}30` }}>
                        <Icon size={14} style={{ color: item.accent }} />
                      </div>
                    </div>
                    <h3 className="text-lg font-display font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400 font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
