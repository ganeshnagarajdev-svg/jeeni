import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductReview } from '../models/product';

export interface ReviewStats {
  average_rating: number | null;
  review_count: number;
}

export interface CreateReviewData {
  rating: number;
  review_text?: string;
}

export interface UpdateReviewData {
  rating?: number;
  review_text?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8000/api/v1/shop';

  constructor(private http: HttpClient) {}

  getProductReviews(productId: number, skip: number = 0, limit: number = 50): Observable<ProductReview[]> {
    return this.http.get<ProductReview[]>(
      `${this.apiUrl}/products/${productId}/reviews`,
      { params: { skip: skip.toString(), limit: limit.toString() } }
    );
  }

  getReviewStats(productId: number): Observable<ReviewStats> {
    return this.http.get<ReviewStats>(`${this.apiUrl}/products/${productId}/reviews/stats`);
  }

  getMyReview(productId: number): Observable<ProductReview> {
    return this.http.get<ProductReview>(`${this.apiUrl}/products/${productId}/reviews/mine`);
  }

  submitReview(productId: number, data: CreateReviewData): Observable<ProductReview> {
    return this.http.post<ProductReview>(`${this.apiUrl}/products/${productId}/reviews`, data);
  }

  updateReview(reviewId: number, data: UpdateReviewData): Observable<ProductReview> {
    return this.http.put<ProductReview>(`${this.apiUrl}/reviews/${reviewId}`, data);
  }

  deleteReview(reviewId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/reviews/${reviewId}`);
  }
}
