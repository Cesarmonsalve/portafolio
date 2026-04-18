'use client';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';
import Particles from './Particles';
import GlitchText from './GlitchText';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg to-bg-secondary" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-red/10 via-transparent to-transparent" />
      <Particles count={50} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2 rounded-full mb-8"
        >
          <Sparkles size={14} className="text-neon-red" />
          <span className="text-xs font-medium text-gray-300 tracking-wider uppercase">
            Motion Graphics & Flyer Design
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6"
        >
          <span className="block text-gray-500 font-body text-lg md:text-xl font-light mb-4">
            CM Design Presenta
          </span>
          <GlitchText
            text="CM DESIGN"
            className="block font-display text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter"
          />
          <span className="block neon-text font-display text-2xl sm:text-3xl md:text-4xl font-bold mt-2">
            MOTION GRAPHICS & VISUAL DESIGN
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Transformo conceptos en{' '}
          <span className="text-neon-red font-semibold">experiencias visuales de alto impacto</span>.
          Diseño que rompe el scroll y construye atmósferas que elevan marcas y comunidades.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#work"
            className="group flex items-center gap-2 bg-neon-red hover:bg-red-600 px-8 py-4 rounded-lg font-display font-bold text-sm tracking-wider transition-all hover:shadow-[0_0_30px_rgba(255,0,51,0.4)]"
          >
            VER TRABAJOS
            <span className="group-hover:translate-y-1 transition-transform">↓</span>
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-neon-red/50 hover:bg-neon-red/10 px-8 py-4 rounded-lg font-display font-bold text-sm tracking-wider transition-all"
          >
            CONTACTAR
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex items-center justify-center gap-8 md:gap-16 mt-16 pt-10 border-t border-white/5"
        >
          {[
            { value: '50+', label: 'Proyectos' },
            { value: '30+', label: 'Clientes' },
            { value: '3+', label: 'Años Exp.' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-black neon-text">{stat.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown size={20} className="text-gray-600" />
        </motion.div>
      </motion.div>
    </section>
  );
}