import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-categories',
  imports: [],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent {
  categoryForm: FormGroup;
  categoryTypes = ['Meal', 'Dessert', 'Drink', 'Snack'];

  constructor(private fb: FormBuilder) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const newCategory = this.categoryForm.value;
      console.log('Submitted category:', newCategory);

      this.categoryForm.reset();
    }
  }
}
