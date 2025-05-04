import { toast } from 'sonner';
import { Check, X } from 'lucide-react';
import React from 'react';
import { ApiExercise } from '@/app/(frontend)/api/public-api';
import {
  DIFFICULTY_OPTIONS,
  DifficultyOption,
  EQUIPMENT_OPTIONS,
  EquipmentOption,
  SORT_OPTIONS,
  SortOption,
} from '@/app/(frontend)/utils/constants';

export const capitalizeAll = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.toUpperCase())
    .join(' ');
};

export const capitalize = (str: string): string => {
  if (str.includes('_') || str.includes('-')) {
    return str
      .split('_')
      .map(word => capitalize(word))
      .join(' ');
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-tertiary';
    case 'intermediate':
      return 'bg-quinary';
    case 'expert':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

export const showSuccessToast = ({ title, description, duration }: ToastOptions) => {
  toast(title, {
    className: 'bg-green-50 border-green-200 text-green-900',
    duration: duration || 3000,
    description,
    position: 'top-center',
    icon: (
      <div className="rounded-full p-1 bg-green-700">
        <Check className="h-3 w-3 text-white" />
      </div>
    ),
  });
};

interface ErrorToastOptions {
  title: string;
  description: string;
}

export const showErrorToast = ({ title, description }: ErrorToastOptions) => {
  toast(title, {
    description,
    position: 'top-center',
    className: 'bg-red-50 border-red-200',
    icon: (
      <div className="rounded-full p-1 bg-red-700">
        <X className="h-3 w-3 text-white" />
      </div>
    ),
  });
};

export const sortExercises = (exercises: ApiExercise[], filterState: FilterState) => {
  console.log(exercises);
  console.log(filterState);
  return exercises.toSorted((a, b) => {
    switch (filterState.sortBy) {
      case SORT_OPTIONS.NAME_ASC:
        return a.name.localeCompare(b.name);
      case SORT_OPTIONS.NAME_DESC:
        return b.name.localeCompare(a.name);
      case SORT_OPTIONS.DIFFICULTY_ASC:
        const difficultyOrder = { beginner: 1, intermediate: 2, expert: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case SORT_OPTIONS.DIFFICULTY_DESC:
        const difficultyOrderDesc = { beginner: 3, intermediate: 2, expert: 1 };
        return difficultyOrderDesc[a.difficulty] - difficultyOrderDesc[a.difficulty];
      default:
        return 0;
    }
  });
};

export const filterExercises = (
  exercises: ApiExercise[],
  filterState: FilterState
): ApiExercise[] => {
  if (!exercises || exercises.length === 0) {
    return [];
  }

  let result = [...exercises];

  if (filterState.equipment !== EQUIPMENT_OPTIONS.ALL) {
    result = result.filter(exercise => exercise.equipment === filterState.equipment);
  }

  if (filterState.difficulty !== DIFFICULTY_OPTIONS.ALL) {
    result = result.filter(exercise => exercise.difficulty === filterState.difficulty);
  }

  return result;
};

export interface FilterState {
  equipment: EquipmentOption;
  difficulty: DifficultyOption;
  sortBy: SortOption;
  isOpen: boolean;
}

export const applyFiltersAndSort = (
  exercises: ApiExercise[],
  filterState: FilterState
): ApiExercise[] => {
  const filtered = filterExercises(exercises, filterState);
  return sortExercises(filtered, filterState);
};
