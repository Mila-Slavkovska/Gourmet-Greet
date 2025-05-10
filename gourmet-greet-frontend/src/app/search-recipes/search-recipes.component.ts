import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { RecipeService } from '../services/recipe.service';
import { CategoryService } from '../services/category.service';
import { Recipe } from '../interfaces/recipe.interface';
import { Category } from '../interfaces/category.interface';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { TopIngredient } from '../interfaces/top-ingredient.interface';
import { AiFeatureComponent } from '../ai-feature/ai-feature.component';
import { OpenAiService } from '../services/open-ai.service';
import { AISuggestRecipeResponse } from '../interfaces/suggest-recipe-response.interface';
import { SuggestionsPopupComponent } from '../suggestions-popup/suggestions-popup.component';

@Component({
  selector: 'app-search-recipes',
  standalone: true,
  imports: [ReactiveFormsModule, RecipeCardComponent, AiFeatureComponent, SuggestionsPopupComponent],
  templateUrl: './search-recipes.component.html',
  styleUrls: ['./search-recipes.component.css'],
})
export class SearchRecipesComponent implements OnInit {
  showAdvancedSearch = false;
  showAIComponent = false;
  showSuggestions = false;

  aiSuggestions: AISuggestRecipeResponse = {
    recipesWithIngredients: [],
    otherRecipes: []
  };
  isLoadingSuggestions = false;
  suggestByIngredients: string[] = [];

  recipeService = inject(RecipeService);
  categoryService = inject(CategoryService);
  openAIService = inject(OpenAiService);

  allRecipes: Recipe[] = [];

  skillLevels: Category[] = [];
  recipeCategories: Category[] = [];
  dietaryOptions: Category[] = [];
  cuisineOptions: Category[] = [];
  ingredients: TopIngredient[] = [];

  subject: Subject<number> = new Subject();

  currentPage = 0;
  pageSize = 9;
  hasMore = false;

  selectedSkillLevels: Category[] = [];
  selectedRecipeCategories: Category[] = [];
  selectedDietaries: Category[] = [];
  selectedCuisines: Category[] = [];
  selectedIngredients: string[] = [];

  form: FormGroup = new FormGroup({
    title: new FormControl(''),
    ingredient: new FormControl(''),
    cookingTime: new FormControl(''),
    numberOfServings: new FormControl(''),
    skillLevels: new FormControl([]),
    recipeCategories: new FormControl([]),
    ingredients: new FormControl([]),
    dietaryOptions: new FormControl([]),
    cuisineOptions: new FormControl([]),
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
      cuisine: this.categoryService.getCategoriesByType('CUISINE_TYPE'),
      topIngredients: this.recipeService.getTop10Ingredients(),
    }).subscribe(({ dietary, recipe, skill, cuisine, topIngredients }) => {
      this.dietaryOptions = dietary;
      this.recipeCategories = recipe;
      this.skillLevels = skill;
      this.cuisineOptions = cuisine;
      this.ingredients = topIngredients;
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
    const selectedCuisineIds = queryParams['cuisineOptions']
      ? queryParams['cuisineOptions'].split(',')
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
    this.selectedCuisines = this.cuisineOptions.filter((diet) =>
      selectedCuisineIds.includes(diet.id.toString())
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
      cuisineOptions: this.selectedCuisines.map((d) => d.id).join(','),
      ingredients: this.selectedIngredients.join(','),
      pageSize: 9,
    };

    const cleanedParams = this.cleanQueryParams(params);

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: cleanedParams,
    });
  }

  toggleAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
    this.showAIComponent = false;
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
        console.log(oldQueryParams);
        console.log(queryParams);
        console.log(recipes);
        this.allRecipes = recipes.recipes;
        this.hasMore = this.allRecipes.length < recipes.totalResults;
      });
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

  removeDietary(category: Category) {
    this.selectedDietaries = this.selectedDietaries.filter(
      (i) => i !== category
    );
  }

  removeSkillLevel(category: Category) {
    this.selectedSkillLevels = this.selectedSkillLevels.filter(
      (i) => i !== category
    );
  }

  removeRecipeCategory(category: Category) {
    this.selectedRecipeCategories = this.selectedRecipeCategories.filter(
      (i) => i !== category
    );
  }

  removeCuisine(category: Category) {
    this.selectedCuisines = this.selectedCuisines.filter((i) => i !== category);
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

  selectCuisine(diet: Category) {
    const index = this.selectedCuisines.findIndex((d) => d.id === diet.id);
    index > -1
      ? this.selectedCuisines.splice(index, 1)
      : this.selectedCuisines.push(diet);
  }

  selectIngredient(ingredient: TopIngredient) {
    const index = this.selectedIngredients.findIndex(
      (d) => d === ingredient.ingredient
    );
    index > -1
      ? this.selectedIngredients.splice(index, 1)
      : this.selectedIngredients.push(ingredient.ingredient);
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

  isCuisineSelected(diet: Category): boolean {
    return this.selectedCuisines.some((d) => d.id === diet.id);
  }

  isIngredientSelected(ingredient: TopIngredient): boolean {
    return this.selectedIngredients.some((d) => d === ingredient.ingredient);
  }
  
  toggleAIComponent(){
    this.showAIComponent = !this.showAIComponent;
    this.showAdvancedSearch = false;
  }

  handleAISuggest(ingredients: string[]) {
    this.isLoadingSuggestions = true;
    this.showSuggestions = true;
    this.suggestByIngredients = ingredients;
    
    this.openAIService.suggestRecipes({ingredients: ingredients.join(', ')}).subscribe({
      next: (suggestions) => {
        console.log(suggestions)
        console.log(suggestions.otherRecipes)
        this.aiSuggestions = suggestions;
        this.isLoadingSuggestions = false;
      },
      error: (err) => {
        console.error('Error getting suggestions:', err);
        this.aiSuggestions = {recipesWithIngredients: [], otherRecipes: []};
        this.isLoadingSuggestions = false;
      }
    });
  }

  closeSuggestions() {
    this.showSuggestions = false;
    this.isLoadingSuggestions = false;
  }
  
  handleAICreation(ingredients: string[]) {
    // TODO: Implement AI create recipe logic
    console.log('Implement AI creation with:', ingredients);
  }
}
