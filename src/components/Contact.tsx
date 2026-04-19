'use client';
import { motion } from 'framer-motion';
import { Mail, Send, Instagram, Youtube, Globe, Twitter, Linkedin, Facebook, Github, Dribbble, Twitch, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getFullConfig, getSocialLinks, sendMessage, type SiteConfig, type SocialLink, DEFAULT_CONFIG } from '@/lib/config';

const platformIcons: Record<string, typeof Mail> = {
  instagram: Instagram, youtube: Youtube, behance: Globe,
  twitter: Twitter, x: Twitter, linkedin: Linkedin,
  facebook: Facebook, github: Github, dribbble: Dribbble,
  twitch: Twitch, whatsapp: MessageCircle, tiktok: Globe,
  default: Globe,
};

export default function Contact() {
  const [cfg, setCfg] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    getFullConfig().then(setCfg);
    getSocialLinks().then((data) => setSocials(data.filter(s => s.enabled)));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSending(true);

    const success = await sendMessage({ name, email, message });
    if (success) {
      setSent(true);
      setName(''); setEmail(''); setMessage('');
      setTimeout(() => setSent(false), 4000);
    } else {
      alert('Error al enviar. Intenta de nuevo.');
    }
    setSending(false);
  };

  return (
    <section id="contact" className="py-20 md:py-28 px-6 bg-bg-secondary">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-label text-neon-pink">Contacto</span>
          <h2 className="text-heading text-3xl md:text-4xl mt-3">
            Hablemos{' '}
            <span className="text-neon-pink" style={{ textShadow: '0 0 15px rgba(236,72,153,0.3)' }}>
              De Tu Proyecto
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-sm leading-body mb-8">
              ¿Tienes un proyecto en mente? Estoy disponible para colaboraciones, proyectos freelance y oportunidades creativas.
            </p>

            <a href={`mailto:${cfg.contact_email}`} className="flex items-center gap-3 group mb-10" data-cursor-hover>
              <div className="w-10 h-10 bg-neon-red/[0.06] rounded-xl flex items-center justify-center group-hover:bg-neon-red/[0.12] transition-colors">
                <Mail size={18} className="text-neon-red" />
              </div>
              <div>
                <p className="text-label text-[10px]">Email</p>
                <p className="text-sm font-medium">{cfg.contact_email}</p>
              </div>
            </a>

            {/* Social Links */}
            {socials.length > 0 && (
              <>
                <p className="text-label text-[10px] mb-3">Sígueme</p>
                <div className="flex gap-2">
                  {socials.map((social) => {
                    const Icon = platformIcons[social.icon || social.platform.toLowerCase()] || platformIcons.default;
                    return (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-center hover:border-neon-red/30 hover:bg-neon-red/[0.05] transition-all"
                        aria-label={social.platform}
                        data-cursor-hover
                      >
                        <Icon size={16} className="text-gray-400" />
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full bg-bg border border-white/[0.06] rounded-xl px-4 py-3 text-sm focus:border-neon-red/40 focus:outline-none focus:ring-1 focus:ring-neon-red/20 transition-all placeholder:text-gray-600"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-bg border border-white/[0.06] rounded-xl px-4 py-3 text-sm focus:border-neon-red/40 focus:outline-none focus:ring-1 focus:ring-neon-red/20 transition-all placeholder:text-gray-600"
              required
            />
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Cuéntame sobre tu proyecto..."
              className="w-full bg-bg border border-white/[0.06] rounded-xl px-4 py-3 text-sm focus:border-neon-red/40 focus:outline-none focus:ring-1 focus:ring-neon-red/20 transition-all resize-none placeholder:text-gray-600"
              required
            />
            <button
              type="submit"
              disabled={sending || sent}
              className="w-full flex items-center justify-center gap-2 bg-neon-red hover:bg-red-600 px-6 py-3 rounded-xl font-display font-bold text-xs tracking-label transition-all hover:shadow-[0_0_25px_rgba(255,0,51,0.3)] disabled:opacity-50"
              data-cursor-hover
            >
              {sent ? '✓ ENVIADO' : sending ? 'ENVIANDO...' : (
                <>ENVIAR MENSAJE <Send size={14} /></>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}