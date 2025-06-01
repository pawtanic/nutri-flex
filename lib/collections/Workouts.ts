export const Workouts = {
  slug: 'workouts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'date', 'createdBy'],
  },
  access: {
    read: () => true,
    //   create: ({ req }) => {
    //     return Boolean(req.user); // Only allow creation if user is logged in
    //   },
    //   read: () => true,
    //   update: ({ req }) => {
    //     if (req.user) {
    //       // If user is admin, allow update
    //       if (req.user.roles?.includes('admin')) return true;
    //
    //       // Otherwise, only allow updating their own workouts
    //       return {
    //         'createdBy': {
    //           equals: req.user.id,
    //         },
    //       };
    //     }
    //     return false;
    //   },
    //   delete: ({ req }) => {
    //     return req.user?.roles?.includes('admin') || false;
    //   },
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
      type: 'relationship',
      relationTo: 'exercises',
      required: false,
      admin: {
        description: 'Add exercises to this workout',
      },
    }
  ],
};
