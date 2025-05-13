import { BicepsFlexed } from 'lucide-react';

export function NoExerciseMessage() {
  return (
    <>
      <BicepsFlexed className="h-12 w-12 text-muted-foreground mx-auto my-6" aria-hidden="true" />
      <p className="text-muted-foreground text-center">
        No exercises added yet. Click the &apos;Add Exercise&apos; button to start building your
        workout routine or go to &apos;Exercise Library&apos; to choose from a wide range of
        exercises.
      </p>
    </>
  );
}
