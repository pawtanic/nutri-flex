'use client';

import React, { useState, useEffect } from 'react';
import { ApiExercise } from '@/app/(frontend)/api/public-api';
import { MuscleGroup, useFetchExerciseByMuscleGroup } from '@/hooks/fetchExercises';
import {
  EQUIPMENT_OPTIONS,
  DIFFICULTY_OPTIONS,
  SORT_OPTIONS,
  EquipmentOption,
  DifficultyOption,
  SortOption,
} from '@/app/(frontend)/utils/constants';
import { MuscleGroupSelector } from './muscle-group-selector';
import { ExerciseFilterPanel } from './exercise-filter-panel';
import { ExerciseList } from './exercise-list';
import { ExerciseDetail } from './exercise-detail';
import { Exercise } from './workout-form';
import { showSuccessToast } from '@/app/(frontend)/utils/helpers';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import Link from 'next/link';

interface ExerciseSelectorProps {
  setExercisesAction: React.Dispatch<React.SetStateAction<Exercise[]>>;
}

interface FilterState {
  equipment: EquipmentOption;
  difficulty: DifficultyOption;
  sortBy: SortOption;
  isOpen: boolean;
}

export function ExerciseSelector({ setExercisesAction }: ExerciseSelectorProps) {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>('');
  const [selectedExercise, setSelectedExercise] = useState<ApiExercise | null>(null);
  const { data, isLoading, error } = useFetchExerciseByMuscleGroup({ selectedMuscle });

  const [filterState, setFilterState] = useState<FilterState>({
    equipment: EQUIPMENT_OPTIONS.ALL,
    difficulty: DIFFICULTY_OPTIONS.ALL,
    sortBy: SORT_OPTIONS.NAME_ASC,
    isOpen: false,
  });

  const [filteredExercises, setFilteredExercises] = useState<ApiExercise[]>([]);

  // Apply filters when data or filter state changes
  useEffect(() => {
    if (!data) {
      setFilteredExercises([]);
      return;
    }

    let result = [...data];

    // Apply equipment filter
    if (filterState.equipment !== EQUIPMENT_OPTIONS.ALL) {
      result = result.filter(exercise => exercise.equipment === filterState.equipment);
    }

    // Apply difficulty filter
    if (filterState.difficulty !== DIFFICULTY_OPTIONS.ALL) {
      result = result.filter(exercise => exercise.difficulty === filterState.difficulty);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filterState.sortBy) {
        case SORT_OPTIONS.NAME_ASC:
          return a.name.localeCompare(b.name);
        case SORT_OPTIONS.NAME_DESC:
          return b.name.localeCompare(a.name);
        case SORT_OPTIONS.DIFFICULTY_ASC:
          const difficultyOrder = { beginner: 1, intermediate: 2, expert: 3 };
          return (
            difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
            difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
          );
        case SORT_OPTIONS.DIFFICULTY_DESC:
          const difficultyOrderDesc = { beginner: 1, intermediate: 2, expert: 3 };
          return (
            difficultyOrderDesc[b.difficulty as keyof typeof difficultyOrderDesc] -
            difficultyOrderDesc[a.difficulty as keyof typeof difficultyOrderDesc]
          );
        default:
          return 0;
      }
    });

    setFilteredExercises(result);
  }, [data, filterState]);

  const selectMuscleGroup = (muscle: MuscleGroup) => {
    setSelectedMuscle(muscle);
    setSelectedExercise(null);
  };

  const selectExercise = (exercise: ApiExercise) => {
    setSelectedExercise(exercise);
  };
  console.log(selectedExercise);
  const addSelectedExercise = () => {
    if (selectedExercise) {
      // Transform API exercise to the Exercise format used by WorkoutForm
      const formattedExercise: Exercise = {
        exerciseName: selectedExercise.name,
        sets: 3, // Default values
        reps: 10, // Default values
      };

      setExercisesAction(prevExercises => [...prevExercises, formattedExercise]);

      // Reset selection
      setSelectedExercise(null);

      // show success toast
      showSuccessToast('Success', 'The exercise has been added to your workout');
    }
  };

  const handleFilterChange = (newState: Partial<FilterState>) => {
    setFilterState(prevState => ({ ...prevState, ...newState }));
  };

  return (
    <div className="space-y-4">
      <MuscleGroupSelector
        isLoading={isLoading}
        selectedMuscle={selectedMuscle}
        onSelectMuscleAction={selectMuscleGroup}
      />
      {selectedMuscle && !selectedExercise && (
        <ExerciseFilterPanel
          filterState={filterState}
          onFilterChange={handleFilterChange}
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
