'use client';
import { ArrowUpRight, Mail, MessageCircle, Radio } from 'lucide-react';
import { FaBehance, FaDiscord, FaDribbble, FaFacebook, FaGithub, FaInstagram, FaLinkedin, FaLink, FaPinterest, FaTiktok, FaTwitch, FaWhatsapp, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import SectionWrapper from './SectionWrapper';
import ContactForm from './contact/ContactForm';
import { useSiteConfig } from '@/lib/SiteConfigContext';
import { DEFAULT_SECTION_VISUAL, HEADING_SIZE_MAP } from '@/lib/config';

const platformIcons: Record<string, React.ElementType> = {
  instagram: FaInstagram, youtube: FaYoutube, behance: FaBehance, twitter: FaXTwitter, x: FaXTwitter,
  linkedin: FaLinkedin, facebook: FaFacebook, github: FaGithub, dribbble: FaDribbble, twitch: FaTwitch,
  whatsapp: FaWhatsapp, tiktok: FaTiktok, discord: FaDiscord, pinterest: FaPinterest, default: FaLink,
};

export default function Contact() {
  const { cfg, socials } = useSiteConfig();
  const visual = cfg.section_contact || DEFAULT_SECTION_VISUAL;
  const hCls = HEADING_SIZE_MAP[cfg.heading_size] || HEADING_SIZE_MAP.md;
  const enabledSocials = socials.filter((social) => social.enabled);

  return (
    <SectionWrapper id="contact" visual={visual} fallbackBg="#090D12" className="section-shell px-5 py-24 md:px-8 md:py-32">
      <div className="arena-grid absolute inset-0 opacity-30" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="acid-panel angle-frame overflow-hidden p-6 md:p-10 lg:p-14">
          <div className="arena-dots absolute -right-6 -top-6 h-48 w-48 opacity-30" aria-hidden="true" />
          <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-neon-red/[0.07] blur-[90px]" aria-hidden="true" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <div className="mb-4 flex items-center gap-3"><span className="h-px w-12 bg-neon-red" aria-hidden="true" /><span className="acid-kicker">{cfg.contact_label}</span></div>
              <h2 className={`heading-slashed max-w-3xl font-black uppercase leading-[.95] tracking-[-.045em] text-white ${hCls}`} style={{ fontFamily: `${cfg.font_display}, var(--font-outfit), sans-serif` }}>{cfg.contact_heading}</h2>
              <p className="mt-6 max-w-xl border-l-2 border-neon-red/60 pl-5 text-sm leading-7 text-gray-400 md:text-base">{cfg.contact_desc}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href={`mailto:${cfg.contact_email}`} className="acid-button"><Mail size={15} aria-hidden="true" /> Enviar email <ArrowUpRight size={15} aria-hidden="true" /></a>
                <a href={cfg.contact_whatsapp || '#'} target="_blank" rel="noopener noreferrer" className="ghost-button"><MessageCircle size={15} aria-hidden="true" /> WhatsApp</a>
              </div>
            </div>
            <div className="space-y-6">
              <div className="border border-white/[0.09] bg-[#0B0E13]/75 p-5 angle-frame-sm md:p-7">
                <div className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[.16em] text-white">
                  <Radio size={15} className="text-neon-red" aria-hidden="true" />
                  Formulario de contacto
                </div>
                <ContactForm />
              </div>
              <div className="border border-white/[0.09] bg-[#0B0E13]/75 p-5 angle-frame-sm md:p-7">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[.16em] text-white"><Radio size={15} className="text-neon-red" aria-hidden="true" /> Canal directo</div>
                  <span className="h-2 w-2 animate-pulse rounded-full bg-neon-red shadow-[0_0_14px_rgba(203,254,28,.6)]" aria-hidden="true" />
                </div>
                <a href={`mailto:${cfg.contact_email}`} className="mt-5 block break-all text-base font-black text-neon-red transition hover:text-white md:text-lg">{cfg.contact_email}</a>
                <p className="mt-2 text-xs leading-5 text-gray-500">Comparte tu idea, formato, fecha y objetivo. La propuesta visual partirá de esas coordenadas.</p>
                {enabledSocials.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2 border-t border-white/[0.08] pt-5">
                    {enabledSocials.map((social) => {
                      const Icon = platformIcons[social.platform.toLowerCase()] || platformIcons.default;
                      return (
                        <a
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.platform}
                          className="flex h-10 w-10 items-center justify-center border border-white/[0.09] bg-white/[0.025] text-gray-400 transition hover:border-neon-red/60 hover:bg-neon-red hover:text-[#0B0E13] angle-frame-sm"
                        >
                          <Icon size={16} aria-hidden="true" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
