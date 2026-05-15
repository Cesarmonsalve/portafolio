'use client';
import { Mail } from 'lucide-react';
import {
  FaInstagram, FaYoutube, FaTiktok, FaWhatsapp,
  FaBehance, FaXTwitter, FaLinkedin, FaFacebook,
  FaGithub, FaDribbble, FaTwitch, FaLink, FaDiscord, FaPinterest
} from 'react-icons/fa6';
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

  return (
    <SectionWrapper id="contact" visual={visual} className="py-24 md:py-32 px-6" fallbackBg="#050505">
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
        {/* Header */}
        <div className="mb-12 animate-slide-up flex flex-col items-center">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-10 h-[1px] bg-neon-red" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-neon-red">{cfg.contact_label}</span>
            <span className="w-10 h-[1px] bg-neon-red" />
          </div>
          <h2 className={`font-black leading-tight mb-4 morphing-gradient-text inline-block ${hCls}`} style={{ fontFamily: `${cfg.font_display}, sans-serif` }}>{cfg.contact_heading}</h2>
        </div>

        <p className="text-gray-400 text-base md:text-lg mb-12 max-w-lg leading-relaxed font-light animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {cfg.contact_desc}
        </p>

        {/* Email */}
        <a href={`mailto:${cfg.contact_email}`}
          className="group flex w-full max-w-md items-center gap-5 p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-neon-red/30 hover:bg-neon-red/[0.04] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mb-14 animate-slide-up"
          style={{ animationDelay: '0.2s' }}>
          <div className="w-14 h-14 rounded-2xl bg-neon-red/10 border border-neon-red/20 flex items-center justify-center group-hover:bg-neon-red transition-all duration-300 shrink-0">
            <Mail size={24} className="text-neon-red group-hover:text-white transition-colors" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Email directo</div>
            <div className="text-white font-medium text-base group-hover:text-neon-red transition-colors truncate">{cfg.contact_email}</div>
          </div>
          <div className="text-gray-700 group-hover:text-neon-red transition-colors shrink-0">→</div>
        </a>

        {/* Socials */}
        {enabledSocials.length > 0 && (
          <div className="w-full animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-6">O encuéntrame en:</div>
            <div className="flex flex-wrap justify-center gap-4">
              {enabledSocials.map((social, i) => {
                const Icon = platformIcons[social.platform.toLowerCase()] || platformIcons.default;
                const color = platformColors[social.platform.toLowerCase()] || platformColors.default;
                return (
                  <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] hover:scale-[1.05] hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.05] shrink-0 transition-colors" style={{ background: `${color}15` }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <span className="text-[12px] font-bold uppercase tracking-wide text-gray-400 group-hover:text-white transition-colors truncate">{social.platform}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}