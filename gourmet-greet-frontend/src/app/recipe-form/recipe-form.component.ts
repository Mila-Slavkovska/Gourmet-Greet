import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CategoryService } from '../services/category.service';
import { Category } from '../interfaces/category.interface';
import { forkJoin } from 'rxjs';
import { RecipeAddDto } from '../interfaces/recipe-add.interface';
import { UserService } from '../user.service';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css'],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule, MatIconModule, CommonModule, ReactiveFormsModule]
})
export class RecipeFormComponent implements OnInit {
  recipeForm: FormGroup;
  categoryService = inject(CategoryService);
  userService = inject(UserService)
  recipeService = inject(RecipeService)

  skillLevels: Category[] = [];
  recipeCategories: Category[] = [];
  dietaryOptions: Category[] = [];

  posterFile: File | null = null;
  posterPreviewUrl: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      ingredients: this.fb.array([]),
      steps: this.fb.array([]),
      categories: this.fb.array([]),
      cookingTime: [0],
      servings: [0],
      // poster: [],
      images: this.fb.array([])
    });
  }

  ngOnInit(): void {
    forkJoin({
          dietary: this.categoryService.getCategoriesByType('DIETARY'),
          recipe: this.categoryService.getCategoriesByType('RECIPE_TYPE'),
          skill: this.categoryService.getCategoriesByType('SKILL_LEVEL'),
        }).subscribe(({ dietary, recipe, skill }) => {
          this.dietaryOptions = dietary;
          this.recipeCategories = recipe;
          this.skillLevels = skill;
    });
  }

  get categoriesArray(): FormArray {
    return this.recipeForm.get('categories') as FormArray;
  }

  onCheckboxChange(event: any, categoryId: number){
    if (event.checked) {
      this.categoriesArray.push(new FormControl(categoryId));
    } else {
      const index = this.categoriesArray.controls.findIndex(ctrl => ctrl.value === categoryId);
      if (index !== -1) {
        this.categoriesArray.removeAt(index);
      }
    }
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(new FormControl(''));
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  addStep() {
    this.steps.push(new FormControl(''));
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  onSubmit() {
    const formValue = this.recipeForm.value;
    const recipeDto: RecipeAddDto = {
      ...formValue,
      categories: formValue.categories,
      images: formValue.images
    };

    this.userService.getUserDetails().subscribe({
      next: (user) => {
        recipeDto.ownerId = user.id 
      },
      error: (err) => {
        console.error('Failed to get user details:', err);
      }
    });
    
    console.log(recipeDto)

    this.recipeService.createRecipe(recipeDto)
  }

  onPosterSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
  
    this.posterFile = input.files[0];
  
    const reader = new FileReader();
    reader.onload = () => {
      this.posterPreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(this.posterFile);
  }
}
