import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Blog, ContentService } from '../../../core/services/content.service';

@Component({
  selector: 'app-admin-blogs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-blogs.html',
  styleUrl: './admin-blogs.css'
})
export class AdminBlogsComponent implements OnInit {
  blogs: Blog[] = [];
  loading = true;

  constructor(private contentService: ContentService) {}

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
