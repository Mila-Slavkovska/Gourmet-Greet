import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-ai-feature',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule],
  templateUrl: './ai-feature.component.html',
  styleUrl: './ai-feature.component.css'
})
export class AiFeatureComponent {
  ingredientsFG: FormGroup;
  showError = false;

  @Output() suggest = new EventEmitter<string[]>();
  @Output() create = new EventEmitter<string[]>();

  constructor(private fb: FormBuilder){
    this.ingredientsFG = this.fb.group({
      ingredients: this.fb.array([])
    });
  }

  get ingredients(): FormArray {
    return this.ingredientsFG.get('ingredients') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(new FormControl('', Validators.required));
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  onSuggest() {
    const ingredients = this.ingredients.value.filter((ingredient: string) => ingredient.length > 0);
    console.log("clicked: ", ingredients)
    if (ingredients.length > 0) {
      this.showError = false;
      this.suggest.emit(ingredients);
    } else {
      this.showError = true;
    }
  }

  onCreate() {
    const ingredients = this.ingredients.value.filter((ingredient: string) => ingredient.length > 0);
    
    if (ingredients.length > 0) {
      this.showError = false;
      this.create.emit(ingredients);
    } else {
      this.showError = true;
    }
  }
}
