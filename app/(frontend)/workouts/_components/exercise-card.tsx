'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { ApiExercise } from '@/app/(frontend)/api/public-api';
import { getDifficultyColor } from '@/app/(frontend)/utils/helpers';

interface ExerciseCardProps {
  exercise: ApiExercise;
  onSelect: (exercise: ApiExercise) => void;
}

export function ExerciseCard({ exercise, onSelect }: ExerciseCardProps) {
  return (
    <Card className="cursor-pointer hover:bg-accent/50 transition-colors shadow">
      <CardContent
        className="p-3 flex items-center justify-between"
        onClick={() => onSelect(exercise)}
      >
        <div>
          <h3 className="font-medium">{exercise.name}</h3>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className={getDifficultyColor(exercise.difficulty)}>
              {exercise.difficulty}
            </Badge>
            <Badge variant="outline" className="bg-gray-100">
              {exercise.equipment.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground mr-2" />
      </CardContent>
    </Card>
  );
}
