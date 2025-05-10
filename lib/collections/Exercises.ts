import type { CollectionConfig } from 'payload';

export const Exercises: CollectionConfig = {
  slug: 'exercises',
  admin: {
    useAsTitle: 'exerciseName',
    defaultColumns: ['exerciseName'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'exerciseName',
      type: 'text',
      required: true,
    },
    {
      name: 'sets',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Sets for this exercise',
      },
      fields: [
        {
          name: 'reps',
          type: 'number',
          required: false,
          min: 1,
          max: 100,
        },
        {
          name: 'weight',
          type: 'number',
          required: false,
          min: 0,
        },
      ],
    },
    // Keeping the additional metadata fields but making them optional
    {
      name: 'description',
      type: 'textarea',
      required: false,
    },
    {
      name: 'instructions',
      type: 'richText',
      required: false,
    },
    {
      name: 'muscleGroups',
      type: 'select',
      hasMany: true,
      required: false,
      options: [
        { label: 'Chest', value: 'chest' },
        { label: 'Back', value: 'back' },
        { label: 'Shoulders', value: 'shoulders' },
        { label: 'Arms', value: 'arms' },
        { label: 'Legs', value: 'legs' },
        { label: 'Core', value: 'core' },
        { label: 'Full Body', value: 'fullBody' },
      ],
    },
    {
      name: 'difficulty',
      type: 'select',
      required: false,
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
    },
    {
      name: 'equipment',
      type: 'select',
      hasMany: true,
      required: false,
      options: [
        { label: 'None', value: 'none' },
        { label: 'Dumbbells', value: 'dumbbells' },
        { label: 'Barbell', value: 'barbell' },
        { label: 'Kettlebell', value: 'kettlebell' },
        { label: 'Resistance Bands', value: 'resistanceBands' },
        { label: 'Machine', value: 'machine' },
        { label: 'Bodyweight', value: 'bodyweight' },
      ],
    },
  ],
};
