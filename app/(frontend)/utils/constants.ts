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

export const EQUIPMENT_OPTIONS = {
  barbell: 'barbell',
  dumbbell: 'dumbbell',
  machine: 'machine',
  all: 'all',
} as const;

export type EquipmentOption = keyof typeof EQUIPMENT_OPTIONS;

export const DIFFICULTY_OPTIONS = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  expert: 'expert',
  all: 'all',
} as const;

export type DifficultyOption = keyof typeof DIFFICULTY_OPTIONS;

export const SORT_OPTIONS = {
  NAME_ASC: 'NAME_ASC',
  NAME_DESC: 'NAME_DESC',
  DIFFICULTY_ASC: 'DIFFICULTY_ASC',
  DIFFICULTY_DESC: 'DIFFICULTY_DESC',
} as const;

export type SortOption = keyof typeof SORT_OPTIONS;

export const SORT_OPTION_LABELS = {
  [SORT_OPTIONS.NAME_ASC]: 'Name (A-Z)',
  [SORT_OPTIONS.NAME_DESC]: 'Name (Z-A)',
  [SORT_OPTIONS.DIFFICULTY_ASC]: 'Difficulty (Low-High)',
  [SORT_OPTIONS.DIFFICULTY_DESC]: 'Difficulty (High-Low)',
};
