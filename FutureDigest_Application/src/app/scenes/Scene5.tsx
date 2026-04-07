import { useMemo } from 'react';
import imgReceipt1 from "../../assets/9c3dc63f059e5edf6e5cd9ea26c689682b0147c6.png";
import { SceneProgressIndicator } from '../components/SceneProgressIndicator';
import { appContent } from '../data/appContent';

const OVERLAP_COMPLETE_PROGRESS = 5.02;
const RECEIPT_ENTRY_START = 3.55;
const RECEIPT_PIN_START = 4.02;
const RECEIPT_VACUUM_START = 4.72;
const RECEIPT_VACUUM_END = OVERLAP_COMPLETE_PROGRESS;

export function Scene5({ currentScene = 4, totalScenes = 8, scrollProgress = 4 }) {
  // Text opacity based on scroll progress - smooth fade in/out
  // Scene 5 = scrollProgress 4. Fade in from 3.5→4, fade out from 4.5→5
  const textOpacity = useMemo(() => {
    if (scrollProgress < 3.5) return 0;
    if (scrollProgress < 4) return (scrollProgress - 3.5) / 0.5;
    if (scrollProgress <= 4.5) return 1;
    if (scrollProgress < 5) return 1 - (scrollProgress - 4.5) / 0.5;
    return 0;
  }, [scrollProgress]);

  // During the Scene 5 -> 6 handoff, keep the receipt fixed and vacuum it into the bag area.
  const receiptVacuumProgress = useMemo(() => {
    if (scrollProgress <= RECEIPT_VACUUM_START) return 0;
    if (scrollProgress >= RECEIPT_VACUUM_END) return 1;
    return (scrollProgress - RECEIPT_VACUUM_START) / (RECEIPT_VACUUM_END - RECEIPT_VACUUM_START);
  }, [scrollProgress]);

  // Fade in during entry scroll phase
  const receiptEntryOpacity = useMemo(() => {
    if (scrollProgress < RECEIPT_ENTRY_START) return 0;
    if (scrollProgress <= RECEIPT_PIN_START) return (scrollProgress - RECEIPT_ENTRY_START) / (RECEIPT_PIN_START - RECEIPT_ENTRY_START);
    return 1;
  }, [scrollProgress]);

  const receiptOpacity = useMemo(() => {
    if (scrollProgress <= RECEIPT_PIN_START) return receiptEntryOpacity;
    if (scrollProgress <= RECEIPT_VACUUM_START) return 1;
    if (scrollProgress < OVERLAP_COMPLETE_PROGRESS) return 1 - (scrollProgress - RECEIPT_VACUUM_START) / (OVERLAP_COMPLETE_PROGRESS - RECEIPT_VACUUM_START);
    return 0;
  }, [scrollProgress, receiptEntryOpacity]);

  const shouldRenderReceipt = scrollProgress >= RECEIPT_ENTRY_START && scrollProgress < OVERLAP_COMPLETE_PROGRESS;
  const isEntryScrollPhase = scrollProgress < RECEIPT_PIN_START;

  return (
    <div className="bg-white relative size-full" data-name="Scene 5">
      {/* Light blue background */}
      <div className="absolute bg-[#c7e5f1] inset-0" />
      
      {/* Receipt image */}
      {shouldRenderReceipt && (
        <div 
          className={isEntryScrollPhase ? 'absolute' : 'fixed'}
          style={{
            right: '4vw',
            top: '1vh',
            width: '33vw',
            height: '100.3vh',
            opacity: receiptOpacity,
            transform: isEntryScrollPhase
              ? 'none'
              : `translateY(${receiptVacuumProgress * 12}vh) scale(${1 - receiptVacuumProgress * 0.78})`,
            transformOrigin: 'center center',
            zIndex: 8,
            pointerEvents: 'none',
            transition: isEntryScrollPhase ? 'opacity 0.08s linear' : 'opacity 0.1s linear',
          }}
          data-name="Receipt 1"
        >
          <img 
            alt="Receipt showing food items" 
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
            src={imgReceipt1} 
          />
        </div>
      )}
      
      {/* Main text - fades based on scroll */}
      <p 
        className="fixed font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic text-[#0f707f]"
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
        {appContent.scenes.scene5.headline}
      </p>
      
      {/* Price - fades based on scroll */}
      <p 
        className="fixed font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic text-[#0f707f]"
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
        {appContent.scenes.scene5.totalPrice}
      </p>

      {/* Scene progress indicator */}
      <SceneProgressIndicator 
        totalScenes={totalScenes} 
        currentScene={currentScene} 
      />
    </div>
  );
}
