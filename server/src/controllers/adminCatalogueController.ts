import type { Request, Response } from 'express';
import { Category } from '../models/Category.model';
import { Product } from '../models/Product.model';
import { asyncHandler } from '../utils/asyncHandler';
import { httpError } from '../middleware/error';
import { uniqueSlug } from '../utils/slug';
import {
  categoryInputSchema,
  categoryPatchSchema,
  productInputSchema,
  productPatchSchema,
  reorderSchema,
} from '../validation/schemas';

/* ------------------------------- products ------------------------------- */

export const adminListProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await Product.find()
    .populate('category', 'name slug')
    .sort({ order: 1, createdAt: -1 })
    .lean();
  res.json(products);
});

export const adminCreateProduct = asyncHandler(async (req: Request, res: Response) => {
  const data = productInputSchema.parse(req.body);

  const category = await Category.findById(data.category).select('_id');
  if (!category) throw httpError(400, 'Choose an existing category');

  const slug = await uniqueSlug(Product, data.name);
  const product = await Product.create({ ...data, slug });
  res.status(201).json(product);
});

export const adminUpdateProduct = asyncHandler(async (req: Request, res: Response) => {
  const data = productPatchSchema.parse(req.body);
  const product = await Product.findById(req.params.id);
  if (!product) throw httpError(404, 'Service not found');

  if (data.category) {
    const category = await Category.findById(data.category).select('_id');
    if (!category) throw httpError(400, 'Choose an existing category');
  }

  const renaming = typeof data.name === 'string' && data.name !== product.name;
  const nextSlug = renaming ? await uniqueSlug(Product, data.name as string, product.id) : product.slug;

  Object.assign(product, data, { slug: nextSlug });
  await product.save();

  res.json(product);
});

export const adminDeleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw httpError(404, 'Service not found');
  res.json({ message: 'Deleted' });
});

/* ------------------------------ categories ------------------------------ */

export const adminListCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await Category.find().sort({ order: 1, name: 1 }).lean();
  const counts = await Product.aggregate<{ _id: string; count: number }>([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const byId = new Map(counts.map((row) => [String(row._id), row.count]));

  res.json(categories.map((category) => ({ ...category, productCount: byId.get(String(category._id)) ?? 0 })));
});

export const adminCreateCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = categoryInputSchema.parse(req.body);
  const slug = await uniqueSlug(Category, data.name);
  const category = await Category.create({ ...data, slug });
  res.status(201).json(category);
});

export const adminUpdateCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = categoryPatchSchema.parse(req.body);
  const category = await Category.findById(req.params.id);
  if (!category) throw httpError(404, 'Category not found');

  const renaming = typeof data.name === 'string' && data.name !== category.name;
  const nextSlug = renaming
    ? await uniqueSlug(Category, data.name as string, category.id)
    : category.slug;

  Object.assign(category, data, { slug: nextSlug });
  await category.save();

  res.json(category);
});

export const adminDeleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const inUse = await Product.countDocuments({ category: req.params.id });
  if (inUse > 0) throw httpError(400, `Move or delete the ${inUse} item(s) in this category first`);

  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw httpError(404, 'Category not found');
  res.json({ message: 'Deleted' });
});

export const adminReorderCategories = asyncHandler(async (req: Request, res: Response) => {
  const { ids } = reorderSchema.parse(req.body);
  await Category.bulkWrite(
    ids.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
    })),
  );
  res.json({ message: 'Order saved' });
});
