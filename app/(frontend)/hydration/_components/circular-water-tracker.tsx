'use client';

import { Droplet, ThumbsUp } from 'lucide-react';
import React, { RefObject, useEffect, useRef } from 'react';

interface CircularWaterTrackerProps {
  percentage: number;
  waterIntake: number;
  goal: number;
  goalReached: boolean;
}

const getKeyFrames = (waterLevel: number): string => {
  return `
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
};

const calculateCircleProperties = (percentage: number) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return { radius, circumference, strokeDashoffset };
};

const getWavePathDefinition = (waterLevel: number): string =>
  `M-20,${waterLevel} C20,${waterLevel - 10} 60,${waterLevel + 10} 100,${waterLevel} C140,${waterLevel - 10} 180,${waterLevel + 10} 220,${waterLevel} L220,200 L-20,200 Z`;

const calculateWaterLevel = (percentage: number): number => {
  return 180 - (percentage / 100) * 180;
};

export function CircularWaterTracker({
  percentage,
  waterIntake,
  goal,
  goalReached,
}: CircularWaterTrackerProps) {
  const { radius, circumference, strokeDashoffset } = calculateCircleProperties(percentage);
  // Animation refs
  const waveRef = useRef<SVGPathElement>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Set up hydration wave animation on component mount and when percentage changes
  useEffect(() => {
    // Create style element if it doesn't exist
    if (!styleRef.current) {
      styleRef.current = document.createElement('style');
      document.head.appendChild(styleRef.current);
    }

    const waterLevel = calculateWaterLevel(percentage);

    // Define keyframes for wave animation
    styleRef.current.innerHTML = getKeyFrames(waterLevel);

    // Apply the animation to the wave
    if (waveRef.current) {
      // Set initial wave shape
      waveRef.current.setAttribute('d', getWavePathDefinition(waterLevel));

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
        <CircleWaveProgressBar
          waveRef={waveRef}
          radius={radius}
          circumference={circumference}
          strokeDashoffset={strokeDashoffset}
          goalReached={goalReached}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {goalReached ? (
            <ThumbsUp className="h-10 w-10 mb-2 text-protein" />
          ) : (
            <Droplet className="h-10 w-10 text-blue-500 mb-2" />
          )}
          <p className="text-2xl font-medium">
            {waterIntake}ml / {goal}ml
          </p>
          <p className="mt-1 text-lg">
            {(waterIntake / 1000).toFixed(1)}l / {(goal / 1000).toFixed(1)}l
          </p>
        </div>
      </div>
      <div className="mt-2 text-center">
        <p className="font-medium">{percentage ? `${percentage} % of daily goal` : ''}</p>
      </div>
    </div>
  );
}

function CircleWaveProgressBar({
  radius,
  circumference,
  strokeDashoffset,
  waveRef,
  goalReached,
}: {
  radius: number;
  circumference: number;
  strokeDashoffset: number;
  goalReached: boolean;
  waveRef: RefObject<SVGPathElement | null>;
}) {
  return (
    <svg className="w-full h-full" viewBox="0 0 180 180">
      <defs>
        <clipPath id="circleClip">
          <circle cx="90" cy="90" r={radius} />
        </clipPath>
      </defs>
      <circle
        cx="90"
        cy="90"
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <g clipPath="url(#circleClip)">
        <path
          ref={waveRef}
          fill={goalReached ? 'rgba(169, 244, 103, 0.5)' : 'rgba(59, 130, 246, 0.3)'}
          style={{
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
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
      <circle
        cx="90"
        cy="90"
        r={radius}
        fill="none"
        stroke={goalReached ? 'rgba(169, 244, 103, 1)' : '#3b82f6'}
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
  );
}
