import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  email: string = '';

  subscribe() {
    if (!this.email) {
      alert('Please enter your email address.');
      return;
    }
    // Simple email regex for validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Simulate API call
    console.log('Subscribing email:', this.email);
    alert('Thank you for subscribing!');
    this.email = '';
  }
}
