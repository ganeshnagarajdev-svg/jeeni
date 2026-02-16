import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ContentService } from '../../../core/services/content.service';
import { Product, Category } from '../../../core/models/product';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
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
    private fb: FormBuilder
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

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.contentService.uploadMedia(file).subscribe({
        next: (res) => {
          this.images.at(index).patchValue({
             image_url: res.url
          });
        },
        error: (err) => alert('Upload failed: ' + err.message)
      });
    }
  }

  getImageUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const productData = this.productForm.value;
    
    if (this.isEditing && this.currentProductId) {
      this.productService.updateProduct(this.currentProductId, productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (e) => alert('Failed to update product')
      });
    } else {
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (e) => alert('Failed to create product')
      });
    }
  }

  deleteProduct(id: number): void {
    if(confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (e) => alert('Failed to delete product')
      });
    }
  }
}
