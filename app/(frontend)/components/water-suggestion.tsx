'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Droplet, Clock, Thermometer, Award } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface WaterSuggestionProps {
  percentage: number;
  temperature: number;
  lastDrink: Date | null;
}

export function WaterSuggestion({ percentage, temperature, lastDrink }: WaterSuggestionProps) {
  // Generate a suggestion based on the current state
  const getSuggestion = () => {
    if (percentage >= 100) {
      return {
        icon: <Award className="h-5 w-5" />,
        message: "Great job! You've reached your water goal for today.",
        color: 'bg-tertiary',
      };
    }

    if (percentage < 30) {
      return {
        icon: <Droplet className="h-5 w-5" />,
        message: `You're only at ${percentage}% of your goal. Time to hydrate!`,
        color: 'bg-blue-500/10',
      };
    }

    if (temperature > 25) {
      return {
        icon: <Thermometer className="h-5 w-5" />,
        message: "It's warm today! Consider drinking more water.",
        color: 'bg-quaternary',
      };
    }

    if (lastDrink && new Date().getTime() - lastDrink.getTime() > 2 * 60 * 60 * 1000) {
      return {
        icon: <Clock className="h-5 w-5 text-purple-500" />,
        message: `It's been ${formatDistanceToNow(lastDrink)} since your last drink. Time for a sip?`,
        color: 'bg-purple-500/10 text-purple-700',
      };
    }

    return {
      icon: <Droplet className="h-5 w-5 text-blue-500" />,
      message: `You're ${percentage}% there! Keep going to reach your hydration goal.`,
      color: 'bg-blue-500/10 text-blue-700',
    };
  };

  const suggestion = getSuggestion();

  return (
    <Card className="mb-6">
      <CardContent className={`p-4 ${suggestion.color} rounded-lg flex items-center gap-3`}>
        {suggestion.icon}
        <p className="text-balanced text-primary">{suggestion.message}</p>
      </CardContent>
    </Card>
  );
}
