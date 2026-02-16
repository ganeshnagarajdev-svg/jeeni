import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { ContentService } from '../../../core/services/content.service';
import { GeneralService } from '../../../core/services/general.service';
import { Product, Category } from '../../../core/models/product';
import { HomeSection } from '../../../core/models/home-section';

import { CartService } from '../../../core/services/cart.service';
import { Router } from '@angular/router';

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
  homeSections: any[] = [];
  isLoading = true;

  constructor(
    private productService: ProductService,
    private contentService: ContentService,
    private generalService: GeneralService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHomeLayout();
    
    // Fallback/Legacy data fetch for featured products if not in dynamic sections
    this.productService.getProducts(0, 8).subscribe(products => {
      this.featuredProducts = products;
    });

    this.productService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadHomeLayout(): void {
    console.log('Loading home layout...');
    this.isLoading = true;
    this.generalService.getHomeLayout().subscribe({
      next: (sections) => {
        console.log('Received home sections:', sections);
        this.homeSections = sections.map(section => {
          let config = {};
          if (section.configuration) {
            try {
              config = typeof section.configuration === 'string' 
                ? JSON.parse(section.configuration) 
                : section.configuration;
            } catch (e) {
              console.error('Error parsing configuration for section', section.id, e);
            }
          }
          // Add runtime state for carousels
          const sectionData: any = { ...section, config };
          if (section.section_type === 'carousel') {
            sectionData.currentSlide = 0;
            if (sectionData.config.autoplay) {
                this.startCarouselAutoplay(sectionData);
            }
          }
          return sectionData;
        });
        console.log('Parsed home sections:', this.homeSections);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading home layout', err);
        this.isLoading = false;
      }
    });
  }

  getImageUrl(path: string | null | undefined): string {
    return this.contentService.getImageUrl(path);
  }

  // Helper to safely access config fields in template
  getConfig(section: any): any {
    return section.config || {};
  }

  // Carousel Navigation
  nextSlide(section: any): void {
    const items = this.getConfig(section).items || [];
    if (items.length > 0) {
      section.currentSlide = (section.currentSlide + 1) % items.length;
    }
  }

  prevSlide(section: any): void {
    const items = this.getConfig(section).items || [];
    if (items.length > 0) {
      section.currentSlide = (section.currentSlide - 1 + items.length) % items.length;
    }
  }

  goToSlide(section: any, index: number): void {
    section.currentSlide = index;
  }

  startCarouselAutoplay(section: any): void {
    const interval = this.getConfig(section).interval || 5000;
    setInterval(() => {
      this.nextSlide(section);
    }, interval);
  }

  viewDetails(slug: string) {
    this.router.navigate(['/shop/products', slug]);
  }

  addToCart(event: Event, product: Product) {
    event.stopPropagation();
    this.cartService.addToCart(product.id).subscribe({
      next: () => {
        this.router.navigate(['/cart/checkout']);
      },
      error: (err) => {
        console.error('Failed to add to cart:', err);
      }
    });
  }
}
