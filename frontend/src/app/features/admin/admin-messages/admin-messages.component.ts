import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralService, ContactMessage } from '../../../core/services/general.service';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-messages.component.html'
})
export class AdminMessagesComponent implements OnInit {
  messages: ContactMessage[] = [];
  loading = true;

  constructor(private generalService: GeneralService) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.generalService.getContactMessages().subscribe({
      next: (data) => {
        this.messages = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching messages', err);
        this.loading = false;
      }
    });
  }

  formatDate(dateStr: string | undefined): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString();
  }
}
