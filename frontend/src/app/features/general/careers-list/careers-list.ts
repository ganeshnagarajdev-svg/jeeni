import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Career, GeneralService } from '../../../core/services/general.service';

@Component({
  selector: 'app-careers-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './careers-list.html',
  styleUrl: './careers-list.css'
})
export class CareersListComponent implements OnInit {
  careers: Career[] = [];
  loading = true;

  constructor(private generalService: GeneralService) {}

  ngOnInit(): void {
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
}
