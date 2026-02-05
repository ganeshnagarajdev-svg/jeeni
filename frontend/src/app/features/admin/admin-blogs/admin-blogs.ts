import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService, Blog } from '../../../core/services/content.service';

@Component({
  selector: 'app-admin-blogs',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
    private fb: FormBuilder
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.contentService.uploadMedia(file).subscribe({
        next: (res) => {
          this.blogForm.patchValue({
             image_url: res.url
          });
        },
        error: (err) => alert('Upload failed: ' + err.message)
      });
    }
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.blogForm.invalid) return;

    if (this.isEditing && this.currentBlogId) {
      this.contentService.updateBlog(this.currentBlogId, this.blogForm.value).subscribe({
        next: () => {
          this.loadBlogs();
          this.closeModal();
        },
        error: (e) => alert('Failed to update blog')
      });
    } else {
      this.contentService.createBlog(this.blogForm.value).subscribe({
        next: () => {
          this.loadBlogs();
          this.closeModal();
        },
        error: (e) => alert('Failed to create blog')
      });
    }
  }

  deleteBlog(id: number): void {
      if(confirm('Are you sure you want to delete this blog?')) {
          this.contentService.deleteBlog(id).subscribe({
              next: () => {
                  this.blogs = this.blogs.filter(b => b.id !== id);
              },
              error: (e) => alert('Failed to delete blog')
          });
      }
  }
}
