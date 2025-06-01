import { NextRequest } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { RequiredDataFromCollectionSlug } from 'payload';
import BotService from "@/lib/services/BotService";
import { DataUtils } from '@/lib/utils/data';
import {RecipeIngredient, RecipeInstruction} from "@/lib/models/types";

/**
 * Interface for the recipe request body
 */
interface RecipeRequestBody {
  query: string;
  instruction?: string;
  dietaryPreferences?: {
    allergies: string[],
    dairyFree: boolean,
    glutenFree: boolean,
    halal: boolean,
    kosher:boolean,
    vegan: boolean,
    vegetarian: boolean,
  };
  timeRange?: {
    min: string,
    max: string,
  };
  serve?: number;
  goal: string;
}

/**
 * Example response directly in the database format:
 * {
 *   "name": "Spicy Grilled Chicken and Vegetable Skewers",
 *   "description": "These colorful and flavorful chicken skewers are perfect for grilling...",
 *   "category": "dinner",
 *   "prepTime": 15,
 *   "cookTime": 10,
 *   "servings": 4,
 *   "ingredients": [
 *     {
 *       "ingredient": "boneless, skinless chicken breasts, cut into 1-inch cubes",
 *       "quantity": "1.5",
 *       "unit": "lbs"
 *     },
 *     {
 *       "ingredient": "red bell pepper, cut into 1-inch pieces",
 *       "quantity": "1",
 *       "unit": "whole"
 *     }
 *   ],
 *   "instructions": [
 *     {
 *       "step": {
 *         "root": {
 *           "type": "root",
 *           "children": [
 *             {
 *               "type": "paragraph",
 *               "children": [{"text": "Cut the chicken breasts into 1-inch cubes..."}]
 *             }
 *           ],
 *           "direction": null,
 *           "format": "",
 *           "indent": 0,
 *           "version": 1
 *         }
 *       }
 *     }
 *   ],
 *   "nutritionalInfo": {
 *     "calories": 250,
 *     "protein": 30,
 *     "carbs": 15,
 *     "fat": 8
 *   },
 *   "tips": {
 *     "root": {
 *       "type": "root",
 *       "children": [
 *         {
 *           "type": "paragraph",
 *           "children": [{"text": "For best results, marinate the chicken for at least 30 minutes..."}]
 *         }
 *       ],
 *       "direction": null,
 *       "format": "",
 *       "indent": 0,
 *       "version": 1
 *     }
 *   }
 * }
 */

