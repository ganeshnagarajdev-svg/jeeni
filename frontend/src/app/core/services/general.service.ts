import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HomeSection } from '../models/home-section';

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: string;
  created_at?: string;
}

export interface Career {
  id: number;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  type: string;
  is_active: boolean;
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

  createCareer(career: any): Observable<Career> {
    return this.http.post<Career>(`${this.apiUrl}/careers`, career);
  }

  updateCareer(id: number, career: any): Observable<Career> {
    return this.http.put<Career>(`${this.apiUrl}/careers/${id}`, career);
  }


  deleteCareer(id: number): Observable<Career> {
    return this.http.delete<Career>(`${this.apiUrl}/careers/${id}`);
  }

  // Contact Message
  sendContactMessage(message: ContactMessage): Observable<ContactMessage> {
    return this.http.post<ContactMessage>(`${this.apiUrl}/contact`, message);
  }

  getContactMessages(skip: number = 0, limit: number = 100): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${environment.apiUrl}/admin/contacts`, {
      params: { skip: skip.toString(), limit: limit.toString() }
    });
  }

  // Home Page Methods
  getHomeLayout(): Observable<HomeSection[]> {
    return this.http.get<HomeSection[]>(`${this.apiUrl}/home-layout`);
  }

  getHomeSections(skip: number = 0, limit: number = 100): Observable<HomeSection[]> {
    return this.http.get<HomeSection[]>(`${this.apiUrl}/home-sections`, {
      params: { skip: skip.toString(), limit: limit.toString() }
    });
  }

  createHomeSection(section: any): Observable<HomeSection> {
    return this.http.post<HomeSection>(`${this.apiUrl}/home-sections`, section);
  }

  updateHomeSection(id: number, section: any): Observable<HomeSection> {
    return this.http.put<HomeSection>(`${this.apiUrl}/home-sections/${id}`, section);
  }

  deleteHomeSection(id: number): Observable<HomeSection> {
    return this.http.delete<HomeSection>(`${this.apiUrl}/home-sections/${id}`);
  }
}
