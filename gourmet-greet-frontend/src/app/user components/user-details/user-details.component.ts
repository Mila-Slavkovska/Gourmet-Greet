import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../interfaces/user.interface';
import { ReviewService } from '../../services/review.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpgradeRequestDialogComponent } from '../upgrade-request-dialog/upgrade-request-dialog.component';
import { UpgradeConfirmationDialogComponent } from '../upgrade-confirmation-dialog/upgrade-confirmation-dialog.component';
import { ChefRequestService } from '../../services/chef-request.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-details',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, AsyncPipe],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent implements OnInit {
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {}

  reviewService = inject(ReviewService);
  chefRequestService = inject(ChefRequestService);

  @Input() user?: User;
  numReviews = 0;

  hasPendingRequest$!: Observable<boolean>;

  ngOnInit() {
    this.reviewService
      .getNumberOfReviewsForUser()
      .subscribe((reviews) => (this.numReviews = reviews));
    this.checkForPendingRequests();
  }

  openUpgradeDialog() {
    const dialogRef = this.dialog.open(UpgradeRequestDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((message: string) => {
      if (message) {
        this.chefRequestService.sendUpgradeRequest(message).subscribe({
          next: () => {
            this.dialog.open(UpgradeConfirmationDialogComponent, {
              width: '350px',
            });
            this.checkForPendingRequests();
          },
          error: (err) => {
            this.snackBar.open(
              'Failed to send request. Please try again.',
              'Close',
              {
                duration: 3000,
                panelClass: ['snackbar-error'],
              }
            );
          },
        });
      }
    });
  }
  checkForPendingRequests() {
    this.hasPendingRequest$ =
      this.chefRequestService.checkIfUserHasPendingRequest();
  }
}
