import type { CollectionConfig } from 'payload';

export const Workouts: CollectionConfig = {
  slug: 'workouts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'date', 'createdBy'],
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
      name: 'exercises',
      type: 'array',
      required: false,
      admin: {
        description: 'Add exercises to this workout',
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
            description: 'Add sets to this exercise',
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
};
