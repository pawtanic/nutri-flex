'use client';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';

interface RecipeFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

export function RecipeForm({ 
  prompt, 
  setPrompt, 
  isGenerating, 
  onGenerate 
}: RecipeFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="recipe-prompt">What would you like to cook?</Label>
        <Textarea
          id="recipe-prompt"
          placeholder="E.g., A quick high-protein breakfast, A vegetarian dinner with quinoa, etc."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[100px]"
          disabled={isGenerating}
        />
      </div>
      
      <Button
        className="w-full"
        onClick={onGenerate}
        disabled={isGenerating || !prompt.trim()}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Recipe
          </>
        )}
      </Button>
    </div>
  );
}