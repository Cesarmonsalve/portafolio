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
        <a href="#home" className="flex items-center">
          <div className="relative w-28 h-8 flex items-center justify-start">
            <img src="/logo.png" alt="CM Design Logo" className="w-full h-full object-contain object-left" />
          </div>
        </a>
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