import { Router } from 'express';
import {
  createReview,
  getProduct,
  getSettings,
  listCategories,
  listGallery,
  listProducts,
  listReviews,
  recordPageView,
} from '../controllers/publicController';
import { analyticsLimiter, reviewLimiter } from '../middleware/rateLimit';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: Math.round(process.uptime()) });
});

router.get('/categories', listCategories);
router.get('/products', listProducts);
router.get('/products/:slug', getProduct);
router.get('/reviews', listReviews);
router.post('/reviews', reviewLimiter, createReview);
router.get('/gallery', listGallery);
router.get('/settings', getSettings);
router.post('/analytics/pageview', analyticsLimiter, recordPageView);

export default router;
