import { SceneProgressIndicator } from '../components/SceneProgressIndicator';
import { PersonSlice79 } from '../components/PersonSlice79';

interface Scene9Props {
  currentScene?: number;
  totalScenes?: number;
  enteredFoods?: string[];
}

export function Scene9({
  currentScene = 8,
  totalScenes = 9,
}: Scene9Props) {
  return (
    <div className="bg-white relative size-full overflow-hidden" data-name="Scene 9">
      <div className="absolute inset-0 bg-[#2ea3bd]" />

      <PersonSlice79 slice="bottom" zIndex={3} />

      <SceneProgressIndicator totalScenes={totalScenes} currentScene={currentScene} />
    </div>
  );
}