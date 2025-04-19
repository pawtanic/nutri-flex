'use client';

import { Droplet } from 'lucide-react';

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

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-64 h-64">
        {/* Water wave animation (simplified) */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-blue-500/20 rounded-full"
          style={{
            height: `${percentage}%`,
            transition: 'height 0.5s ease-in-out',
            animation: 'waterWave 2s infinite ease-in-out',
          }}
        />

        {/* Background circle */}
        <svg className="w-full h-full" viewBox="0 0 180 180">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="12"
            strokeLinecap="round"
          />

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
