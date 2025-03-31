import { Component, inject, OnInit } from '@angular/core';
import { RecipeCardComponent } from "../recipe-card/recipe-card.component";
import { Recipe } from '../interfaces/recipe.interface';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipes',
  imports: [RecipeCardComponent],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})
export class RecipesComponent implements OnInit {
  recipeService = inject(RecipeService)
  recipes: Recipe[] = []

  ngOnInit(): void {
    this.recipeService.getHighestRatedRecipes().subscribe(
      recipes => this.recipes = recipes
    )
  }
}
