import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import personIllustration from '../../assets/30a91495dceb6d7fc18038e42fb8026c7916a513.png';

type SliceMode = 'top' | 'middle' | 'bottom';

interface PersonSlice79Props {
  slice: SliceMode;
  foods?: string[];
  currentFoodIndex?: number;
  zIndex?: number;
}

const PERSON2_CONFIG = {
  widthVw: 44,
  leftVw: 2,
  offsetUpPx: -150,
};

const BELLY_ANCHOR = {
  xPct: 0.57,
  yPct: 0.43,
};

const SLICE_INDEX: Record<SliceMode, number> = {
  top: 0,
  middle: 1,
  bottom: 2,
};

const PERSON_IMAGE_SRC = personIllustration;

/**
 * Responsive top positioning based on screen size + aspect ratio
 */
function useResponsiveTopVh() {
  const [topVh, setTopVh] = useState(-15.05); // desktop default (your MacBook)

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const aspect = h / w;

      let value = -15.05;

      if (w < 480) value = -8.8;            // small phones
      else if (w < 768) value = -9.8;       // phones
      else if (w < 1024) value = -11.8;     // tablets
      else if (w < 1280) value = -13.4;     // small laptops
      else if (aspect > 0.8) value = -14.2; // taller desktops
      else value = -15.05;                  // wide desktop (MacBook sweet spot)

      setTopVh(value);
    }

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return topVh;
}

export function PersonSlice79({
  slice,
  foods = [],
  currentFoodIndex = -1,
  zIndex = 4,
}: PersonSlice79Props) {
  const showFoods = slice === 'middle' && foods.length > 0;
  const topVh = useResponsiveTopVh();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: `${PERSON2_CONFIG.leftVw}vw`,
          top: `calc(${topVh}vh + ${PERSON2_CONFIG.offsetUpPx}px)`,
          width: `${PERSON2_CONFIG.widthVw}vw`,
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <img
          src={PERSON_IMAGE_SRC}
          alt="Person illustration"
          style={{
            height: '300%',
            width: 'auto',
            maxWidth: 'none',
            display: 'block',
            transform: `translateY(calc(-${SLICE_INDEX[slice] * 33.333333}% - ${SLICE_INDEX[slice]}px))`,
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
            {foods.slice(0, 4).map((food, index) => {
              const isActive =
                currentFoodIndex === -1 ? true : index === currentFoodIndex;

              return (
                <motion.div
                  key={`slice79-food-${food}-${index}`}
                  initial={{ opacity: 0, y: 10, scale: 0.94 }}
                  animate={{
                    opacity: isActive ? 1 : 0.56,
                    y: 0,
                    scale: isActive ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
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
      </div>
    </div>
  );
}