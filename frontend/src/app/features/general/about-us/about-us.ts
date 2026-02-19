import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GeneralService, Page } from '../../../core/services/general.service';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css'
})
export class AboutUsComponent implements OnInit {
  page: Page | null = null;
  loading = true;

  constructor(private generalService: GeneralService) {}

  ngOnInit(): void {
    this.generalService.getPage('about-us').subscribe({
      next: (data) => {
        this.page = data;
        this.loading = false;
      },
      error: (e) => {
        console.error('Error loading about-us page:', e);
        this.loading = false;
      }
    });
  }
}
