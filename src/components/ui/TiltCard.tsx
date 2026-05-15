'use client';
import { useRef, useState, useEffect } from 'react';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number;
  scale?: number;
}

export default function TiltCard({ children, maxTilt = 10, scale = 1.02, className = '', ...props }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});

  useEffect(() => {
    // Disable on mobile/touch devices for performance and UX
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;

    const card = cardRef.current;
    if (!card) return;

    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      // Calculate normalized mouse position relative to card center (-1 to 1)
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      // Tilt intensity
      const tiltX = -y * maxTilt;
      const tiltY = x * maxTilt;

      rafId = requestAnimationFrame(() => {
        setStyle({
          transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`,
          transition: 'transform 0.1s ease-out',
        });
      });
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(rafId);
      setStyle({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [maxTilt, scale]);

  return (
    <div
      ref={cardRef}
      className={`will-change-transform ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
