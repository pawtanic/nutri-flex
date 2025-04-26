import type { CollectionConfig } from 'payload'

export const Workouts: CollectionConfig = {
  slug: 'workouts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'level', 'duration', 'createdBy'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'level',
      type: 'select',
      required: true,
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
    },
    {
      name: 'duration',
      type: 'number',
      required: true,
      min: 5,
      max: 180,
      admin: {
        description: 'Estimated workout duration in minutes',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Strength', value: 'strength' },
        { label: 'Cardio', value: 'cardio' },
        { label: 'HIIT', value: 'hiit' },
        { label: 'Flexibility', value: 'flexibility' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
    },
    {
      name: 'targetMuscleGroups',
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
      name: 'exercises',
      type: 'array',
      required: true,
      admin: {
        description: 'Add exercises to this workout',
      },
      fields: [
        {
          name: 'exercise',
          type: 'relationship',
          relationTo: 'exercises',
          required: true,
        },
        {
          name: 'sets',
          type: 'number',
          required: true,
          min: 1,
          max: 20,
        },
        {
          name: 'reps',
          type: 'text',
          required: true,
          admin: {
            description: 'Number of reps per set (e.g., "10", "8-12", "Until failure")',
          },
        },
        {
          name: 'restBetweenSets',
          type: 'number',
          required: true,
          min: 0,
          max: 300,
          admin: {
            description: 'Rest time between sets in seconds',
          },
        },
        {
          name: 'notes',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'notes',
      type: 'richText',
      admin: {
        description: 'Additional notes or instructions for the workout',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ req, operation }) => {
            if (operation === 'create') {
              return req.user?.id;
            }
          },
        ],
      },
    },
  ],
}