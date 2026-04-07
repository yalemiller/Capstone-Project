import  { SceneProgressIndicator }  from '../components/SceneProgressIndicator';
import { PersonSlice79 } from '../components/PersonSlice79';

export function Scene7({ currentScene = 6, totalScenes = 9 }) {
  return (
    <div className="bg-white relative size-full overflow-hidden" data-name="Scene 7">
      <div className="absolute inset-0 bg-[#2ea3bd]" />

      <PersonSlice79 slice="top" zIndex={3} />

      <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[411px] leading-[normal] left-[982px] not-italic text-[#fae850] text-[50px] top-[506px] w-[762px]">
        How are these foods affecting the environment?
      </p>

      <div className="absolute font-['Inter:Bold',sans-serif] font-bold h-[73px] leading-[0] left-[982px] not-italic text-[#fae850] text-[60px] top-[423px] w-[762px]">
        <p className="leading-[normal] mb-0">Now let&apos;s flip the script.</p>
        <p className="leading-[normal]">&nbsp;</p>
      </div>

      <SceneProgressIndicator totalScenes={totalScenes} currentScene={currentScene} />
    </div>
  );
}
