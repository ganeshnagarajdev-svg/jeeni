import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService, Order } from '../../../core/services/order.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-order-details.html',
})
export class AdminOrderDetailsComponent implements OnInit {
  order: Order | null = null;
  isLoading = true;
  statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(+orderId);
    }
  }

  loadOrder(id: number): void {
    this.isLoading = true;
    this.orderService.getOrder(id).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  updateStatus(newStatus: string): void {
    if (!this.order || this.order.status === newStatus) return;

    this.orderService.updateOrderStatus(this.order.id, newStatus).subscribe({
      next: (updatedOrder) => {
        if (this.order) this.order.status = updatedOrder.status;
      },
      error: (err) => {
        console.error('Failed to update status', err);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}
