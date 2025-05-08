import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CalorieEstimationResponse } from '../interfaces/calorie-estimation-response.interface';

@Component({
  selector: 'app-calorie-estimation',
  templateUrl: './calorie-estimation.component.html',
  styleUrls: ['./calorie-estimation.component.css']
})
export class CalorieEstimationComponent {
  @Input() showModal = false;
  @Output() modalClosed = new EventEmitter<void>();

  calorieEstimation?: CalorieEstimationResponse | null;

  estimateCalories() {
    this.showModal = true;
    this.calorieEstimation = null;

    setTimeout(() => {
      this.calorieEstimation = {
        calories: Math.round(Math.random() * 500 + 300),
        protein: Math.round(Math.random() * 30 + 10),
        carbs: Math.round(Math.random() * 60 + 20),
        fat: Math.round(Math.random() * 30 + 5)
      };
    }, 2000);
  }

  closeModal() {
    this.showModal = false;
    this.calorieEstimation = null;
    this.modalClosed.emit();
  }
}
