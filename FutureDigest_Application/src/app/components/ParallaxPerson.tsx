import { useMemo } from 'react';
import imgChest1 from '../../assets/30a91495dceb6d7fc18038e42fb8026c7916a513.png';

/**
 * ParallaxPerson - ONE person image as a fixed overlay spanning scenes 2-4.
 * 
 * The person is JUST the image. Food blocks are a separate fixed overlay
 * (FixedFoodBlocks) that happens to align with the stomach area.
 * 
 * Scene 2: Head + torso visible
 * Scene 2→3: Parallax (person scrolls at 0.5x background speed)
 * Scene 3-4: Person FIXED, stomach aligned with food blocks position
 * After scene 4: Person fades out, food blocks persist
 * 
 * TUNING GUIDE:
 * - widthVw: person size (affects height via aspect ratio)
 * - leftVw: horizontal position on screen
 * - startTopVh: where person top is at scene 2 (negative = head above viewport)
 * - offsetUpPx: additional upward nudge in pixels (applied at all times)
 * - parallaxRate: 0.5 = person moves at half background speed
 * 
 * The person's stomach must align with FOOD_BLOCKS_POSITION in FixedFoodBlocks.
 * Stomach screen position = (startTopVh - parallaxRate*100) + 0.43 * imageHeightVh
 */
const PERSON_CONFIG = {
  widthVw: 44,
  leftVw: 57,
  startTopVh: -18,
  offsetUpPx: -150,
  parallaxRate: .93,
};

const PERSON_EXIT_PROGRESS = 4;

export function ParallaxPerson({ scrollProgress }) {
  const personTop = useMemo(() => {
    if (scrollProgress <= 1) {
      return PERSON_CONFIG.startTopVh;
    } else if (scrollProgress <= 2) {
      // Scene 2→3: parallax at 0.5x
      const delta = scrollProgress - 1;
      return PERSON_CONFIG.startTopVh - delta * 100 * PERSON_CONFIG.parallaxRate;
    } else if (scrollProgress <= 3) {
      // Scenes 3-4: person remains fixed in place
      return PERSON_CONFIG.startTopVh - 100 * PERSON_CONFIG.parallaxRate;
    } else if (scrollProgress < PERSON_EXIT_PROGRESS) {
      // Scene 4→5 handoff: person exits upward with the scene (no fade)
      const delta = scrollProgress - 3;
      return PERSON_CONFIG.startTopVh - 100 * PERSON_CONFIG.parallaxRate - delta * 100;
    } else {
      // After handoff starts, keep far above viewport.
      return -300;
    }
  }, [scrollProgress]);

  const opacity = useMemo(() => {
    if (scrollProgress < 0.7) return 0;
    if (scrollProgress < 1) return (scrollProgress - 0.7) / 0.3;
    if (scrollProgress < PERSON_EXIT_PROGRESS) return 1;
    return 1;
  }, [scrollProgress]);

  // Scene 4 bottom edge mask:
  // - full viewport up to Scene 4
  // - shrinks upward during Scene 4→5 so content beyond boundary is clipped
  const scene4MaskHeightVh = useMemo(() => {
    if (scrollProgress <= 3) return 100;
    if (scrollProgress < 4) return (4 - scrollProgress) * 100;
    return 0;
  }, [scrollProgress]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        height: `${scene4MaskHeightVh}vh`,
        overflow: 'hidden',
        zIndex: 4,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: `calc(${personTop}vh - ${PERSON_CONFIG.offsetUpPx}px)`,
          left: `${PERSON_CONFIG.leftVw}vw`,
          width: `${PERSON_CONFIG.widthVw}vw`,
          opacity,
        }}
      >
        <img
          src={imgChest1}
          alt="Person illustration"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>
    </div>
  );
}
