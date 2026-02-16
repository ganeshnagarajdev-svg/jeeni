import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { ContentService } from '../../../core/services/content.service';
import { Product, Category } from '../../../core/models/product';
import { CartService } from '../../../core/services/cart.service';
import { ApiConstants } from '../../../core/constants/api.constants';

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
    private contentService: ContentService,
    private cartService: CartService,
    private router: Router
  ) {}

  buyNow(event: Event, product: Product) {
    event.stopPropagation();
    this.cartService.addToCart(product.id).subscribe({
      next: () => {
        this.router.navigate(['/cart/checkout']);
      },
      error: (err) => {
        console.error('Failed to buy:', err);
      }
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

    // Use take(1) to avoid potential double-triggering or leaks
    this.productService.getProducts(ApiConstants.DEFAULT_PAGE_SKIP, ApiConstants.DEFAULT_PAGE_SIZE, categoryId, min, max, this.sortBy).pipe(take(1)).subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.isLoading = false;
        // Trigger change detection manually if needed (Angular usually handles this but safety first)
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

  getImageUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
  }

  viewDetails(slug: string) {
    this.router.navigate(['/shop/products', slug]);
  }
}
