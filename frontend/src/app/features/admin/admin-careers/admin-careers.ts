import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Career, GeneralService } from '../../../core/services/general.service';

@Component({
  selector: 'app-admin-careers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-careers.html',
  styleUrl: './admin-careers.css'
})
export class AdminCareersComponent implements OnInit {
  careers: Career[] = [];
  loading = true;

  constructor(private generalService: GeneralService) {}

  ngOnInit(): void {
    this.loadCareers();
  }

  loadCareers(): void {
    this.loading = true;
    this.generalService.getCareers().subscribe({
      next: (data) => {
        this.careers = data;
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
      }
    });
  }

  deleteCareer(id: number): void {
      if(confirm('Are you sure you want to delete this job posting?')) {
          this.generalService.deleteCareer(id).subscribe({
              next: () => {
                  this.careers = this.careers.filter(c => c.id !== id);
              },
              error: (e) => alert('Failed to delete job posting')
          });
      }
  }
}
