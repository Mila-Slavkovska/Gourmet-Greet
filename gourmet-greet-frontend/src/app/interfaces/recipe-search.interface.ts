import { Recipe } from "./recipe.interface";

export interface RecipeSearch {
  recipes: Recipe[],
  totalResults: number
}
