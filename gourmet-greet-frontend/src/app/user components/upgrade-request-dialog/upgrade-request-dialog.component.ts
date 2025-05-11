import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-upgrade-request-dialog',
  imports: [
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './upgrade-request-dialog.component.html',
  styleUrl: './upgrade-request-dialog.component.css',
})
export class UpgradeRequestDialogComponent {
  message = '';

  constructor(private dialogRef: MatDialogRef<UpgradeRequestDialogComponent>) {}

  submitRequest() {
    this.dialogRef.close(this.message);
  }

  cancel() {
    this.dialogRef.close();
  }
}
