import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ContentService } from '../../../core/services/content.service';
import { WishlistService, WishlistItem } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { ReviewService, CreateReviewData, ReviewStats } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product, ProductReview } from '../../../core/models/product';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  error: string | null = null;
  selectedImageIndex = 0;
  
  // Reviews
  reviews: ProductReview[] = [];
  reviewStats: ReviewStats = { average_rating: null, review_count: 0 };
  isLoadingReviews = false;
  userReview: ProductReview | null = null;
  
  // Wishlist
  isInWishlist = false;
  wishlistItem: WishlistItem | null = null;
  
  // Review form
  showReviewForm = false;
  reviewRating = 0;
  reviewText = '';
  isSubmittingReview = false;
  isEditingReview = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private contentService: ContentService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  get currentUser(): any {
    return this.authService.currentUserValue;
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  nextImage() {
    if (this.product?.images && this.product.images.length > 0) {
      this.selectedImageIndex = (this.selectedImageIndex + 1) % this.product.images.length;
    }
  }

  prevImage() {
    if (this.product?.images && this.product.images.length > 0) {
      this.selectedImageIndex = (this.selectedImageIndex - 1 + this.product.images.length) % this.product.images.length;
    }
  }

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
        this.loadReviews();
        this.loadReviewStats();
        if (this.isLoggedIn) {
          this.loadUserReview();
          this.checkWishlistStatus();
        }
      },
      error: (err) => {
        this.error = 'Failed to load product details';
        this.isLoading = false;
      }
    });
  }

  checkWishlistStatus() {
    if (!this.product) return;
    this.wishlistService.getWishlist().subscribe({
      next: (wishlist) => {
        const item = wishlist.find(item => item.product.id === this.product?.id);
        if (item) {
          this.isInWishlist = true;
          this.wishlistItem = item;
        } else {
          this.isInWishlist = false;
          this.wishlistItem = null;
        }
      },
      error: (err) => console.error('Error checking wishlist status', err)
    });
  }

  loadReviews() {
    if (!this.product) return;
    this.isLoadingReviews = true;
    this.reviewService.getProductReviews(this.product.id).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.isLoadingReviews = false;
      },
      error: () => {
        this.isLoadingReviews = false;
      }
    });
  }

  loadReviewStats() {
    if (!this.product) return;
    this.reviewService.getReviewStats(this.product.id).subscribe({
      next: (stats) => {
        this.reviewStats = stats;
      }
    });
  }

  loadUserReview() {
    if (!this.product) return;
    this.reviewService.getMyReview(this.product.id).subscribe({
      next: (review) => {
        this.userReview = review;
      },
      error: () => {
        this.userReview = null;
      }
    });
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push('full');
      } else if (i - 0.5 <= rating) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }

  setRating(rating: number) {
    this.reviewRating = rating;
  }

  openReviewForm(edit = false) {
    if (!this.isLoggedIn) {
      alert('Please log in to write a review');
      this.router.navigate(['/auth/login']);
      return;
    }
    this.isEditingReview = edit;
    if (edit && this.userReview) {
      this.reviewRating = this.userReview.rating;
      this.reviewText = this.userReview.review_text || '';
    } else {
      this.reviewRating = 0;
      this.reviewText = '';
    }
    this.showReviewForm = true;
  }

  closeReviewForm() {
    this.showReviewForm = false;
    this.reviewRating = 0;
    this.reviewText = '';
  }

  submitReview() {
    if (!this.product || this.reviewRating === 0) {
      alert('Please select a rating');
      return;
    }

    this.isSubmittingReview = true;
    const data: CreateReviewData = {
      rating: this.reviewRating,
      review_text: this.reviewText || undefined
    };

    if (this.isEditingReview && this.userReview) {
      this.reviewService.updateReview(this.userReview.id, data).subscribe({
        next: (review) => {
          this.userReview = review;
          this.loadReviews();
          this.loadReviewStats();
          this.closeReviewForm();
          this.isSubmittingReview = false;
          alert('Review updated successfully!');
        },
        error: (err) => {
          this.isSubmittingReview = false;
          alert('Failed to update review: ' + (err.error?.detail || err.message));
        }
      });
    } else {
      this.reviewService.submitReview(this.product.id, data).subscribe({
        next: (review) => {
          this.userReview = review;
          this.loadReviews();
          this.loadReviewStats();
          this.closeReviewForm();
          this.isSubmittingReview = false;
          alert('Review submitted successfully!');
        },
        error: (err) => {
          this.isSubmittingReview = false;
          alert('Failed to submit review: ' + (err.error?.detail || err.message));
        }
      });
    }
  }

  deleteMyReview() {
    if (!this.userReview) return;
    if (!confirm('Are you sure you want to delete your review?')) return;

    this.reviewService.deleteReview(this.userReview.id).subscribe({
      next: () => {
        this.userReview = null;
        this.loadReviews();
        this.loadReviewStats();
        alert('Review deleted successfully!');
      },
      error: (err) => {
        alert('Failed to delete review: ' + (err.error?.detail || err.message));
      }
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  toggleWishlist() {
    if (!this.isLoggedIn) {
      alert('Please log in to add to wishlist');
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.isInWishlist && this.wishlistItem) {
      this.wishlistService.removeFromWishlist(this.wishlistItem.id).subscribe({
        next: () => {
          this.isInWishlist = false;
          this.wishlistItem = null;
          alert('Product removed from wishlist');
        },
        error: (err) => alert('Failed to remove from wishlist: ' + (err.error?.detail || err.message))
      });
    } else if (this.product) {
      this.wishlistService.addToWishlist(this.product.id).subscribe({
        next: (item) => {
          this.isInWishlist = true;
          this.wishlistItem = item;
          alert('Product added to wishlist!');
        },
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
