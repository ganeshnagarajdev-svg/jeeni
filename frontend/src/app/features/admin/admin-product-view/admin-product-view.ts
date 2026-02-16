import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ContentService } from '../../../core/services/content.service';
import { ReviewService, ReviewStats } from '../../../core/services/review.service';
import { Product, ProductReview } from '../../../core/models/product';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-product-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-product-view.html',
  styleUrl: './admin-product-view.css'
})
export class AdminProductViewComponent implements OnInit {
  product: Product | null = null;
  reviews: ProductReview[] = [];
  reviewStats: ReviewStats = { average_rating: null, review_count: 0 };
  loading = true;
  loadingReviews = false;
  selectedImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private contentService: ContentService,
    private reviewService: ReviewService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(parseInt(id, 10));
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    // Use getProducts and filter since we need to get by ID
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.product = products.find(p => p.id === id) || null;
        this.loading = false;
        if (this.product) {
          this.loadReviews();
          this.loadReviewStats();
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadReviews(): void {
    if (!this.product) return;
    this.loadingReviews = true;
    this.reviewService.getProductReviews(this.product.id).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.loadingReviews = false;
      },
      error: () => {
        this.loadingReviews = false;
      }
    });
  }

  loadReviewStats(): void {
    if (!this.product) return;
    this.reviewService.getReviewStats(this.product.id).subscribe({
      next: (stats) => {
        this.reviewStats = stats;
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

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  async deleteReview(reviewId: number) {
    const confirmed = await this.confirmationService.confirm({
      message: 'Are you sure you want to delete this review?',
      type: 'danger',
      confirmText: 'Yes, delete',
      cancelText: 'Cancel'
    });

    if (!confirmed) return;
    
    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== reviewId);
        this.loadReviewStats();
        this.toastService.success('Review deleted successfully');
      },
      error: (err) => {
        this.toastService.error('Failed to delete review: ' + (err.error?.detail || err.message));
      }
    });
  }

  getImageUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
  }

  goBack(): void {
    this.router.navigate(['/admin/products']);
  }
}
