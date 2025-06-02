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
import type { Exercises } from '@/app/(frontend)/workouts/_components/workout-form-types';
import { goals } from '@/components/goal-progress';
import { CaloriesIntakeData, ProteinIntakeData } from '@/app/(frontend)/settings/_schemas/schemas';

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
  const difficultyOrder = { beginner: 1, intermediate: 2, expert: 3 };
  return exercises.toSorted((a, b) => {
    switch (filterState.sortBy) {
      case SORT_OPTIONS.NAME_ASC:
        return a.name.localeCompare(b.name);
      case SORT_OPTIONS.NAME_DESC:
        return b.name.localeCompare(a.name);
      case SORT_OPTIONS.DIFFICULTY_ASC:
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case SORT_OPTIONS.DIFFICULTY_DESC:
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
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

  if (filterState.equipment !== EQUIPMENT_OPTIONS.all) {
    result = result.filter(exercise => exercise.equipment === filterState.equipment);
  }

  if (filterState.difficulty !== DIFFICULTY_OPTIONS.all) {
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

export const getExerciseDisplayName = (exercise: Exercises[number], index: number) => {
  if (exercise.exerciseName) {
    return exercise.exerciseName;
  }
  return `New Exercise ${index + 1}`;
};

type Goal = (typeof goals)[number];

export const getFillColor = (goalName: Goal['name']): string => {
  switch (goalName) {
    case 'Weekly Workouts':
      return 'bg-primary';
    case 'Daily Water':
      return 'bg-quinary';
    case 'Calories Goal':
      return 'bg-calories';
    case 'Protein Intake':
      return 'bg-quaternary';
    default:
      return 'bg-primary';
  }
};

export const calculateNutrition = (
  nutritionData: { calories: number; protein: number; carbs: number; fat: number },
  grams: number
) => {
  const { calories, protein, carbs, fat } = nutritionData;

  return {
    calories: (calories * grams) / 100,
    protein: (protein * grams) / 100,
    carbs: (carbs * grams) / 100,
    fat: (fat * grams) / 100,
  };
};

export function constructApiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
}

type Sex = 'male' | 'female';
export type ActivityLevel = 'none' | 'light' | 'moderate' | 'heavy';

export function calculateHydrationGoal(
  weightKg: number,
  activityLevel: ActivityLevel,
  sex: Sex,
  initialFoodDataKcal?: number
): number {
  // Baseline water intake (mL/kg)
  const mlPerKgBaseline = sex === 'male' ? 40 : 35;
  const baselineMl = weightKg * mlPerKgBaseline;

  // Additional water for exercise (based on ~355 mL per 30 min)
  const activityAdditionMl = (() => {
    switch (activityLevel) {
      case 'none':
        return 0;
      case 'light':
        return 300; // ~15-30 min
      case 'moderate':
        return 600; // ~30-60 min
      case 'heavy':
        return 1000; // >60 min
      default:
        return 0;
    }
  })();

  // Total plain water requirement before food adjustment
  const totalMl = baselineMl + activityAdditionMl;

  // Subtract metabolic water from food, if provided
  let metabolicWaterMl = 0;
  if (initialFoodDataKcal) {
    metabolicWaterMl = initialFoodDataKcal * 0.12;
  } else {
  }

  const adjustedMl = totalMl - metabolicWaterMl;

  // Ensure non-negative and round
  return Math.max(0, Math.round(adjustedMl));
}

export function calculateProteinIntake(validatedData: ProteinIntakeData): number {
  let proteinPerKg: number;

  switch (validatedData.activity) {
    case 'none':
      proteinPerKg = 1.2;
      break;
    case 'light':
      proteinPerKg = 1.4;
      break;
    case 'moderate':
      proteinPerKg = 1.6;
      break;
    case 'heavy':
      proteinPerKg = 1.8;
      break;
    default:
      proteinPerKg = 1.2;
  }

  // Adjust for sex (slightly higher for males)
  if (validatedData.sex === 'male') {
    proteinPerKg += 0.1;
  }

  // Adjust for age (higher for older adults)
  if (validatedData.age >= 65) {
    proteinPerKg = Math.max(proteinPerKg, 1.2); // Ensure minimum of 1.2g/kg for older adults
    proteinPerKg += 0.1; // Additional 0.1g/kg for older adults
  }

  return Math.round(validatedData.weight * proteinPerKg);
}

export function calculateTDEE(validatedData: CaloriesIntakeData): number {
  // Calculate BMR using Harris-Benedict equation
  let bmr: number;

  if (validatedData.sex === 'male') {
    // BMR for men = 66.5 + (13.75 × weight in kg) + (5.003 × height in cm) - (6.75 × age)
    bmr =
      66.5 + 13.75 * validatedData.weight + 5.003 * validatedData.height - 6.75 * validatedData.age;
  } else {
    // BMR for women = 655.1 + (9.563 × weight in kg) + (1.850 × height in cm) - (4.676 × age)
    bmr =
      655.1 +
      9.563 * validatedData.weight +
      1.85 * validatedData.height -
      4.676 * validatedData.age;
  }

  // Calculate TDEE based on activity level
  let activityMultiplier: number;

  switch (validatedData.activity as ActivityLevel) {
    case 'none':
      activityMultiplier = 1.2; // Sedentary (little or no exercise)
      break;
    case 'light':
      activityMultiplier = 1.375; // Light exercise (1-3 days per week)
      break;
    case 'moderate':
      activityMultiplier = 1.55; // Moderate exercise (3-5 days per week)
      break;
    case 'heavy':
      activityMultiplier = 1.725; // Heavy exercise (6-7 days per week)
      break;
    default:
      activityMultiplier = 1.2;
  }

  let tdee = Math.round(bmr * activityMultiplier);

  // Adjust based on goal
  let calculatedCalories: number;

  switch (validatedData.goal) {
    case 'lose':
      calculatedCalories = Math.round(tdee * 0.8); // 20% deficit for weight loss
      break;
    case 'maintain':
      calculatedCalories = tdee; // Maintenance calories
      break;
    case 'gain':
      calculatedCalories = Math.round(tdee * 1.1); // 10% surplus for weight gain
      break;
    default:
      calculatedCalories = tdee;
  }

  return calculatedCalories;
}

interface WaterIntakeUpdate {
  newIntake: number;
  shouldUpdate: boolean;
  toastMessage?: {
    title: string;
    description: string;
  };
}

export function calculateWaterIntakeUpdate(
  currentIntake: number,
  amountToAdd: number,
  goal: number
): WaterIntakeUpdate {
  if (currentIntake >= goal) {
    return {
      newIntake: currentIntake,
      shouldUpdate: false,
      toastMessage: {
        title: 'Hydration Goal Reached',
        description: "You've already met your daily water intake goal! ",
      },
    };
  }

  const newTotal = currentIntake + amountToAdd;

  if (newTotal > goal) {
    const remaining = goal - currentIntake;
    if (remaining > 0) {
      return {
        newIntake: goal,
        shouldUpdate: true,
        toastMessage: {
          title: 'Goal Achieved!',
          description: `Added ${remaining}ml to reach your daily goal of ${goal}ml! `,
        },
      };
    }
    return { newIntake: currentIntake, shouldUpdate: false };
  }

  if (newTotal === goal) {
    return {
      newIntake: newTotal,
      shouldUpdate: true,
      toastMessage: {
        title: 'Goal Achieved!',
        description: "Perfect! You've reached your daily water intake goal! ",
      },
    };
  }

  return { newIntake: newTotal, shouldUpdate: true };
}
