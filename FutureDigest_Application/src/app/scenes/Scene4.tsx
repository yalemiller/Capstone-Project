import { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { getFoodByName } from '../utils/foodValidation';
import { appContent } from '../data/appContent';

const SNAP_IDLE_DELAY_MS = 120;
const SNAP_LOCK_MS = 280;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function mean(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values: number[]) {
  if (values.length === 0) return 0;
  const avg = mean(values);
  const variance =
    values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function getScrollMetrics(container: HTMLDivElement) {
  const cards = container.querySelectorAll('[data-scroll-card]') as NodeListOf<HTMLDivElement>;
  const firstCard = cards[0];

  if (!firstCard) {
    return {
      baseOffset: 0,
      stride: container.offsetWidth,
      maxLeft: Math.max(0, container.scrollWidth - container.clientWidth),
    };
  }

  const secondCard = cards[1];
  const fallbackStride = firstCard.offsetWidth;
  const stride = secondCard ? secondCard.offsetLeft - firstCard.offsetLeft : fallbackStride;

  return {
    baseOffset: firstCard.offsetLeft,
    stride,
    maxLeft: Math.max(0, container.scrollWidth - container.clientWidth),
  };
}

function getPerFoodPriceStats(currentValue: number, projectedValue: number) {
  const values = [currentValue, projectedValue].filter(
    (value): value is number => typeof value === 'number' && Number.isFinite(value),
  );

  const safeValues = values.length > 0 ? values : [0];
  const avg = mean(safeValues);
  const stdDev = standardDeviation(safeValues);
  const safeStdDev = stdDev > 0 ? stdDev : Math.max(avg * 0.15, 1);
  const maxDisplayValue = Math.max(avg + safeStdDev * 2, 1);

  return {
    mean: avg,
    stdDev: safeStdDev,
    minDisplayValue: 0,
    maxDisplayValue,
  };
}

function getBarHeightPercent(value: number, minDisplayValue: number, maxDisplayValue: number) {
  const normalized = clamp(
    (value - minDisplayValue) / (maxDisplayValue - minDisplayValue),
    0,
    1,
  );

  return normalized * 100;
}

export function Scene4({ currentScene = 3, totalScenes = 8, enteredFoods = [], onFoodIndexChange }) {
  const scene4Content = appContent.scenes.scene4;
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const snapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snapLockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastScrollLeftRef = useRef(0);
  const lastScrollTsRef = useRef(0);
  const velocityRef = useRef(0);
  const isSnappingRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const foodDataList = useMemo(() => {
    return enteredFoods.map((foodName) => {
      const foodData = getFoodByName(foodName);
      if (foodData) return foodData;

      const fallback = scene4Content.fallbackFood;

      return {
        name: foodName,
        categories: [...fallback.categories],
        riskLevel: fallback.riskLevel,
        vulnerabilityScore: fallback.vulnerabilityScore,
        primaryThreat: fallback.primaryThreat,
        cost: {
          currentAvg: fallback.cost.currentAvg,
          predictedAvg: fallback.cost.predictedAvg,
          currency: fallback.cost.currency,
          unit: fallback.cost.unit,
        },
      };
    });
  }, [enteredFoods, scene4Content.fallbackFood]);

  const emitActiveIndex = (newIndex: number, totalItems: number) => {
    if (newIndex < 0 || newIndex >= totalItems) return;

    setActiveIndex((previous) => {
      if (previous !== newIndex) {
        onFoodIndexChange?.(newIndex);
      }
      return newIndex;
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateProgress = (nextProgress: number) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setScrollProgress(nextProgress);
      });
    };

    const snapToIndex = (index: number) => {
      const { baseOffset, stride, maxLeft } = getScrollMetrics(container);
      const boundedIndex = clamp(index, 0, Math.max(foodDataList.length - 1, 0));
      const targetLeft = clamp(baseOffset + boundedIndex * stride, 0, maxLeft);

      isSnappingRef.current = true;
      container.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      });

      emitActiveIndex(boundedIndex, foodDataList.length);
      updateProgress(boundedIndex);

      if (snapLockTimeoutRef.current) clearTimeout(snapLockTimeoutRef.current);
      snapLockTimeoutRef.current = setTimeout(() => {
        isSnappingRef.current = false;
      }, SNAP_LOCK_MS);
    };

    const calculateTargetIndex = (rawIndex: number) => {
      const velocity = velocityRef.current;
      const projectedIndex = rawIndex + clamp(velocity * 0.22, -0.35, 0.35);
      const boundedProjected = clamp(projectedIndex, 0, Math.max(foodDataList.length - 1, 0));
      return Math.round(boundedProjected);
    };

    const handleScroll = () => {
      const now = performance.now();
      const { baseOffset, stride } = getScrollMetrics(container);
      const currentLeft = container.scrollLeft;
      const rawIndex = (currentLeft - baseOffset) / stride;

      const dt = now - lastScrollTsRef.current;
      if (dt > 0) {
        const delta = currentLeft - lastScrollLeftRef.current;
        velocityRef.current = delta / dt;
      }

      lastScrollLeftRef.current = currentLeft;
      lastScrollTsRef.current = now;

      const nearestIndex = Math.round(rawIndex);
      emitActiveIndex(nearestIndex, foodDataList.length);
      updateProgress(rawIndex);

      if (isSnappingRef.current) return;
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);

      snapTimeoutRef.current = setTimeout(() => {
        const targetIndex = calculateTargetIndex(rawIndex);
        snapToIndex(targetIndex);
      }, SNAP_IDLE_DELAY_MS);
    };

    const { baseOffset, stride } = getScrollMetrics(container);
    const startingIndex = clamp(
      Math.round((container.scrollLeft - baseOffset) / stride),
      0,
      Math.max(foodDataList.length - 1, 0),
    );
    emitActiveIndex(startingIndex, foodDataList.length);
    setScrollProgress(startingIndex);

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      if (snapLockTimeoutRef.current) clearTimeout(snapLockTimeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [foodDataList.length, onFoodIndexChange]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { baseOffset, stride, maxLeft } = getScrollMetrics(container);
    const bounded = clamp(activeIndex, 0, Math.max(foodDataList.length - 1, 0));
    const targetLeft = clamp(baseOffset + bounded * stride, 0, maxLeft);
    container.scrollTo({ left: targetLeft, behavior: 'auto' });
    setScrollProgress(bounded);
  }, [foodDataList.length]);

  const getRiskLevelText = (riskLevel: string) => {
    return scene4Content.riskLevelLabels[riskLevel] || scene4Content.riskLevelLabels.moderate;
  };

  const getCategoryName = (categories: string[]) => {
    if (!categories || categories.length === 0) return scene4Content.categoryLabels.other;
    return scene4Content.categoryLabels[categories[0]] || scene4Content.categoryLabels.other;
  };

  if (foodDataList.length === 0) {
    return (
      <div className="bg-white relative size-full overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-2xl text-gray-500">{scene4Content.emptyStateText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white relative size-full overflow-hidden" data-name="Scene 4">
      <div className="absolute inset-0 bg-[#52c467]" />

      <div
        ref={scrollContainerRef}
        data-scroll-cards
        className="absolute top-0 bottom-0 left-0 flex items-center overflow-x-auto"
        style={{
          width: '66vw',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingLeft: '1.2vw',
          paddingRight: '3vw',
          gap: '1.6vw',
          zIndex: 2,
        }}
      >
        <style>{`
          [data-name="Scene 4"] [data-scroll-cards]::-webkit-scrollbar {
            display: none;
          }

          [data-name="Scene 4"] [data-scroll-cards] {
            -webkit-overflow-scrolling: touch;
            scroll-snap-stop: always;
          }
        `}</style>

        {foodDataList.map((food, index) => {
          const currentValue = food.cost?.currentAvg || 0;
          const projectedValue = food.cost?.predictedAvg || 0;
          const priceStats = getPerFoodPriceStats(currentValue, projectedValue);
          const currentBarHeight = getBarHeightPercent(
            currentValue,
            priceStats.minDisplayValue,
            priceStats.maxDisplayValue,
          );
          const projectedBarHeight = getBarHeightPercent(
            projectedValue,
            priceStats.minDisplayValue,
            priceStats.maxDisplayValue,
          );

          const stackDistance = clamp(index - scrollProgress, -2.5, 2.5);
          const depth = Math.abs(stackDistance);
          const cardScale = 1 - depth * 0.08;
          const cardRotate = stackDistance * -6;
          const cardX = stackDistance * 34;
          const cardY = depth * 18;
          const cardOpacity = 1 - depth * 0.2;
          const cardShadow = `0 ${14 + depth * 6}px ${38 + depth * 8}px rgba(0,0,0,${0.22 - depth * 0.03})`;

          return (
            <div
              key={`card-${index}`}
              data-scroll-card
              className="flex-shrink-0"
              style={{
                scrollSnapAlign: 'start',
                width: '58vw',
                height: '88vh',
                padding: '0.7vw',
                position: 'relative',
                zIndex: Math.round(100 - depth * 10),
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{
                  opacity: cardOpacity,
                  x: cardX,
                  y: cardY,
                  scale: cardScale,
                  rotate: cardRotate,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 24, mass: 0.7 }}
                className="bg-[#47c6da] rounded-[1.8vw] relative"
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '2.2vh 2vw',
                  boxShadow: cardShadow,
                  transformOrigin: 'center center',
                }}
              >
                <p
                  className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[#f5f5f5] capitalize"
                  style={{ fontSize: 'clamp(56px, 5.4vw, 112px)', lineHeight: 1 }}
                >
                  {food.name}
                </p>

                <div
                  className="absolute flex items-center justify-center bg-[#f5f5f5] rounded-full"
                  style={{
                    width: 'clamp(54px, 4.2vw, 84px)',
                    height: 'clamp(54px, 4.2vw, 84px)',
                    top: '2.2vh',
                    right: '1.5vw',
                  }}
                >
                  <p
                    className="font-['Inter:Regular',sans-serif] text-black"
                    style={{ fontSize: 'clamp(8px, 0.68vw, 12px)' }}
                  >
                    {getCategoryName(food.categories)}
                  </p>
                </div>

                <div
                  className="bg-[#f5f5f5] w-full"
                  style={{ height: '0.45vh', margin: '2.1vh 0 3vh 0' }}
                />

                <p
                  className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[#f5f5f5]"
                  style={{ fontSize: 'clamp(80px, 2.5vw, 48px)', lineHeight: 1.1 }}
                >
                  Vulnerability:
                </p>

                <p
                  className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[#28818f]"
                  style={{ fontSize: 'clamp(100px, 6.2vw, 132px)', lineHeight: 0.95, marginTop: '2vh' }}
                >
                  {getRiskLevelText(food.riskLevel)}
                </p>

                <p
                  className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[#28818f]"
                  style={{ fontSize: 'clamp(54px, 4.8vw, 92px)', lineHeight: 1, marginTop: '1vh' }}
                >
                  {food.vulnerabilityScore || 50}/100
                </p>

                <p
                  className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[#f5f5f5]"
                  style={{ fontSize: 'clamp(80px, 2.5vw, 48px)', marginTop: '7vh', lineHeight: 1.1 }}
                >
                  Primary Threat
                </p>

                <ul
                  className="font-['Inter:Regular',sans-serif] text-[#f5f5f5]"
                  style={{ fontSize: 'clamp(70px, 2.2vw, 40px)', marginLeft: '2vw', marginTop: '1.1vh' }}
                >
                  <li className="list-disc">
                    <span>{food.primaryThreat}</span>
                  </li>
                </ul>

                <div className="absolute" style={{ bottom: '1.8vh', left: '2vw' }}>
                  <svg width="64" height="64" viewBox="0 0 69 69" fill="none">
                    <circle cx="34.5" cy="34.5" r="31.5" stroke="white" strokeWidth="6" />
                  </svg>
                  <p
                    className="absolute font-['Inter:Bold',sans-serif] font-bold text-white text-center"
                    style={{
                      fontSize: 'clamp(24px, 2vw, 38px)',
                      top: '8px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    i
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 + 0.12 }}
                  className="bg-[#f1f1f1] rounded-[1.8vw] absolute flex flex-col"
                  style={{
                    width: '39%',
                    height: '68%',
                    right: '2.4vw',
                    top: '20.5vh',
                    padding: '1.8vh 1.1vw 1.8vh 1.1vw',
                    boxShadow: '0px 10px 30px rgba(0,0,0,0.15)',
                  }}
                >
                  <div
                    className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[#47c6da]"
                    style={{ fontSize: 'clamp(28px, 2.7vw, 50px)', lineHeight: 1.02 }}
                  >
                    <p>Average Price</p>
                    <p>Per {String(food.cost?.unit || 'Lb').toUpperCase()}</p>
                  </div>

                  <div className="flex-1 relative" style={{ marginTop: '2.2vh' }}>
                    <div className="absolute left-0 right-0 bg-[#d0d0d0]" style={{ top: '2%', height: '4px' }} />
                    <p
                      className="absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[#d0d0d0]"
                      style={{ fontSize: 'clamp(12px, 1vw, 18px)', top: '-1.8vh' }}
                    >
                      ${priceStats.maxDisplayValue.toFixed(2)}
                    </p>

                    <div
                      className="absolute left-0 right-0 flex justify-around items-end"
                      style={{ top: '13%', bottom: '17%' }}
                    >
                      <div className="flex items-end justify-center" style={{ width: '32%', height: '100%' }}>
                        <div
                          className="bg-[#47c6da] w-full rounded-t-[0.8vw] flex items-start justify-center overflow-hidden"
                          style={{
                            height: `${Math.max(currentBarHeight, 0)}%`,
                            opacity: 1,
                            minHeight: currentValue > 0 ? '18px' : '0px',
                            paddingTop: currentValue > 0 ? '1vh' : '0vh',
                          }}
                        >
                          <p
                            className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[#f5f5f5]"
                            style={{ fontSize: 'clamp(12px, 1.05vw, 20px)' }}
                          >
                            ${food.cost?.currentAvg.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-end justify-center" style={{ width: '32%', height: '100%' }}>
                        <div
                          className="bg-[#47c6da] w-full rounded-t-[0.8vw] flex items-start justify-center overflow-hidden"
                          style={{
                            height: `${Math.max(projectedBarHeight, 0)}%`,
                            opacity: 1,
                            minHeight: projectedValue > 0 ? '18px' : '0px',
                            paddingTop: projectedValue > 0 ? '1vh' : '0vh',
                          }}
                        >
                          <p
                            className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[#f5f5f5]"
                            style={{ fontSize: 'clamp(12px, 1.05vw, 20px)' }}
                          >
                            ${food.cost?.predictedAvg.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="absolute left-0 right-0 bg-[#d0d0d0]" style={{ bottom: '15%', height: '4px' }} />
                    <p
                      className="absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[#d0d0d0]"
                      style={{ fontSize: 'clamp(12px, 1vw, 18px)', bottom: '16.5%' }}
                    >
                      $0.00
                    </p>

                    <div className="absolute bottom-[2%] left-0 right-0 flex justify-around">
                      <p
                        className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[#47c6da]"
                        style={{ fontSize: 'clamp(16px, 1.45vw, 26px)' }}
                      >
                        {scene4Content.priceChart.currentLabel}
                      </p>
                      <p
                        className="font-['Inter:Extra_Bold',sans-serif] font-extrabold text-[#47c6da]"
                        style={{ fontSize: 'clamp(16px, 1.45vw, 26px)' }}
                      >
                        {scene4Content.priceChart.projectedLabel}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          );
        })}

        <div
          aria-hidden
          className="flex-shrink-0"
          style={{ width: '10vw', height: '1px' }}
        />
      </div>
    </div>
  );
}