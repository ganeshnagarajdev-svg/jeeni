// Trigger rebuild - Category implementation fixed
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Category } from '../../../core/models/product';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css'
})
export class AdminCategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  showModal = false;
  isEditing = false;
  currentCategoryId: number | null = null;
  categoryForm: FormGroup;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      is_active: [true]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (e) => {
        console.error('Failed to load categories', e);
        this.loading = false;
      }
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.currentCategoryId = null;
    this.categoryForm.reset({ is_active: true });
    this.showModal = true;
  }

  openEditModal(category: Category) {
    this.isEditing = true;
    this.currentCategoryId = category.id;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description,
      is_active: category.is_active !== false
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;

    const categoryData = this.categoryForm.value;
    
    if (this.isEditing && this.currentCategoryId) {
      this.productService.updateCategory(this.currentCategoryId, categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
        error: (e) => alert('Failed to update category')
      });
    } else {
      this.productService.createCategory(categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
        error: (e) => alert('Failed to create category')
      });
    }
  }

  deleteCategory(id: number): void {
    if(confirm('Are you sure you want to delete this category? This might affect products in this category.')) {
      this.productService.deleteCategory(id).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== id);
        },
        error: (e) => alert('Failed to delete category. it may have products associated with it.')
      });
    }
  }
}
