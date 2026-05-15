'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  FaInstagram, FaYoutube, FaTiktok, FaWhatsapp,
  FaBehance, FaXTwitter, FaLinkedin, FaFacebook,
  FaGithub, FaDribbble, FaTwitch, FaLink, FaDiscord, FaPinterest
} from 'react-icons/fa6';
import { useState } from 'react';
import LottieRenderer from './LottieRenderer';
import SectionWrapper from './SectionWrapper';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { HEADING_SIZE_MAP, DEFAULT_SECTION_VISUAL } from '@/lib/config';

const platformIcons: Record<string, React.ElementType> = {
  instagram: FaInstagram, youtube: FaYoutube, behance: FaBehance,
  twitter: FaXTwitter, x: FaXTwitter, linkedin: FaLinkedin,
  facebook: FaFacebook, github: FaGithub, dribbble: FaDribbble,
  twitch: FaTwitch, whatsapp: FaWhatsapp, tiktok: FaTiktok,
  discord: FaDiscord, pinterest: FaPinterest, default: FaLink,
};
const platformColors: Record<string, string> = {
  instagram: '#E1306C', youtube: '#FF0000', behance: '#1769FF',
  twitter: '#1DA1F2', x: '#1DA1F2', linkedin: '#0A66C2',
  facebook: '#1877F2', github: '#ffffff', dribbble: '#EA4C89',
  twitch: '#9146FF', whatsapp: '#25D366', tiktok: '#ff0050',
  discord: '#5865F2', pinterest: '#E60023', default: '#8a8a8a',
};

export default function Contact() {
  const { cfg, socials } = useSiteConfig();
  const enabledSocials = socials.filter(s => s.enabled);
  const hCls = HEADING_SIZE_MAP[cfg.heading_size] || HEADING_SIZE_MAP.md;
  const visual = cfg.section_contact || DEFAULT_SECTION_VISUAL;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSending(true); setError(false);
    try {
      const msgs = JSON.parse(localStorage.getItem('cm_messages') || '[]');
      msgs.push({ id: crypto.randomUUID(), name, email, message, read: false, created_at: new Date().toISOString() });
      localStorage.setItem('cm_messages', JSON.stringify(msgs));
      setSent(true); setName(''); setEmail(''); setMessage('');
      setTimeout(() => setSent(false), 5000);
    } catch { setError(true); setTimeout(() => setError(false), 4000); }
    setSending(false);
  };

  const inputCls = "w-full bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-4 text-white text-sm placeholder-gray-700 outline-none transition-all duration-300 focus:border-neon-red/40 focus:bg-neon-red/[0.02]";

  return (
    <SectionWrapper id="contact" visual={visual} className="py-24 md:py-32 px-6" fallbackBg="#050505">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-[1px] bg-neon-red" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neon-red">{cfg.contact_label}</span>
          </div>
          <h2 className={`font-bold leading-tight mb-4 ${hCls}`} style={{ fontFamily: `${cfg.font_display}, sans-serif` }}>{cfg.contact_heading}</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Info & Socials */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="text-gray-400 text-base md:text-lg mb-10 max-w-md leading-relaxed font-light">{cfg.contact_desc}</p>

            {/* Email */}
            <motion.a href={`mailto:${cfg.contact_email}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-neon-red/30 hover:bg-neon-red/[0.04] transition-all duration-300 mb-8">
              <div className="w-12 h-12 rounded-xl bg-neon-red/10 border border-neon-red/20 flex items-center justify-center group-hover:bg-neon-red transition-all duration-300">
                <Mail size={20} className="text-neon-red group-hover:text-white transition-colors" />
              </div>
              <div>
                <div className="text-[9px] text-gray-600 uppercase tracking-widest mb-0.5 font-bold">Email directo</div>
                <div className="text-white font-medium text-sm group-hover:text-neon-red transition-colors">{cfg.contact_email}</div>
              </div>
              <div className="ml-auto text-gray-700 group-hover:text-neon-red transition-colors">→</div>
            </motion.a>

            {/* Socials */}
            {enabledSocials.length > 0 && (
              <div>
                <div className="text-[9px] text-gray-600 uppercase tracking-widest font-bold mb-4">Redes Sociales</div>
                <div className="grid grid-cols-2 gap-3">
                  {enabledSocials.map((social, i) => {
                    const Icon = platformIcons[social.platform.toLowerCase()] || platformIcons.default;
                    const color = platformColors[social.platform.toLowerCase()] || platformColors.default;
                    return (
                      <motion.a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.03, y: -1 }}
                        className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] transition-all group cursor-pointer">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/[0.05] shrink-0" style={{ background: `${color}15` }}>
                          <Icon size={16} style={{ color }} />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wide text-gray-500 group-hover:text-white transition-colors truncate">{social.platform}</span>
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right — Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }}>
            <form onSubmit={handleSubmit} className="relative">
              <AnimatePresence>
                {sent && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-bg/95 backdrop-blur-xl rounded-2xl border border-green-500/20">
                    <CheckCircle2 size={48} className="text-green-400 mb-4" />
                    <h3 className="text-white font-bold text-xl mb-2">¡Mensaje Enviado!</h3>
                    <p className="text-gray-400 text-sm text-center max-w-xs">Me pondré en contacto contigo pronto.</p>
                  </motion.div>
                )}
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mb-4 flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <AlertCircle size={18} className="text-red-400 shrink-0" />
                    <span className="text-sm text-red-400">Error al enviar. Intenta de nuevo.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600 mb-2">Nombre</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                    placeholder="Tu nombre completo" required className={inputCls}
                    style={{ boxShadow: focusedField === 'name' ? '0 0 20px rgba(255,0,51,0.06)' : 'none' }} />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600 mb-2">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                    placeholder="tu@email.com" required className={inputCls}
                    style={{ boxShadow: focusedField === 'email' ? '0 0 20px rgba(255,0,51,0.06)' : 'none' }} />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-[0.2em] text-gray-600 mb-2">Mensaje</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} onFocus={() => setFocusedField('msg')} onBlur={() => setFocusedField(null)}
                    placeholder="Cuéntame sobre tu proyecto..." required rows={5} className={`${inputCls} resize-none`}
                    style={{ boxShadow: focusedField === 'msg' ? '0 0 20px rgba(255,0,51,0.06)' : 'none' }} />
                </div>

                <motion.button type="submit" disabled={sending} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="group relative w-full overflow-hidden flex items-center justify-center gap-3 bg-neon-red px-8 py-4 rounded-xl font-bold text-[12px] tracking-[0.15em] text-white transition-all hover:shadow-[0_0_40px_rgba(255,0,51,0.35)] disabled:opacity-60">
                  <span className="relative z-10 flex items-center gap-2">
                    {sending ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enviando...</> : <><Send size={14} /> ENVIAR MENSAJE</>}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700" />
                </motion.button>
                <p className="text-[10px] text-gray-700 text-center pt-1">Respondo en menos de 24 horas ✓</p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}