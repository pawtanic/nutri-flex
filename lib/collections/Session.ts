export const Sessions = {
  slug: 'sessions',
  admin: {
    useAsTitle: 'date',
    defaultColumns: ['user', 'date', 'workout', 'duration'],
  },
  access: {
    read: () => true,
    // You can add create/update/delete access control as needed
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User who performed the session',
      },
    },
    {
      name: 'workout',
      type: 'relationship',
      relationTo: 'workouts',
      required: false,
      admin: {
        description: 'Workout template used (optional)',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'duration',
      type: 'number',
      required: false,
      admin: {
        description: 'Duration in minutes',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      required: false,
    },
    {
      name: 'sessionExercises',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Exercises performed in this session',
      },
      fields: [
        {
          name: 'exercise',
          type: 'relationship',
          relationTo: 'exercises',
          required: true,
        },
        {
          name: 'order',
          type: 'number',
          required: false,
          admin: {
            description: 'Order in the session',
          },
        },
        {
          name: 'sets',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'reps',
              type: 'number',
              required: false,
            },
            {
              name: 'weight',
              type: 'number',
              required: false,
            },
            {
              name: 'rest',
              type: 'number',
              required: false,
              admin: {
                description: 'Rest after set (seconds)',
              },
            },
            {
              name: 'tempo',
              type: 'text',
              required: false,
              admin: {
                description: 'Tempo (e.g., 2-1-2)',
              },
            },
            {
              name: 'completed',
              type: 'checkbox',
              required: false,
            },
          ],
        },
        {
          name: 'notes',
          type: 'textarea',
          required: false,
        },
        {
          name: 'supersetGroup',
          type: 'text',
          required: false,
          admin: {
            description: 'Superset/circuit group identifier',
          },
        },
      ],
    },
    {
      name: 'intensity',
      type: 'number',
      required: false,
      admin: {
        description: 'Perceived exertion (RPE 1-10)',
      },
    },
    {
      name: 'caloriesBurned',
      type: 'number',
      required: false,
    },
    {
      name: 'completed',
      type: 'checkbox',
      required: false,
      admin: {
        description: 'Mark session as completed',
      },
    },
  ],
}; 