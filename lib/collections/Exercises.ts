import type { CollectionConfig } from 'payload';

// TODO:
// copy all exercises for all muscles from : https://api.api-ninjas.com/v1/exercises?muscle=biceps

export const Exercises: CollectionConfig = {
  slug: 'exercises',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'muscleGroups', 'difficulty'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'instructions',
      type: 'richText',
      required: true,
    },
    {
      name: 'muscleGroups',
      type: 'select',
      hasMany: true,
      required: true,
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
      required: true,
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
    {
      name: 'demonstrationImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'demonstrationVideo',
      type: 'text',
      admin: {
        description: 'URL to a video demonstration (e.g., YouTube link)',
      },
    },
  ],
};
