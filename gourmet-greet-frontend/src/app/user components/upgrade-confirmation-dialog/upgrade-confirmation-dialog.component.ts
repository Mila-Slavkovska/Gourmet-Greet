import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upgrade-confirmation-dialog',
  templateUrl: './upgrade-confirmation-dialog.component.html',
  styleUrls: ['./upgrade-confirmation-dialog.component.css']
})
export class UpgradeConfirmationDialogComponent {
  constructor(private dialogRef: MatDialogRef<UpgradeConfirmationDialogComponent>) {}

  close() {
    this.dialogRef.close();
  }
}
