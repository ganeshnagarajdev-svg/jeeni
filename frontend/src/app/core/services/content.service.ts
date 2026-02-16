import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  is_published: boolean;
  created_at: string;
  author_id: number;
}

export interface Media {
  id: number;
  title: string;
  media_type: string;
  url: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = `${environment.apiUrl}/content`;

  constructor(private http: HttpClient) {}

  getBlogs(skip: number = 0, limit: number = 100): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/blogs?skip=${skip}&limit=${limit}`);
  }

  getBlog(slug: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/blogs/${slug}`);
  }

  getMedia(skip: number = 0, limit: number = 100): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.apiUrl}/media?skip=${skip}&limit=${limit}`);
  }

  createBlog(blog: any): Observable<Blog> {
    return this.http.post<Blog>(`${this.apiUrl}/blogs`, blog);
  }

  updateBlog(id: number, blog: any): Observable<Blog> {
    return this.http.put<Blog>(`${this.apiUrl}/blogs/${id}`, blog);
  }

  deleteBlog(id: number): Observable<Blog> {
    return this.http.delete<Blog>(`${this.apiUrl}/blogs/${id}`);
  }

  uploadMedia(file: File): Observable<{url: string}> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{url: string}>(`${this.apiUrl}/upload`, formData);
  }

  // Gallery Methods
  getPhotos(skip: number = 0, limit: number = 100): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.apiUrl}/gallery/photos?skip=${skip}&limit=${limit}`);
  }

  getVideos(skip: number = 0, limit: number = 100): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.apiUrl}/gallery/videos?skip=${skip}&limit=${limit}`);
  }

  createMedia(media: any): Observable<Media> {
    return this.http.post<Media>(`${this.apiUrl}/media`, media);
  }

  updateMedia(id: number, media: any): Observable<Media> {
    return this.http.put<Media>(`${this.apiUrl}/media/${id}`, media);
  }

  deleteMedia(id: number): Observable<Media> {
    return this.http.delete<Media>(`${this.apiUrl}/media/${id}`);
  }

  getImageUrl(path: string | null | undefined): string {
    if (!path) return '/assets/placeholder-product.jpg';
    if (path.startsWith('http') || path.startsWith('/assets/')) return path;

    // Handle paths that already start with /uploads/ (returned by backend)
    const cleanPath = path.replace(/^\/?uploads\//, '');
    return `${environment.mediaUrl}/${cleanPath}`;
  }
}
