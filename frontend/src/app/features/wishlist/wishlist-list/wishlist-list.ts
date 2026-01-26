import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistItem, WishlistService } from '../../../core/services/wishlist.service';

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

  constructor(private wishlistService: WishlistService) {}

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

  removeItem(id: number): void {
    if(confirm('Are you sure you want to remove this item?')) {
      this.wishlistService.removeFromWishlist(id).subscribe({
        next: () => {
          this.wishlistItems = this.wishlistItems.filter(item => item.id !== id);
        },
        error: (err) => console.error('Error removing item', err)
      });
    }
  }
}
