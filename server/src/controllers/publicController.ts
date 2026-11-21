import { Types } from 'mongoose';
import type { Request, Response } from 'express';
import { Category } from '../models/Category.model';
import { Product } from '../models/Product.model';
import { Review } from '../models/Review.model';
import { GalleryItem } from '../models/GalleryItem.model';
import { Settings } from '../models/Settings.model';
import { PageView } from '../models/PageView.model';
import { asyncHandler } from '../utils/asyncHandler';
import { httpError } from '../middleware/error';
import { pageViewSchema, reviewInputSchema } from '../validation/schemas';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await Category.find().sort({ order: 1, name: 1 }).lean();
  res.json(categories);
});

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const { category, q, sort, type, featured } = req.query as Record<string, string | undefined>;
  const filter: Record<string, unknown> = {};

  if (type === 'service' || type === 'retail') filter.type = type;
  if (featured === 'true') filter.featured = true;

  if (category) {
    const found = await Category.findOne({ slug: category }).select('_id').lean();
    filter.category = found ? found._id : new Types.ObjectId();
  }

  if (q && q.trim()) {
    const term = new RegExp(escapeRegex(q.trim()), 'i');
    filter.$or = [{ name: term }, { shortDescription: term }, { description: term }];
  }

  const sorts: Record<string, Record<string, 1 | -1>> = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    newest: { createdAt: -1 },
    recommended: { order: 1, createdAt: -1 },
  };

  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .sort(sorts[sort ?? 'recommended'] ?? sorts.recommended)
    .lean();

  res.json(products);
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate('category', 'name slug description')
    .lean();

  if (!product) throw httpError(404, 'That service could not be found');

  res.json(product);
});

export const listReviews = asyncHandler(async (_req: Request, res: Response) => {
  const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 }).limit(24).lean();
  res.json(reviews);
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const body = reviewInputSchema.parse(req.body);
  const review = await Review.create({ ...body, approved: false });
  res.status(201).json({ id: review.id, message: 'Thanks — your review will appear once approved.' });
});

export const listGallery = asyncHandler(async (_req: Request, res: Response) => {
  const items = await GalleryItem.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json(items);
});

export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const existing = await Settings.findOne({ singleton: 'singleton' }).lean();
  if (existing) {
    res.json(existing);
    return;
  }

  const created = await Settings.create({ singleton: 'singleton' });
  res.json(created.toObject());
});

export const recordPageView = asyncHandler(async (req: Request, res: Response) => {
  const { path } = pageViewSchema.parse(req.body);
  await PageView.create({ path });
  res.status(204).end();
});
