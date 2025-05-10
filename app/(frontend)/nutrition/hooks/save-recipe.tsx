import { useMutation } from '@tanstack/react-query';
import { recipeApi } from '@/app/(frontend)/api/payload-api';
import { Recipe } from '@/app/(frontend)/nutrition/_components/recipe/recipe-types';
import { toast } from 'sonner';

export function useSaveRecipe() {
  const saveRecipe = useMutation({
    mutationFn: async (recipe: Recipe) => {
      return recipeApi.saveRecipe(recipe);
    },
    onError: () => {
      toast.error('Failed to save meal. Please try again.');
    },
  });

  const handleSaveMeal = async (recipe: Recipe) => {
    await saveRecipe.mutateAsync(recipe);
    // optimistic update ??
    toast.success('Meal saved successfully!');
  };

  return { handleSaveMeal };
}
