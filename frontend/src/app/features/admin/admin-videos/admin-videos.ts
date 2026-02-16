import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService, Media } from '../../../core/services/content.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-videos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-videos.html',
  styleUrl: './admin-videos.css'
})
export class AdminVideosComponent implements OnInit {
  videos: Media[] = [];
  loading = true;
  showModal = false;
  isEditing = false;
  currentVideoId: number | null = null;
  videoForm: FormGroup;

  constructor(
    private contentService: ContentService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private toastService: ToastService
  ) {
    this.videoForm = this.fb.group({
      title: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)]],
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
    this.videoForm.reset();
    this.showModal = true;
  }

  openEditModal(video: Media) {
    this.isEditing = true;
    this.currentVideoId = video.id;
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.contentService.uploadMedia(file).subscribe({
        next: (res) => {
          this.videoForm.patchValue({ url: res.url });
        },
        error: (err) => this.toastService.error('Upload failed: ' + err.message)
      });
    }
  }

  getVideoThumbnail(url: string): string {
    // Extract YouTube thumbnail if it's a YouTube URL
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
    }
    return '/assets/video-placeholder.jpg';
  }

  isYoutubeUrl(url: string): boolean {
    return /(?:youtube\.com|youtu\.be)/.test(url);
  }

  getEmbedUrl(url: string): string {
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    return url;
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
