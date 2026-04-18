'use client';
import { motion } from 'framer-motion';
import { Zap, Target, Award } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Background glow */}
              <div className="absolute inset-0 bg-neon-red/20 rounded-3xl blur-3xl" />
              {/* Main image container */}
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-surface">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 bg-neon-red/20 rounded-2xl flex items-center justify-center font-display text-5xl font-black neon-red">
                      CM
                    </div>
                    <p className="text-gray-500 text-sm">Tu foto aquí</p>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-6 right-6 w-20 h-20 border border-neon-red/30 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
                <div className="absolute bottom-6 left-6 w-16 h-16 border border-neon-purple/30 rounded-lg rotate-45" />
              </div>
            </div>
          </motion.div>

          {/* Right - Text */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-neon-red text-sm font-bold tracking-[0.3em] uppercase">Sobre Mí</span>
            <h2 className="font-display text-4xl md:text-5xl font-black mt-4 mb-6">
              DISEÑADOR <span className="neon-text">VISUAL</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Soy <strong className="text-white">CM Design</strong> — un diseñador visual especializado en
              <span className="text-neon-red font-semibold"> motion graphics</span> y{' '}
              <span className="text-neon-purple font-semibold">diseño de flyers</span> que capturan la atención
              desde el primer frame.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Mi enfoque combina una estética cinematográfica con una ejecución técnica precisa. No solo diseño piezas;
              construyo atmósferas visuales que elevan la identidad de marcas y comunidades competitivas.
            </p>

            {/* Features */}
            <div className="space-y-4">
              {[
                { icon: Zap, title: 'Motion Graphics', desc: 'Animaciones que capturan y retienen la atención' },
                { icon: Target, title: 'Flyer Design', desc: 'Diseños de alto impacto para eventos y marcas' },
                { icon: Award, title: 'Branding Visual', desc: 'Identidades que comunican poder y profesionalismo' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-neon-red/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon size={18} className="text-neon-red" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}