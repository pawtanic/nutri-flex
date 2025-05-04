'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Dumbbell } from 'lucide-react';
import { ApiExercise } from '@/app/(frontend)/api/public-api';
import { ExerciseCard } from './exercise-card';

interface ExerciseListProps {
  exercises: ApiExercise[];
  isLoading: boolean;
  selectedMuscle: string;
  onSelectExerciseAction: (exercise: ApiExercise) => void;
}

export function ExerciseList({
  exercises,
  isLoading,
  selectedMuscle,
  onSelectExerciseAction,
}: ExerciseListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading exercises...</span>
      </div>
    );
  }

  if (exercises.length === 0 && selectedMuscle) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No exercises found for this muscle group</p>
      </div>
    );
  }

  if (!selectedMuscle) {
    return (
      <div className="text-center py-4">
        <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Select a muscle group to see exercises</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {exercises.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} onSelect={onSelectExerciseAction} />
        ))}
      </div>
    </ScrollArea>
  );
}
