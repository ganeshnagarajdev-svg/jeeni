import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Career, GeneralService } from '../../../core/services/general.service';

@Component({
  selector: 'app-admin-careers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-careers.html',
  styleUrl: './admin-careers.css'
})
export class AdminCareersComponent implements OnInit {
  careers: Career[] = [];
  loading = true;
  showModal = false;
  isEditing = false;
  currentCareerId: number | null = null;
  careerForm: FormGroup;

  constructor(
    private generalService: GeneralService,
    private fb: FormBuilder
  ) {
    this.careerForm = this.fb.group({
      title: ['', Validators.required],
      department: ['', Validators.required],
      location: ['', Validators.required],
      description: ['', Validators.required],
      requirements: [''],
      is_active: [true]
    });
  }

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

  openAddModal() {
    this.isEditing = false;
    this.currentCareerId = null;
    this.careerForm.reset({ is_active: true });
    this.showModal = true;
  }

  openEditModal(career: Career) {
    this.isEditing = true;
    this.currentCareerId = career.id;
    this.careerForm.patchValue({
      title: career.title,
      department: career.department,
      location: career.location,
      description: career.description,
      requirements: career.requirements,
      is_active: true // Default to true if not present
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmit() {
    if (this.careerForm.invalid) return;

    if (this.isEditing && this.currentCareerId) {
      this.generalService.updateCareer(this.currentCareerId, this.careerForm.value).subscribe({
        next: () => {
          this.loadCareers();
          this.closeModal();
        },
        error: (e) => alert('Failed to update job posting')
      });
    } else {
      this.generalService.createCareer(this.careerForm.value).subscribe({
        next: () => {
          this.loadCareers();
          this.closeModal();
        },
        error: (e) => alert('Failed to create job posting')
      });
    }
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
