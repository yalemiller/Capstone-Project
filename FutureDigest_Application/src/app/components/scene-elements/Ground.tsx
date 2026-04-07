/**
 * Reusable Ground component for scenes
 * Green elliptical ground element
 */

import { memo } from 'react';
import { COLORS, DIMENSIONS } from '../../constants';

export const Ground = memo(function Ground() {
  return (
    <div
      className="-translate-x-1/2 absolute left-1/2 top-[850px]"
      style={{
        height: DIMENSIONS.ground.height,
        width: DIMENSIONS.ground.width,
      }}
    >
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 2617 604"
      >
        <ellipse
          cx={DIMENSIONS.ground.radiusX}
          cy={DIMENSIONS.ground.radiusY}
          fill={COLORS.green}
          rx={DIMENSIONS.ground.radiusX}
          ry={DIMENSIONS.ground.radiusY}
        />
      </svg>
    </div>
  );
});