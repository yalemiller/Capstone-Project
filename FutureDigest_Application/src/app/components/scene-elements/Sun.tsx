/**
 * Reusable Sun component for scenes
 * Supports animated positioning with arc path animation
 */

import { memo } from 'react';
import { motion } from 'motion/react';
import { COLORS, DIMENSIONS } from '../../constants';

interface SunProps {
  left: string;
  top: string;
  animate?: boolean;
  transition?: object;
}

export const Sun = memo(function Sun({ left, top, animate = false, transition }: SunProps) {
  const Component = animate ? motion.div : 'div';

  return (
    <Component
      className="absolute"
      style={{
        left,
        top,
        width: DIMENSIONS.sun.size,
        height: DIMENSIONS.sun.size,
      }}
      {...(animate && { 
        animate: { left, top },
        transition: transition || { 
          duration: 1.5, 
          ease: [0.43, 0.13, 0.23, 0.96] // Custom easing for smooth arc
        }
      })}
    >
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 305 305"
      >
        <circle
          cx={DIMENSIONS.sun.radius}
          cy={DIMENSIONS.sun.radius}
          fill={COLORS.sunYellow}
          r={DIMENSIONS.sun.radius}
        />
        {/* Sun rays for more detail */}
        <g opacity="0.6">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1={DIMENSIONS.sun.radius}
              y1={DIMENSIONS.sun.radius}
              x2={
                DIMENSIONS.sun.radius +
                Math.cos((angle * Math.PI) / 180) * (DIMENSIONS.sun.radius + 20)
              }
              y2={
                DIMENSIONS.sun.radius +
                Math.sin((angle * Math.PI) / 180) * (DIMENSIONS.sun.radius + 20)
              }
              stroke={COLORS.sunYellow}
              strokeWidth="8"
              strokeLinecap="round"
            />
          ))}
        </g>
      </svg>
    </Component>
  );
});
