import { motion } from 'motion/react';
import svgPaths from '../../imports/svg-r2pv384azv';
import imgTitle1 from '../../assets/a16a85855a3bb3af39a3f72babdcda2905687e67.png';
import { bobbingAnimation } from '../animations/variants';
import { GradientBackground } from '../components/scene-elements';
import { COLORS } from '../constants';
import { appContent } from '../data/appContent';

export function Scene1({ skyGradient, enableGlobalGradient = false }) {
  return (
    <div className="bg-white relative size-full" data-name="Scene 1">
      {enableGlobalGradient ? (
        <GradientBackground
          gradient={skyGradient}
          animate
          backgroundSize="100% 300%"
          backgroundPosition="50% 0%"
        />
      ) : (
        <div
          className="absolute h-full left-0 top-0 w-full"
          style={{ backgroundColor: COLORS.turquoise }}
        />
      )}
      
      {/* Title image */}
      <div className="-translate-x-1/2 absolute h-[317px] left-[calc(50%-0.5px)] top-[341px] w-[1432px]" data-name="Title 1">
        <img 
          alt="Food Futures Title" 
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
          src={imgTitle1} 
        />
      </div>
      
      {/* Instructions text with fade-in and bobbing animation */}
      <motion.p
        {...bobbingAnimation}
        className="-translate-x-1/2 absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold h-[57px] leading-[normal] left-1/2 not-italic text-[40px] text-center text-white top-[820px] w-[736px]"
      >
        {appContent.scenes.scene1.swipePrompt}
      </motion.p>
      
      {/* Down arrow with bobbing animation */}
      <motion.div
        {...bobbingAnimation}
        className="absolute flex items-center justify-center left-1/2 -translate-x-1/2 size-[74px] top-[877px]"
      >
        <div className="flex-none rotate-180">
          <div className="relative size-[74px]">
            <div className="absolute bottom-1/4 left-[6.7%] right-[6.7%] top-0">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 64.0859 55.5">
                <path d={svgPaths.pe75b400} fill="white" id="Polygon 1" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
      
    </div>

    
  );
}
