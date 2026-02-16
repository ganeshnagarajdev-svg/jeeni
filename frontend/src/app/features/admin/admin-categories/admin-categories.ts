// Trigger rebuild - Category implementation fixed
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Category } from '../../../core/models/product';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';

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
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private toastService: ToastService
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
    if (this.categoryForm.invalid) {
         this.toastService.error('Please fill all required fields');
         return;
    }

    const categoryData = this.categoryForm.value;
    
    if (this.isEditing && this.currentCategoryId) {
      this.productService.updateCategory(this.currentCategoryId, categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.toastService.success('Category updated successfully');
          this.closeModal();
        },
        error: (e) => this.toastService.error('Failed to update category')
      });
    } else {
      this.productService.createCategory(categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.toastService.success('Category created successfully');
          this.closeModal();
        },
        error: (e) => this.toastService.error('Failed to create category')
      });
    }
  }

  async deleteCategory(id: number) {
    const confirmed = await this.confirmationService.confirm({
      message: 'Are you sure you want to delete this category? This might affect products in this category.',
      type: 'danger',
      confirmText: 'Yes, delete',
      cancelText: 'Cancel'
    });

    if(confirmed) {
      this.productService.deleteCategory(id).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== id);
          this.toastService.success('Category deleted successfully');
        },
        error: (e) => this.toastService.error('Failed to delete category. it may have products associated with it.')
      });
    }
  }
}
