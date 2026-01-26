import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Career {
  id: number;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  created_at: string;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  private apiUrl = `${environment.apiUrl}/general`;

  constructor(private http: HttpClient) {}

  getCareers(): Observable<Career[]> {
    return this.http.get<Career[]>(`${this.apiUrl}/careers`);
  }

  getCareer(id: number): Observable<Career> {
    return this.http.get<Career>(`${this.apiUrl}/careers/${id}`);
  }

  getPage(slug: string): Observable<Page> {
    return this.http.get<Page>(`${this.apiUrl}/pages/${slug}`);
  }

  deleteCareer(id: number): Observable<Career> {
    return this.http.delete<Career>(`${this.apiUrl}/careers/${id}`);
  }
}
