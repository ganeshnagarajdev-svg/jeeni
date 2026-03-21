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
    const videoId = this.extractYoutubeId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
    return '/assets/video-placeholder.jpg';
  }

  isYoutubeUrl(url: string): boolean {
    return !!this.extractYoutubeId(url);
  }

  extractYoutubeId(url: string): string | null {
    if (!url) return null;
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  getEmbedUrl(url: string): SafeResourceUrl {
    const videoId = this.extractYoutubeId(url);
    if (videoId) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${videoId}?autoplay=1`
      );
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getVideoUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
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
