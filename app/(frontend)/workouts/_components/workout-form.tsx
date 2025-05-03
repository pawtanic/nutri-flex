import { Wrapper } from '@/components/layout/Wrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BicepsFlexed, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AuthRequiredButton } from '@/components/common/auth-button/auth-button';
import { ExerciseSchema } from '@/app/(frontend)/workouts/_schemas/exercise-schema';
import { useActionState } from 'react';
import { addExercisesAction } from '@/app/(frontend)/workouts/_actions/add-exercises-action';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { ActionResponse } from '@/app/(frontend)/types/common-types';

export type Exercise = Omit<ExerciseSchema, 'workoutName'>;

interface WorkoutFormProps {
  exercises: Exercise[];
  setExercises: (exercises: Exercise[]) => void;
}

const initialState: ActionResponse = {
  errors: [],
  message: '',
  success: false,
};

export function WorkoutForm({ exercises, setExercises }: WorkoutFormProps) {
  const [state, action, isPending] = useActionState(addExercisesAction, initialState);

  const addExercise = () => {
    setExercises([...exercises, { exerciseName: '', sets: 1, reps: 1 }]);
  };

  const removeExercise = (index: number) => {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
  };

  const [workoutNameError] = state.errors[0]?.workoutName || [];

  return (
    <Wrapper>
      <form action={action} className="space-y-6">
        <div>
          <Label htmlFor="workout-name">Workout Name</Label>
          <Input
            id="workout-name"
            name="workoutName"
            placeholder="e.g., Upper Body, Leg Day"
            className="mt-1"
            aria-invalid={!!workoutNameError}
          />
          {/* component*/}
          {workoutNameError && <FormErrorMessage errorMessages={workoutNameError} />}
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Exercises</Label>
            <Button type="button" size="sm" onClick={addExercise}>
              <Plus className="h-4 w-4 mr-1" />
              Add Exercise
            </Button>
          </div>
          {exercises.length === 0 && (
            <>
              <BicepsFlexed className="h-12 w-12 text-muted-foreground mx-auto mt-6 mb-2" />
              <p className="text-muted-foreground">
                No exercises added yet. Click the &apos;Add Exercise&apos; button to start building
                your workout routine.
              </p>
            </>
          )}
          {exercises.map((exercise, index) => {
            const exerciseErrors = state.errors[index];
            const [exerciseNameError] = exerciseErrors?.exerciseName || [];
            const [repsError] = exerciseErrors?.reps || [];
            const [setsError] = exerciseErrors?.sets || [];

            return (
              <Card key={index} className="mb-3">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-[1fr,auto] gap-2">
                    <Input
                      placeholder="Exercise name"
                      name="exerciseName"
                      value={exercise.exerciseName}
                      onChange={e => updateExercise(index, 'exerciseName', e.target.value)}
                      aria-invalid={!!exerciseNameError}
                    />
                    <Button
                      variant="ghost"
                      onClick={() => removeExercise(index)}
                      disabled={exercises.length === 1}
                    >
                      <Trash2
                        style={{ width: '24px', height: '24px' }}
                        aria-label="Remove exercise from workout"
                      />
                    </Button>
                    {exerciseNameError && <FormErrorMessage errorMessages={exerciseNameError} />}
                    <div className="col-span-2 grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <Label htmlFor={`sets-${index}`} className="text-xs">
                          Sets
                        </Label>
                        <Input
                          id={`sets-${index}`}
                          name={`sets-${index}`}
                          type="number"
                          placeholder="Sets"
                          value={exercise.sets}
                          onChange={e => updateExercise(index, 'sets', e.target.value)}
                        />
                        {setsError && <FormErrorMessage errorMessages={setsError} />}
                      </div>
                      <div>
                        <Label htmlFor={`reps-${index}`} className="text-xs">
                          Reps
                        </Label>
                        <Input
                          id={`reps-${index}`}
                          name={`reps-${index}`}
                          type="number"
                          placeholder="Reps"
                          value={exercise.reps}
                          onChange={e => updateExercise(index, 'reps', e.target.value)}
                        />
                        {repsError && <FormErrorMessage errorMessages={repsError} />}
                        {/*HACK for now to pass exercises array to Form Data*/}
                        <input type="hidden" name="exercises" value={JSON.stringify(exercises)} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {!state.success && state.message && <WarningAlert description={state.message} />}
        <AuthRequiredButton
          loadingText="Saving workout..."
          successMessageText="Workout saved successfully!"
          successMessageDescription="You can now view your added workout in the 'Workouts' page."
          errorMessageText="Failed to save workout. Please try again."
          className="w-full"
          onAuthenticatedClick={() => console.log('save')}
          disabled={isPending}
        >
          Save Workout
        </AuthRequiredButton>
      </form>
    </Wrapper>
  );
}
