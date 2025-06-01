export const Recipes = {
  slug: 'recipes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'prepTime', 'calories'],
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
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Breakfast', value: 'breakfast' },
        { label: 'Lunch', value: 'lunch' },
        { label: 'Dinner', value: 'dinner' },
        { label: 'Snack', value: 'snack' },
        { label: 'Pre-Workout', value: 'preWorkout' },
        { label: 'Post-Workout', value: 'postWorkout' },
        { label: 'Dessert', value: 'dessert' },
      ],
    },
    {
      name: 'dietaryPreferences',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Vegetarian', value: 'vegetarian' },
        { label: 'Vegan', value: 'vegan' },
        { label: 'Gluten-Free', value: 'glutenFree' },
        { label: 'Dairy-Free', value: 'dairyFree' },
        { label: 'Keto', value: 'keto' },
        { label: 'Paleo', value: 'paleo' },
        { label: 'Low-Carb', value: 'lowCarb' },
        { label: 'High-Protein', value: 'highProtein' },
      ],
    },
    {
      name: 'prepTime',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        description: 'Preparation time in minutes',
      },
    },
    {
      name: 'cookTime',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Cooking time in minutes',
      },
    },
    {
      name: 'servings',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'ingredients',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'ingredient',
          type: 'text',
          required: true,
        },
        {
          name: 'quantity',
          type: 'text',
          required: true,
        },
        {
          name: 'unit',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'instructions',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'step',
          type: 'richText',
          required: true,
        },
      ],
    },
    {
      name: 'nutritionalInfo',
      type: 'group',
      fields: [
        {
          name: 'calories',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'protein',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Protein in grams',
          },
        },
        {
          name: 'carbs',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Carbohydrates in grams',
          },
        },
        {
          name: 'fat',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Fat in grams',
          },
        },
        {
          name: 'fiber',
          type: 'number',
          min: 0,
          admin: {
            description: 'Fiber in grams',
          },
        },
        {
          name: 'sugar',
          type: 'number',
          min: 0,
          admin: {
            description: 'Sugar in grams',
          },
        },
      ],
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'tips',
      type: 'richText',
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
