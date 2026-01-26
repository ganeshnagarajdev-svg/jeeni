import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Page, GeneralService } from '../../../core/services/general.service';

@Component({
  selector: 'app-page-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-viewer.html',
  styleUrl: './page-viewer.css'
})
export class PageViewerComponent implements OnInit {
  page: Page | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        const slug = params.get('slug');
        if (slug) {
            this.loadPage(slug);
        }
    });
  }

  loadPage(slug: string) {
      this.loading = true;
      this.error = false;
      this.generalService.getPage(slug).subscribe({
        next: (data) => {
            this.page = data;
            this.loading = false;
        },
        error: (e) => {
            console.error(e);
            this.error = true;
            this.loading = false;
        }
      });
  }
}
