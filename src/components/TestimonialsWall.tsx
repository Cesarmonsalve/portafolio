'use client';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Hash } from 'lucide-react';

const TESTIMONIALS = [
  { name: 'Carlos M.', role: 'CEO, StartupX', msg: 'El mejor diseñador con el que he trabajado. Entendió mi visión desde el primer momento y la elevó a otro nivel.', platform: 'whatsapp', time: '14:32' },
  { name: 'Ana R.', role: 'Marketing Director', msg: 'Resultados increíbles. El motion graphics que nos creó generó un 300% más de engagement en redes.', platform: 'email', time: '09:15' },
  { name: 'David L.', role: 'Founder, GameStudio', msg: 'Profesional, rápido y con un ojo para el detalle que es difícil de encontrar. Totalmente recomendado.', platform: 'discord', time: '21:47' },
  { name: 'María G.', role: 'Brand Manager', msg: 'Transformó nuestra identidad visual completamente. Ahora nuestra marca se ve premium y moderna.', platform: 'whatsapp', time: '16:03' },
  { name: 'Jorge P.', role: 'CTO, TechCorp', msg: 'La atención al detalle y la calidad del trabajo es excepcional. Un placer colaborar.', platform: 'email', time: '10:28' },
  { name: 'Lucía S.', role: 'Creative Director', msg: 'Entrega rápida sin sacrificar calidad. Cada proyecto supera las expectativas.', platform: 'discord', time: '18:55' },
];

const PLATFORM_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  whatsapp: { icon: MessageCircle, color: '#25D366', label: 'WhatsApp' },
  email: { icon: Mail, color: '#60a5fa', label: 'Email' },
  discord: { icon: Hash, color: '#5865F2', label: 'Discord' },
};

export default function TestimonialsWall() {
  return (
    <section className="relative py-24 md:py-32 px-6 md:px-12">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/3 bottom-0 w-[500px] h-[500px] bg-[var(--accent-cyan)]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[var(--accent-cyan)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Conversation Wall</span>
            <span className="w-8 h-[1px] bg-[var(--accent-cyan)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white">
            Lo que dicen
          </h2>
          <p className="mt-4 text-gray-400 font-light max-w-md mx-auto">
            Mensajes reales de clientes y colaboradores.
          </p>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {TESTIMONIALS.map((t, i) => {
            const platform = PLATFORM_CONFIG[t.platform];
            const Icon = platform.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="break-inside-avoid glass-panel rounded-2xl p-5 hover:border-white/[0.12] transition-all group"
              >
                {/* Platform indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${platform.color}15`, border: `1px solid ${platform.color}30` }}>
                      <Icon size={13} style={{ color: platform.color }} />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: platform.color }}>{platform.label}</span>
                  </div>
                  <span className="text-[10px] text-gray-600 font-mono">{t.time}</span>
                </div>

                {/* Message bubble */}
                <p className="text-sm text-gray-200 leading-relaxed mb-4 font-light">
                  &ldquo;{t.msg}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.04]">
                  <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[11px] font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{t.name}</div>
                    <div className="text-[10px] text-gray-500">{t.role}</div>
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
