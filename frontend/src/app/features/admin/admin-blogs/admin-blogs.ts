import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService, Blog } from '../../../core/services/content.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';
import { MediaUploadComponent } from '../../../shared/components/media-upload/media-upload.component';

@Component({
  selector: 'app-admin-blogs',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MediaUploadComponent],
  templateUrl: './admin-blogs.html',
  styleUrl: './admin-blogs.css'
})
export class AdminBlogsComponent implements OnInit {
  blogs: Blog[] = [];
  loading = true;
  showModal = false;
  isEditing = false;
  currentBlogId: number | null = null;
  blogForm: FormGroup;

  constructor(
    private contentService: ContentService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private toastService: ToastService
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      image_url: [''],
      is_published: [true]
    });
  }

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading = true;
    this.contentService.getBlogs().subscribe({
      next: (data) => {
        this.blogs = data;
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
    this.currentBlogId = null;
    this.blogForm.reset({ is_published: true });
    this.showModal = true;
  }

  openEditModal(blog: Blog) {
    this.isEditing = true;
    this.currentBlogId = blog.id;
    this.blogForm.patchValue({
      title: blog.title,
      content: blog.content,
      image_url: blog.image_url,
      is_published: blog.is_published
    });
    this.showModal = true;
  }


  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.blogForm.invalid) {
         this.toastService.error('Please fill all required fields');
         return;
    }

    if (this.isEditing && this.currentBlogId) {
      this.contentService.updateBlog(this.currentBlogId, this.blogForm.value).subscribe({
        next: () => {
          this.loadBlogs();
          this.toastService.success('Blog updated successfully');
          this.closeModal();
        },
        error: (e) => this.toastService.error('Failed to update blog')
      });
    } else {
      this.contentService.createBlog(this.blogForm.value).subscribe({
        next: () => {
          this.loadBlogs();
          this.toastService.success('Blog created successfully');
          this.closeModal();
        },
        error: (e) => this.toastService.error('Failed to create blog')
      });
    }
  }

  async deleteBlog(id: number) {
      const confirmed = await this.confirmationService.confirm({
          message: 'Are you sure you want to delete this blog?',
          type: 'danger',
          confirmText: 'Yes, delete',
          cancelText: 'Cancel'
      });

      if(confirmed) {
          this.contentService.deleteBlog(id).subscribe({
              next: () => {
                  this.blogs = this.blogs.filter(b => b.id !== id);
                  this.toastService.success('Blog deleted successfully');
              },
              error: (e) => this.toastService.error('Failed to delete blog')
          });
      }
  }
}
