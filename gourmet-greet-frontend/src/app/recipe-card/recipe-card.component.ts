import { Component, Input } from '@angular/core';
import { Recipe } from '../interfaces/recipe.interface';
import { mockRecipes } from '../mock-data/mock-recipes';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipe-card',
  imports: [RouterLink],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  @Input() recipe?: Recipe;


}
