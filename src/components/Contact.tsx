'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Mail, MessageCircle, Send, Rocket, CheckCircle } from 'lucide-react';
import { FaBehance, FaDiscord, FaDribbble, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaLink, FaPinterest, FaTiktok, FaTwitch, FaWhatsapp, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import SectionWrapper from './SectionWrapper';
import ContactForm from './contact/ContactForm';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { DEFAULT_SECTION_VISUAL } from '@/lib/config';

const platformIcons: Record<string, React.ElementType> = {
  instagram: FaInstagram, youtube: FaYoutube, behance: FaBehance, twitter: FaXTwitter, x: FaXTwitter,
  linkedin: FaLinkedin, facebook: FaFacebook, github: FaGithub, dribbble: FaDribbble, twitch: FaTwitch,
  whatsapp: FaWhatsapp, tiktok: FaTiktok, discord: FaDiscord, pinterest: FaPinterest, default: FaLink,
};

export default function Contact() {
  const { cfg, socials } = useSiteConfig();
  const visual = cfg.section_contact || DEFAULT_SECTION_VISUAL;
  const enabledSocials = socials.filter((social) => social.enabled);

  return (
    <SectionWrapper id="contact" visual={visual} className="relative py-24 md:py-32 px-6 md:px-12">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute left-1/3 bottom-0 w-[700px] h-[700px] bg-[var(--accent-cyan)]/5 rounded-full blur-[120px]" />
        <div className="absolute right-0 top-1/4 w-[400px] h-[400px] bg-[var(--accent-violet)]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-[var(--accent-cyan)]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Launch Mission</span>
            <span className="w-8 h-[1px] bg-[var(--accent-cyan)]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-white">
            {cfg.contact_heading || '¿Tienes una idea?'}
          </h2>
          <p className="mt-6 text-lg text-gray-400 font-light max-w-xl mx-auto">
            {cfg.contact_desc || 'Estoy disponible para proyectos freelance, colaboraciones y oportunidades creativas.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Contact Form - Terminal style */}
          <div className="glass-panel rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="ml-3 text-[10px] font-mono text-gray-500">mission-control — contact</span>
            </div>
            <div className="p-6 md:p-8">
              <ContactForm />
            </div>
          </div>

          {/* Direct Contact Info */}
          <div className="space-y-5">
            {/* Quick actions */}
            <a href={`mailto:${cfg.contact_email}`} className="glass-panel rounded-2xl p-6 flex items-center justify-between group hover:border-white/[0.12] transition-all block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 flex items-center justify-center">
                  <Mail size={20} className="text-[var(--accent-cyan)]" />
                </div>
                <div>
                  <div className="font-semibold text-white">Email</div>
                  <div className="text-sm text-gray-400">{cfg.contact_email || 'hello@cesar.dev'}</div>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-gray-500 group-hover:text-[var(--accent-cyan)] transition-colors" />
            </a>

            <a href={cfg.contact_whatsapp || '#'} target="_blank" rel="noopener noreferrer" className="glass-panel rounded-2xl p-6 flex items-center justify-between group hover:border-white/[0.12] transition-all block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <MessageCircle size={20} className="text-green-400" />
                </div>
                <div>
                  <div className="font-semibold text-white">WhatsApp</div>
                  <div className="text-sm text-gray-400">Respuesta rápida</div>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-gray-500 group-hover:text-green-400 transition-colors" />
            </a>

            {/* Social Links */}
            {enabledSocials.length > 0 && (
              <div className="glass-panel rounded-2xl p-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Redes Sociales</div>
                <div className="flex flex-wrap gap-2">
                  {enabledSocials.map((social) => {
                    const Icon = platformIcons[social.platform.toLowerCase()] || platformIcons.default;
                    return (
                      <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.platform} className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.12] transition-all">
                        <Icon size={16} />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Status */}
            <div className="glass-panel rounded-2xl p-6 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-cyan)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent-cyan)]"></span>
              </span>
              <span className="text-sm font-medium text-gray-300">Disponible para nuevos proyectos</span>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
