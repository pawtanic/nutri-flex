'use client';

import React, { useState, useEffect } from 'react';
import { ApiExercise } from '@/app/(frontend)/api/public-api';
import {
  MuscleGroup,
  useFetchExerciseByMuscleGroup,
} from '@/hooks/use-fetch-exercise-by-muscle-group';
import {
  EQUIPMENT_OPTIONS,
  DIFFICULTY_OPTIONS,
  SORT_OPTIONS,
} from '@/app/(frontend)/utils/constants';
import { MuscleGroupSelector } from './muscle-group-selector';
import { ExerciseFilterPanel } from './exercise-filter-panel';
import { ExerciseList } from './exercise-list';
import { ExerciseDetail } from './exercise-detail';
import { Exercises } from './workout-form';
import { applyFiltersAndSort, FilterState, showSuccessToast } from '@/app/(frontend)/utils/helpers';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import Link from 'next/link';
import { RoutesConfig } from '@/components/common/navigation/navigation';
import { useRouter } from 'next/navigation';
import { useUrlParams } from '@/hooks/useUrlParams';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ExerciseSelectorProps {
  setExercisesAction: React.Dispatch<React.SetStateAction<Exercises>>;
}

// TODO; refactor to new structure
export function ExerciseSelector({ setExercisesAction }: ExerciseSelectorProps) {
  const [storedMuscleGroup, setStoredMuscleGroup] = useLocalStorage('selectedMuscleGroup', '');
  const { updateParams, getParams } = useUrlParams();
  const selectedMuscleFromParams = getParams().muscle as MuscleGroup;
  // TODO: store tabs value in constants
  const isApiTab = getParams().tab === 'api';
  const selectedMuscle = selectedMuscleFromParams || (storedMuscleGroup as MuscleGroup);
  const [selectedExercise, setSelectedExercise] = useState<ApiExercise | null>(null);

  useEffect(() => {
    if (!isApiTab) return;
    const shouldUpdateParams = storedMuscleGroup && !selectedMuscleFromParams;

    if (shouldUpdateParams) updateParams({ muscle: storedMuscleGroup });
  }, [storedMuscleGroup, updateParams, isApiTab, getParams, selectedMuscleFromParams]);

  const { data, isLoading, error } = useFetchExerciseByMuscleGroup({
    selectedMuscle,
  });
  const router = useRouter();

  const [filterState, setFilterState] = useState<FilterState>({
    equipment: EQUIPMENT_OPTIONS.all,
    difficulty: DIFFICULTY_OPTIONS.all,
    sortBy: SORT_OPTIONS.NAME_ASC,
    isOpen: false,
  });

  const [filteredExercises, setFilteredExercises] = useState<ApiExercise[]>([]);

  // Apply filters when data or filter state changes
  useEffect(() => {
    if (!data) return;

    const result = applyFiltersAndSort(data, filterState);
    setFilteredExercises(result);
  }, [data, filterState]);

  const selectMuscleGroup = (muscle: MuscleGroup) => {
    updateParams({ muscle });
    setSelectedExercise(null);
    setStoredMuscleGroup(muscle);
  };

  const selectExercise = (exercise: ApiExercise) => {
    setSelectedExercise(exercise);
  };

  const addSelectedExercise = () => {
    if (selectedExercise) {
      const formattedExercise: Exercises[number] = {
        exerciseName: selectedExercise.name,
        sets: [
          {
            reps: 1,
            weight: 1,
          },
        ],
      };

      setExercisesAction(prevExercises => [...prevExercises, formattedExercise]);
      setSelectedExercise(null);
      showSuccessToast({
        title: 'Success',
        description:
          'The exercise has been added to your workout, please adjust the sets and reps as needed.',
        duration: 5000,
      });
    }
    router.push(RoutesConfig.addWorkout);
  };

  const handleFilterChange = (newState: Partial<FilterState>) => {
    const updatedFilterState = { ...filterState, ...newState };
    setFilterState(updatedFilterState);

    if (!data) return;
    const result = applyFiltersAndSort(data, updatedFilterState);
    setFilteredExercises(result);
  };

  const handleSort = () => {
    if (!data) return;

    const result = applyFiltersAndSort(data, filterState);
    setFilteredExercises(result);
  };

  const showFilterPanel = selectedMuscle && !selectedExercise && data && data.length > 0;

  return (
    <div className="space-y-4">
      <MuscleGroupSelector
        isLoading={isLoading}
        selectedMuscle={selectedMuscle}
        onSelectMuscleAction={selectMuscleGroup}
      />
      {showFilterPanel && (
        <ExerciseFilterPanel
          filterState={filterState}
          onFilterChangeAction={handleFilterChange}
          onSortChangeAction={handleSort}
          exerciseCount={filteredExercises.length}
        />
      )}
      {selectedExercise ? (
        <ExerciseDetail
          exercise={selectedExercise}
          onBackAction={() => setSelectedExercise(null)}
          onAddExerciseAction={addSelectedExercise}
        />
      ) : (
        <ExerciseList
          error={error}
          exercises={filteredExercises}
          isLoading={isLoading}
          selectedMuscle={selectedMuscle}
          onSelectExerciseAction={selectExercise}
        />
      )}
      {error && (
        <WarningAlert description="The results rely on free data from Ninja API">
          <Link href="https://api-ninjas.com/api/exercises" className="ml-2 underline">
            Learn more
          </Link>
        </WarningAlert>
      )}
    </div>
  );
}
