import { useState } from 'react';
import { ScrollContainer } from './components/ScrollContainer';
import { SceneWrapper } from './components/SceneWrapper';
import { ParallaxPerson } from './components/ParallaxPerson';
import { FixedFoodBlocks } from './components/FixedFoodBlocks';
import { useScrollSnap } from './hooks/useScrollSnap';
import { useScrollProgress } from './hooks/useScrollProgress';
import { SCENE_3_STEPS } from './constants';
import {
  Scene1,
  Scene2,
  Scene3,
  Scene4,
  Scene5,
  Scene6,
  Scene7,
  Scene8,
  Scene9,
} from './scenes';

const TOTAL_SCENES = 9;

export default function App() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [scene3Complete, setScene3Complete] = useState(false);
  const [enteredFoods, setEnteredFoods] = useState([]);
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);
  const [skyGradient, setSkyGradient] = useState(SCENE_3_STEPS[0].gradient);
  const [hasFeedingStarted, setHasFeedingStarted] = useState(false);

  const { containerRef, currentScene, scrollToScene } = useScrollSnap({
    totalScenes: TOTAL_SCENES,
    onSceneChange: (sceneIndex) => {
      setCurrentSceneIndex(sceneIndex);
      console.log('Current scene:', sceneIndex + 1);
    },
  });

  // Continuous scroll progress for parallax and fade effects
  const scrollProgress = useScrollProgress(containerRef);

  // Lock scroll when on Scene 3 and not complete
  const isScrollLocked = currentSceneIndex === 2 && !scene3Complete;

  return (
    <>
      <ScrollContainer 
        containerRef={containerRef} 
        isScrollLocked={isScrollLocked}
        currentScene={currentSceneIndex}
      >
        <SceneWrapper sceneNumber={1}>
          <Scene1 skyGradient={skyGradient} enableGlobalGradient={hasFeedingStarted} />
        </SceneWrapper>
        
        <SceneWrapper sceneNumber={2}>
          <Scene2
            currentScene={currentSceneIndex}
            totalScenes={TOTAL_SCENES}
            skyGradient={skyGradient}
            enableGlobalGradient={hasFeedingStarted}
          />
        </SceneWrapper>
        
        <SceneWrapper sceneNumber={3}>
          <Scene3 
            currentScene={currentSceneIndex} 
            totalScenes={TOTAL_SCENES}
            onComplete={() => setScene3Complete(true)}
            onFoodsEntered={(foods) => {
              setEnteredFoods(foods);
              if (foods.length > 0) setHasFeedingStarted(true);
            }}
            onSkyGradientChange={setSkyGradient}
          />
        </SceneWrapper>
        
        <SceneWrapper sceneNumber={4}>
          <Scene4 
            currentScene={currentSceneIndex} 
            totalScenes={TOTAL_SCENES}
            enteredFoods={enteredFoods}
            onFoodIndexChange={(index) => setCurrentFoodIndex(index)}
          />
        </SceneWrapper>
        
        <SceneWrapper sceneNumber={5}>
          <Scene5 
            currentScene={currentSceneIndex} 
            totalScenes={TOTAL_SCENES}
            scrollProgress={scrollProgress}
          />
        </SceneWrapper>
        
        <SceneWrapper sceneNumber={6}>
          <Scene6 
            currentScene={currentSceneIndex} 
            totalScenes={TOTAL_SCENES}
            scrollProgress={scrollProgress}
          />
        </SceneWrapper>
        
        <SceneWrapper sceneNumber={7}>
          <Scene7 currentScene={currentSceneIndex} totalScenes={TOTAL_SCENES} />
        </SceneWrapper>
        
        <SceneWrapper sceneNumber={8}>
          <Scene8 
            currentScene={currentSceneIndex} 
            totalScenes={TOTAL_SCENES}
            enteredFoods={enteredFoods}
          />
        </SceneWrapper>

        <SceneWrapper sceneNumber={9}>
          <Scene9 currentScene={currentSceneIndex} totalScenes={TOTAL_SCENES} />
        </SceneWrapper>
      </ScrollContainer>

      {/* Parallax Person - image only, scenes 2-4 */}
      <ParallaxPerson scrollProgress={scrollProgress} />

      {/* Fixed Food Blocks - ONE persistent element from scene 3 through 6 */}
      {/* Aligns with person stomach (3-4), receipt items (5), bag opening (6) */}
      <FixedFoodBlocks 
        scrollProgress={scrollProgress}
        foods={enteredFoods}
        currentFoodIndex={currentSceneIndex === 3 ? currentFoodIndex : -1}
      />

    </>
  );
}
