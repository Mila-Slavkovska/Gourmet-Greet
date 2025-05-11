import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { CategoryAdd } from '../../interfaces/category-add.interface';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-categories',
  imports: [ReactiveFormsModule, CommonModule, MatSnackBarModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent {
  categoryForm: FormGroup;
  categoryTypes: string[] = [];
  categoryService = inject(CategoryService)
  snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      categoryType: ['', Validators.required]
    });
    this.loadCategoryTypes();
  }

  loadCategoryTypes() {
    this.categoryService.getCategoryTypes().subscribe({
      next: (categoryTypes) => this.categoryTypes = categoryTypes
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const newCategory: CategoryAdd = this.categoryForm.value;
      this.categoryService.createCategory(newCategory).subscribe({
        next: (created) => {
          this.categoryForm.reset();
          this.snackBar.open('Category created successfully!', 'Close', {
            duration: 3000
          });
        },
        error: (err) => {
          this.snackBar.open('Failed to create category.', 'Close', {
            duration: 3000
          });
        }
      });
    }
  }
}
