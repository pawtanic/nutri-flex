'use client';

import { useState, useEffect } from 'react';
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
import { DataSourceAttribution } from './data-source-attribution';

interface ExerciseSelectorProps {
  setExercises: (exercise: ApiExercise) => void;
}

interface FilterState {
  equipment: EquipmentOption;
  difficulty: DifficultyOption;
  sortBy: SortOption;
  isOpen: boolean;
}

export function ExerciseSelector({ setExercises }): ExerciseSelectorProps {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup>('');
  const [selectedExercise, setSelectedExercise] = useState<ApiExercise | null>(null);
  // TODO: transform data ?
  const { data, isLoading, error } = useFetchExerciseByMuscleGroup({ selectedMuscle });

  console.log(selectedMuscle);
  console.log(selectedExercise);

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

  const addSelectedExercise = () => {
    if (selectedExercise) {
      setSelectedExercise(selectedExercise);
    }
  };

  const handleFilterChange = (newState: Partial<FilterState>) => {
    setFilterState(prevState => ({ ...prevState, ...newState }));
  };

  return (
    <div className="space-y-4">
      <MuscleGroupSelector selectedMuscle={selectedMuscle} onSelectMuscle={selectMuscleGroup} />
      {selectedMuscle && !selectedExercise && (
        <ExerciseFilterPanel
          filterState={filterState}
          onFilterChange={handleFilterChange}
          exerciseCount={filteredExercises.length}
        />
      )}

      {error && <p className="text-red-500">Error fetching exercises: {error.message}</p>}

      {selectedExercise ? (
        <ExerciseDetail
          exercise={selectedExercise}
          onBackAction={() => setSelectedExercise(null)}
          onAddExerciseAction={addSelectedExercise}
        />
      ) : (
        <ExerciseList
          exercises={filteredExercises}
          isLoading={isLoading}
          selectedMuscle={selectedMuscle}
          onSelectExerciseAction={selectExercise}
        />
      )}

      <DataSourceAttribution />
    </div>
  );
}
