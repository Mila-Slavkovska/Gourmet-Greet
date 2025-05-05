import { Component, inject, Input, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { User } from '../../interfaces/user.interface';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-user-details',
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  //TODO: Find number of reviews for every user
  //TODO: Add upgrade button on user
  reviewService = inject(ReviewService)

  @Input() user?: User
  numReviews = 0

  ngOnInit() {
    this.reviewService.getNumberOfReviewsForUser()
    .subscribe((reviews) => this.numReviews = reviews)
  }
}
