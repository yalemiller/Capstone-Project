import { SceneProgressIndicator } from '../components/SceneProgressIndicator';
import { PersonSlice79 } from '../components/PersonSlice79';

export function Scene9({ currentScene = 8, totalScenes = 9 }) {
  return (
    <div className="bg-white relative size-full overflow-hidden" data-name="Scene 9">
      <div className="absolute inset-0 bg-[#2ea3bd]" />

      <PersonSlice79 slice="bottom" zIndex={3} />

      <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold h-[70px] leading-[normal] left-[1332.5px] not-italic text-[55px] text-center text-white top-[464px] w-[523px]">
        Thank You!
      </p>

      <SceneProgressIndicator totalScenes={totalScenes} currentScene={currentScene} />
    </div>
  );
}
