export const linkAkaBtnStyles =
  'inline-flex items-center justify-center gap-2 p-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"';

export const periodValue = {
  week: 'week',
  month: 'month',
  '3months': '3months',
  year: 'year',
} as const;

export type Period = keyof typeof periodValue;

export const tabsValues = {
  overview: 'overview',
  workout: 'workout',
  nutrition: 'nutrition',
} as const;

export type Tabs = keyof typeof tabsValues;

export const muscleGroups = [
  'abdominals',
  'abductors',
  'adductors',
  'biceps',
  'calves',
  'chest',
  'forearms',
  'glutes',
  'hamstrings',
  'lats',
  'lower_back',
  'middle_back',
  'neck',
  'quadriceps',
  'traps',
  'triceps',
] as const;