/**
 * POST handler for the recipe route
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: RecipeRequestBody = await request.json();

    // Validate the request
    if (!body.query) {
      return Response.json({ error: 'Question is required' }, { status: 400 });
    }

    // Initialize the payload instance
    const payload = await getPayload({
      config: configPromise,
    });

    // Prepare the context for the AI request
    const context: Record<string, any> = {};

    // Add optional parameters to the context if provided
    if (body.dietaryPreferences) {
      context.dietaryPreferences = body.dietaryPreferences;
    }
    if (body.timeRange) {
      context.timeRange = body.timeRange;
    }

    // Define the expected response format that matches the database schema
    const responseFormat: RequiredDataFromCollectionSlug<'recipes'> = {
      name: "Recipe Name",
      description: "Brief overview of the recipe",
      category: "dinner", // Default category
      prepTime: 30, // Example prep time in minutes
      cookTime: 20, // Example cook time in minutes
      servings: body.serve || 4,
      ingredients: [
        {
          ingredient: "Ingredient name",
          quantity: "1",
          unit: "cup"
        }
      ],
      instructions: [
        {
          step: {
            root: {
              type: "root",
              children: [
                {
                  type: "paragraph",
                  children: [{text: "Detailed instructions for this step"}],
                  version: 0,
                }
              ],
              direction: null,
              format: "",
              indent: 0,
              version: 1,
            }
          }
        }
      ],
      nutritionalInfo: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      },
      tips: {
        root: {
          type: "root",
          children: [
            {
              type: "paragraph",
              children: [{text: "Tips for preparing this recipe"}],
              version: 0,
            }
          ],
          direction: null,
          format: "",
          indent: 0,
          version: 1,
        }
      }
    };

    // Custom formatting instructions for the recipe response that matches the database schema
    const formattingInstructions = `
    {
      "name": "Recipe Name",
      "description": "Brief overview of the recipe",
      "category": "dinner", // Use one of: breakfast, lunch, dinner, snack, preWorkout, postWorkout, dessert
      "prepTime": 30, // Total preparation time in minutes
      "cookTime": 20, // Total cooking time in minutes
      "servings": ${body.serve || 4},
      "ingredients": [
        {
          "ingredient": "Ingredient name",
          "quantity": "1", // make it string to avoid conversion errors
          "unit": "cup" // REQUIRED: Always provide a unit (e.g., cup, tbsp, tsp, oz, g, ml, whole, pinch)
        },
        // Add more ingredients as needed, always including a valid unit
        {
          "ingredient": "Another ingredient",
          "quantity": "2",
          "unit": "tbsp" // Examples of valid units: cup, tbsp, tsp, oz, g, ml, whole, pinch
        },
        ...
      ],
      "instructions": [
        {
          "step": {
            "root": {
              "type": "root",
              "children": [
                {
                  "type": "paragraph",
                  "children": [{"text": "Detailed instructions for step 1"}]
                }
              ],
              "direction": null,
              "format": "",
              "indent": 0,
              "version": 1
            }
          }
        },
        ...
      ],
      "nutritionalInfo": {
        "calories": 300, // Estimate total calories per serving
        "protein": 20, // Protein in grams
        "carbs": 30, // Carbohydrates in grams
        "fat": 10 // Fat in grams
      },
      "tips": {
        "root": {
          "type": "root",
          "children": [
            {
              "type": "paragraph",
              "children": [{"text": "Tips for preparing this recipe"}]
            }
          ],
          "direction": null,
          "format": "",
          "indent": 0,
          "version": 1
        }
      }
    }`;

    // Call the AI service to generate the recipe directly in the database format
    const recipeData = await BotService.generateResponse<RequiredDataFromCollectionSlug<'recipes'>>({
      query: body.query || 'Write a recipe',
      instruction: body.instruction || '',
      context,
      responseFormat,
      formattingInstructions
    });

    // Helper function to validate and sanitize recipe data
    const validateRecipeData = (data: any): RequiredDataFromCollectionSlug<'recipes'> => {
      // Ensure ingredients have valid values
      const validatedIngredients = Array.isArray(data.ingredients) 
        ? data.ingredients.map((ingredient: RecipeIngredient, index: number) => ({
            ingredient: ingredient.ingredient || `Ingredient ${index + 1}`,
            quantity: ingredient.quantity || '1',
            unit: ingredient.unit || 'unit', // Provide a default unit if missing
          }))
        : [];

      // Ensure instructions have valid structure
      const validatedInstructions = Array.isArray(data.instructions) 
        ? data.instructions.map((instruction: RecipeInstruction, index: number) => {
            if (!instruction.step || !instruction.step.root) {
              return DataUtils.convertToRichText(`Step ${index + 1}`);
            }
            return instruction;
          })
        : [];

      // Ensure nutritionalInfo has valid values
      const validatedNutritionalInfo = data.nutritionalInfo 
        ? {
            calories: typeof data.nutritionalInfo.calories === 'number' ? data.nutritionalInfo.calories : 0,
            protein: typeof data.nutritionalInfo.protein === 'number' ? data.nutritionalInfo.protein : 0,
            carbs: typeof data.nutritionalInfo.carbs === 'number' ? data.nutritionalInfo.carbs : 0,
            fat: typeof data.nutritionalInfo.fat === 'number' ? data.nutritionalInfo.fat : 0,
            fiber: typeof data.nutritionalInfo.fiber === 'number' ? data.nutritionalInfo.fiber : null,
            sugar: typeof data.nutritionalInfo.sugar === 'number' ? data.nutritionalInfo.sugar : null,
          }
        : {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          };

      // Ensure tips has valid structure
      const validatedTips = (data.tips && data.tips.root && data.tips.root.children) 
        ? data.tips 
        : DataUtils.convertToRichText("");

      // Return the validated recipe data
      return {
        name: data.name || 'Untitled Recipe',
        description: data.description || '',
        category: data.category || 'dinner',
        prepTime: typeof data.prepTime === 'number' ? data.prepTime : 0,
        cookTime: typeof data.cookTime === 'number' ? data.cookTime : 0,
        servings: typeof data.servings === 'number' ? data.servings : 4,
        ingredients: validatedIngredients,
        instructions: validatedInstructions,
        nutritionalInfo: validatedNutritionalInfo,
        tips: validatedTips,
      };
    };

    // Save the recipe to the database
    try {
      // Validate and ensure the response has all required fields
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const recipeToSave = validateRecipeData({
        ...recipeData,
        servings: recipeData.servings || body.serve || 4,
      });


      // Create the recipe in the database and get the created recipe object
      const createdRecipe = await payload.create({
        collection: 'recipes',
        data: recipeData,
      });

      // Return the created recipe
      return Response.json(createdRecipe);
    } catch (error) {
      console.error('Error saving recipe to database:', error);

      // Check if it's a validation error
      if (error instanceof Error && error.name === 'ValidationError') {
        return Response.json({
          error: 'Validation error when saving recipe',
          details: error.message || 'Unknown validation error'
        }, { status: 400 });
      }

      return Response.json({ error: 'Failed to save recipe to database' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing recipe request:', error);
    return Response.json({ error: 'Failed to process recipe request' }, { status: 500 });
  }
}

/**
 * The recipe route handles AI-generated recipes.
 * 
 * The service handles:
 * - Constructing the prompt with the user's query and context
 * - Calling the AI model
 * - Parsing and returning the response directly in the database format
 * 
 * The response format is structured to match the database schema exactly,
 * eliminating the need for post-processing before saving to the database.
 * This includes properly formatted rich text fields for instructions and tips.
 *
 * See the GeminiAIService.ts file for more details on how to use the service
 * for other AI generation needs.
 */
