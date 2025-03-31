
import { Component, Input } from '@angular/core';
import { Review } from '../interfaces/review.interface';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  @Input() reviews: Review[] | undefined;
}

