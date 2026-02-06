import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private shopApiUrl = 'http://localhost:8000/api/v1/shop';
  private adminApiUrl = 'http://localhost:8000/api/v1/shop'; // For now it's the same base but conceptually different

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

    return this.http.get<Product[]>(`${this.shopApiUrl}/products`, { params });
  }

  getProduct(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.shopApiUrl}/products/${slug}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.shopApiUrl}/categories`);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.shopApiUrl}/categories/${id}`);
  }

  createCategory(category: any): Observable<Category> {
    return this.http.post<Category>(`${this.adminApiUrl}/categories`, category);
  }

  updateCategory(id: number, category: any): Observable<Category> {
    return this.http.put<Category>(`${this.adminApiUrl}/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<Category> {
    return this.http.delete<Category>(`${this.adminApiUrl}/categories/${id}`);
  }

  createProduct(product: any): Observable<Product> {
    return this.http.post<Product>(`${this.adminApiUrl}/products`, product);
  }

  updateProduct(id: number, product: any): Observable<Product> {
    return this.http.put<Product>(`${this.adminApiUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.adminApiUrl}/products/${id}`);
  }
}
