import { Injectable, signal } from '@angular/core';

export interface ConfirmationOptions {
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  confirmationState = signal<{
    isOpen: boolean;
    options: ConfirmationOptions | null;
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    options: null,
    resolve: null
  });

  confirm(options: ConfirmationOptions): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationState.set({
        isOpen: true,
        options,
        resolve
      });
    });
  }

  resolve(result: boolean) {
    const state = this.confirmationState();
    if (state.resolve) {
      state.resolve(result);
    }
    this.close();
  }

  close() {
    this.confirmationState.set({
      isOpen: false,
      options: null,
      resolve: null
    });
  }
}
