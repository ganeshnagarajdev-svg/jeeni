import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  total_users: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  active_jobs: number;
  active_blogs: number;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  is_active: boolean;
  is_superuser: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  updateUser(id: number, userData: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, userData);
  }

  getOrderReport(startDate?: string, endDate?: string): Observable<any[]> {
    let params = {};
    if (startDate) params = { ...params, start_date: startDate };
    if (endDate) params = { ...params, end_date: endDate };
    return this.http.get<any[]>(`${this.apiUrl}/reports/orders`, { params });
  }

  getSalesReport(
    startDate?: string, 
    endDate?: string,
    status?: string,
    minAmount?: number,
    maxAmount?: number,
    customer?: string
  ): Observable<any[]> {
    let params: any = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    if (status) params.status = status;
    if (minAmount) params.min_amount = minAmount;
    if (maxAmount) params.max_amount = maxAmount;
    if (customer) params.customer = customer;
    
    return this.http.get<any[]>(`${this.apiUrl}/reports/sales`, { params });
  }
}
