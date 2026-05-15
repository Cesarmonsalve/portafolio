'use client';
import { useEffect, useRef, useMemo } from 'react';

/**
 * Particles — CSS-only animation (no React re-renders).
 * Uses pure CSS animations instead of setInterval + setState for zero JS overhead.
 */
export default function Particles({ count = 20 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate particle configs once
  const particles = useMemo(() => {
    const colors = ['#ff0033', '#a855f7', '#ec4899', '#f59e0b'];
    return Array.from({ length: Math.min(count, 20) }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.05,
      color: colors[i % colors.length],
      duration: 15 + Math.random() * 25,
      delay: Math.random() * -20,
    }));
  }, [count]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}