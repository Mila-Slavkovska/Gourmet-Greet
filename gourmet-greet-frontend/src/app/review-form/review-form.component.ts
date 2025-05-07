import { Component, inject, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Review } from '../interfaces/review.interface';
import { RecipeService } from '../services/recipe.service';
import { ReviewService } from '../review-notifier.service';
import { ReviewNotifierService } from '../services/review-notifier.service';

@Component({
  selector: 'app-review-form',
  imports: [ReactiveFormsModule],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css',
})
export class ReviewFormComponent {
  @Input() recipeId?: number;

  recipeService = inject(RecipeService);
  reviewService = inject(ReviewService);
  reviewNotifierService = inject(ReviewNotifierService)

  form = new FormGroup({
    grade: new FormControl<number>(1, [Validators.required]),
    comment: new FormControl('', [Validators.required]),
  });

  selectedRating = 0;

  onStarClick(rating: number) {
    this.selectedRating = rating;
    this.form.get('grade')?.setValue(rating);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.value;
    const reviewPayload: Partial<Review> = {
      grade: formValue.grade ?? 0,
      comment: formValue.comment ?? '',
      recipeId: this.recipeId,
    };

    this.recipeService.createReviewForRecipe(reviewPayload).subscribe({
      next: (res: Review) => {
        this.form.reset({
          grade: 1,
          comment: '',
        });
        this.selectedRating = 0;
        console.log("review")
        this.reviewNotifierService.notifyReviewSubmitted();
      },
    });
  }
}
