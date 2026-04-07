/**
 * Reusable Gradient Background component
 * Supports animated gradient transitions
 */

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { gradientTransition } from '../../animations/variants';

interface GradientBackgroundProps {
  gradient: string;
  animate?: boolean;
  backgroundSize?: string;
  backgroundPosition?: string;
}

export function GradientBackground({
  gradient,
  animate = false,
  backgroundSize,
  backgroundPosition,
}: GradientBackgroundProps) {
  const [baseGradient, setBaseGradient] = useState(gradient);
  const [incomingGradient, setIncomingGradient] = useState<string | null>(null);

  useEffect(() => {
    if (!animate) {
      setBaseGradient(gradient);
      setIncomingGradient(null);
      return;
    }

    if (gradient !== baseGradient) {
      setIncomingGradient(gradient);
    }
  }, [animate, gradient, baseGradient]);

  if (!animate) {
    return (
      <div
        className="absolute h-full left-0 top-0 w-full"
        style={{
          backgroundImage: gradient,
          backgroundSize,
          backgroundPosition,
        }}
      />
    );
  }

  return (
    <div className="absolute h-full left-0 top-0 w-full">
      <div
        className="absolute h-full left-0 top-0 w-full"
        style={{
          backgroundImage: baseGradient,
          backgroundSize,
          backgroundPosition,
        }}
      />

      {incomingGradient && (
        <motion.div
          className="absolute h-full left-0 top-0 w-full"
          style={{
            backgroundImage: incomingGradient,
            backgroundSize,
            backgroundPosition,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={gradientTransition.transition}
          onAnimationComplete={() => {
            setBaseGradient(incomingGradient);
            setIncomingGradient(null);
          }}
        />
      )}
    </div>
  );
}
