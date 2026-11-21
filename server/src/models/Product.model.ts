import { Schema, model, type Document, type Model, type Types } from 'mongoose';

export type ProductType = 'service' | 'retail';

export interface IProduct extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  duration: string;
  type: ProductType;
  category: Types.ObjectId;
  images: string[];
  variants: { label: string; price: number }[];
  bestseller: boolean;
  featured: boolean;
  outOfStock: boolean;
  order: number;
  seo: { title: string; description: string };
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: { type: String, default: '' },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    duration: { type: String, default: '' },
    type: { type: String, enum: ['service', 'retail'], default: 'service' },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    images: { type: [String], default: [] },
    variants: { type: [variantSchema], default: [] },
    bestseller: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    outOfStock: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
    },
  },
  { timestamps: true },
);

productSchema.index({ name: 'text', shortDescription: 'text', description: 'text' });

export const Product: Model<IProduct> = model<IProduct>('Product', productSchema);
