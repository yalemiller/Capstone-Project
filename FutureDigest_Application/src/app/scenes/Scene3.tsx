import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SceneProgressIndicator } from '../components/SceneProgressIndicator';
import { Sun, Ground, GradientBackground } from '../components/scene-elements';
import { validateFoodName, getAllFoodNames } from '../utils/foodValidation';
import { errorFlashAnimation } from '../animations/variants';
import { SCENE_3_STEPS, SCENE_3_CONFIG, VALIDATION, TOTAL_SCENES } from '../constants';

export function Scene3({ currentScene = 2, totalScenes = 8, onComplete, onFoodsEntered, onSkyGradientChange }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [enteredFoods, setEnteredFoods] = useState([]);
  const [showError, setShowError] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const inputRef = useRef(null);

  const currentStepData = SCENE_3_STEPS[currentStep];
  const finalStepData = SCENE_3_STEPS[SCENE_3_STEPS.length - 1];

  // Get all food names for examples (memoized to prevent re-creation on every render)
  const allFoods = useMemo(() => getAllFoodNames(), []);

  // Generate dynamic helper text with randomized food examples that update per step
  const helperText = useMemo(() => {
    const shuffled = [...allFoods].sort(() => Math.random() - 0.5);
    const examples = shuffled.slice(0, 3).join(', ');
    return `Try entering foods like ${examples}`;
  }, [currentStep, allFoods]);

  // ✅ NEW: color logic
  const isDarkBlueStep = currentStep === 1 || currentStep === 2;

  // Keep shared sky background in sync with feeding progression.
  useEffect(() => {
    if (!onSkyGradientChange) return;
    onSkyGradientChange(isComplete ? finalStepData.gradient : currentStepData.gradient);
  }, [currentStepData.gradient, finalStepData.gradient, isComplete, onSkyGradientChange]);

  useEffect(() => {
    if (inputRef.current && !isComplete) {
      inputRef.current.focus();
    }
  }, [currentStep, isComplete]);

  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  useEffect(() => {
    if (onFoodsEntered && enteredFoods.length > 0) {
      onFoodsEntered(enteredFoods);
    }
  }, [enteredFoods, onFoodsEntered]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    const trimmedInput = inputValue.trim();
    const isDuplicate = enteredFoods.some(food => food.toLowerCase() === trimmedInput.toLowerCase());
    const isValid = validateFoodName(trimmedInput);

    if (isValid && !isDuplicate) {
      const newFoods = [...enteredFoods, trimmedInput];
      setEnteredFoods(newFoods);
      setInputValue('');
      
      if (currentStep === SCENE_3_STEPS.length - 1) {
        setTimeout(() => setIsComplete(true), 500);
      } else {
        setTimeout(() => setCurrentStep(currentStep + 1), 500);
      }
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), VALIDATION.errorFlashDuration);
    }
  };

  return (
    <div className="bg-white relative size-full overflow-hidden" data-name="Scene 3">

      <GradientBackground 
        gradient={isComplete ? finalStepData.gradient : currentStepData.gradient}
        animate
        backgroundSize="100% 300%"
        backgroundPosition="50% 100%"
      />

      {!isComplete && currentStep === 0 && (
        <div
          className="absolute left-0 top-0 w-full pointer-events-none"
          style={{
            height: '32vh',
            background: 'linear-gradient(180deg, rgba(46, 163, 189, 1) 0%, rgba(46, 163, 189, 0) 100%)',
          }}
        />
      )}

      <AnimatePresence>
        {showError && (
          <motion.div
            {...errorFlashAnimation}
            className="absolute inset-0 bg-red-600 z-40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* <Sun ... /> */}

      <Ground />

      <AnimatePresence>
        {!isComplete && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>

            {/* Prompt */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`prompt-${currentStep}`}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.45 }}
                className={`absolute font-bold ${
                  isDarkBlueStep ? 'text-[#1e3a8a]' : 'text-[#fae850]'
                }`}
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

            {/* Input */}
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
                className={`w-full bg-transparent border-none outline-none font-bold pb-[10px] ${
                  isDarkBlueStep ? 'text-[#1e3a8a]' : 'text-[#fae850]'
                }`}
                style={{ fontSize: 'clamp(18px, 2.1vw, 40px)' }}
              />
              <div className="bg-[#d9d9d9] h-[8px] w-full" />
            </form>

            {/* Helper */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`helper-${currentStep}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4 }}
                className={`absolute font-bold ${
                  isDarkBlueStep ? 'text-[#1e3a8a]' : 'text-[#fae850]'
                }`}
                style={{
                  left: '10vw',
                  top: '53vh',
                  width: '44vw',
                  fontSize: 'clamp(10px, 1vw, 20px)',
                }}
              >
                {helperText}
              </motion.p>
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute font-bold text-[#fae850]"
            style={{
              left: '10vw',
              top: '36vh',
              width: '44vw',
              fontSize: 'clamp(22px, 2.9vw, 55px)',
            }}
          >
            <p>{SCENE_3_CONFIG.completionText.line1}</p>
            <p>{SCENE_3_CONFIG.completionText.line2}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <SceneProgressIndicator currentScene={currentScene} totalScenes={TOTAL_SCENES} />

    </div>
  );
}