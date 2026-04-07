import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const OVERLAP_COMPLETE_PROGRESS = 5.02;

/**
 * FixedFoodBlocks - Food blocks that persist from scene 3 through scene 6.
 * 
 * These blocks are at a FIXED screen position. They never move.
 * The world scrolls around them:
 * - Scenes 3-4: Person's stomach is aligned behind the blocks
 * - Scene 5: Receipt scrolls up, its itemized area aligns with blocks
 * - Scene 6: Bag scrolls up, its opening aligns with blocks
 * 
 * This position MUST match the person's stomach position in ParallaxPerson.
 * Person stomach screen Y ≈ personTop_scene3 + 43% * imageHeight
 * 
 * TUNING: Adjust these values AND the receipt/bag positions in Scene5/Scene6
 * to align everything. Also adjust ParallaxPerson PERSON_CONFIG if stomach misaligns.
 */
const FOOD_BLOCKS_POSITION = {
  topVh: 37,            // Vertical position on screen
  leftVw: 72,           // Horizontal position (aligns with person stomach)
  widthVw: 15,          // Width of the block column
  blockHeightVh: 9.5,   // Height of each block
  gapVh: 1.75,           // Gap between blocks
};

export function FixedFoodBlocks({ scrollProgress, foods = [], currentFoodIndex = -1 }) {
  // Visible from scene 3 through scene 6 only.
  const opacity = useMemo(() => {
  if (foods.length === 0) return 0;

  // Start fade-in a little earlier so Scene 3 begins fully visible
  if (scrollProgress < 1.6) return 0;
  if (scrollProgress < 2.0) return (scrollProgress - 1.6) / 0.4;

  if (scrollProgress <= 5.8) return 1;
  if (scrollProgress < 6.2) return 1 - (scrollProgress - 5.8) / 0.4;

  return 0;
}, [scrollProgress, foods.length]);

  // Scene 5 -> 6: collapse blocks into the bag opening area.
  const vacuumProgress = useMemo(() => {
    if (scrollProgress <= 4.62) return 0;
    if (scrollProgress >= OVERLAP_COMPLETE_PROGRESS) return 1;
    return (scrollProgress - 4.62) / 0.5;
  }, [scrollProgress]);

  const transitionOpacity = useMemo(() => {
    if (scrollProgress <= 4.62) return 1;
    if (scrollProgress >= 6) return 0; // food fades after scene 6 fully complete
    if (scrollProgress >= OVERLAP_COMPLETE_PROGRESS) return 1 - ((scrollProgress - OVERLAP_COMPLETE_PROGRESS) / (6 - OVERLAP_COMPLETE_PROGRESS));
    return 1;
  }, [scrollProgress]);

  const scrollAwayYVh = useMemo(() => {
    // From Scene 6 onward, move with page scroll instead of sticking to viewport.
    if (scrollProgress <= 5) return 0;
    return -(scrollProgress - 5) * 100;
  }, [scrollProgress]);

  // Stop rendering if no opacity or no foods.
  if (opacity <= 0 || foods.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: `${FOOD_BLOCKS_POSITION.topVh}vh`,
        left: `${FOOD_BLOCKS_POSITION.leftVw}vw`,
        width: `${FOOD_BLOCKS_POSITION.widthVw}vw`,
        display: 'flex',
        flexDirection: 'column',
        gap: `${FOOD_BLOCKS_POSITION.gapVh}vh`,
        opacity: opacity * transitionOpacity,
        transform: `translateY(${scrollAwayYVh}vh) scale(${1 - vacuumProgress * 0.8})`,
        transformOrigin: 'center center',
        zIndex: vacuumProgress > 0 && scrollProgress < 6 ? 5 : 10, // behind bag during vacuum (Scene 6), in front otherwise
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {foods.map((food, index) => (
          <motion.div
            key={`fixed-food-${index}`}
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{
              opacity: currentFoodIndex === -1 ? 1 : (index === currentFoodIndex ? 1 : 0.5),
              y: 0,
              scale: currentFoodIndex === -1 ? 1 : (index === currentFoodIndex ? 1 : 0.95),
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              backgroundColor: '#47c6da',
              borderRadius: 'clamp(8px, 1.2vw, 25px)',
              height: `${FOOD_BLOCKS_POSITION.blockHeightVh}vh`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <p
              style={{
                fontFamily: "'Inter:Bold',sans-serif",
                fontWeight: 'bold',
                color: 'white',
                fontSize: 'clamp(12px, 1.8vw, 45px)',
                textTransform: 'capitalize',
                margin: 0,
                lineHeight: 'normal',
              }}
            >
              {food.toLowerCase()}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
