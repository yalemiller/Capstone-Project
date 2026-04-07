import { useMemo } from 'react';
import imgBag1 from "../../assets/161e525cc32e6c36fdb23b7da795dc9faee62f01.png";
import  { SceneProgressIndicator }  from '../components/SceneProgressIndicator';
import { appContent } from '../data/appContent';
import { formatCurrency, getSelectedFoodsCostTotals } from '../utils/dataHelpers';

export function Scene6({
  currentScene = 5,
  totalScenes = 8,
  scrollProgress = 5,
  enteredFoods = [],
  foods = [],
}) {
  const textOpacity = useMemo(() => {
    if (scrollProgress < 4.5) return 0;
    if (scrollProgress < 5) return (scrollProgress - 4.5) / 0.5;
    if (scrollProgress <= 5.5) return 1;
    if (scrollProgress < 6) return 1 - (scrollProgress - 5.5) / 0.5;
    return 0;
  }, [scrollProgress]);

  const bagRiseProgress = useMemo(() => {
    if (scrollProgress <= 4.58) return 0;
    if (scrollProgress >= 5.04) return 1;
    return (scrollProgress - 4.58) / 0.46;
  }, [scrollProgress]);

  const projectedTotalText = useMemo(() => {
    const { predictedTotal } = getSelectedFoodsCostTotals(enteredFoods, foods);
    return formatCurrency(predictedTotal);
  }, [enteredFoods, foods]);

  const increaseText = useMemo(() => {
    const { currentTotal, predictedTotal } = getSelectedFoodsCostTotals(enteredFoods, foods);

    if (currentTotal > 0 && predictedTotal > 0) {
      const increasePercentage = Math.round(
        ((predictedTotal - currentTotal) / currentTotal) * 100
      );
      return `${increasePercentage}% increase`;
    }

    return appContent.scenes.scene6.increaseText;
  }, [enteredFoods, foods]);

  return (
    <div className="bg-[#c7e5f1] relative size-full" data-name="Scene 6">
      <div className="absolute bg-[#c7e5f1] inset-0" />
      
      <div 
        className="absolute"
        style={{
          right: '2vw',
          top: '20.5vh',
          width: '36vw',
          height: '65.5vh',
          zIndex: 11,
          transform: `translateY(${(1 - bagRiseProgress) * 16}vh) scale(${0.92 + bagRiseProgress * 0.08})`,
          transformOrigin: 'bottom center',
          transition: 'transform 0.12s linear',
        }}
        data-name="Bag 1"
      >
        <img 
          alt="Grocery bag illustration" 
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
          src={imgBag1} 
        />
      </div>
      
      <p 
        className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic text-[#0f707f]"
        style={{
          left: '9.4vw',
          top: '20.7vh',
          width: '38.8vw',
          fontSize: 'clamp(22px, 2.9vw, 55px)',
          opacity: textOpacity,
          zIndex: 12,
          pointerEvents: 'none',
          transition: 'opacity 0.15s ease',
        }}
      >
        {appContent.scenes.scene6.headline}
      </p>
      
      <p 
        className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic text-[#0f707f]"
        style={{
          left: '9.4vw',
          top: '35.7vh',
          width: '47.2vw',
          fontSize: 'clamp(60px, 10.4vw, 200px)',
          opacity: textOpacity,
          zIndex: 12,
          pointerEvents: 'none',
          transition: 'opacity 0.15s ease',
        }}
      >
        {projectedTotalText}
      </p>
      
      <p 
        className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic text-[#0f707f]"
        style={{
          left: '9.4vw',
          top: '58.6vh',
          width: '38.8vw',
          fontSize: 'clamp(22px, 2.9vw, 55px)',
          opacity: textOpacity,
          zIndex: 12,
          pointerEvents: 'none',
          transition: 'opacity 0.15s ease',
        }}
      >
        {increaseText}
      </p>
      
      <div 
        className="absolute bg-[#2ea3bd]"
        style={{
          left: '-5.5vw',
          top: '84.7vh',
          width: '110vw',
          bottom: 0,
        }}
      />

      <SceneProgressIndicator 
        totalScenes={totalScenes} 
        currentScene={currentScene} 
      />
    </div>
  );
}