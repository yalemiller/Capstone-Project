import { useMemo } from 'react';
import { motion } from 'motion/react';
import imgChest1 from '../../assets/30a91495dceb6d7fc18038e42fb8026c7916a513.png';

/**
 * ParallaxPerson79 - ONE person image as a fixed overlay spanning scenes 7-9.
 *
 * No parallax: the same image is split into 3 equal vertical slices.
 * - Scene 7: top third
 * - Scene 8: middle third
 * - Scene 9: bottom third
 */
const PERSON2_CONFIG = {
  widthVw: 44,
  leftVw: 2,
  topVh: -18,
  offsetUpPx: -150,
};

const BELLY_ANCHOR = {
  xPct: 0.57,
  yPct: 0.43,
};

interface ParallaxPerson79Props {
  scrollProgress: number;
  foods?: string[];
  currentFoodIndex?: number;
}

export function ParallaxPerson79({ scrollProgress, foods = [], currentFoodIndex = -1 }: ParallaxPerson79Props) {
  const segmentIndex = useMemo(() => {
    if (scrollProgress < 7) return 0;
    if (scrollProgress < 8) return 1;
    return 2;
  }, [scrollProgress]);

  const segmentBaseProgress = useMemo(() => {
    if (segmentIndex === 0) return 6;
    if (segmentIndex === 1) return 7;
    return 8;
  }, [segmentIndex]);

  const pageAttachY = useMemo(() => {
    // Make each slice move with its scene scroll instead of floating fixed on the viewport.
    return -(scrollProgress - segmentBaseProgress) * 100;
  }, [scrollProgress, segmentBaseProgress]);

  const imageTranslateY = useMemo(() => {
    // Each step shifts exactly one-third of the image height.
    return `${-segmentIndex * 33.333333}%`;
  }, [segmentIndex]);

  const lateFoods = useMemo(() => {
    if (foods.length > 0) return foods.slice(0, 4);
    return ['salmon', 'almonds', 'turkey', 'coffee'];
  }, [foods]);

  const showFoods = useMemo(() => {
    if (lateFoods.length === 0) return false;
    // Food blocks are mounted in the stomach only for Scene 8 (middle third).
    return scrollProgress >= 7 && scrollProgress < 8;
  }, [scrollProgress, lateFoods.length]);

  const opacity = useMemo(() => {
    // Visible only during scenes 7-9
    if (scrollProgress >= 6 && scrollProgress <= 9) return 1;
    return 0;
  }, [scrollProgress]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        height: '100vh',
        overflow: 'hidden',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          left: `${PERSON2_CONFIG.leftVw}vw`,
          top: `calc(${PERSON2_CONFIG.topVh}vh - ${PERSON2_CONFIG.offsetUpPx}px)`,
          width: `${PERSON2_CONFIG.widthVw}vw`,
          height: '100vh',
          overflow: 'hidden',
          opacity,
          transform: `translateY(${pageAttachY}vh)`,
        }}
      >
        <img
          src={imgChest1}
          alt="Person illustration"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            transform: `translateY(${imageTranslateY})`,
            transition: 'transform 120ms linear',
            willChange: 'transform',
          }}
        />

        {showFoods ? (
          <div
            style={{
              position: 'absolute',
              left: `${BELLY_ANCHOR.xPct * 100}%`,
              top: `${BELLY_ANCHOR.yPct * 100}%`,
              transform: 'translate(-40%, -12%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9vh',
              width: '30%',
              pointerEvents: 'none',
            }}
          >
            {lateFoods.map((food, index) => {
              const isActive = currentFoodIndex === -1 ? true : index === currentFoodIndex;
              return (
                <motion.div
                  key={`person79-food-${food}-${index}`}
                  initial={{ opacity: 0, y: 10, scale: 0.94 }}
                  animate={{
                    opacity: isActive ? 1 : 0.56,
                    y: 0,
                    scale: isActive ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  style={{
                    backgroundColor: '#47c6da',
                    borderRadius: 'clamp(8px, 0.9vw, 16px)',
                    minHeight: '5.8vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 18px rgba(0, 0, 0, 0.18)',
                    padding: '0 0.7vw',
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Inter:Bold',sans-serif",
                      fontWeight: 'bold',
                      color: '#ffffff',
                      fontSize: 'clamp(12px, 0.95vw, 20px)',
                      textTransform: 'capitalize',
                      margin: 0,
                      lineHeight: 'normal',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {food.toLowerCase()}
                  </p>
                </motion.div>
              );
            })}
          </div>
        ) : null}
      </motion.div>
    </div>
  );
}
