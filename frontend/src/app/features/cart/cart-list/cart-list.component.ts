import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, Cart } from '../../../core/services/cart.service';
import { ContentService } from '../../../core/services/content.service';

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
    private contentService: ContentService
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

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart().subscribe();
    }
  }

  getImageUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
  }
}
