import { useEffect, useState, useRef } from 'react';

export function useScrollSnap({ totalScenes, onSceneChange }) {
  const [currentScene, setCurrentScene] = useState(0);
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);
  const onSceneChangeRef = useRef(onSceneChange);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snapUnlockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onSceneChangeRef.current = onSceneChange;
  }, [onSceneChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Force a clean initial position so reloads/HMR never start mid-story.
    container.scrollTo({ top: 0, behavior: 'auto' });
    setCurrentScene(0);
    onSceneChangeRef.current?.(0);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrollingRef.current) return;

      const scrollPosition = container.scrollTop;
      const sceneHeight = window.innerHeight;
      const newScene = Math.round(scrollPosition / sceneHeight);

      if (newScene !== currentScene && newScene >= 0 && newScene < totalScenes) {
        setCurrentScene(newScene);
        onSceneChangeRef.current?.(newScene);
      }

      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      snapTimeoutRef.current = setTimeout(() => {
        const nearestScene = Math.max(0, Math.min(totalScenes - 1, Math.round(container.scrollTop / sceneHeight)));
        const targetScroll = nearestScene * sceneHeight;

        if (Math.abs(container.scrollTop - targetScroll) < 2) return;

        isScrollingRef.current = true;
        container.scrollTo({ top: targetScroll, behavior: 'smooth' });

        if (snapUnlockTimeoutRef.current) clearTimeout(snapUnlockTimeoutRef.current);
        snapUnlockTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 380);
      }, 140);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      if (snapUnlockTimeoutRef.current) clearTimeout(snapUnlockTimeoutRef.current);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [currentScene, totalScenes]);

  const scrollToScene = (sceneIndex) => {
    const container = containerRef.current;
    if (!container) return;

    isScrollingRef.current = true;
    const targetScroll = sceneIndex * window.innerHeight;

    container.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  };

  return {
    containerRef,
    currentScene,
    scrollToScene,
  };
}