import type { Request, Response } from 'express';
import { Category } from '../models/Category.model';
import { Product } from '../models/Product.model';
import { Review } from '../models/Review.model';
import { GalleryItem } from '../models/GalleryItem.model';
import { Settings } from '../models/Settings.model';
import { PageView } from '../models/PageView.model';
import { asyncHandler } from '../utils/asyncHandler';
import { httpError } from '../middleware/error';
import {
  galleryInputSchema,
  galleryPatchSchema,
  reorderSchema,
  reviewPatchSchema,
  settingsSchema,
} from '../validation/schemas';

/* -------------------------------- reviews ------------------------------- */

export const adminListReviews = asyncHandler(async (_req: Request, res: Response) => {
  const reviews = await Review.find().sort({ approved: 1, createdAt: -1 }).lean();
  res.json(reviews);
});

export const adminUpdateReview = asyncHandler(async (req: Request, res: Response) => {
  const data = reviewPatchSchema.parse(req.body);
  const review = await Review.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!review) throw httpError(404, 'Review not found');
  res.json(review);
});

export const adminDeleteReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) throw httpError(404, 'Review not found');
  res.json({ message: 'Deleted' });
});

/* -------------------------------- gallery ------------------------------- */

export const adminListGallery = asyncHandler(async (_req: Request, res: Response) => {
  const items = await GalleryItem.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json(items);
});

export const adminCreateGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  const data = galleryInputSchema.parse(req.body);
  const item = await GalleryItem.create(data);
  res.status(201).json(item);
});

export const adminUpdateGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  const data = galleryPatchSchema.parse(req.body);
  const item = await GalleryItem.findByIdAndUpdate(req.params.id, data, { new: true });
  if (!item) throw httpError(404, 'Gallery item not found');
  res.json(item);
});

export const adminDeleteGalleryItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await GalleryItem.findByIdAndDelete(req.params.id);
  if (!item) throw httpError(404, 'Gallery item not found');
  res.json({ message: 'Deleted' });
});

export const adminReorderGallery = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = reorderSchema.parse(req.body);
  await GalleryItem.bulkWrite(
    ids.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
    })),
  );
  res.json({ message: 'Order saved' });
});

/* ------------------------------- settings ------------------------------- */

export const adminGetSettings = asyncHandler(async (_req: Request, res: Response) => {
  const existing = await Settings.findOne({ singleton: 'singleton' }).lean();
  if (existing) {
    res.json(existing);
    return;
  }

  const created = await Settings.create({ singleton: 'singleton' });
  res.json(created.toObject());
});

export const adminUpdateSettings = asyncHandler(async (req: Request, res: Response) => {
  const data = settingsSchema.parse(req.body);
  const settings = await Settings.findOneAndUpdate(
    { singleton: 'singleton' },
    { $set: data },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean();

  res.json(settings);
});

/* ------------------------------- analytics ------------------------------ */

export const adminAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const requested = Number(req.query.days ?? 30);
  const days = [7, 30, 90].includes(requested) ? requested : 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [byDay, totals, pending, products, categories, gallery] = await Promise.all([
    PageView.aggregate<{ _id: string; views: number }>([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          views: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    PageView.countDocuments({ createdAt: { $gte: since } }),
    Review.countDocuments({ approved: false }),
    Product.countDocuments(),
    Category.countDocuments(),
    GalleryItem.countDocuments(),
  ]);

  res.json({
    days,
    totalViews: totals,
    series: byDay.map((row) => ({ date: row._id, views: row.views })),
    counts: { products, categories, gallery, pendingReviews: pending },
  });
});
