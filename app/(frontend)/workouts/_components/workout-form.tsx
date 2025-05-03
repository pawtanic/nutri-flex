import { Wrapper } from '@/components/layout/Wrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AuthRequiredButton } from '@/components/common/auth-button/auth-button';
import { Exercise } from '@/app/(frontend)/api/public-api';

interface WorkoutFormProps {
  exercises: Exercise[];
  setExercises: (exercises: Exercise[]) => void;
}

export function WorkoutForm({ exercises, setExercises }: WorkoutFormProps) {
  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '' }]);
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

  return (
    <Wrapper>
      <div className="space-y-6">
        <div>
          <Label htmlFor="workout-name">Workout Name</Label>
          <Input id="workout-name" placeholder="e.g., Upper Body, Leg Day" className="mt-1" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Exercises</Label>
            <Button variant="outline" size="sm" onClick={addExercise}>
              <Plus className="h-4 w-4 mr-1" />
              Add Exercise
            </Button>
          </div>
          {exercises.map((exercise, index) => (
            <Card key={index} className="mb-3">
              <CardContent className="pt-4">
                <div className="grid grid-cols-[1fr,auto] gap-3">
                  <Input
                    placeholder="Exercise name"
                    value={exercise.name}
                    onChange={e => updateExercise(index, 'name', e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExercise(index)}
                    disabled={exercises.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="col-span-2 grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <Label htmlFor={`sets-${index}`} className="text-xs">
                        Sets
                      </Label>
                      <Input
                        id={`sets-${index}`}
                        type="number"
                        placeholder="Sets"
                        value={exercise.sets}
                        onChange={e => updateExercise(index, 'sets', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`reps-${index}`} className="text-xs">
                        Reps
                      </Label>
                      <Input
                        id={`reps-${index}`}
                        type="number"
                        placeholder="Reps"
                        value={exercise.reps}
                        onChange={e => updateExercise(index, 'reps', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <AuthRequiredButton
          loadingText="Saving workout..."
          successMessageText="Workout saved successfully!"
          successMessageDescription="You can now view your added workout in the 'Workouts' page."
          errorMessageText="Failed to save workout. Please try again."
          className="w-full"
          onAuthenticatedClick={() => console.log('save')}
        >
          Save Workout
        </AuthRequiredButton>
      </div>
    </Wrapper>
  );
}
