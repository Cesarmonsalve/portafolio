'use client';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { 
  FaInstagram, FaYoutube, FaTiktok, FaWhatsapp, 
  FaBehance, FaXTwitter, FaLinkedin, FaFacebook, 
  FaGithub, FaDribbble, FaTwitch, FaLink 
} from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import LottieRenderer from './LottieRenderer';
import { getFullConfig, getSocialLinks, sendMessage, type SiteConfig, type SocialLink, DEFAULT_CONFIG } from '@/lib/config';

const platformIcons: Record<string, React.ElementType> = {
  instagram: FaInstagram, youtube: FaYoutube, behance: FaBehance,
  twitter: FaXTwitter, x: FaXTwitter, linkedin: FaLinkedin,
  facebook: FaFacebook, github: FaGithub, dribbble: FaDribbble,
  twitch: FaTwitch, whatsapp: FaWhatsapp, tiktok: FaTiktok,
  default: FaLink,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="contact" className="py-20 md:py-28 px-6 bg-bg-secondary relative overflow-hidden">
      {/* Background orbs */}
      <div className="floating-orb" style={{ width: 180, height: 180, top: '15%', left: '5%', background: 'var(--neon-pink)' }} />
      <div className="floating-orb" style={{ width: 120, height: 120, bottom: '20%', right: '10%', background: 'var(--neon-red)' }} />

      {/* Lottie decoration */}
      {cfg.lottie_contact?.enabled && cfg.lottie_contact?.source && (
        <div className="lottie-section" style={{ opacity: cfg.lottie_contact.opacity || 0.35 }}>
          <LottieRenderer source={cfg.lottie_contact.source} speed={cfg.lottie_contact.speed} />
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-label text-neon-pink">Contacto</span>
          <h2 className="text-heading text-3xl md:text-4xl mt-3">
            Hablemos{' '}
            <span className="gradient-text-animated">
              De Tu Proyecto
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p variants={itemVariants} className="text-gray-400 text-sm leading-body mb-8">
              ¿Tienes un proyecto en mente? Estoy disponible para colaboraciones, proyectos freelance y oportunidades creativas.
            </motion.p>

            <motion.a variants={itemVariants} href={`mailto:${cfg.contact_email}`} className="flex items-center gap-3 group mb-10" data-cursor-hover>
              <div className="w-10 h-10 bg-neon-red/[0.06] rounded-xl flex items-center justify-center group-hover:bg-neon-red/[0.12] group-hover:scale-110 transition-all">
                <Mail size={18} className="text-neon-red" />
              </div>
              <div>
                <p className="text-label text-[10px]">Email</p>
                <p className="text-sm font-medium">{cfg.contact_email}</p>
              </div>
            </motion.a>

            {/* Social Links */}
            {socials.length > 0 && (
              <motion.div variants={itemVariants}>
                <p className="text-label text-[10px] mb-3">Sígueme</p>
                <div className="flex gap-2">
                  {socials.map((social, i) => {
                    const Icon = platformIcons[social.icon || social.platform.toLowerCase()] || platformIcons.default;
                    return (
                      <motion.a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-center justify-center hover:border-neon-red/30 hover:bg-neon-red/[0.05] transition-all elastic-press"
                        aria-label={social.platform}
                        data-cursor-hover
                        whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <Icon size={16} className="text-gray-400" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <motion.div whileFocus={{ scale: 1.01 }}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-bg border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-neon-red/40 focus:outline-none focus:ring-1 focus:ring-neon-red/20 transition-all placeholder:text-gray-400"
                required
              />
            </motion.div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-bg border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-neon-red/40 focus:outline-none focus:ring-1 focus:ring-neon-red/20 transition-all placeholder:text-gray-400"
              required
            />
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Cuéntame sobre tu proyecto..."
              className="w-full bg-bg border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:border-neon-red/40 focus:outline-none focus:ring-1 focus:ring-neon-red/20 transition-all resize-none placeholder:text-gray-400"
              required
            />
            <motion.button
              type="submit"
              disabled={sending || sent}
              className="w-full flex items-center justify-center gap-2 bg-neon-red hover:bg-red-600 px-6 py-3 rounded-xl font-display font-bold text-xs tracking-label transition-all hover:shadow-[0_0_25px_rgba(255,0,51,0.3)] disabled:opacity-50 elastic-press"
              data-cursor-hover
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {sent ? '✓ ENVIADO' : sending ? 'ENVIANDO...' : (
                <>ENVIAR MENSAJE <Send size={14} /></>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}