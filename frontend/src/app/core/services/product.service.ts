import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/api/v1/shop';

  constructor(private http: HttpClient) {}

  getProducts(
    skip: number = 0, 
    limit: number = 100, 
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number,
    sortBy?: string
  ): Observable<Product[]> {
    let params = new HttpParams()
      .set('skip', skip)
      .set('limit', limit);
    
    if (categoryId) params = params.set('category_id', categoryId);
    if (minPrice) params = params.set('min_price', minPrice);
    if (maxPrice) params = params.set('max_price', maxPrice);
    if (sortBy) params = params.set('sort_by', sortBy);

    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }

  getProduct(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${slug}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.apiUrl}/products/${id}`);
  }
}
