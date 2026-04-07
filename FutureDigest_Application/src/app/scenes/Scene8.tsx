import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SceneProgressIndicator } from '../components/SceneProgressIndicator';
import { PersonSlice79 } from '../components/PersonSlice79';
import { getFoodByName } from '../utils/foodValidation';



const SNAP_IDLE_DELAY_MS = 120;
const SNAP_LOCK_MS = 280;
const DEFAULT_FOOD_IDS = ['salmon', 'almonds', 'turkey', 'coffee'] as const;
const DEFAULT_IMPACTS = {
  productionPct: 60,
  transportPct: 20,
  processingPct: 8,
  homeCookingPct: 7,
  refrigerationPct: 5,
  totalImpact: 0.005,
};

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

type Scene8Food = {
  id: string;
  name: string;
  categories?: string[];
  riskLevel?: string;
  primaryThreat?: string;
  vulnerabilityScore?: number;
  cost?: {
    currentAvg?: number;
    predictedAvg?: number;
    currency?: string;
    unit?: string;
  };
  lifecycleImpacts?: {
    productionPct: number;
    transportPct: number;
    processingPct: number;
    homeCookingPct: number;
    refrigerationPct: number;
    totalImpact: number;
  };
};

interface Scene8Props {
  currentScene?: number;
  totalScenes?: number;
  enteredFoods?: string[];
}

