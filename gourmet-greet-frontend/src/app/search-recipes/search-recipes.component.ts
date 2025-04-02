import { Component, inject, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../interfaces/recipe.interface';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';

@Component({
  selector: 'app-search-recipes',
  imports: [RecipeCardComponent],
  templateUrl: './search-recipes.component.html',
  styleUrl: './search-recipes.component.css',
})
export class SearchRecipesComponent implements OnInit {
  showAdvancedSearch: boolean = false;
  recipeService = inject(RecipeService)
  allRecipes: Recipe[] = []
  ngOnInit(): void {
    this.recipeService.getAllRecipes()
    .subscribe((recipes) => this.allRecipes = recipes)
  }

  toggleAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }


}
