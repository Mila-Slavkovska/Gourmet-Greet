import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CategoryService } from '../services/category.service';
import { Category } from '../interfaces/category.interface';
import { forkJoin, map, merge, mergeMap, Observable, of, switchMap } from 'rxjs';
import { RecipeAddDto } from '../interfaces/recipe-add.interface';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../interfaces/recipe.interface';
import { Router } from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css'],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule, MatIconModule, CommonModule, ReactiveFormsModule]
})
export class RecipeFormComponent implements OnInit {
  recipeForm: FormGroup;
  categoryService = inject(CategoryService);
  userService = inject(UserService);
  recipeService = inject(RecipeService);
  router = inject(Router)

  skillLevels: Category[] = [];
  recipeCategories: Category[] = [];
  dietaryOptions: Category[] = [];

  posterFile: File | null = null;
  posterPreviewUrl: string | null = null;
  galleryFiles: File[] = [];
  galleryPreviewUrls: string[] = [];

  titleErrorMessage = signal('');
  ingredientsErrorMessage = signal('');
  stepsErrorMessage = signal('');

  constructor(private fb: FormBuilder) {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      ingredients: this.fb.array([]),
      steps: this.fb.array([]),
      categories: this.fb.array([]),
      cookingTime: [0],
      servings: [0]
    });

    const titleControl = this.recipeForm.get('title') as FormControl;
    merge(titleControl?.statusChanges, titleControl?.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateTitleErrorMessage())

    this.ingredients.valueChanges.subscribe(() => {
      this.ingredientErrorMessage();
    });

    this.ingredients.statusChanges.subscribe(() => {
      this.ingredientErrorMessage();
    });

    this.steps.valueChanges.subscribe(() => {
      this.stepErrorMessage();
    });

    this.steps.statusChanges.subscribe(() => {
      this.stepErrorMessage();
    });
  }

  ingredientErrorMessage(): string {
    if (this.ingredients.length === 0) return '';
    let errorMessages: string[] = [];
    this.ingredients.controls.forEach((control, index) => {
      if (control.invalid) {
        errorMessages.push('Ingredient is required.');
      }
    });
    return errorMessages.join(' ');
  }

  stepErrorMessage(): string {
    if (this.steps.length === 0) return '';
    let errorMessages: string[] = [];
    this.steps.controls.forEach((control) => {
      if (control.invalid) {
        errorMessages.push('Step is required.');
      }
    });
    return errorMessages.join(' ');
  }

  updateTitleErrorMessage(){
    if(this.recipeForm.get('title')?.hasError('required')){
      this.titleErrorMessage.set('You must enter a value');
    } else {
      this.titleErrorMessage.set('');
    }
  }

  updateFormErrorMessages(){
    this.updateTitleErrorMessage()

    if (this.ingredients.length === 0) {
      this.ingredientsErrorMessage.set('Add at least one ingredient!');
    } else {
      this.ingredientsErrorMessage.set('');
      this.ingredientErrorMessage()
    }

    if (this.steps.length === 0) {
      this.stepsErrorMessage.set('Add at least one step!');
    } else {
      this.stepsErrorMessage.set('');
      this.stepErrorMessage()
    }
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
    this.ingredients.push(new FormControl('', Validators.required));
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  addStep() {
    this.steps.push(new FormControl('', Validators.required));
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  onSubmit() {
    const formValue = this.recipeForm.value;
    const recipeDto: RecipeAddDto = {
      ...formValue,
      categories: formValue.categories,
      poster: 0,
      images: []
    };

    const ingredients = recipeDto.ingredients.filter(ingredient => ingredient.length > 0)
    const steps = recipeDto.steps.filter(step => step.length > 0)

    if(this.recipeForm.invalid || ingredients.length<1 || steps.length<1){
      this.updateFormErrorMessages()
      return
    }

    this.userService.getUserDetails().pipe(
      switchMap(user => {
        recipeDto.ownerId = user.id
        recipeDto.ingredients = recipeDto.ingredients.filter(ingredient => ingredient.length > 0)
        recipeDto.steps = recipeDto.steps.filter(step => step.length > 0)
        return this.recipeService.createRecipe(recipeDto)
      }),
      switchMap((addedRecipe: Recipe) => {
        const recipeId = addedRecipe.id

        const uploadPoster$: Observable<any> = this.posterFile
        ? this.recipeService.uploadPoster(recipeId, this.posterFile)
        : of(null);

        const uploadImages$: Observable<any[]> = this.galleryFiles.length > 0
        ? forkJoin(
          this.galleryFiles.map(file => this.recipeService.uploadImage(recipeId, file))
        )
        : of([])

        return uploadPoster$.pipe(
          mergeMap(() => uploadImages$),
          map(() => addedRecipe)
        );
      })
    ).subscribe({
      next: (res) => {
        console.log('Recipe created:', res);
        this.router.navigate(['/recipes', res.id])
      },
      error: (err) => console.error('Error:', err)
    });
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

  removePoster() {
    this.posterFile = null;
    this.posterPreviewUrl = null;
  }

  onGallerySelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    Array.from(input.files).forEach(file => {
      this.galleryFiles.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.galleryPreviewUrls.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    });

    input.value = '';
  }

  removeGalleryImage(index: number) {
    this.galleryFiles.splice(index, 1);
    this.galleryPreviewUrls.splice(index, 1);
  }
}
