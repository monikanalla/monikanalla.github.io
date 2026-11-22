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

interface ProductFilters {
  category?: string;
  q?: string;
  sort?: string;
  type?: string;
  featured?: boolean;
}

const staticRequests = new Map<string, Promise<unknown>>();

/**
 * Seeded catalogue mirrored into `public/data` at build time. The GitHub Pages build is a static
 * bundle with no Express process behind it, so public reads fall back to this snapshot.
 */
function loadStatic<T>(name: string): Promise<T> {
  let request = staticRequests.get(name) as Promise<T> | undefined;
  if (!request) {
    request = fetch(`${import.meta.env.BASE_URL}data/${name}.json`).then((response) => {
      if (!response.ok) throw new Error(`Offline data unavailable (${response.status})`);
      return response.json() as Promise<T>;
    });
    staticRequests.set(name, request);
  }
  return request;
}

const isAbort = (error: unknown): boolean => error instanceof Error && error.name === 'AbortError';

async function readThrough<T>(name: string, request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (error) {
    if (isAbort(error)) throw error;
    return loadStatic<T>(name);
  }
}

const filterProducts = (products: Product[], filters: ProductFilters): Product[] => {
  let list = products.filter((product) => !filters.type || product.type === filters.type);
  if (filters.featured) list = list.filter((product) => product.featured);
  if (filters.category) {
    list = list.filter((product) =>
      typeof product.category === 'string'
        ? product.category === filters.category
        : product.category.slug === filters.category,
    );
  }
  if (filters.q) {
    const needle = filters.q.trim().toLowerCase();
    list = list.filter((product) =>
      `${product.name} ${product.shortDescription ?? ''}`.toLowerCase().includes(needle),
    );
  }

  const sorted = [...list];
  if (filters.sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
  else if (filters.sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
  else if (filters.sort === 'newest') {
    sorted.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
  } else sorted.sort((a, b) => a.order - b.order);
  return sorted;
};

export const getSettings = (signal?: AbortSignal) =>
  readThrough<Settings>('settings', () => apiRequest<Settings>('/api/settings', { signal }));

export const getCategories = (signal?: AbortSignal) =>
  readThrough<Category[]>('categories', () => apiRequest<Category[]>('/api/categories', { signal }));

export const getGallery = (signal?: AbortSignal) =>
  readThrough<GalleryItem[]>('gallery', () => apiRequest<GalleryItem[]>('/api/gallery', { signal }));

export const getReviews = (signal?: AbortSignal) =>
  readThrough<Review[]>('reviews', () => apiRequest<Review[]>('/api/reviews', { signal }));

export const getProducts = async (
  params: ProductFilters = {},
  signal?: AbortSignal,
): Promise<Product[]> => {
  try {
    return await apiRequest<Product[]>(
      `/api/products${query({
        category: params.category,
        q: params.q,
        sort: params.sort,
        type: params.type,
        featured: params.featured ? 'true' : undefined,
      })}`,
      { signal },
    );
  } catch (error) {
    if (isAbort(error)) throw error;
    return filterProducts(await loadStatic<Product[]>('products'), params);
  }
};

export const getProduct = async (slug: string, signal?: AbortSignal): Promise<Product> => {
  try {
    return await apiRequest<Product>(`/api/products/${encodeURIComponent(slug)}`, { signal });
  } catch (error) {
    if (isAbort(error)) throw error;
    const products = await loadStatic<Product[]>('products');
    const match = products.find((product) => product.slug === slug);
    if (!match) throw error;
    return match;
  }
};

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
