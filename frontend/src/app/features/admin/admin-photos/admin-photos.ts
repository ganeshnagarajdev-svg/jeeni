import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService, Media } from '../../../core/services/content.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';
import { MediaUploadComponent } from '../../../shared/components/media-upload/media-upload.component';

@Component({
  selector: 'app-admin-photos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MediaUploadComponent],
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
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private toastService: ToastService
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


  getImageUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
  }

  onSubmit() {
    if (this.photoForm.invalid) {
         this.toastService.error('Please fill all required fields');
         return;
    }

    const photoData = {
      ...this.photoForm.value,
      media_type: 'image'
    };

    if (this.isEditing && this.currentPhotoId) {
      this.contentService.updateMedia(this.currentPhotoId, photoData).subscribe({
        next: () => {
          this.loadPhotos();
          this.toastService.success('Photo updated successfully');
          this.closeModal();
        },
        error: (e) => this.toastService.error('Failed to update photo')
      });
    } else {
      this.contentService.createMedia(photoData).subscribe({
        next: () => {
          this.loadPhotos();
          this.toastService.success('Photo added successfully');
          this.closeModal();
        },
        error: (e) => this.toastService.error('Failed to add photo')
      });
    }
  }

  async deletePhoto(id: number) {
    const confirmed = await this.confirmationService.confirm({
        message: 'Are you sure you want to delete this photo?',
        type: 'danger',
        confirmText: 'Yes, delete',
        cancelText: 'Cancel'
    });

    if(confirmed) {
      this.contentService.deleteMedia(id).subscribe({
        next: () => {
          this.photos = this.photos.filter(p => p.id !== id);
          this.toastService.success('Photo deleted successfully');
        },
        error: (e) => this.toastService.error('Failed to delete photo')
      });
    }
  }
}
