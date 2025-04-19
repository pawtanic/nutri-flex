import type { CollectionConfig } from 'payload'

export const UserProfiles: CollectionConfig = {
  slug: 'userProfiles',
  admin: {
    useAsTitle: 'user',
    defaultColumns: ['user', 'fitnessGoal', 'activityLevel'],
  },
  access: {
    read: ({ req: { user } }) => {
      // Users can only read their own profile
      if (user) {
        return {
          user: {
            equals: user.id,
          },
        }
      }
      return false
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
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
    {
      name: 'personalInfo',
      type: 'group',
      fields: [
        {
          name: 'firstName',
          type: 'text',
        },
        {
          name: 'lastName',
          type: 'text',
        },
        {
          name: 'dateOfBirth',
          type: 'date',
        },
        {
          name: 'gender',
          type: 'select',
          options: [
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Non-binary', value: 'nonBinary' },
            { label: 'Prefer not to say', value: 'preferNotToSay' },
          ],
        },
      ],
    },
    {
      name: 'fitnessGoal',
      type: 'select',
      required: true,
      options: [
        { label: 'Lose Weight', value: 'loseWeight' },
        { label: 'Build Muscle', value: 'buildMuscle' },
        { label: 'Improve Fitness', value: 'improveFitness' },
        { label: 'Maintain Weight', value: 'maintainWeight' },
        { label: 'Increase Strength', value: 'increaseStrength' },
        { label: 'Improve Flexibility', value: 'improveFlexibility' },
      ],
    },
    {
      name: 'activityLevel',
      type: 'select',
      required: true,
      options: [
        { label: 'Sedentary (little or no exercise)', value: 'sedentary' },
        { label: 'Lightly active (light exercise/sports 1-3 days/week)', value: 'lightlyActive' },
        { label: 'Moderately active (moderate exercise/sports 3-5 days/week)', value: 'moderatelyActive' },
        { label: 'Very active (hard exercise/sports 6-7 days a week)', value: 'veryActive' },
        { label: 'Extra active (very hard exercise/physical job & exercise twice a day)', value: 'extraActive' },
      ],
    },
    {
      name: 'bodyMeasurements',
      type: 'group',
      fields: [
        {
          name: 'height',
          type: 'number',
          min: 0,
          admin: {
            description: 'Height in centimeters',
          },
        },
        {
          name: 'weight',
          type: 'number',
          min: 0,
          admin: {
            description: 'Weight in kilograms',
          },
        },
        {
          name: 'bodyFatPercentage',
          type: 'number',
          min: 0,
          max: 100,
        },
        {
          name: 'measurementHistory',
          type: 'array',
          fields: [
            {
              name: 'date',
              type: 'date',
              required: true,
            },
            {
              name: 'weight',
              type: 'number',
              min: 0,
              admin: {
                description: 'Weight in kilograms',
              },
            },
            {
              name: 'bodyFatPercentage',
              type: 'number',
              min: 0,
              max: 100,
            },
            {
              name: 'notes',
              type: 'textarea',
            },
          ],
        },
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
      name: 'allergies',
      type: 'array',
      fields: [
        {
          name: 'allergen',
          type: 'text',
          required: true,
        },
        {
          name: 'severity',
          type: 'select',
          options: [
            { label: 'Mild', value: 'mild' },
            { label: 'Moderate', value: 'moderate' },
            { label: 'Severe', value: 'severe' },
          ],
        },
      ],
    },
    {
      name: 'workoutPreferences',
      type: 'group',
      fields: [
        {
          name: 'preferredWorkoutDays',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
          ],
        },
        {
          name: 'preferredWorkoutTime',
          type: 'select',
          options: [
            { label: 'Morning', value: 'morning' },
            { label: 'Afternoon', value: 'afternoon' },
            { label: 'Evening', value: 'evening' },
          ],
        },
        {
          name: 'workoutDuration',
          type: 'select',
          options: [
            { label: 'Less than 30 minutes', value: 'lessThan30' },
            { label: '30-45 minutes', value: '30to45' },
            { label: '45-60 minutes', value: '45to60' },
            { label: '60-90 minutes', value: '60to90' },
            { label: 'More than 90 minutes', value: 'moreThan90' },
          ],
        },
        {
          name: 'preferredExerciseTypes',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Strength Training', value: 'strengthTraining' },
            { label: 'Cardio', value: 'cardio' },
            { label: 'HIIT', value: 'hiit' },
            { label: 'Yoga', value: 'yoga' },
            { label: 'Pilates', value: 'pilates' },
            { label: 'Calisthenics', value: 'calisthenics' },
            { label: 'CrossFit', value: 'crossfit' },
          ],
        },
      ],
    },
    {
      name: 'favoriteWorkouts',
      type: 'relationship',
      relationTo: 'workouts',
      hasMany: true,
    },
    {
      name: 'favoriteRecipes',
      type: 'relationship',
      relationTo: 'recipes',
      hasMany: true,
    },
  ],
}