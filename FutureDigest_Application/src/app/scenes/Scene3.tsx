import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneProgressIndicator } from '../components/SceneProgressIndicator';
import { Sun, Ground, GradientBackground } from '../components/scene-elements';
import { validateFoodName } from '../utils/foodValidation';
import { errorFlashAnimation } from '../animations/variants';
import { SCENE_3_STEPS, SCENE_3_CONFIG, VALIDATION } from '../constants';

export function Scene3({ currentScene = 2, totalScenes = 8, onComplete, onFoodsEntered, onSkyGradientChange }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [enteredFoods, setEnteredFoods] = useState([]);
  const [showError, setShowError] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef(null);

  const currentStepData = SCENE_3_STEPS[currentStep];
  const finalStepData = SCENE_3_STEPS[SCENE_3_STEPS.length - 1];

  // Keep shared sky background in sync with feeding progression.
  useEffect(() => {
    if (!onSkyGradientChange) return;
    onSkyGradientChange(isComplete ? finalStepData.gradient : currentStepData.gradient);
  }, [currentStepData.gradient, finalStepData.gradient, isComplete, onSkyGradientChange]);

  // Auto focus input when step changes
  useEffect(() => {
    if (inputRef.current && !isComplete) {
      inputRef.current.focus();
    }
  }, [currentStep, isComplete]);

  // Notify parent when complete to re-enable scrolling
  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  // Send foods to parent when foods change
  useEffect(() => {
    if (onFoodsEntered && enteredFoods.length > 0) {
      onFoodsEntered(enteredFoods);
    }
  }, [enteredFoods, onFoodsEntered]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    const isValid = validateFoodName(inputValue);

    if (isValid) {
      const newFoods = [...enteredFoods, inputValue.trim()];
      setEnteredFoods(newFoods);
      setInputValue('');
      
      if (currentStep === SCENE_3_STEPS.length - 1) {
        setTimeout(() => {
          setIsComplete(true);
        }, 500);
      } else {
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 500);
      }
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), VALIDATION.errorFlashDuration);
    }
  };

  return (
    <div className="bg-white relative size-full overflow-hidden" data-name="Scene 3">
      {/* Animated Background Gradient */}
      <GradientBackground 
        gradient={isComplete ? finalStepData.gradient : currentStepData.gradient}
        animate
        backgroundSize="100% 300%"
        backgroundPosition="50% 100%"
      />

      {/* Scene 3 step 0 only: blend Scene 2 turquoise into the top of this gradient */}
      {!isComplete && currentStep === 0 && (
        <div
          className="absolute left-0 top-0 w-full pointer-events-none"
          style={{
            height: '32vh',
            background: 'linear-gradient(180deg, rgba(46, 163, 189, 1) 0%, rgba(46, 163, 189, 0) 100%)',
          }}
        />
      )}

      {/* Error Flash Overlay */}
      <AnimatePresence>
        {showError && (
          <motion.div
            {...errorFlashAnimation}
            className="absolute inset-0 bg-red-600 z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Animated Sun */}
      <Sun
        left={isComplete ? finalStepData.sunPosition.left : currentStepData.sunPosition.left}
        top={isComplete ? finalStepData.sunPosition.top : currentStepData.sunPosition.top}
        animate
        transition={{ 
          duration: 1.8,
          ease: [0.43, 0.13, 0.23, 0.96]
        }}
      />

      {/* Green Ground */}
      <Ground />

      {/* Person image and food blocks are now rendered by ParallaxPerson overlay */}

      {/* Input Screen - Show when not complete */}
      <AnimatePresence>
        {!isComplete && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Prompt Text */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`prompt-${currentStep}`}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic text-[#fae850]"
                style={{
                  left: '10vw',
                  top: '24vh',
                  width: '44vw',
                  fontSize: 'clamp(22px, 2.9vw, 55px)',
                }}
              >
                {currentStepData.prompt}
              </motion.p>
            </AnimatePresence>

            {/* Input Form */}
            <form 
              onSubmit={handleSubmit} 
              className="absolute"
              style={{
                left: '10vw',
                top: '42vh',
                width: '37.5vw',
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-transparent border-none outline-none font-['Inter:Bold',sans-serif] font-bold text-[#fae850] pb-[10px]"
                style={{ fontSize: 'clamp(18px, 2.1vw, 40px)' }}
                placeholder=""
                autoComplete="off"
                autoFocus
              />
              <div className="bg-[#d9d9d9] h-[8px] w-full" />
            </form>

            {/* Helper Text */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`helper-${currentStep}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic text-[#fae850]"
                style={{
                  left: '10vw',
                  top: '47vh',
                  width: '44vw',
                  fontSize: 'clamp(10px, 1vw, 20px)',
                }}
              >
                {SCENE_3_CONFIG.helperText}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Screen */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[0] not-italic text-[#fae850]"
            style={{
              left: '10vw',
              top: '36vh',
              width: '44vw',
              fontSize: 'clamp(22px, 2.9vw, 55px)',
            }}
          >
            <p className="leading-[normal] mb-0">{SCENE_3_CONFIG.completionText.line1}</p>
            <p className="leading-[normal]">{SCENE_3_CONFIG.completionText.line2}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene progress indicator */}
      <SceneProgressIndicator 
        totalScenes={totalScenes} 
        currentScene={1}
      />
    </div>
  );
}
