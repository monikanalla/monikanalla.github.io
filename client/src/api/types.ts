export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order: number;
  productCount?: number;
}

export interface Variant {
  label: string;
  price: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price: number;
  compareAtPrice?: number | null;
  duration?: string;
  type: 'service' | 'retail';
  category: Pick<Category, '_id' | 'name' | 'slug'> | string;
  images: string[];
  variants: Variant[];
  bestseller: boolean;
  featured: boolean;
  outOfStock: boolean;
  order: number;
  seo?: { title?: string; description?: string };
  createdAt?: string;
}

export interface Review {
  _id: string;
  name: string;
  rating: number;
  text: string;
  service?: string;
  approved: boolean;
  createdAt: string;
}

export interface GalleryItem {
  _id: string;
  image: string;
  title?: string;
  caption?: string;
  inSlider: boolean;
  order: number;
}

export interface Settings {
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroSubhead: string;
  heroBadge: string;
  aboutCopy: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  instagram: string;
  address: string;
  mapsUrl: string;
  hours: string;
  messageTemplate: string;
  announcement: string;
}

export interface Admin {
  id: string;
  email: string;
  mustChangePassword: boolean;
}

export interface Analytics {
  days: number;
  totalViews: number;
  series: { date: string; views: number }[];
  counts: { products: number; categories: number; gallery: number; pendingReviews: number };
}

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  duration?: string;
  variant?: string;
  qty: number;
}
