export function SceneWrapper({ children, sceneNumber }) {
  return (
    <section
      className="h-full w-screen snap-start snap-always relative overflow-hidden"
      data-scene={sceneNumber}
    >
      {children}
    </section>
  );
}