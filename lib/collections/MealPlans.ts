import type { CollectionConfig } from 'payload'

export const MealPlans: CollectionConfig = {
  slug: 'mealPlans',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'goal', 'duration', 'createdBy'],
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
      name: 'goal',
      type: 'select',
      required: true,
      options: [
        { label: 'Weight Loss', value: 'weightLoss' },
        { label: 'Muscle Gain', value: 'muscleGain' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Performance', value: 'performance' },
        { label: 'General Health', value: 'generalHealth' },
      ],
    },
    {
      name: 'duration',
      type: 'number',
      required: true,
      min: 1,
      max: 90,
      admin: {
        description: 'Duration of the meal plan in days',
      },
    },
    {
      name: 'dailyCalories',
      type: 'number',
      min: 500,
      max: 10000,
      admin: {
        description: 'Target daily calories for this meal plan',
      },
    },
    {
      name: 'macroDistribution',
      type: 'group',
      fields: [
        {
          name: 'protein',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            description: 'Protein percentage of total calories',
          },
        },
        {
          name: 'carbs',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            description: 'Carbohydrates percentage of total calories',
          },
        },
        {
          name: 'fat',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            description: 'Fat percentage of total calories',
          },
        },
      ],
      admin: {
        description: 'Macronutrient distribution (should add up to 100%)',
      },
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
      name: 'days',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'dayNumber',
          type: 'number',
          required: true,
          min: 1,
          admin: {
            description: 'Day number in the meal plan',
          },
        },
        {
          name: 'meals',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'mealType',
              type: 'select',
              required: true,
              options: [
                { label: 'Breakfast', value: 'breakfast' },
                { label: 'Lunch', value: 'lunch' },
                { label: 'Dinner', value: 'dinner' },
                { label: 'Snack', value: 'snack' },
                { label: 'Pre-Workout', value: 'preWorkout' },
                { label: 'Post-Workout', value: 'postWorkout' },
              ],
            },
            {
              name: 'recipe',
              type: 'relationship',
              relationTo: 'recipes',
              required: true,
            },
            {
              name: 'servingSize',
              type: 'number',
              required: true,
              min: 0.25,
              defaultValue: 1,
              admin: {
                description: 'Number of servings (can be fractional)',
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
          type: 'textarea',
          admin: {
            description: 'Notes for this specific day',
          },
        },
      ],
    },
    {
      name: 'shoppingList',
      type: 'richText',
      admin: {
        description: 'Optional shopping list for the meal plan',
      },
    },
    {
      name: 'notes',
      type: 'richText',
      admin: {
        description: 'General notes for the meal plan',
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
              return req.user.id;
            }
          },
        ],
      },
    },
  ],
}