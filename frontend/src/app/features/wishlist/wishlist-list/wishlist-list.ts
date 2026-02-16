import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { WishlistItem, WishlistService } from '../../../core/services/wishlist.service';
import { ContentService } from '../../../core/services/content.service';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-wishlist-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist-list.html',
  styleUrl: './wishlist-list.css'
})
export class WishlistListComponent implements OnInit {
  wishlistItems: WishlistItem[] = [];
  loading = true;
  error = '';

  constructor(
    private wishlistService: WishlistService,
    private contentService: ContentService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.loading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (items) => {
        this.wishlistItems = items;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load wishlist';
        this.loading = false;
        console.error(err);
      }
    });
  }

  async removeItem(event: Event, id: number) {
    event.stopPropagation();
    
    const confirmed = await this.confirmationService.confirm({
      message: 'Are you sure you want to remove this item?',
      type: 'warning',
      confirmText: 'Yes, remove',
      cancelText: 'Cancel'
    });

    if(confirmed) {
      this.wishlistService.removeFromWishlist(id).subscribe({
        next: () => {
          this.wishlistItems = this.wishlistItems.filter(item => item.id !== id);
          this.toastService.success('Item removed from wishlist');
        },
        error: (err) => {
          console.error('Error removing item', err);
          this.toastService.error('Failed to remove item');
        }
      });
    }
  }

  getImageUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
  }

  viewDetails(slug: string) {
    this.router.navigate(['/shop/products', slug]);
  }
}
