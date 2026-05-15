'use client';
import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { SectionVisual } from '@/lib/config';
import Particles from './Particles';

/**
 * SectionWrapper — Applies configurable backgrounds, videos, overlays,
 * parallax, particles, grain and floating orbs around any section content.
 */

interface Props {
  id?: string;
  visual: SectionVisual;
  className?: string;
  children: ReactNode;
  /** Fallback bg color if visual.background.color is default */
  fallbackBg?: string;
}

export default function SectionWrapper({ id, visual, className = '', children, fallbackBg }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { bg, fx } = { bg: visual.background, fx: visual.effects };

  // Parallax
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    fx.parallax ? [`${fx.parallaxIntensity}px`, `-${fx.parallaxIntensity}px`] : ['0px', '0px']
  );

  // Determine background color
  const bgColor = bg.type === 'color' ? (bg.color || fallbackBg || '#060606') : 'transparent';

  return (
    <section
      id={id}
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* ═══ GRADIENT BACKGROUND ═══ */}
      {bg.type === 'gradient' && bg.gradient && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: bg.gradient }}
        />
      )}

      {/* ═══ IMAGE BACKGROUND ═══ */}
      {bg.type === 'image' && bg.imageUrl && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ y: parallaxY }}
        >
          <img
            src={bg.imageUrl}
            alt=""
            className="w-full h-full object-cover"
            style={{ opacity: bg.mediaOpacity / 100 }}
          />
        </motion.div>
      )}

      {/* ═══ VIDEO BACKGROUND ═══ */}
      {bg.type === 'video' && bg.videoUrl && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ y: parallaxY }}
        >
          <video
            src={bg.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ opacity: bg.mediaOpacity / 100 }}
          />
        </motion.div>
      )}

      {/* ═══ OVERLAY ═══ */}
      {(bg.type === 'image' || bg.type === 'video' || bg.type === 'gradient') && bg.overlayOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            backgroundColor: bg.overlayColor || '#000000',
            opacity: bg.overlayOpacity / 100,
          }}
        />
      )}

      {/* ═══ FLOATING ORBS ═══ */}
      {fx.floatingOrbs && (
        <>
          {(fx.orbColors || ['#ff0033', '#a855f7', '#ec4899']).map((color, i) => (
            <div
              key={i}
              className="floating-orb"
              style={{
                width: 200 + i * 80,
                height: 200 + i * 80,
                background: color,
                top: `${10 + i * 25}%`,
                left: i % 2 === 0 ? `${10 + i * 20}%` : 'auto',
                right: i % 2 !== 0 ? `${5 + i * 10}%` : 'auto',
              }}
            />
          ))}
        </>
      )}

      {/* ═══ PARTICLES ═══ */}
      {fx.particles && (
        <Particles count={fx.particleCount || 25} />
      )}

      {/* ═══ GRAIN ═══ */}
      {fx.grain && (
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            opacity: (fx.grainOpacity || 3) / 100,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* ═══ CONTENT ═══ */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
