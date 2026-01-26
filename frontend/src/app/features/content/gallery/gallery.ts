import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Media, ContentService } from '../../../core/services/content.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class GalleryComponent implements OnInit {
  mediaItems: Media[] = [];
  loading = true;

  constructor(private contentService: ContentService) {}

  ngOnInit(): void {
    this.contentService.getMedia().subscribe({
      next: (data) => {
        this.mediaItems = data;
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    });
  }
}
