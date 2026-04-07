import { memo } from 'react';

interface SceneProgressIndicatorProps {
  totalScenes: number;
  currentScene: number;
}

export const SceneProgressIndicator = memo(function SceneProgressIndicator({ 
  totalScenes, 
  currentScene 
}: SceneProgressIndicatorProps) {
  return (
    <div 
      className="fixed left-[37px] top-[364px] bg-[#d2d2d2] rounded-[47px] z-50"
      style={{
        height: `${totalScenes * 40 + 31}px`,
        width: '74px',
      }}
    >
      {Array.from({ length: totalScenes }, (_, i) => (
        <div
          key={i}
          className="absolute left-1/2 -translate-x-1/2 size-[30px]"
          style={{ top: `${19 + i * 40}px` }}
        >
          <svg
            className="absolute block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 30 30"
          >
            <circle
              cx="15"
              cy="15"
              fill={i === currentScene ? 'white' : '#8A8A8A'}
              r="15"
            />
          </svg>
        </div>
      ))}
    </div>
  );
});