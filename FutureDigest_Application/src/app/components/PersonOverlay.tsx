import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import imgChest1 from '../../assets/30a91495dceb6d7fc18038e42fb8026c7916a513.png';
import { calculateStomachPosition } from '../utils/positionHelpers';
import { SCENE_3_CONFIG } from '../constants';

interface PersonOverlayProps {
  isVisible: boolean;
  enteredFoods: string[];
  currentFoodIndex?: number;
}

export function PersonOverlay({ isVisible, enteredFoods, currentFoodIndex = -1 }: PersonOverlayProps) {
  // Calculate dynamically coupled stomach position
  const stomachPosition = useMemo(() => {
    return calculateStomachPosition(
      SCENE_3_CONFIG.personPosition.left,
      SCENE_3_CONFIG.personPosition.top,
      SCENE_3_CONFIG.personPosition.scale,
      SCENE_3_CONFIG.stomachRelativePosition
    );
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {/* Person illustration - Full torso visible, scaled up */}
      <div 
        className="absolute h-[3010px] w-[797px]" 
        style={{ 
          left: SCENE_3_CONFIG.personPosition.left,
          top: SCENE_3_CONFIG.personPosition.top,
          transform: `scale(${SCENE_3_CONFIG.personPosition.scale})`,
          transformOrigin: 'top left',
        }}
        data-name="chest 1"
      >
        <img 
          alt="Human body illustration showing digestive system" 
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
          src={imgChest1} 
        />
      </div>

      {/* Food blocks in stomach - DYNAMICALLY COUPLED to person image */}
      <div 
        className="absolute flex flex-col justify-end"
        style={{
          left: stomachPosition.left,
          top: stomachPosition.top,
          width: stomachPosition.width,
          height: stomachPosition.height,
          gap: '6px',
          transformOrigin: 'top left',
        }}
      >
        <AnimatePresence>
          {enteredFoods.map((food, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: currentFoodIndex === -1 ? 1 : (index === currentFoodIndex ? 1 : 0.5),
                scale: currentFoodIndex === -1 ? 1 : (index === currentFoodIndex ? 1 : 0.95),
                y: 0
              }}
              transition={{ duration: 0.3 }}
              className="bg-[#47c6da] rounded-[25px] w-full flex items-center justify-center flex-shrink-0"
              style={{ 
                height: SCENE_3_CONFIG.foodBlockSize.height,
              }}
            >
              <p 
                className="font-['Inter:Bold',sans-serif] font-bold text-white text-center leading-[normal] capitalize px-4"
                style={{ fontSize: '55px' }}
              >
                {food.toLowerCase()}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
