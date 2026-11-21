import { Schema, model, type Document, type Model } from 'mongoose';

export interface IGalleryItem extends Document {
  image: string;
  title: string;
  caption: string;
  inSlider: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGalleryItem>(
  {
    image: { type: String, required: true },
    title: { type: String, default: '' },
    caption: { type: String, default: '' },
    inSlider: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const GalleryItem: Model<IGalleryItem> = model<IGalleryItem>('GalleryItem', gallerySchema);
