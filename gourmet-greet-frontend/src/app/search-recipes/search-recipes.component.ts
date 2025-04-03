import { Component, inject, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../interfaces/recipe.interface';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-search-recipes',
  imports: [RecipeCardComponent, ReactiveFormsModule],
  templateUrl: './search-recipes.component.html',
  styleUrl: './search-recipes.component.css',
})
export class SearchRecipesComponent implements OnInit {
  showAdvancedSearch: boolean = false;
  recipeService = inject(RecipeService);
  allRecipes: Recipe[] = [];

  skillLevels = ['Beginner', 'Intermediate', 'Advanced'];
  recipeCategories = [
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snack',
    'Appetizer',
    'Dessert',
  ];
  dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'High-Protein',
    'Glutern-Free',
    'Sugar-Free',
    'Keto',
  ];

  selectedSkillLevel: string | null = null;
  selectedRecipeCategory: string | null = null;
  selectedDietary: string | null = null;
  selectedIngredients: string[] = [];
  ingredientForm: FormGroup = new FormGroup({
    ingredient: new FormControl(),
  });

  addIngredient() {
    const ingredientControl = this.ingredientForm.get('ingredient');
    if (!ingredientControl) return;

    const value = ingredientControl.value?.trim();

    if (value) {
      this.selectedIngredients.push(value);
      ingredientControl.reset();
    }
  }

  removeIngredient(ingredient: string) {
    const index = this.selectedIngredients.indexOf(ingredient);
    if (index > -1) {
      this.selectedIngredients.splice(index, 1);
    }
  }

  ngOnInit(): void {
    this.recipeService
      .getAllRecipes()
      .subscribe((recipes) => (this.allRecipes = recipes));
  }

  toggleAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }

  selectSkillLevel(level: string) {
    this.selectedSkillLevel = this.selectedSkillLevel === level ? null : level;
  }

  selectRecipeCategory(category: string) {
    this.selectedRecipeCategory =
      this.selectedRecipeCategory === category ? null : category;
  }

  selectDietary(diet: string) {
    this.selectedDietary = this.selectedDietary === diet ? null : diet;
  }

  clearSkillLevel() {
    this.selectedSkillLevel = null;
  }

  clearRecipeCategory() {
    this.selectedRecipeCategory = null;
  }

  clearDietary() {
    this.selectedDietary = null;
  }
}
