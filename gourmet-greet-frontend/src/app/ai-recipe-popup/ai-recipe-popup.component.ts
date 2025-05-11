import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AIRecipeResponse } from '../interfaces/ai-recipe-response.interface';
import { CommonModule } from '@angular/common';

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

  tryAgain(){
    this.retry.emit(this.ingredients)
  }
  
  closePopup() {
    this.visible = false;
    this.close.emit();
  }
}
