import { Router } from 'express';
import { changePassword, login, me } from '../controllers/adminAuthController';
import {
  adminCreateCategory,
  adminCreateProduct,
  adminDeleteCategory,
  adminDeleteProduct,
  adminListCategories,
  adminListProducts,
  adminReorderCategories,
  adminUpdateCategory,
  adminUpdateProduct,
} from '../controllers/adminCatalogueController';
import {
  adminAnalytics,
  adminCreateGalleryItem,
  adminDeleteGalleryItem,
  adminDeleteReview,
  adminGetSettings,
  adminListGallery,
  adminListReviews,
  adminReorderGallery,
  adminUpdateGalleryItem,
  adminUpdateReview,
  adminUpdateSettings,
} from '../controllers/adminContentController';
import { requireAdmin } from '../middleware/auth';
import { loginLimiter, writeLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/login', loginLimiter, login);

router.use(requireAdmin);
router.use(writeLimiter);

router.get('/me', me);
router.post('/change-password', changePassword);

router.get('/products', adminListProducts);
router.post('/products', adminCreateProduct);
router.put('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

router.get('/categories', adminListCategories);
router.post('/categories', adminCreateCategory);
router.post('/categories/reorder', adminReorderCategories);
router.put('/categories/:id', adminUpdateCategory);
router.delete('/categories/:id', adminDeleteCategory);

router.get('/reviews', adminListReviews);
router.put('/reviews/:id', adminUpdateReview);
router.delete('/reviews/:id', adminDeleteReview);

router.get('/gallery', adminListGallery);
router.post('/gallery', adminCreateGalleryItem);
router.post('/gallery/reorder', adminReorderGallery);
router.put('/gallery/:id', adminUpdateGalleryItem);
router.delete('/gallery/:id', adminDeleteGalleryItem);

router.get('/settings', adminGetSettings);
router.put('/settings', adminUpdateSettings);

router.get('/analytics', adminAnalytics);

export default router;
