import { Component, inject, Input, OnInit } from '@angular/core';
import { Recipe } from '../../interfaces/recipe.interface';
import { CommonModule } from '@angular/common';
import { RecipeCardComponent } from '../../recipe-card/recipe-card.component';
import { RecipeService } from '../../services/recipe.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-recipes',
  imports: [RecipeCardComponent, CommonModule, RouterLink],
  templateUrl: './user-recipes.component.html',
  styleUrl: './user-recipes.component.css'
})
export class UserRecipesComponent implements OnInit{
  @Input() recipes: number[] | null | undefined = []
  @Input() type?: "Favourites" | "Owned"

  detailedRecipes: Recipe[] = [];

  recipeService = inject(RecipeService)

  showAll = false

  ngOnInit() {
    if (this.recipes && this.recipes.length > 0) {
      const initialIds = this.recipes.slice(0, 3);
      this.fetchRecipes(initialIds);
    }
  }


toggleViewAll() {
  this.showAll = !this.showAll;
  if (this.showAll && this.recipes) {
    const remainingIds = this.recipes.slice(3).filter(id =>
      !this.detailedRecipes.some(r => r.id === id)
    );

    this.fetchRecipes(remainingIds);
  }
}

fetchRecipes(ids: number[]) {
  ids.forEach(id => {
    this.recipeService.getRecipeById(id).subscribe(recipe => {
      if (recipe && !this.detailedRecipes.some(r => r.id === recipe.id)) {
        this.detailedRecipes.push(recipe);
      }
    });
  });
}

}
