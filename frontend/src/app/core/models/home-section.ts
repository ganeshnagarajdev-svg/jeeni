export interface HomeSection {
  id: number;
  title: string | null;
  section_type: string;
  configuration: string | null; // JSON string from backend
  order: number;
  is_active: boolean;
}

export type HomeSectionType = 'hero' | 'features' | 'categories' | 'benefits' | 'product_grid' | 'cta' | 'carousel';

export interface CarouselItem {
  image_url: string;
  title: string;
  subtitle?: string;
  link?: string;
  button_text?: string;
}

export interface CarouselConfig {
  items: CarouselItem[];
  autoplay?: boolean;
  interval?: number;
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  description: string;
  primary_btn_text: string;
  primary_btn_link: string;
  secondary_btn_text: string;
  secondary_btn_link: string;
  image_url: string;
  bg_image_url: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface FeaturesConfig {
  header: string;
  title: string;
  subtitle: string;
  features: FeatureItem[];
}

export interface CategoryItem {
  name: string;
  slug: string;
  image_url: string;
}

export interface CategoriesConfig {
  header: string;
  title: string;
  categories: CategoryItem[];
}

export interface BenefitPoint {
  id: number;
  title: string;
  description: string;
}

export interface UsageItem {
  icon: string;
  text: string;
}

export interface BenefitsConfig {
  header: string;
  title: string;
  image_url: string;
  points: BenefitPoint[];
  usage_title: string;
  usage_items: UsageItem[];
  cta_text: string;
  cta_link: string;
}

export interface ProductGridConfig {
  header: string;
  title: string;
  limit: number;
}

export interface CtaConfig {
  title: string;
  description: string;
  placeholder: string;
  btn_text: string;
}
