import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { OpenAiService } from '../services/open-ai.service';
import { Recipe } from '../interfaces/recipe.interface';
import { CalorieEstimationRequest } from '../interfaces/calorie-estimation-request.interface';
import { CalorieEstimation } from '../interfaces/calorie-estimation.interface';

@Component({
  selector: 'app-calorie-estimation',
  templateUrl: './calorie-estimation.component.html',
  styleUrls: ['./calorie-estimation.component.css']
})
export class CalorieEstimationComponent {

  @Input() recipe?: Recipe

  @Input() showModal = false;
  @Output() modalClosed = new EventEmitter<void>();

  calorieEstimation?: CalorieEstimation | null;
  openAiService = inject(OpenAiService)

  estimateCalories() {
    this.showModal = true;
    if (!this.recipe) return;

    const request: CalorieEstimationRequest = {
      ingredients: this.recipe.ingredients,
      steps: this.recipe.steps
    };

    this.openAiService.estimateCalories(request)
    .subscribe(estimation =>{
      this.calorieEstimation = estimation.calorieEstimation

    })
  }

  closeModal() {
    this.showModal = false;
    this.calorieEstimation = null;
    this.modalClosed.emit();
  }
}
