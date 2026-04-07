/**
 * Reusable Moon component for night scenes
 * Simple crescent moon design
 */

import { memo } from 'react';
import { motion } from 'motion/react';

interface MoonProps {
  left: string;
  top: string;
}

export const Moon = memo(function Moon({ left, top }: MoonProps) {
  return (
    <motion.div
      className="absolute"
      style={{
        left,
        top,
        width: '150px',
        height: '150px',
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <svg
        className="absolute block size-full"
        fill="none"
        viewBox="0 0 150 150"
      >
        {/* Full moon circle */}
        <circle
          cx="75"
          cy="75"
          r="70"
          fill="#F4F4D0"
          opacity="0.95"
        />
        {/* Craters for detail */}
        <circle cx="55" cy="55" r="12" fill="#E8E8C0" opacity="0.4" />
        <circle cx="85" cy="70" r="8" fill="#E8E8C0" opacity="0.3" />
        <circle cx="65" cy="90" r="10" fill="#E8E8C0" opacity="0.35" />
      </svg>
    </motion.div>
  );
});
