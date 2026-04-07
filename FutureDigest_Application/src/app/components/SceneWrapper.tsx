import { ReactNode } from 'react';

export function SceneWrapper({ children, sceneNumber }) {
  const allowOverflow = sceneNumber >= 7;

  return (
    <section
      className={`h-screen w-screen snap-start snap-always relative ${allowOverflow ? 'overflow-visible' : 'overflow-hidden'}`}
      data-scene={sceneNumber}
    >
      {children}
    </section>
  );
}