import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ContentService } from '../../../core/services/content.service';
import { Product, Category } from '../../../core/models/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  categories: Category[] = [];

  constructor(
    private productService: ProductService,
    private contentService: ContentService
  ) {}

  ngOnInit(): void {
    // Fetch some featured products (assuming first 4 for now)
    this.productService.getProducts(0, 4).subscribe(products => {
      this.featuredProducts = products;
    });

    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  getImageUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
  }
}
