import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product, Category } from '../../../core/models/product';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  
  // Filters
  selectedCategoryId: number | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy: string = 'newest';
  
  isLoading = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  buyNow(product: Product) {
    this.cartService.addToCart(product.id).subscribe({
      next: () => {
        this.router.navigate(['/cart/checkout']);
      },
      error: (err) => alert('Failed to proceed to buy: ' + (err.error?.detail || err.message))
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
      },
      error: (err) => console.error('Failed to load categories:', err)
    });
  }

  loadProducts() {
    this.isLoading = true;
    const categoryId = this.selectedCategoryId ? this.selectedCategoryId : undefined;
    const min = this.minPrice ? this.minPrice : undefined;
    const max = this.maxPrice ? this.maxPrice : undefined;

    this.productService.getProducts(0, 100, categoryId, min, max, this.sortBy).subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.isLoading = false;
      }
    });
  }

  onCategoryChange(categoryId: number) {
    this.selectedCategoryId = categoryId;
    this.loadProducts();
  }

  applyFilters() {
    this.loadProducts();
  }

  clearFilters() {
    this.selectedCategoryId = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.sortBy = 'newest';
    this.loadProducts();
  }

  onSortChange(event: any) {
    this.sortBy = event.target.value;
    this.loadProducts();
  }

  viewDetails(slug: string) {
    this.router.navigate(['/shop/products', slug]);
  }
}
