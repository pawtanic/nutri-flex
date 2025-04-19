'use client';

import { Droplet } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface CircularWaterTrackerProps {
  percentage: number;
  current: number;
  goal: number;
}

export function CircularWaterTracker({ percentage, current, goal }: CircularWaterTrackerProps) {
  // Calculate the circle's properties
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Calculate water in ml
  const currentMl = current * 250;
  const goalMl = goal * 250;

  // Animation refs
  const waveRef = useRef<SVGPathElement>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Set up water wave animation on component mount and when percentage changes
  useEffect(() => {
    // Create style element if it doesn't exist
    if (!styleRef.current) {
      styleRef.current = document.createElement('style');
      document.head.appendChild(styleRef.current);
    }

    // Calculate water level based on percentage (inverted - higher percentage means more water)
    // 180 is viewBox height, we want to go from bottom (180) to top (0)
    const waterLevel = 180 - (percentage / 100) * 180;

    // Define keyframes for wave animation
    const keyframes = `
      @keyframes waveAnimation {
        0% {
          d: path('M-20,${waterLevel} C20,${waterLevel - 10} 60,${waterLevel + 10} 100,${waterLevel} C140,${waterLevel - 10} 180,${waterLevel + 10} 220,${waterLevel} L220,200 L-20,200 Z');
        }
        50% {
          d: path('M-20,${waterLevel} C20,${waterLevel + 10} 60,${waterLevel - 10} 100,${waterLevel} C140,${waterLevel + 10} 180,${waterLevel - 10} 220,${waterLevel} L220,200 L-20,200 Z');
        }
        100% {
          d: path('M-20,${waterLevel} C20,${waterLevel - 10} 60,${waterLevel + 10} 100,${waterLevel} C140,${waterLevel - 10} 180,${waterLevel + 10} 220,${waterLevel} L220,200 L-20,200 Z');
        }
      }
    `;

    styleRef.current.innerHTML = keyframes;

    // Apply the animation to the wave
    if (waveRef.current) {
      // Set initial wave shape
      waveRef.current.setAttribute(
        'd',
        `M-20,${waterLevel} C20,${waterLevel - 10} 60,${waterLevel + 10} 100,${waterLevel} C140,${waterLevel - 10} 180,${waterLevel + 10} 220,${waterLevel} L220,200 L-20,200 Z`
      );

      // Apply animation
      waveRef.current.style.animation = 'waveAnimation 4s ease-in-out infinite';
    }

    return () => {
      // Clean up only when component unmounts
      if (styleRef.current && !percentage) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, [percentage]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-64 h-64">
        {/* SVG with clip path for the water animation */}
        <svg className="w-full h-full" viewBox="0 0 180 180">
          {/* Define clip path for the water */}
          <defs>
            <clipPath id="circleClip">
              <circle cx="90" cy="90" r={radius} />
            </clipPath>
          </defs>

          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Water filling with wave effect */}
          <g clipPath="url(#circleClip)">
            <path
              ref={waveRef}
              fill="rgba(59, 130, 246, 0.3)"
              style={{
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
            {/* Additional overlay for a more watery look */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="rgba(59, 130, 246, 0.05)"
              style={{
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </g>

          {/* Progress circle */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="rgb(59, 130, 246)" // blue-500
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 90 90)"
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease-in-out',
            }}
          />
        </svg>

        {/* Content in the center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Droplet className="h-10 w-10 text-blue-500 mb-2" />
          <div className="text-4xl font-bold">
            {current}/{goal}
          </div>
          <div className="text-sm text-muted-foreground">glasses</div>
          <div className="text-sm mt-1">
            {currentMl} / {goalMl} ml
          </div>
        </div>
      </div>

      <div className="mt-2 text-center">
        <div className="text-sm font-medium">{percentage}% of daily goal</div>
      </div>
    </div>
  );
}
