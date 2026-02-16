import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (confirmationService.confirmationState().isOpen) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
        <div class="relative w-full max-w-md max-h-full rounded-lg bg-white shadow-xl transform transition-all scale-100 animate-scale-in">
          
          <!-- Modal content -->
          <div class="p-6 text-center">
            
            <!-- Icon based on type -->
            @if (confirmationService.confirmationState().options?.type === 'danger') {
              <svg class="mx-auto mb-4 h-12 w-12 text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
            } @else if (confirmationService.confirmationState().options?.type === 'warning') {
              <svg class="mx-auto mb-4 h-12 w-12 text-yellow-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
            } @else {
              <svg class="mx-auto mb-4 h-12 w-12 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
              </svg>
            }

            <h3 class="mb-5 text-lg font-normal text-gray-500">
              {{ confirmationService.confirmationState().options?.message }}
            </h3>
            
            <button 
              type="button" 
              (click)="confirmationService.resolve(true)"
              [class]="confirmationService.confirmationState().options?.type === 'danger' 
                ? 'bg-red-600 hover:bg-red-800 focus:ring-red-300' 
                : 'bg-blue-600 hover:bg-blue-800 focus:ring-blue-300'"
              class="inline-flex items-center rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 mr-2"
            >
              {{ confirmationService.confirmationState().options?.confirmText || 'Yes, I\\'m sure' }}
            </button>
            
            <button 
              type="button" 
              (click)="confirmationService.resolve(false)"
              class="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100"
            >
              {{ confirmationService.confirmationState().options?.cancelText || 'No, cancel' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out;
    }
    .animate-scale-in {
      animation: scaleIn 0.2s ease-out;
    }
  `]
})
export class ConfirmationModalComponent {
  confirmationService = inject(ConfirmationService);
}
