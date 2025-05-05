import { Component, inject, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RecipeService } from '../services/recipe.service';
import { Review } from '../interfaces/review.interface';
import { ReviewService } from '../services/review.service';

@Component({
  selector: 'app-review-form',
  imports: [ReactiveFormsModule],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css',
})
export class ReviewFormComponent {
  @Input() recipeId?: number;

  reviewService = inject(RecipeService);
  reviewNotifierService = inject(ReviewService);

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

    this.reviewService.createReviewForRecipe(reviewPayload).subscribe({
      next: (res: Review) => {
        this.form.reset({
          grade: 1,
          comment: '',
        });
        this.selectedRating = 0;
        this.reviewNotifierService.notifyReviewSubmitted();
      },
    });
  }
}
