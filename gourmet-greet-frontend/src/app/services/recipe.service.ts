import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Recipe } from '../interfaces/recipe.interface';
import { Observable, of } from 'rxjs';
import { mockRecipes } from '../mock-data/mock-recipes';
import { Review } from '../interfaces/review.interface';
import { RecipeSearch } from '../interfaces/recipe-search.interface';
import { TopIngredient } from '../interfaces/top-ingredient.interface';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  httpClient = inject(HttpClient);

  getHighestRatedRecipesMock(
    page: number = 0,
    size: number = 6
  ): Observable<Recipe[]> {
    return of(mockRecipes.slice(0, 6));
  }

  getRecipeByIdMock(id: number): Observable<Recipe | undefined> {
    return of(mockRecipes.find((recipe) => recipe.id == id));
  }

  getAllRecipes(): Observable<Recipe[]> {
    return of(mockRecipes);
  }

  getHighestRatedRecipes(
    page: number = 0,
    size: number = 6
  ): Observable<Recipe[]> {
    return this.httpClient.get<Recipe[]>(`/api/recipes/top-rated`);
  }

  getRecipeById(id: number): Observable<Recipe | undefined> {
    return this.httpClient.get<Recipe>(`/api/recipes/${id}`);
  }

  getFullRecipeImageUrl(recipeId: number, imageId: number): string {
    const baseUrl = 'http://localhost:8080/api/recipes';
    return `${baseUrl}/${recipeId}/image/${imageId}`;
  }

  createReviewForRecipe(reviewData: Partial<Review>): Observable<Review> {
    return this.httpClient.post<Review>(`/api/reviews`, reviewData);
  }

  getFilteredRecipes(params: {
    title?: string;
    cookingTime?: number;
    servings?: number;
    categoryIds?: number[];
    ingredients?: string[];
    page?: number;
    pageSize?: number;
  }): Observable<RecipeSearch> {
    return this.httpClient.get<RecipeSearch>('/api/recipes/search', {
      params: {
        ...params,
        page: params.page?.toString() || '0',
        pageSize: params.pageSize?.toString() || '9',
      },
    });
  }

  getTop10Ingredients(): Observable<TopIngredient[]> {
    return this.httpClient.get<TopIngredient[]>(`/api/recipes/top-ingredients`);
  }
}
