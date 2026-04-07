import  { SceneProgressIndicator }  from '../components/SceneProgressIndicator';
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
  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="bg-white relative size-full overflow-hidden" data-name="Scene 9">
      <div className="absolute inset-0 bg-[#2ea3bd]" />

      <PersonSlice79 slice="bottom" zIndex={3} />

      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ marginLeft: '20vw' }}>
        <h1 className="text-white text-6xl font-bold mb-8">Thank you!</h1>
        <button
          onClick={handleReset}
          className="bg-white text-[#2ea3bd] px-8 py-4 rounded-lg font-semibold text-xl hover:bg-gray-100 transition-colors"
        >
          Start Over
        </button>
      </div>

      <SceneProgressIndicator totalScenes={totalScenes} currentScene={currentScene} />
    </div>
  );
}