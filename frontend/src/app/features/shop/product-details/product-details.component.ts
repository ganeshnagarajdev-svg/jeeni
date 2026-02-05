import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ContentService } from '../../../core/services/content.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private contentService: ContentService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadProduct(slug);
      }
    });
  }

  loadProduct(slug: string) {
    this.isLoading = true;
    this.error = null;
    this.productService.getProduct(slug).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product details';
        this.isLoading = false;
      }
    });
  }

  addToWishlist() {
    if (this.product) {
        this.wishlistService.addToWishlist(this.product.id).subscribe({
            next: () => alert('Product added to wishlist!'),
            error: (err) => alert('Failed to add to wishlist: ' + (err.error?.detail || err.message))
        });
    }
  }

  buyNow() {
    if (this.product) {
      this.cartService.addToCart(this.product.id).subscribe({
        next: () => {
          this.router.navigate(['/cart/checkout']);
        },
        error: (err) => alert('Failed to proceed to buy: ' + (err.error?.detail || err.message))
      });
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product.id).subscribe({
        next: () => alert('Product added to cart!'),
        error: (err) => alert('Failed to add to cart: ' + (err.error?.detail || err.message))
      });
    }
  }

  getImageUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
  }
}
