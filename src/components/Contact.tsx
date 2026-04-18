'use client';
import { motion } from 'framer-motion';
import { Mail, Instagram, Twitter, Youtube, Send } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" className="py-24 px-6 bg-bg-secondary">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-neon-pink text-sm font-bold tracking-[0.3em] uppercase">Contacto</span>
          <h2 className="font-display text-5xl md:text-7xl font-black mt-4">
            HABLEMOS <span className="text-neon-pink" style={{ textShadow: '0 0 20px #ec4899' }}>DE TU PROYECTO</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <p className="text-gray-400 mb-8">
              ¿Tienes un proyecto en mente? Estoy disponible para colaboraciones, proyectos freelance y oportunidades creativas.
            </p>

            <div className="space-y-6 mb-10">
              <a href="mailto:cm@design.com" className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-neon-red/10 rounded-xl flex items-center justify-center group-hover:bg-neon-red/20 transition-colors">
                  <Mail size={20} className="text-neon-red" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="font-medium">cm@design.com</p>
                </div>
              </a>
            </div>

            {/* Social */}
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Sígueme</p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Youtube, href: '#', label: 'YouTube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:border-neon-red/50 hover:bg-neon-red/10 transition-all"
                  aria-label={social.label}
                >
                  <social.icon size={18} className="text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full bg-bg border border-white/10 rounded-xl px-5 py-4 text-sm focus:border-neon-red focus:outline-none focus:ring-1 focus:ring-neon-red/30 transition-all placeholder:text-gray-600"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="tu@email.com"
                className="w-full bg-bg border border-white/10 rounded-xl px-5 py-4 text-sm focus:border-neon-red focus:outline-none focus:ring-1 focus:ring-neon-red/30 transition-all placeholder:text-gray-600"
                required
              />
            </div>
            <div>
              <textarea
                rows={5}
                placeholder="Cuéntame sobre tu proyecto..."
                className="w-full bg-bg border border-white/10 rounded-xl px-5 py-4 text-sm focus:border-neon-red focus:outline-none focus:ring-1 focus:ring-neon-red/30 transition-all resize-none placeholder:text-gray-600"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-neon-red hover:bg-red-600 px-8 py-4 rounded-xl font-display font-bold text-sm tracking-wider transition-all hover:shadow-[0_0_30px_rgba(255,0,51,0.4)] disabled:opacity-50"
              disabled={sent}
            >
              {sent ? '✓ ENVIADO' : (
                <>
                  ENVIAR MENSAJE
                  <Send size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}