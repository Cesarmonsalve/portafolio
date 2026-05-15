'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useInView } from 'framer-motion';

// Lazy-load Lottie for performance — only loads when needed
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface LottieRendererProps {
  /** Can be a raw JSON string, a parsed JSON object, or a URL to a .json file */
  source: string | object | null | undefined;
  /** CSS class for sizing */
  className?: string;
  /** Loop animation */
  loop?: boolean;
  /** Autoplay on mount */
  autoplay?: boolean;
  /** Playback speed multiplier */
  speed?: number;
  /** Style overrides */
  style?: React.CSSProperties;
}

export default function LottieRenderer({
  source,
  className = '',
  loop = true,
  autoplay = true,
  speed = 1,
  style,
}: LottieRendererProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<any>(null);
  const isInView = useInView(containerRef, { margin: "200px" });

  useEffect(() => {
    if (!source) {
      setAnimationData(null);
      return;
    }

    // Already a parsed object
    if (typeof source === 'object') {
      setAnimationData(source);
      setError(false);
      return;
    }

    const str = (source as string).trim();

    // Check if it's a URL
    if (str.startsWith('http://') || str.startsWith('https://')) {
      fetch(str)
        .then((res) => res.json())
        .then((data) => {
          setAnimationData(data);
          setError(false);
        })
        .catch(() => setError(true));
      return;
    }

    // Try to parse as JSON string
    try {
      const parsed = JSON.parse(str);
      setAnimationData(parsed);
      setError(false);
    } catch {
      setError(true);
    }
  }, [source]);

  // Pause when out of view to save CPU/Battery
  useEffect(() => {
    if (lottieRef.current) {
      if (isInView && autoplay) {
        lottieRef.current.play();
      } else {
        lottieRef.current.pause();
      }
    }
  }, [isInView, autoplay]);

  // Memoize the lottie options so they don't cause re-renders
  const lottieStyle = useMemo(
    () => ({ width: '100%', height: '100%', ...style }),
    [style]
  );

  if (!animationData || error) return null;

  return (
    <div ref={containerRef} className={`lottie-container ${className}`}>
      {/* Only render Lottie when it's near the viewport to save RAM, but wait, 
          mounting/unmounting is heavy. Pausing is enough. */}
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={autoplay && isInView}
        style={lottieStyle}
        // @ts-expect-error lottie-react speed type
        speed={speed}
        rendererSettings={{
          preserveAspectRatio: 'xMidYMid slice',
        }}
      />
    </div>
  );
}
