import { Component, inject, Input } from '@angular/core';
import { Recipe } from '../interfaces/recipe.interface';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-card',
  imports: [RouterLink, DecimalPipe],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {
  @Input() recipe?: Recipe;
  recipeService = inject(RecipeService)
  image: string = ""

  ngOnInit(): void {
    if(this.recipe && this.recipe.posterId) {
      this.image = this.recipeService.getFullRecipeImageUrl(this.recipe.id, this.recipe.posterId);
    }
    else {
      this.image = './default-recipe-poster-image.jpg';
    }
  }

}
