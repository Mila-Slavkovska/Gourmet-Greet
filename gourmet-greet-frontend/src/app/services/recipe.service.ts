import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Recipe } from '../interfaces/recipe.interface';
import { Observable, of } from 'rxjs';
import { mockRecipes } from '../mock-data/mock-recipes';
import { Review } from '../interfaces/review.interface';
import { RecipeSearch } from '../interfaces/recipe-search.interface';
import { RecipeAddDto } from '../interfaces/recipe-add.interface';

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

  createRecipe(recipe: RecipeAddDto){
    return this.httpClient.post<Recipe>('/api/recipes', recipe);
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

  uploadPoster(id: number, poster: File){
    const formData = new FormData();
    formData.append('file', poster);

    return this.httpClient.post(`/api/recipes/${id}/upload-poster-image`, formData)
  }

  uploadImage(id: number, image: File){
    const formData = new FormData();
    formData.append('file', image);

    return this.httpClient.post(`/api/recipes/${id}/upload-image`, formData)
  }
}
