import { motion } from 'motion/react';
import { SceneProgressIndicator } from '../components/SceneProgressIndicator';
import { headlineAnimation } from '../animations/variants';
import { GradientBackground } from '../components/scene-elements';
import { COLORS } from '../constants';
import { appContent } from '../data/appContent';

export function Scene2({ currentScene = 1, totalScenes = 8, skyGradient, enableGlobalGradient = false }) {
  const [headlineLine1, headlineLine2] = appContent.scenes.scene2.headline;

  return (
    <div className="bg-white relative size-full" data-name="Scene 2">
      {enableGlobalGradient ? (
        <GradientBackground
          gradient={skyGradient}
          animate
          backgroundSize="100% 300%"
          backgroundPosition="50% 50%"
        />
      ) : (
        <div
          className="absolute h-full left-0 top-0 w-full"
          style={{ backgroundColor: COLORS.turquoise }}
        />
      )}
      
      {/* Person is now rendered by ParallaxPerson overlay - removed from here */}
      
      {/* Main headline */}
      <motion.div
        {...headlineAnimation(0.3)}
        className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] not-italic text-[#fae850]"
        style={{
          left: '10.7vw',
          top: '33.6vh',
          width: '44.8vw',
          fontSize: 'clamp(24px, 3.4vw, 65px)',
        }}
      >
        <p className="leading-[normal] mb-0">{headlineLine1}</p>
        <p className="leading-[normal]">{headlineLine2}</p>
      </motion.div>
      
      {/* Placeholder text */}
      <motion.p
        {...headlineAnimation(0.5)}
        className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-white"
        style={{
          left: '10.7vw',
          top: '53vh',
          width: '38.3vw',
          fontSize: 'clamp(18px, 2.1vw, 40px)',
        }}
      >
        {appContent.scenes.scene2.body}
      </motion.p>
      
      {/* Scene progress indicator */}
      <SceneProgressIndicator 
        totalScenes={totalScenes} 
        currentScene={currentScene} 
      />
    </div>
  );
}
