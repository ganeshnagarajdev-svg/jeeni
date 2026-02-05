import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: any;
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  total_price: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart/`;
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  loadCart(): void {
    this.http.get<Cart>(this.apiUrl).subscribe({
      next: (cart) => this.cartSubject.next(cart),
      error: () => this.cartSubject.next(null),
    });
  }

  addToCart(productId: number, quantity: number = 1): Observable<CartItem> {
    return this.http
      .post<CartItem>(this.apiUrl, { product_id: productId, quantity })
      .pipe(tap(() => this.loadCart()));
  }

  updateQuantity(itemId: number, quantity: number): Observable<CartItem> {
    return this.http
      .put<CartItem>(`${this.apiUrl}${itemId}`, { quantity })
      .pipe(tap(() => this.loadCart()));
  }

  removeFromCart(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${itemId}`).pipe(tap(() => this.loadCart()));
  }

  clearCart(): Observable<any> {
    return this.http
      .delete(this.apiUrl)
      .pipe(tap(() => this.cartSubject.next({ items: [], total_items: 0, total_price: 0 })));
  }
}
