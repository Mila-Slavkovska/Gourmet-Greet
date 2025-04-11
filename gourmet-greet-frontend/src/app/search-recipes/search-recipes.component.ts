import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';

import { RecipeService } from '../recipe.service';
import { CategoryService } from '../category.service';
import { Recipe } from '../interfaces/recipe.interface';
import { Category } from '../interfaces/category.interface';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-search-recipes',
  standalone: true,
  imports: [ReactiveFormsModule, RecipeCardComponent],
  templateUrl: './search-recipes.component.html',
  styleUrls: ['./search-recipes.component.css'],
})
export class SearchRecipesComponent implements OnInit {
  showAdvancedSearch = false;

  recipeService = inject(RecipeService);
  categoryService = inject(CategoryService);

  allRecipes: Recipe[] = [];

  skillLevels: Category[] = [];
  recipeCategories: Category[] = [];
  dietaryOptions: Category[] = [];

  subject: Subject<number> = new Subject();

  private viewportScroller = inject(ViewportScroller);

  private scrollPosition: [number, number] = [0, 0];

  currentPage = 0;
  pageSize = 9;
  hasMore = false;

  selectedSkillLevels: Category[] = [];
  selectedRecipeCategories: Category[] = [];
  selectedDietaries: Category[] = [];
  selectedIngredients: string[] = [];

  recipesLoaded = false;

  form: FormGroup = new FormGroup({
    title: new FormControl(''),
    ingredient: new FormControl(''),
    cookingTime: new FormControl(''),
    numberOfServings: new FormControl(''),
    skillLevels: new FormControl([]),
    recipeCategories: new FormControl([]),
    ingredients: new FormControl([]),
    dietaryOptions: new FormControl([]),
  });
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit(): void {
    this.subject.subscribe((pageSize) => {
      this.loadRecipes({ pageSize });
    });

    forkJoin({
      dietary: this.categoryService.getCategoriesByType('DIETARY'),
      recipe: this.categoryService.getCategoriesByType('RECIPE_TYPE'),
      skill: this.categoryService.getCategoriesByType('SKILL_LEVEL'),
    }).subscribe(({ dietary, recipe, skill }) => {
      this.dietaryOptions = dietary;
      this.recipeCategories = recipe;
      this.skillLevels = skill;
      this.patchFormValues();
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      this.loadRecipes(params);
    });
  }

  patchFormValues() {
    this.form.patchValue({ ...this.activatedRoute.snapshot.queryParams });

    const queryParams = this.activatedRoute.snapshot.queryParams;
    const selectedSkillLevelsIds = queryParams['skillLevels']
      ? queryParams['skillLevels'].split(',')
      : [];
    const selectedRecipeCategoriesIds = queryParams['recipeCategories']
      ? queryParams['recipeCategories'].split(',')
      : [];
    const selectedDietariesIds = queryParams['dietaryOptions']
      ? queryParams['dietaryOptions'].split(',')
      : [];
    const selectedIngredients = queryParams['ingredients']
      ? queryParams['ingredients'].split(',')
      : [];

    this.selectedSkillLevels = this.skillLevels.filter((level) =>
      selectedSkillLevelsIds.includes(level.id.toString())
    );
    this.selectedRecipeCategories = this.recipeCategories.filter((category) =>
      selectedRecipeCategoriesIds.includes(category.id.toString())
    );
    this.selectedDietaries = this.dietaryOptions.filter((diet) =>
      selectedDietariesIds.includes(diet.id.toString())
    );

    this.selectedIngredients = selectedIngredients;
  }

  cleanQueryParams(params: { [key: string]: any }): { [key: string]: any } {
    const cleanedParams: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(params)) {
      if (value && value !== undefined && value !== null && value !== '') {
        cleanedParams[key] = value;
      }
    }
    return cleanedParams;
  }

  updateUrlParams() {
    const params: any = {
      title: this.form.get('title')?.value,
      ingredient: this.form.get('ingredient')?.value,
      cookingTime: this.form.get('cookingTime')?.value,
      numberOfServings: this.form.get('numberOfServings')?.value,
      skillLevels: this.selectedSkillLevels.map((l) => l.id).join(','),
      recipeCategories: this.selectedRecipeCategories
        .map((c) => c.id)
        .join(','),
      dietaryOptions: this.selectedDietaries.map((d) => d.id).join(','),
      ingredients: this.selectedIngredients.join(','),
      pageSize: 9,
    };

    const cleanedParams = this.cleanQueryParams(params);

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: cleanedParams,
    });
  }

  onSearchSubmit() {
    if (this.showAdvancedSearch) {
      this.toggleAdvancedSearch();
    }
    this.updateUrlParams();
  }

  loadMore() {
    this.pageSize += 9;
    this.subject.next(this.pageSize);
  }

  loadRecipes(queryParams: any) {
    const oldQueryParams = this.cleanQueryParams(this.form.value);

    this.recipeService
      .getFilteredRecipes({
        ...oldQueryParams,
        ...queryParams,
        page: 1,
        size: +(queryParams.pageSize ?? 9),
      })
      .subscribe((recipes) => {
        this.allRecipes = recipes.recipes;
        this.hasMore = this.allRecipes.length < recipes.totalResults;
      });
  }

  toggleAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }

  addIngredient() {
    const ingredientControl = this.form.get('ingredient');
    const value = ingredientControl?.value?.trim();
    if (value && !this.selectedIngredients.includes(value)) {
      this.selectedIngredients.push(value);
      ingredientControl?.reset();
    }
  }

  removeIngredient(ingredient: string) {
    this.selectedIngredients = this.selectedIngredients.filter(
      (i) => i !== ingredient
    );
  }

  selectSkillLevel(level: Category) {
    const index = this.selectedSkillLevels.findIndex((d) => d.id === level.id);
    index > -1
      ? this.selectedSkillLevels.splice(index, 1)
      : this.selectedSkillLevels.push(level);
  }

  selectRecipeCategory(category: Category) {
    const index = this.selectedRecipeCategories.findIndex(
      (d) => d.id === category.id
    );
    index > -1
      ? this.selectedRecipeCategories.splice(index, 1)
      : this.selectedRecipeCategories.push(category);
  }

  selectDietary(diet: Category) {
    const index = this.selectedDietaries.findIndex((d) => d.id === diet.id);
    index > -1
      ? this.selectedDietaries.splice(index, 1)
      : this.selectedDietaries.push(diet);
  }

  isSkillLevelSelected(level: Category): boolean {
    return this.selectedSkillLevels.some((d) => d.id === level.id);
  }

  isRecipeCategorySelected(cat: Category): boolean {
    return this.selectedRecipeCategories.some((d) => d.id === cat.id);
  }

  isDietarySelected(diet: Category): boolean {
    return this.selectedDietaries.some((d) => d.id === diet.id);
  }
}
