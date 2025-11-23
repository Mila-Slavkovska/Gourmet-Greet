import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

 export interface IngredientRecipeDto {
      recipeType: string;
      ingredients: string[];
  }

@Component({
  selector: 'app-ai-feature',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule, MatSelectModule],
  templateUrl: './ai-feature.component.html',
  styleUrl: './ai-feature.component.css'
})
export class AiFeatureComponent {
  ingredientsFG: FormGroup;
  showError = false;


  @Output() suggest = new EventEmitter<IngredientRecipeDto>();
  @Output() create = new EventEmitter<IngredientRecipeDto>();


 readonly types = [
  {key: "breakfast", label: "Breakfast"},
  {key: "main dish", label: "Main Dish"},
  {key: "dessert", label: "Dessert"},
  {key: "appetizers", label: "Appetizers"}
 ]


  constructor(private fb: FormBuilder){
    this.ingredientsFG = this.fb.group({
      ingredients: this.fb.array([]),
      recipeType: new FormControl('breakfast', Validators.required)
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
    const recipeType = this.ingredientsFG.get('recipeType')?.value;

    if (ingredients.length > 0) {
      this.showError = false;
      this.suggest.emit( {ingredients, recipeType});
    } else {
      this.showError = true;
    }
  }

  onCreate() {
    const ingredients = this.ingredients.value.filter((ingredient: string) => ingredient.length > 0);
    const recipeType = this.ingredientsFG.get('recipeType')?.value;

    if (ingredients.length > 0) {
      this.showError = false;
      this.create.emit({ingredients, recipeType});
    } else {
      this.showError = true;
    }
  }
}
