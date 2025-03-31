import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Recipe } from './interfaces/recipe.interface';
import { Observable, of } from 'rxjs';
import { mockRecipes } from './mock-data/mock-recipes';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  httpClient = inject(HttpClient)
  getHighestRatedRecipes(page: number = 0, size: number = 6): Observable<Recipe[]> {
    return of(mockRecipes.slice(0,6))
  }

  getRecipeById(id: number): Observable<Recipe | undefined> {
    return of(mockRecipes.find(recipe => recipe.id == id));
  }
}
