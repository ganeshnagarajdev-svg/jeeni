import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap, map, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { StorageKeys } from '../constants/storage-keys';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    const storedUser = localStorage.getItem(StorageKeys.CURRENT_USER);
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
    
    // Always sync with backend if token exists to ensure role and status are current
    if (this.isAuthenticated()) {
      this.fetchCurrentUser().subscribe();
    }
  }

  login(credentials: any): Observable<any> {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    return this.http.post<any>(`${this.apiUrl}/login/access-token`, formData).pipe(
      tap((response) => {
        if (response.access_token) {
          localStorage.setItem(StorageKeys.TOKEN, response.access_token);
        }
      }),
      switchMap(() => this.fetchCurrentUser())
    );
  }

  signup(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, userData);
  }

  fetchCurrentUser(): Observable<any> {
    const token = localStorage.getItem(StorageKeys.TOKEN);
    if (!token) {
      this.isLoadingSubject.next(false);
      return of(null);
    }
    
    this.isLoadingSubject.next(true);
    return this.http
      .get<any>(`${this.apiUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        tap((user) => {
          localStorage.setItem(StorageKeys.CURRENT_USER, JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.isLoadingSubject.next(false);
        }),
        map(user => {
          this.isLoadingSubject.next(false);
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem(StorageKeys.TOKEN);
    localStorage.removeItem(StorageKeys.CURRENT_USER);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(StorageKeys.TOKEN);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  get isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }
}
