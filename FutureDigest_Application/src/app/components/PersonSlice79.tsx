import { useMemo } from 'react';
import { motion } from 'motion/react';

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
  topVh: -15.05,
  offsetUpPx: -150,
};

const BELLY_ANCHOR = {
  xPct: 0.57,
  yPct: 0.43,
};

const SLICE_OFFSET_VH: Record<SliceMode, number> = {
  top: 0,
  middle: -100.5,
  bottom: -200.5,
};

const PERSON_IMAGE_SRC = '/src/assets/30a91495dceb6d7fc18038e42fb8026c7916a513.png';

export function PersonSlice79({
  slice,
  foods = [],
  currentFoodIndex = -1,
  zIndex = 4,
}: PersonSlice79Props) {
  const imageTranslateY = useMemo(() => `${SLICE_OFFSET_VH[slice]}vh`, [slice]);
  const showFoods = slice === 'middle' && foods.length > 0;

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
          top: `calc(${PERSON2_CONFIG.topVh}vh - ${PERSON2_CONFIG.offsetUpPx}px)`,
          width: `${PERSON2_CONFIG.widthVw}vw`,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <img
          src={PERSON_IMAGE_SRC}
          alt="Person illustration"
          style={{
            width: 'auto',
            height: '300vh',
            maxWidth: 'none',
            display: 'block',
            transform: `translateY(${imageTranslateY})`,
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
              const isActive = currentFoodIndex === -1 ? true : index === currentFoodIndex;

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