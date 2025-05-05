import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private reviewSubmittedSource = new Subject<void>();
  reviewSubmitted$ = this.reviewSubmittedSource.asObservable();

  httpClient = inject(HttpClient)
  
  notifyReviewSubmitted() {
    this.reviewSubmittedSource.next();
  }

  getNumberOfReviewsForUser() {
    return this.httpClient.get<number>(`/api/reviews/for-user`);
  }
}
