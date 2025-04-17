import { Component, Input } from '@angular/core';
import { Recipe } from '../../interfaces/recipe.interface';
import { CommonModule } from '@angular/common';
import { mockRecipes } from '../../mock-data/mock-recipes';
import { RecipeCardComponent } from '../../recipe-card/recipe-card.component';

@Component({
  selector: 'app-user-recipes',
  imports: [RecipeCardComponent, CommonModule],
  templateUrl: './user-recipes.component.html',
  styleUrl: './user-recipes.component.css'
})
export class UserRecipesComponent {
  //TODO: In template, add View all functionality
  @Input() recipes: number[] | null | undefined = []
  @Input() type?: "Favourites" | "Owned"

  getRecipe(id: number){
    //TODO: Integrate with [BE]
    return mockRecipes.find(r => r.id === id)
  }
}
