'use client';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export default function GlitchText({ text, className = '', as: Tag = 'span' }: GlitchTextProps) {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      data-text={text}
      whileHover={{ scale: 1.02 }}
    >
      <Tag className="glitch" data-text={text}>
        {text}
      </Tag>
      <Tag className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity text-neon-red" aria-hidden="true">
        {text}
      </Tag>
    </motion.span>
  );
}