import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recipeApi, recipeKeys } from '@/app/(frontend)/api/payload-api';
import { toast } from 'sonner';

export interface RecipeGeneratorParams {
  query: string;
  dietaryPreferences?: {
    allergies: string[];
    dairyFree: boolean;
    glutenFree: boolean;
    halal: boolean;
    kosher: boolean;
    vegan: boolean;
    vegetarian: boolean;
  };
  timeRange?: {
    min: string;
    max: string;
  };
  serve?: number;
  goal?: string;
}

export function useRecipeGenerator() {
  const queryClient = useQueryClient();

  const recipeGenerator = useMutation({
    mutationFn: async (params: RecipeGeneratorParams) => {
      return recipeApi.generateRecipe(params);
    },
    onError: () => {
      toast.error('Failed to generate recipe. Please try again.');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });

  return {
    isGenerating: recipeGenerator.isPending,
    generateRecipe: recipeGenerator.mutateAsync,
  };
}
