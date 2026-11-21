import { apiRequest } from './client';
import type {
  Admin,
  Analytics,
  Category,
  GalleryItem,
  Product,
  Review,
  Settings,
} from './types';

const query = (params: Record<string, string | undefined>): string => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
};

/* --------------------------------- public -------------------------------- */

export const getSettings = (signal?: AbortSignal) => apiRequest<Settings>('/api/settings', { signal });
export const getCategories = (signal?: AbortSignal) => apiRequest<Category[]>('/api/categories', { signal });
export const getGallery = (signal?: AbortSignal) => apiRequest<GalleryItem[]>('/api/gallery', { signal });
export const getReviews = (signal?: AbortSignal) => apiRequest<Review[]>('/api/reviews', { signal });

export const getProducts = (
  params: { category?: string; q?: string; sort?: string; type?: string; featured?: boolean } = {},
  signal?: AbortSignal,
) =>
  apiRequest<Product[]>(
    `/api/products${query({
      category: params.category,
      q: params.q,
      sort: params.sort,
      type: params.type,
      featured: params.featured ? 'true' : undefined,
    })}`,
    { signal },
  );

export const getProduct = (slug: string, signal?: AbortSignal) =>
  apiRequest<Product>(`/api/products/${encodeURIComponent(slug)}`, { signal });

export const submitReview = (body: { name: string; rating: number; text: string; service?: string }) =>
  apiRequest<{ id: string; message: string }>('/api/reviews', { method: 'POST', body });

export const trackPageView = (path: string) => {
  void apiRequest('/api/analytics/pageview', { method: 'POST', body: { path } }).catch(() => undefined);
};

/* --------------------------------- admin --------------------------------- */

export const adminLogin = (email: string, password: string) =>
  apiRequest<{ token: string; admin: Admin }>('/api/admin/login', {
    method: 'POST',
    body: { email, password },
  });

export const adminMe = () => apiRequest<Admin>('/api/admin/me', { auth: true });

export const adminChangePassword = (currentPassword: string, newPassword: string) =>
  apiRequest<{ message: string }>('/api/admin/change-password', {
    method: 'POST',
    auth: true,
    body: { currentPassword, newPassword },
  });

export const adminProducts = () => apiRequest<Product[]>('/api/admin/products', { auth: true });

export const adminCreateProduct = (body: Partial<Product> & { category: string }) =>
  apiRequest<Product>('/api/admin/products', { method: 'POST', auth: true, body });

export const adminUpdateProduct = (id: string, body: Partial<Product> & { category?: string }) =>
  apiRequest<Product>(`/api/admin/products/${id}`, { method: 'PUT', auth: true, body });

export const adminDeleteProduct = (id: string) =>
  apiRequest<{ message: string }>(`/api/admin/products/${id}`, { method: 'DELETE', auth: true });

export const adminCategories = () => apiRequest<Category[]>('/api/admin/categories', { auth: true });

export const adminCreateCategory = (body: Partial<Category>) =>
  apiRequest<Category>('/api/admin/categories', { method: 'POST', auth: true, body });

export const adminUpdateCategory = (id: string, body: Partial<Category>) =>
  apiRequest<Category>(`/api/admin/categories/${id}`, { method: 'PUT', auth: true, body });

export const adminDeleteCategory = (id: string) =>
  apiRequest<{ message: string }>(`/api/admin/categories/${id}`, { method: 'DELETE', auth: true });

export const adminReorderCategories = (ids: string[]) =>
  apiRequest<{ message: string }>('/api/admin/categories/reorder', {
    method: 'POST',
    auth: true,
    body: { ids },
  });

export const adminReviews = () => apiRequest<Review[]>('/api/admin/reviews', { auth: true });

export const adminUpdateReview = (id: string, body: { approved?: boolean }) =>
  apiRequest<Review>(`/api/admin/reviews/${id}`, { method: 'PUT', auth: true, body });

export const adminDeleteReview = (id: string) =>
  apiRequest<{ message: string }>(`/api/admin/reviews/${id}`, { method: 'DELETE', auth: true });

export const adminGallery = () => apiRequest<GalleryItem[]>('/api/admin/gallery', { auth: true });

export const adminCreateGalleryItem = (body: Partial<GalleryItem>) =>
  apiRequest<GalleryItem>('/api/admin/gallery', { method: 'POST', auth: true, body });

export const adminUpdateGalleryItem = (id: string, body: Partial<GalleryItem>) =>
  apiRequest<GalleryItem>(`/api/admin/gallery/${id}`, { method: 'PUT', auth: true, body });

export const adminDeleteGalleryItem = (id: string) =>
  apiRequest<{ message: string }>(`/api/admin/gallery/${id}`, { method: 'DELETE', auth: true });

export const adminReorderGallery = (ids: string[]) =>
  apiRequest<{ message: string }>('/api/admin/gallery/reorder', {
    method: 'POST',
    auth: true,
    body: { ids },
  });

export const adminSettings = () => apiRequest<Settings>('/api/admin/settings', { auth: true });

export const adminUpdateSettings = (body: Partial<Settings>) =>
  apiRequest<Settings>('/api/admin/settings', { method: 'PUT', auth: true, body });

export const adminAnalytics = (days: number) =>
  apiRequest<Analytics>(`/api/admin/analytics?days=${days}`, { auth: true });
