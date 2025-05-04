'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MuscleGroup } from '@/hooks/use-fetch-exercise-by-muscle-group';
import { muscleGroups } from '@/app/(frontend)/utils/constants';
import { capitalize } from '@/app/(frontend)/utils/helpers';

interface MuscleGroupSelectorProps {
  selectedMuscle: MuscleGroup;
  onSelectMuscleAction: (muscle: MuscleGroup) => void;
  isLoading: boolean;
}

export function MuscleGroupSelector({
  selectedMuscle,
  onSelectMuscleAction,
  isLoading,
}: MuscleGroupSelectorProps) {
  return (
    <div className="container max-w-md mx-auto pt-6 px-4">
      <Label htmlFor="muscle-group">Select Muscle Group</Label>
      <Select value={selectedMuscle} onValueChange={onSelectMuscleAction}>
        <SelectTrigger id="muscle-group" className="mt-1 shadow border-none">
          <SelectValue
            placeholder={isLoading ? 'Loading muscle groups...' : 'Choose a muscle group'}
          />
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
