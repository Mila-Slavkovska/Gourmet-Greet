import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { CategoryService } from '../services/category.service';
import { Recipe } from '../interfaces/recipe.interface';
import { ReviewsComponent } from '../reviews/reviews.component';
import { ReviewFormComponent } from '../review-form/review-form.component';
import { NgClass } from '@angular/common';
import { ReviewService } from '../services/review.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css'],
  imports: [ReviewsComponent, ReviewFormComponent, NgClass],
})
export class RecipeDetailsComponent implements OnInit {
  recipe?: Recipe;
  categoryNames: string[] = [];
  id?: number;
  currentImageIndex: number = 0;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeService = inject(RecipeService);
  private categoryService = inject(CategoryService);
  private reviewNotifierService = inject(ReviewService);

  isFavorite = false;

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scroll({
          top: 0,
          behavior: 'smooth',
        });
      });

    this.route.params.subscribe((params) => {
      this.id = +params['id'];
      if (this.id) {
        this.loadRecipe();
        this.reviewNotifierService.reviewSubmitted$.subscribe(() =>
          this.loadRecipe()
        );
      }
    });

    if (this.loggedIn()) {
      this.recipeService
        .isFavourite(this.id || 0)
        .subscribe((favourite) => (this.isFavorite = favourite));
    }
  }

  loadRecipe(): void {
    if (this.id) {
      this.recipeService.getRecipeById(this.id).subscribe((recipe) => {
        this.recipe = recipe;
        if (recipe?.categoryIds.length) {
          this.loadCategories(recipe.categoryIds);
        }
      });
    }
  }

  private loadCategories(categoryIds: number[]): void {
    this.categoryService
      .getCategoriesByIds(categoryIds)
      .subscribe((categories) => {
        this.categoryNames = categories.map((c) => c.name);
      });
  }

  getPosterImage(): string {
    const { id, posterId } = this.recipe || {};
    if (id && posterId) {
      return this.recipeService.getFullRecipeImageUrl(id, posterId);
    }
    return './default-recipe-poster-image.jpg';
  }

  prevImage(): void {
    if (this.recipe?.galleryImageIds?.length) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.recipe.galleryImageIds.length) %
        this.recipe.galleryImageIds.length;
    }
  }

  nextImage(): void {
    if (this.recipe?.galleryImageIds?.length) {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.recipe.galleryImageIds.length;
    }
  }

  getFullImageUrl(imageId: number | undefined): string {
    if (this.id && imageId) {
      return this.recipeService.getFullRecipeImageUrl(this.id, imageId);
    }
    return './default-recipe-poster-image.jpg';
  }

  goToImage(index: number): void {
    this.currentImageIndex = index;
  }

  loggedIn() {
    return localStorage.getItem('token') != null;
  }

  toggleFavorite() {
    if (!this.id) return;

    if (this.isFavorite) {
      this.recipeService.removeFromFavorites(this.id).subscribe({
        next: () => {
          this.isFavorite = false;
        },
      });
    } else {
      this.recipeService.addToFavorites(this.id).subscribe({
        next: () => {
          this.isFavorite = true;
        },
      });
    }
  }
}
