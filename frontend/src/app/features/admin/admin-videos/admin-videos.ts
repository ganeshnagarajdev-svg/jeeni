import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService, Media } from '../../../core/services/content.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';
import { MediaUploadComponent } from '../../../shared/components/media-upload/media-upload.component';

@Component({
  selector: 'app-admin-videos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MediaUploadComponent],
  templateUrl: './admin-videos.html',
  styleUrl: './admin-videos.css'
})
export class AdminVideosComponent implements OnInit {
  videos: Media[] = [];
  loading = true;
  showModal = false;
  isEditing = false;
  currentVideoId: number | null = null;
  videoSourceType: 'youtube' | 'upload' = 'youtube';
  videoForm: FormGroup;
  
  // Preview properties
  showPreviewModal = false;
  previewUrl: string | SafeResourceUrl = '';
  isPreviewYoutube = false;
  previewTitle = '';

  constructor(
    private contentService: ContentService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private sanitizer: DomSanitizer
  ) {
    this.videoForm = this.fb.group({
      title: ['', Validators.required],
      url: ['', Validators.required],
      description: ['']
    });
  }

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

  openAddModal() {
    this.isEditing = false;
    this.currentVideoId = null;
    this.videoSourceType = 'youtube'; 
    this.videoForm.reset();
    this.showModal = true;
  }

  openEditModal(video: Media) {
    this.isEditing = true;
    this.currentVideoId = video.id;
    this.videoSourceType = this.isYoutubeUrl(video.url) ? 'youtube' : 'upload';
    this.videoForm.patchValue({
      title: video.title,
      url: video.url,
      description: video.description
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  openPreview(video: Media) {
    this.previewTitle = video.title;
    if (this.isYoutubeUrl(video.url)) {
      const embedUrl = this.getEmbedUrl(video.url);
      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      this.isPreviewYoutube = true;
    } else {
      this.previewUrl = this.getVideoUrl(video.url);
      this.isPreviewYoutube = false;
    }
    this.showPreviewModal = true;
  }

  closePreview() {
    this.showPreviewModal = false;
    this.previewUrl = '';
  }


  getVideoThumbnail(url: string): string {
    // Extract YouTube ID from various formats
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

  getEmbedUrl(url: string): string {
    const videoId = this.extractYoutubeId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  }

  getVideoUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
  }

  onSubmit() {
    if (this.videoForm.invalid) {
        this.toastService.error('Please fill all required fields');
        return;
    }

    const videoData = {
      ...this.videoForm.value,
      media_type: 'video'
    };

    if (this.isEditing && this.currentVideoId) {
      this.contentService.updateMedia(this.currentVideoId, videoData).subscribe({
        next: () => {
          this.loadVideos();
          this.toastService.success('Video updated successfully');
          this.closeModal();
        },
        error: (e) => this.toastService.error('Failed to update video')
      });
    } else {
      this.contentService.createMedia(videoData).subscribe({
        next: () => {
          this.loadVideos();
          this.toastService.success('Video added successfully');
          this.closeModal();
        },
        error: (e) => this.toastService.error('Failed to add video')
      });
    }
  }

  async deleteVideo(id: number) {
    const confirmed = await this.confirmationService.confirm({
      message: 'Are you sure you want to delete this video?',
      type: 'danger',
      confirmText: 'Yes, delete',
      cancelText: 'Cancel'
    });

    if(confirmed) {
      this.contentService.deleteMedia(id).subscribe({
        next: () => {
          this.videos = this.videos.filter(v => v.id !== id);
          this.toastService.success('Video deleted successfully');
        },
        error: (e) => this.toastService.error('Failed to delete video')
      });
    }
  }
}
