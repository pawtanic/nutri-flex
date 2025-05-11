import { Recipe, Workout } from '@/payload-types';

export type RecipeIngredient = Recipe['ingredients'][number];

export type RecipeInstruction = Recipe['instructions'][number];

// export type WorkoutExercise = Workout['exercises'][number];
