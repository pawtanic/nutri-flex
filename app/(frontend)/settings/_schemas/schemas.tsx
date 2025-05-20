import { z } from 'zod';

export const measurementUnitSchema = z.enum(['metric', 'imperial']);
export type MeasurementUnit = z.infer<typeof measurementUnitSchema>;

// Base schema with common fields
export const userProfileSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
    email: z.string().email('Please enter a valid email address'),
    heightUnit: measurementUnitSchema,
    weightUnit: measurementUnitSchema,
    height: z.string().optional(),
    'height-ft': z.string().optional(),
    'height-in': z.string().optional(),
    weight: z.string().optional(),
    'weight-st': z.string().optional(),
    'weight-lb': z.string().optional(),
  })
  .refine(
    data => {
      // For height validation
      if (data.heightUnit === 'metric') {
        const height = Number(data.height);
        return height >= 50 && height <= 300;
      } else {
        const feet = Number(data['height-ft']);
        const inches = Number(data['height-in']);
        return feet >= 0 && feet <= 9 && inches >= 0 && inches <= 11;
      }
    },
    {
      message: 'Please provide a valid height (metric: 50-300cm, imperial: 0-9ft 0-11in)',
      path: ['height'],
    }
  )
  .refine(
    data => {
      // For weight validation
      if (data.weightUnit === 'metric') {
        const weight = Number(data.weight);
        return weight >= 20 && weight <= 500;
      } else {
        const stones = Number(data['weight-st']);
        const pounds = Number(data['weight-lb']);
        return stones >= 0 && stones <= 80 && pounds >= 0 && pounds <= 13;
      }
    },
    {
      message: 'Please provide a valid weight (metric: 20-500kg, imperial: 0-80st 0-13lb)',
      path: ['weight'],
    }
  );

export type UserProfileData = z.infer<typeof userProfileSchema>;

export const fitnessGoalsSchema = z.object({
  calories: z.coerce
    .number()
    .positive('Calorie target must be positive')
    .min(500, 'Calorie target must be at least 500')
    .max(10000, 'Calorie target must be less than 10000'),
  protein: z.coerce
    .number()
    .positive('Protein target must be positive')
    .min(10, 'Protein target must be at least 10g')
    .max(500, 'Protein target must be less than 500g'),
  workouts: z.coerce
    .number()
    .int('Workout target must be a whole number')
    .min(1, 'Workout target must be at least 1')
    .max(14, 'Workout target must be 14 or less'),
});

export type FitnessGoals = z.infer<typeof fitnessGoalsSchema>;
