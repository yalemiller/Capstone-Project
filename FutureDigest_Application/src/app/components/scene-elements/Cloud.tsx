/**
 * Reusable Cloud component
 * Simple, stylized cloud design
 */

import { memo } from 'react';
import { motion } from 'motion/react';

interface CloudProps {
  left: string;
  top: string;
  delay?: number;
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: { width: '120px', height: '60px', scale: 0.8 },
  medium: { width: '160px', height: '80px', scale: 1 },
  large: { width: '200px', height: '100px', scale: 1.2 },
};

export const Cloud = memo(function Cloud({ 
  left, 
  top, 
  delay = 0,
  size = 'medium' 
}: CloudProps) {
  const { width, height, scale } = sizeMap[size];

  return (
    <motion.div
      className="absolute"
      style={{
        left,
        top,
        width,
        height,
      }}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 0.7, x: 0 }}
      transition={{ 
        duration: 1.2, 
        delay,
        ease: 'easeOut' 
      }}
    >
      <svg
        className="absolute block size-full"
        fill="none"
        viewBox="0 0 200 100"
        style={{ transform: `scale(${scale})` }}
      >
        {/* Simple cloud shape using circles */}
        <ellipse cx="50" cy="60" rx="35" ry="30" fill="white" opacity="0.8" />
        <ellipse cx="90" cy="55" rx="45" ry="35" fill="white" opacity="0.8" />
        <ellipse cx="130" cy="60" rx="40" ry="32" fill="white" opacity="0.8" />
        <ellipse cx="100" cy="70" rx="60" ry="25" fill="white" opacity="0.8" />
      </svg>
    </motion.div>
  );
});
