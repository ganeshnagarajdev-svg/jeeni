import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService, Media } from '../../../core/services/content.service';

@Component({
  selector: 'app-photo-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-gallery.html',
  styleUrl: './photo-gallery.css'
})
export class PhotoGalleryComponent implements OnInit {
  photos: Media[] = [];
  loading = true;
  selectedPhoto: Media | null = null;
  showLightbox = false;

  constructor(private contentService: ContentService) {}

  ngOnInit(): void {
    this.loadPhotos();
  }

  loadPhotos(): void {
    this.loading = true;
    this.contentService.getPhotos().subscribe({
      next: (data) => {
        this.photos = data;
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    });
  }

  getImageUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
  }

  openLightbox(photo: Media): void {
    this.selectedPhoto = photo;
    this.showLightbox = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.showLightbox = false;
    this.selectedPhoto = null;
    document.body.style.overflow = '';
  }

  navigatePhoto(direction: number): void {
    if (!this.selectedPhoto) return;
    const currentIndex = this.photos.findIndex(p => p.id === this.selectedPhoto!.id);
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = this.photos.length - 1;
    if (newIndex >= this.photos.length) newIndex = 0;
    this.selectedPhoto = this.photos[newIndex];
  }
}
