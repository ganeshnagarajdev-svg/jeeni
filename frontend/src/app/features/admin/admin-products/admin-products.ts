import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ContentService } from '../../../core/services/content.service';
import { Product, Category } from '../../../core/models/product';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';
import { MediaUploadComponent } from '../../../shared/components/media-upload/media-upload.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MediaUploadComponent],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css'
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  showModal = false;
  isEditing = false;
  currentProductId: number | null = null;
  productForm: FormGroup;

  constructor(
    private productService: ProductService,
    private contentService: ContentService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private toastService: ToastService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      discounted_price: [null],
      stock: [0, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
      category_id: [null, Validators.required],
      is_active: [true],
      is_featured: [false],
      images: this.fb.array([])
    });
  }

  get images() {
    return this.productForm.get('images') as FormArray;
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log('Admin Products loaded:', data);
        this.products = data;
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (e) => console.error(e)
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.currentProductId = null;
    this.productForm.reset({ is_active: true, is_featured: false, price: 0, stock: 0 });
    this.images.clear();
    this.showModal = true;
  }

  openEditModal(product: Product) {
    this.isEditing = true;
    this.currentProductId = product.id;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      discounted_price: product.discounted_price,
      stock: product.stock,
      category_id: product.category_id,
      is_active: product.is_active,
      is_featured: product.is_featured
    });
    
    this.images.clear();
    product.images?.forEach(img => {
      this.images.push(this.fb.group({
        image_url: [img.image_url, Validators.required],
        is_main: [img.is_main]
      }));
    });
    
    if (this.images.length === 0) this.addImage();
    this.showModal = true;
  }

  addImage() {
    this.images.push(this.fb.group({
      image_url: ['', Validators.required],
      is_main: [this.images.length === 0]
    }));
  }

  removeImage(index: number) {
    this.images.removeAt(index);
  }


  getImageUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.productForm.invalid) {
        this.toastService.error('Please fill all required fields');
        return;
    }

    const productData = this.productForm.value;
    
    if (this.isEditing && this.currentProductId) {
      this.productService.updateProduct(this.currentProductId, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.toastService.success('Product updated successfully');
          this.closeModal();
        },
        error: (e) => this.toastService.error('Failed to update product')
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadProducts();
          this.toastService.success('Product created successfully');
          this.closeModal();
        },
        error: (e) => this.toastService.error('Failed to create product')
      });
    }
  }

  async deleteProduct(id: number) {
    const confirmed = await this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      type: 'danger',
      confirmText: 'Yes, delete',
      cancelText: 'Cancel'
    });

    if(confirmed) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          this.toastService.success('Product deleted successfully');
        },
        error: (e) => this.toastService.error('Failed to delete product')
      });
    }
  }
}
