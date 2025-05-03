'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Dumbbell } from 'lucide-react';
import { Exercise } from '@/app/(frontend)/api/public-api';
import { capitalize, getDifficultyColor } from '@/app/(frontend)/utils/helpers';
import { AuthRequiredButton } from '@/components/common/auth-button/auth-button';

interface ExerciseDetailProps {
  exercise: Exercise;
  onBack: () => void;
  onAddExercise: (exercise: Exercise) => void;
}

export function ExerciseDetail({ exercise, onBack, onAddExercise }: ExerciseDetailProps) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" className="pl-0" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to exercises
      </Button>

      <Card className="shadow-md">
        <CardContent className="p-4 space-y-4">
          <div>
            <h3 className="text-xl font-bold">{exercise.name}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className={getDifficultyColor(exercise.difficulty)}>
                {capitalize(exercise.difficulty)}
              </Badge>

              <Badge variant="outline">
                {exercise.equipment === 'barbell' || exercise.equipment === 'dumbbell' ? (
                  <Dumbbell className="h-4 w-4 mr-1" />
                ) : (
                  ''
                )}
                {capitalize(exercise.equipment)}
              </Badge>

              <Badge variant="outline">{capitalize(exercise.type)}</Badge>
            </div>
          </div>

          <hr />

          <div>
            <h4 className="font-medium mb-2">Instructions</h4>
            <p className="text-muted-foreground whitespace-pre-line">{exercise.instructions}</p>
          </div>
          <AuthRequiredButton
            loadingText="Saving..."
            successMessageText="Exercise saved successfully!"
            successMessageDescription="You can now view your added exercise in the 'Workouts' page."
            errorMessageText="Failed to save exercise. Please try again."
            className="w-full"
            onAuthenticatedClick={() => onAddExercise(exercise)}
          >
            Add This Exercise
          </AuthRequiredButton>
        </CardContent>
      </Card>
    </div>
  );
}
