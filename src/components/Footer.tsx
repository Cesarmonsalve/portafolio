'use client';
import { useEffect, useState } from 'react';
import { getFullConfig, DEFAULT_CONFIG } from '@/lib/config';

export default function Footer() {
  const [footerText, setFooterText] = useState(DEFAULT_CONFIG.footer_text);

  useEffect(() => {
    getFullConfig().then((cfg) => setFooterText(cfg.footer_text));
  }, []);

  return (
    <footer className="py-8 px-6 border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-neon-red rounded-md flex items-center justify-center font-display font-extrabold text-[10px]">
            CM
          </div>
          <span className="font-display font-bold text-xs tracking-tight-custom">CM DESIGN</span>
        </div>
        <p className="text-[11px] text-gray-600">
          © {new Date().getFullYear()} CM Design. Todos los derechos reservados.
        </p>
        <p className="text-[11px] text-gray-700">
          {footerText}
        </p>
      </div>
    </footer>
  );
}