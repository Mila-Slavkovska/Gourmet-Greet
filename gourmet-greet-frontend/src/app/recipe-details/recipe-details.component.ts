import { Component, inject, OnInit } from '@angular/core';
import { Recipe } from '../interfaces/recipe.interface';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { ReviewsComponent } from "../reviews/reviews.component";
import { ReviewFormComponent } from '../review-form/review-form.component';

@Component({
  selector: 'app-recipe-details',
  imports: [ReviewsComponent,ReviewsComponent,ReviewFormComponent],
  templateUrl: './recipe-details.component.html',
  styleUrl: './recipe-details.component.css',
})
export class RecipeDetailsComponent implements OnInit {
  recipe?: Recipe;
  route = inject(ActivatedRoute);
  recipeService = inject(RecipeService);
  id?: number;
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id'];
      this.loadRecipe();
    });
  }
  loadRecipe(): void {
    if (this.id) {
      this.recipeService
        .getRecipeById(this.id)
        .subscribe((recipe) => (this.recipe = recipe));
    }
  }
}
