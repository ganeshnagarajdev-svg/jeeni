import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product';

export interface WishlistItem {
  id: number;
  user_id: number;
  product: Product;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/wishlist`;

  constructor(private http: HttpClient) {}

  getWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(this.apiUrl + '/');
  }

  addToWishlist(productId: number): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(this.apiUrl + '/', { product_id: productId });
  }

  removeFromWishlist(id: number): Observable<WishlistItem> {
    return this.http.delete<WishlistItem>(`${this.apiUrl}/${id}`);
  }
}
