import { Schema, model, type Document, type Model } from 'mongoose';

export interface IPageView extends Document {
  path: string;
  createdAt: Date;
}

const pageViewSchema = new Schema<IPageView>(
  {
    path: { type: String, required: true, maxlength: 300 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

pageViewSchema.index({ createdAt: -1 });

export const PageView: Model<IPageView> = model<IPageView>('PageView', pageViewSchema);
