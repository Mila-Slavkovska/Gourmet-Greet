import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AISuggestRecipeResponse } from '../interfaces/suggest-recipe-response.interface';
import { Router } from '@angular/router';
import { IngredientRecipeDto } from '../ai-feature/ai-feature.component';

@Component({
  selector: 'app-suggestions-popup',
  imports: [],
  templateUrl: './suggestions-popup.component.html',
  styleUrl: './suggestions-popup.component.css'
})
export class SuggestionsPopupComponent {
  @Input() suggestions: AISuggestRecipeResponse = {
    recipesWithIngredients: [],
    otherRecipes: []
  };
  @Input() ingredients: string[] = []
  @Input() visible = false;
  @Input() isLoading = false;

  @Output() close = new EventEmitter();
  @Output() retry = new EventEmitter<IngredientRecipeDto>();

  private router = inject(Router)

  viewRecipe(recipe: string) {
    this.router.navigate(['/search'], {
      queryParams: {
        title: recipe,
        pageSize: 9
      }
    })

    this.closePopup(recipe)
  }

  tryAgain(){
    this.retry.emit({
      ingredients: this.ingredients,
      recipeType: ''
    });
  }

  closePopup(title: string = '') {
    this.visible = false;
    this.close.emit(title)
  }
}
