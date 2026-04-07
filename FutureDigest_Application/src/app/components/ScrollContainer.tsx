import { ReactNode, useEffect } from 'react';

export function ScrollContainer({ children, containerRef, isScrollLocked = false, currentScene = 0 }) {
  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (isScrollLocked) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleTouchMove = (e) => {
      if (isScrollLocked) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e) => {
      if (isScrollLocked && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space'].includes(e.key)) {
        e.preventDefault();
      }
    };

    if (isScrollLocked) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isScrollLocked, containerRef]);

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory"
      style={{ 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none'
      }}
    >
      <style>{`
        .snap-y::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {children}
    </div>
  );
}
