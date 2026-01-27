export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductImage {
  id: number;
  image_url: string;
  is_main: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discounted_price?: number;
  stock: number;
  is_featured: boolean;
  is_active: boolean;
  category_id: number;
  category?: Category;
  images?: ProductImage[];
}
