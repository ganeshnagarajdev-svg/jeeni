import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService, Media } from '../../../core/services/content.service';

@Component({
  selector: 'app-admin-photos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-photos.html',
  styleUrl: './admin-photos.css'
})
export class AdminPhotosComponent implements OnInit {
  photos: Media[] = [];
  loading = true;
  showModal = false;
  isEditing = false;
  currentPhotoId: number | null = null;
  photoForm: FormGroup;

  constructor(
    private contentService: ContentService,
    private fb: FormBuilder
  ) {
    this.photoForm = this.fb.group({
      title: ['', Validators.required],
      url: ['', [Validators.required, Validators.pattern(/https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)$/i)]],
      description: ['']
    });
  }

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

  openAddModal() {
    this.isEditing = false;
    this.currentPhotoId = null;
    this.photoForm.reset();
    this.showModal = true;
  }

  openEditModal(photo: Media) {
    this.isEditing = true;
    this.currentPhotoId = photo.id;
    this.photoForm.patchValue({
      title: photo.title,
      url: photo.url,
      description: photo.description
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
          this.photoForm.patchValue({ url: res.url });
        },
        error: (err) => alert('Upload failed: ' + err.message)
      });
    }
  }

  getImageUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
  }

  onSubmit() {
    if (this.photoForm.invalid) return;

    const photoData = {
      ...this.photoForm.value,
      media_type: 'image'
    };

    if (this.isEditing && this.currentPhotoId) {
      this.contentService.updateMedia(this.currentPhotoId, photoData).subscribe({
        next: () => {
          this.loadPhotos();
          this.closeModal();
        },
        error: (e) => alert('Failed to update photo')
      });
    } else {
      this.contentService.createMedia(photoData).subscribe({
        next: () => {
          this.loadPhotos();
          this.closeModal();
        },
        error: (e) => alert('Failed to add photo')
      });
    }
  }

  deletePhoto(id: number): void {
    if(confirm('Are you sure you want to delete this photo?')) {
      this.contentService.deleteMedia(id).subscribe({
        next: () => {
          this.photos = this.photos.filter(p => p.id !== id);
        },
        error: (e) => alert('Failed to delete photo')
      });
    }
  }
}
