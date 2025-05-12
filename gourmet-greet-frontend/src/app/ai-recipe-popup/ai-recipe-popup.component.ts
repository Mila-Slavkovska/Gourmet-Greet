import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AIRecipeResponse } from '../interfaces/ai-recipe-response.interface';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../interfaces/user.interface';

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

  @Output() close = new EventEmitter();
  @Output() retry = new EventEmitter<string[]>();

  router = inject(Router);
  userService = inject(UserService);
  user: User = this.userService.getCurrentUser();

  tryAgain(){
    this.retry.emit(this.ingredients)
  }

  createRecipe(){
    this.router.navigate(['/recipes/add'], {
      state: { data: this.recipe }
    })
  }
  
  closePopup() {
    this.visible = false;
    this.close.emit();
  }
}
