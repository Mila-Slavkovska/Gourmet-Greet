import { Component, Input } from '@angular/core';
import { Recipe } from '../interfaces/recipe.interface';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-recipe-card',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  @Input() recipe?: Recipe;


}