interface Scene8PanelProps {
  food: Scene8Food;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
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

function Scene8Panel({ food }: Scene8PanelProps) {
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const [currentMonth, setCurrentMonth] = useState(0);

  const impacts = food.lifecycleImpacts || DEFAULT_IMPACTS;

  const maxBarWidth = 760;
  const productionWidth = (impacts.productionPct / 100) * maxBarWidth;
  const transportWidth = (impacts.transportPct / 100) * maxBarWidth;
  const processingWidth = (impacts.processingPct / 100) * maxBarWidth;
  const cookingWidth = (impacts.homeCookingPct / 100) * maxBarWidth;
  const refrigerationWidth = (impacts.refrigerationPct / 100) * maxBarWidth;

  return (
    <div className="relative w-full h-full flex items-start justify-start pt-[2.2vh] pl-[0.8vw]">
      <div className="relative bg-[#404c92] h-[82vh] rounded-[30px] w-[42vw]">
        <p className="absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold h-[133px] leading-[normal] left-[24px] not-italic text-[#f5f5f5] text-[100px] top-[22px] w-[750px]">
          {food.name}
        </p>

        <p
          className="absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold h-[60px] leading-[normal] left-[34px] not-italic text-[#f5f5f5] text-[44px] top-[178px]"
          style={{ width: 'calc(100% - 240px)' }}
        >
          Vulnerability: {(food.riskLevel || 'moderate').toUpperCase()}
        </p>

        <div className="absolute bg-[#f5f5f5] h-[7px] left-[27px] top-[155px] w-[calc(100%-54px)]" />

        <div className="absolute left-[calc(100%-116px)] size-[91px] top-[35px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 91 91">
            <circle cx="45.5" cy="45.5" fill="#F5F5F5" r="45.5" />
          </svg>
        </div>

        <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[19px] leading-[normal] left-[calc(100%-110px)] not-italic text-[10px] text-black top-[71px] w-[74px] text-center">
          {food.categories?.[0] || 'other'}
        </p>

        <div className="absolute right-[28px] top-[182px] z-20 flex flex-col items-end gap-[7px] w-[122px]">
          <p className="font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-[normal] not-italic text-[24px] text-white whitespace-nowrap m-0">
            {viewMode === 'month' ? 'By Year' : 'By Month'}
          </p>

          <button
            onClick={() => setViewMode((prev) => (prev === 'month' ? 'year' : 'month'))}
            className="relative h-[48px] w-[94px] cursor-pointer"
          >
            <div className="absolute inset-0 bg-[#D9D9D9] rounded-full" />
            <div
              className="absolute top-[7px] h-[34px] w-[34px] transition-all duration-200"
              style={{ left: viewMode === 'month' ? '53px' : '7px' }}
            >
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 36">
                <ellipse cx="18.5" cy="18" fill="#404C92" rx="18.5" ry="18" />
              </svg>
            </div>
          </button>
        </div>

        {viewMode === 'month' ? (
          <>
            <p className="absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold h-[29px] leading-[normal] left-[32px] not-italic text-[#f5f5f5] text-[25px] top-[252px] w-[409px]">
              % Emissions
            </p>

            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => (
              <p
                key={month}
                className="-translate-x-full absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-[normal] left-[83px] not-italic text-[#f5f5f5] text-[25px] text-right w-[56px]"
                style={{ top: `${294 + idx * 32}px` }}
              >
                {month}
              </p>
            ))}

            {Array.from({ length: 12 }).map((_, monthIdx) => {
              const topPosition = 294 + monthIdx * 32;
              const currentLeft = 99;

              return (
                <div key={monthIdx}>
                  <div className="absolute bg-[#5cc0e6] h-[27px]" style={{ left: `${currentLeft}px`, top: `${topPosition}px`, width: `${productionWidth * 0.1}px` }} />
                  <div className="absolute bg-[#ffd166] h-[27px]" style={{ left: `${currentLeft + productionWidth * 0.1}px`, top: `${topPosition}px`, width: `${transportWidth * 0.1}px` }} />
                  <div className="absolute bg-[#ef476f] h-[27px]" style={{ left: `${currentLeft + productionWidth * 0.1 + transportWidth * 0.1}px`, top: `${topPosition}px`, width: `${processingWidth * 0.1}px` }} />
                  <div className="absolute bg-[#9b7dff] h-[27px]" style={{ left: `${currentLeft + productionWidth * 0.1 + transportWidth * 0.1 + processingWidth * 0.1}px`, top: `${topPosition}px`, width: `${cookingWidth * 0.1}px` }} />
                  <div className="absolute bg-[#ff7a59] h-[27px]" style={{ left: `${currentLeft + productionWidth * 0.1 + transportWidth * 0.1 + processingWidth * 0.1 + cookingWidth * 0.1}px`, top: `${topPosition}px`, width: `${refrigerationWidth * 0.1}px` }} />
                </div>
              );
            })}

            <div className="absolute bg-[#f5f5f5] h-[5px] left-[34px] top-[282px] w-[calc(100%-68px)]" />
          </>
        ) : (
          <>
            <p className="absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold h-[60px] leading-[normal] left-[34px] not-italic text-[#f5f5f5] text-[30px] top-[276px] w-[700px]">
              {impacts.totalImpact.toFixed(5)} kg CO2 per unit produced
            </p>

            <p className="absolute font-['Inter:Regular',sans-serif] font-normal h-[60px] leading-[normal] left-[34px] not-italic text-[#f5f5f5] text-[50px] top-[725px] w-[616px]">
              {MONTHS[currentMonth]}
            </p>

            <div className="absolute bg-[#5cc0e6] h-[327px] left-[37px] top-[370px]" style={{ width: `${productionWidth}px` }} />
            <p className="absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold h-[50px] leading-[normal] left-[54px] not-italic text-[#404c92] text-[30px] top-[381px] w-[190px]">Production</p>
            <p className="absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold h-[50px] leading-[normal] left-[54px] not-italic text-[#404c92] text-[30px] top-[419px] w-[190px]">{impacts.productionPct}%</p>

            <div className="absolute bg-[#ffd166] h-[327px] top-[370px]" style={{ left: `${37 + productionWidth}px`, width: `${transportWidth}px` }} />
            <p className="absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold h-[50px] leading-[normal] not-italic text-[#404c92] text-[30px] top-[381px] w-[190px]" style={{ left: `${54 + productionWidth}px` }}>Transport</p>
            <p className="absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold h-[50px] leading-[normal] not-italic text-[#404c92] text-[30px] top-[419px] w-[190px]" style={{ left: `${54 + productionWidth}px` }}>{impacts.transportPct}%</p>

            <div className="absolute bg-[#ef476f] h-[327px] top-[370px]" style={{ left: `${37 + productionWidth + transportWidth}px`, width: `${processingWidth + cookingWidth + refrigerationWidth}px` }} />

            <div className="absolute bg-[#d9d9d9] h-[17px] left-[37px] rounded-[2px] top-[834px] w-[calc(100%-74px)]" />
            {Array.from({ length: 12 }).map((_, idx) => (
              <div key={idx} className="absolute bg-[#898989] h-[17px] w-[5px] top-[834px]" style={{ left: `${101 + idx * 67}px` }} />
            ))}

            <input
              type="range"
              min="0"
              max="11"
              value={currentMonth}
              onChange={(e) => setCurrentMonth(parseInt(e.target.value, 10))}
              className="absolute left-[37px] top-[807px] w-[calc(100%-74px)] h-[68px] opacity-0 cursor-pointer z-10"
            />

            <div
              className="absolute bg-[#97a6f8] h-[68px] rounded-[8px] top-[807px] w-[67px] pointer-events-none"
              style={{ left: `${37 + currentMonth * 67}px` }}
            />
          </>
        )}

        <p className="absolute font-['Inter:Extra_Bold',sans-serif] font-extrabold h-[49px] leading-[normal] left-[52px] not-italic text-[#f5f5f5] text-[34px] top-[700px] w-[780px]">
          Primary Threat: {food.primaryThreat || 'Market volatility'}
        </p>
      </div>
    </div>
  );
}

