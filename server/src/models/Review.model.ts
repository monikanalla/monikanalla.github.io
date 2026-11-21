import { Schema, model, type Document, type Model } from 'mongoose';

export interface IReview extends Document {
  name: string;
  rating: number;
  text: string;
  service: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true, maxlength: 700 },
    service: { type: String, default: '' },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Review: Model<IReview> = model<IReview>('Review', reviewSchema);
