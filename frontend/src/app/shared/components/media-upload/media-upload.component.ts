import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentService } from '../../../core/services/content.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-media-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.css']
})
export class MediaUploadComponent {
  @Input() currentUrl: string | null = null;
  @Input() mediaType: 'image' | 'video' = 'image'; // default to image
  @Input() label: string = 'Upload Media';
  
  @Output() uploadComplete = new EventEmitter<string>();
  @Output() uploadError = new EventEmitter<any>();
  @Output() remove = new EventEmitter<void>();

  isUploading = false;
  dragOver = false;

  constructor(
    private contentService: ContentService,
    private toastService: ToastService
  ) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  uploadFile(file: File) {
    // Validate file type
    if (this.mediaType === 'image' && !file.type.startsWith('image/')) {
        this.toastService.error('Please upload an image file.');
        return;
    }
    if (this.mediaType === 'video' && !file.type.startsWith('video/')) {
        this.toastService.error('Please upload a video file.');
        return;
    }

    this.isUploading = true;
    this.contentService.uploadMedia(file).subscribe({
      next: (res) => {
        this.isUploading = false;
        this.uploadComplete.emit(res.url);
      },
      error: (err) => {
        this.isUploading = false;
        this.toastService.error('Upload failed: ' + (err.message || 'Unknown error'));
        this.uploadError.emit(err);
      }
    });
  }

  onRemove() {
    this.remove.emit();
  }

  triggerFileInput(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  getPreviewUrl(path: string | null): string {
    if (!path) return '';
    // Use ContentService helper if available, or just heuristic
    // Since we injected ContentService, let's look if it has a public helper to resolve full URL
    // Checking ContentService source (from previous view_file), it has getImageUrl
    // But for video it might just return the path if it's external, or construct it.
    // ContentService.getImageUrl handles http/assets logic.
    // However, for videos, getImageUrl might be misnamed but logic holds for any media path.
    return this.contentService.getImageUrl(path); 
  }
}