export function Scene8({ currentScene = 7, totalScenes = 9, enteredFoods = [] }: Scene8Props) {
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

  const foods = useMemo<Scene8Food[]>(() => {
    const normalized = enteredFoods
      .map((name) => getFoodByName(name))
      .filter((food): food is NonNullable<ReturnType<typeof getFoodByName>> => Boolean(food))
      .map((food) => ({
        ...food,
        lifecycleImpacts: DEFAULT_IMPACTS,
      }));

    if (normalized.length > 0) {
      return normalized;
    }

    return DEFAULT_FOOD_IDS.map((name) => getFoodByName(name))
      .filter((food): food is NonNullable<ReturnType<typeof getFoodByName>> => Boolean(food))
      .map((food) => ({
        ...food,
        lifecycleImpacts: DEFAULT_IMPACTS,
      }));
  }, [enteredFoods]);

  const emitActiveIndex = (newIndex: number, totalItems: number) => {
    if (newIndex < 0 || newIndex >= totalItems) return;
    setActiveIndex(newIndex);
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
      const boundedIndex = clamp(index, 0, Math.max(foods.length - 1, 0));
      const targetLeft = clamp(baseOffset + boundedIndex * stride, 0, maxLeft);

      isSnappingRef.current = true;
      container.scrollTo({ left: targetLeft, behavior: 'smooth' });

      emitActiveIndex(boundedIndex, foods.length);
      updateProgress(boundedIndex);

      if (snapLockTimeoutRef.current) clearTimeout(snapLockTimeoutRef.current);
      snapLockTimeoutRef.current = setTimeout(() => {
        isSnappingRef.current = false;
      }, SNAP_LOCK_MS);
    };

    const calculateTargetIndex = (rawIndex: number) => {
      const velocity = velocityRef.current;
      const projectedIndex = rawIndex + clamp(velocity * 0.22, -0.35, 0.35);
      const boundedProjected = clamp(projectedIndex, 0, Math.max(foods.length - 1, 0));
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
      emitActiveIndex(nearestIndex, foods.length);
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
      Math.max(foods.length - 1, 0),
    );

    emitActiveIndex(startingIndex, foods.length);
    setScrollProgress(startingIndex);

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      if (snapLockTimeoutRef.current) clearTimeout(snapLockTimeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [foods.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { baseOffset, stride, maxLeft } = getScrollMetrics(container);
    const bounded = clamp(activeIndex, 0, Math.max(foods.length - 1, 0));
    const targetLeft = clamp(baseOffset + bounded * stride, 0, maxLeft);
    container.scrollTo({ left: targetLeft, behavior: 'auto' });
    setScrollProgress(bounded);
  }, [foods.length]);

  return (
    <div className="w-full h-full relative overflow-visible bg-[#2ea3bd]" data-name="Scene 8">
      <PersonSlice79
        slice="middle"
        foods={foods.map((food) => food.name)}
        zIndex={8}
      />

      <div
        ref={scrollContainerRef}
        data-scroll-cards
        className="absolute top-0 bottom-0 right-0 flex items-center overflow-x-auto"
        style={{
          left: '45vw',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingLeft: '0.8vw',
          paddingRight: '2.4vw',
          gap: '1.2vw',
          zIndex: 20,
        }}
      >
        <style>{`
          [data-name="Scene 8"] [data-scroll-cards]::-webkit-scrollbar {
            display: none;
          }

          [data-name="Scene 8"] [data-scroll-cards] {
            -webkit-overflow-scrolling: touch;
            scroll-snap-stop: always;
          }
        `}</style>

        {foods.map((food, index) => {
          const stackDistance = clamp(index - scrollProgress, -2.5, 2.5);
          const depth = Math.abs(stackDistance);
          const cardScale = 1 - depth * 0.08;
          const cardRotate = stackDistance * -6;
          const cardX = stackDistance * 34;
          const cardY = depth * 18;
          const cardOpacity = 1 - depth * 0.2;

          return (
            <div
              key={food.id}
              data-scroll-card
              className="flex-shrink-0"
              style={{
                scrollSnapAlign: 'start',
                width: '48vw',
                height: '84vh',
                padding: '0.45vw',
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
                className="relative w-full h-full"
                style={{ transformOrigin: 'center center' }}
              >
                <Scene8Panel food={food} />
              </motion.div>
            </div>
          );
        })}

        <div aria-hidden className="flex-shrink-0" style={{ width: '10vw', height: '1px' }} />
      </div>

      <SceneProgressIndicator totalScenes={totalScenes} currentScene={currentScene} />
    </div>
  );
}
