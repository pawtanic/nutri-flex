'use server';

export interface UserFitnessData {
  hydration: number;
  protein: number;
  weight: number;
  calories: number;
  height: number;
  age: number;
  activityLevel: 'none' | 'light' | 'moderate' | 'heavy';
  sex: 'male' | 'female';
  weeklyWorkoutTarget: number;
}

export interface UserMeasurementsUnits {
  weightUnit: 'metric' | 'imperial';
  heightUnit: 'metric' | 'imperial';
}

// TAN - this is shape for user fitness data in the api
const defaultFitnessData: UserFitnessData = {
  hydration: 2550,
  protein: 120,
  calories: 2000,
  height: 180,
  age: 30,
  activityLevel: 'moderate',
  sex: 'male',
  weight: 90,
  weeklyWorkoutTarget: 4,
};

// TAN - this is shape for user measurements units in the api
const defaultMeasurementsUnits: UserMeasurementsUnits = {
  weightUnit: 'metric',
  heightUnit: 'metric',
};
// move to locally scoped api folder - see examples in workout

export async function fetchUserFitnessData(): Promise<UserFitnessData> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return defaultFitnessData;
}

export async function fetchUserMeasurementsUnits(): Promise<typeof defaultMeasurementsUnits> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return defaultMeasurementsUnits;
}
