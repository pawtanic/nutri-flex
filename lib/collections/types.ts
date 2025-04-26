import {Recipe} from "@/payload-types";

export type RecipeIngredient = Recipe['ingredients'][number];

export type RecipeInstruction = Recipe['instructions'][number];