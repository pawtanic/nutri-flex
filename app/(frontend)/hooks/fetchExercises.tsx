import { useQuery } from '@tanstack/react-query';
import { exerciseApi, exerciseKeys } from '@/app/(frontend)/api/public-api';
import { muscleGroups } from '@/app/(frontend)/utils/constants';

export type MuscleGroup = (typeof muscleGroups)[number] | '';

interface FetchExercisesProps {
  selectedMuscle: MuscleGroup;
}

export function useFetchExerciseByMuscleGroup({ selectedMuscle }: FetchExercisesProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: exerciseKeys.byMuscle(selectedMuscle),
    queryFn: () => exerciseApi.getByMuscle(selectedMuscle),
    enabled: !!selectedMuscle,
  });

  return { data, isLoading, error };
}
