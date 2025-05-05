import { Component, inject, Input, OnInit } from '@angular/core';
import { Recipe } from '../../interfaces/recipe.interface';
import { CommonModule } from '@angular/common';
import { mockRecipes } from '../../mock-data/mock-recipes';
import { RecipeCardComponent } from '../../recipe-card/recipe-card.component';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-user-recipes',
  imports: [RecipeCardComponent, CommonModule],
  templateUrl: './user-recipes.component.html',
  styleUrl: './user-recipes.component.css'
})
export class UserRecipesComponent implements OnInit{
  //TODO: In template, add View all functionality
  @Input() recipes: number[] | null | undefined = []
  @Input() type?: "Favourites" | "Owned"

  detailedRecipes: Recipe[] = [];

  recipeService = inject(RecipeService)

  ngOnInit() {
    if(this.recipes) {
      this.recipes.forEach(recipe => {
        this.recipeService.getRecipeById(recipe).subscribe(fullRecipe => {
          if (fullRecipe) {
            this.detailedRecipes.push(fullRecipe);
          }
        });
      });
    }
}
}
