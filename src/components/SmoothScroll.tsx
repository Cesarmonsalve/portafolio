'use client';

import { ReactLenis } from 'lenis/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  );
}
