'use client';
import { useEffect } from 'react';

// Tailwind alpha-value requires "R G B" components (e.g. 255 0 51)
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` : '255 255 255';
};

export default function ThemeApplier() {
  useEffect(() => {
    const applyTheme = () => {
      try {
        const raw = localStorage.getItem('cm_site_config');
        if (raw) {
          const cfg = JSON.parse(raw);
          const root = document.documentElement;
          if (cfg.theme_primary) root.style.setProperty('--theme-primary', hexToRgb(cfg.theme_primary));
          if (cfg.theme_secondary) root.style.setProperty('--theme-secondary', hexToRgb(cfg.theme_secondary));
          if (cfg.theme_accent) root.style.setProperty('--theme-accent', hexToRgb(cfg.theme_accent));
        }
      } catch { /* fallback to defaults from layout */ }
    };

    applyTheme();

    // Listen for admin changes
    window.addEventListener('cm_config_updated', applyTheme);
    window.addEventListener('storage', applyTheme);

    return () => {
      window.removeEventListener('cm_config_updated', applyTheme);
      window.removeEventListener('storage', applyTheme);
    };
  }, []);

  return null;
}
