import { useEffect, useState, useRef } from 'react';

/**
 * Tracks continuous scroll progress within a snap-scrolling container.
 * Returns a float where 0 = top of scene 1, 1 = top of scene 2, etc.
 * Uses requestAnimationFrame for smooth updates.
 */
export function useScrollProgress(containerRef) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const progress = container.scrollTop / window.innerHeight;
        setScrollProgress(progress);
      });
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef]);

  return scrollProgress;
}
