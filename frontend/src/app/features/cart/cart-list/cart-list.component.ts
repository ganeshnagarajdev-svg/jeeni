import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, Cart } from '../../../core/services/cart.service';
import { ContentService } from '../../../core/services/content.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-cart-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-list.component.html',
})
export class CartListComponent implements OnInit {
  cart: Cart | null = null;
  isLoading = true;

  constructor(
    private cartService: CartService,
    private contentService: ContentService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.isLoading = false;
    });
  }

  updateQuantity(itemId: number, quantity: number) {
    if (quantity < 1) return;
    this.cartService.updateQuantity(itemId, quantity).subscribe();
  }

  removeItem(itemId: number) {
    this.cartService.removeFromCart(itemId).subscribe();
  }

  async clearCart() {
    const confirmed = await this.confirmationService.confirm({
      message: 'Are you sure you want to clear your cart?',
      type: 'danger',
      confirmText: 'Yes, clear cart',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      this.cartService.clearCart().subscribe({
        next: () => this.toastService.success('Cart cleared'),
        error: () => this.toastService.error('Failed to clear cart')
      });
    }
  }

  getImageUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
  }
}
