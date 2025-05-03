'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MuscleGroup } from '@/hooks/fetchExercises';
import { muscleGroups } from '@/app/(frontend)/utils/constants';
import { capitalize } from '@/app/(frontend)/utils/helpers';

interface MuscleGroupSelectorProps {
  selectedMuscle: MuscleGroup;
  onSelectMuscle: (muscle: MuscleGroup) => void;
}

export function MuscleGroupSelector({ selectedMuscle, onSelectMuscle }: MuscleGroupSelectorProps) {
  return (
    <div className="container max-w-md mx-auto pt-6 px-4">
      <Label htmlFor="muscle-group">Select Muscle Group</Label>
      <Select value={selectedMuscle} onValueChange={onSelectMuscle}>
        <SelectTrigger id="muscle-group" className="mt-1 shadow border-none">
          <SelectValue placeholder="Choose a muscle group" />
        </SelectTrigger>
        <SelectContent>
          {muscleGroups?.map(muscle => (
            <SelectItem key={muscle} value={muscle}>
              {capitalize(muscle)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
