import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContentService, Media } from '../../../core/services/content.service';

@Component({
  selector: 'app-video-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-gallery.html',
  styleUrl: './video-gallery.css'
})
export class VideoGalleryComponent implements OnInit {
  videos: Media[] = [];
  loading = true;
  selectedVideo: Media | null = null;
  showPlayer = false;

  constructor(
    private contentService: ContentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadVideos();
  }

  loadVideos(): void {
    this.loading = true;
    this.contentService.getVideos().subscribe({
      next: (data) => {
        this.videos = data;
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    });
  }

  getVideoThumbnail(url: string): string {
    // Extract YouTube thumbnail if it's a YouTube URL
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
    }
    return '/assets/video-placeholder.jpg';
  }

  isYoutubeUrl(url: string): boolean {
    return /(?:youtube\.com|youtu\.be)/.test(url);
  }

  getEmbedUrl(url: string): SafeResourceUrl {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (youtubeMatch) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`
      );
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openPlayer(video: Media): void {
    this.selectedVideo = video;
    this.showPlayer = true;
    document.body.style.overflow = 'hidden';
  }

  closePlayer(): void {
    this.showPlayer = false;
    this.selectedVideo = null;
    document.body.style.overflow = '';
  }
}
