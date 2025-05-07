import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  httpClient = inject(HttpClient)

  getNumberOfReviewsForUser() {
    return this.httpClient.get<number>(`/api/reviews/for-user`);
  }
}
