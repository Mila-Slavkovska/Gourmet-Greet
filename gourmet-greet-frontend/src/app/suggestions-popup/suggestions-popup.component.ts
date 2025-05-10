import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AISuggestRecipeResponse } from '../interfaces/suggest-recipe-response.interface';

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
  @Output() retry = new EventEmitter<string[]>();

  viewRecipe(recipe: string) {
    console.log('Clicked recipe:', recipe);
  }

  tryAgain() {
    console.log(this.ingredients)
    this.retry.emit(this.ingredients);
  }

  closePopup() {
    this.visible = false;
    this.close.emit()
  }
}
