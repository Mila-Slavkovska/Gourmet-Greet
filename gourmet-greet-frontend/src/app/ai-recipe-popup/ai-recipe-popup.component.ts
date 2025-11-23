import { Component, EventEmitter, inject, input, Input, output, Output } from '@angular/core';
import { AIRecipeResponse } from '../interfaces/ai-recipe-response.interface';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../interfaces/user.interface';
import { IngredientRecipeDto } from '../ai-feature/ai-feature.component';

@Component({
  selector: 'app-ai-recipe-popup',
  imports: [CommonModule],
  templateUrl: './ai-recipe-popup.component.html',
  styleUrl: './ai-recipe-popup.component.css'
})
export class AiRecipePopupComponent {
  @Input() recipe: AIRecipeResponse | null = null;
  @Input() ingredients: string[] = []
  @Input() visible = false;
  @Input() isLoading = false;
  recipeCreated = input<boolean>();
  saveRecipe = output<void>();

  @Output() close = new EventEmitter();
  @Output() retry = new EventEmitter<IngredientRecipeDto>();

  router = inject(Router);
  userService = inject(UserService);
  user: User = this.userService.getCurrentUser();

  showCreateRecipeButton = output<void>();

  tryAgain(){
    this.retry.emit({
      ingredients: this.ingredients,
      recipeType: ''
    });

    this.showCreateRecipeButton.emit();
  }

  createRecipe(){
   this.saveRecipe.emit();
  }

  closePopup() {
    this.visible = false;
    this.close.emit();
  }
}
