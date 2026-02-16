import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService, Media } from '../../../core/services/content.service';

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
    private fb: FormBuilder
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
        error: (err) => alert('Upload failed: ' + err.message)
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
    if (this.videoForm.invalid) return;

    const videoData = {
      ...this.videoForm.value,
      media_type: 'video'
    };

    if (this.isEditing && this.currentVideoId) {
      this.contentService.updateMedia(this.currentVideoId, videoData).subscribe({
        next: () => {
          this.loadVideos();
          this.closeModal();
        },
        error: (e) => alert('Failed to update video')
      });
    } else {
      this.contentService.createMedia(videoData).subscribe({
        next: () => {
          this.loadVideos();
          this.closeModal();
        },
        error: (e) => alert('Failed to add video')
      });
    }
  }

  deleteVideo(id: number): void {
    if(confirm('Are you sure you want to delete this video?')) {
      this.contentService.deleteMedia(id).subscribe({
        next: () => {
          this.videos = this.videos.filter(v => v.id !== id);
        },
        error: (e) => alert('Failed to delete video')
      });
    }
  }
}
