import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReviewNotifierService {
  private reviewSubmittedSource = new Subject<void>();
  reviewSubmitted$ = this.reviewSubmittedSource.asObservable();

  notifyReviewSubmitted() {
    this.reviewSubmittedSource.next();
  }
}
