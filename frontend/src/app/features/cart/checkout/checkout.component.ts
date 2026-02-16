import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService, Cart } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { ContentService } from '../../../core/services/content.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  shippingInfo = {
    shipping_address: '',
    city: '',
    state: '',
    zip_code: '',
    phone_number: ''
  };
  isSubmitting = false;
  paymentStatus: 'idle' | 'processing' | 'success' | 'failed' = 'idle';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,

    private contentService: ContentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      if (!cart || cart.items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }

  onSubmit() {
    this.isSubmitting = true;
    this.paymentStatus = 'processing';

    // Simulate Payment
    setTimeout(() => {
      this.orderService.createOrder(this.shippingInfo).subscribe({
        next: (order) => {
          this.paymentStatus = 'success';
          this.toastService.success('Order placed successfully!');
          this.router.navigate(['/orders']); // Redirect to order history
        },
        error: (err) => {
          this.toastService.error('Failed to place order: ' + (err.error?.detail || err.message));
          this.isSubmitting = false;
          this.paymentStatus = 'failed';
        }
      });
    }, 2000);
  }

  getImageUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
  }
}
