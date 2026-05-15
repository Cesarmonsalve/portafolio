'use client';
import { useRef, useState, useEffect } from 'react';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export default function MagneticButton({ children, strength = 0.2, className = '', ...props }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Disable magnetic effect on touch devices for performance and UX
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;

    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      // Calculate cursor position relative to button center
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      setPosition({ x: x * strength, y: y * strength });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setPosition({ x: 0, y: 0 }); // Snap back
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <button
      ref={buttonRef}
      className={`relative transition-transform duration-300 ease-out will-change-transform ${className}`}
      style={{
        transform: isHovered ? `translate(${position.x}px, ${position.y}px)` : 'translate(0px, 0px)',
      }}
      {...props}
    >
      {/* Spotlight effect layered behind content */}
      <div 
        className="absolute inset-0 z-0 opacity-0 transition-opacity duration-300 pointer-events-none rounded-inherit"
        style={{
          opacity: isHovered ? 0.15 : 0,
          background: `radial-gradient(circle at ${50 + position.x}% ${50 + position.y}%, rgba(255,255,255,1) 0%, transparent 70%)`
        }}
      />
      <span className="relative z-10 flex items-center justify-center w-full h-full">
        {children}
      </span>
    </button>
  );
}
