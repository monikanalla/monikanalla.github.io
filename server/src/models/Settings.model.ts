import { Schema, model, type Document, type Model } from 'mongoose';

export interface ISettings extends Document {
  singleton: string;
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroSubhead: string;
  heroBadge: string;
  aboutCopy: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  instagram: string;
  address: string;
  mapsUrl: string;
  hours: string;
  messageTemplate: string;
  announcement: string;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    singleton: { type: String, default: 'singleton', unique: true, immutable: true },
    brandName: { type: String, default: 'HAIR5S' },
    tagline: { type: String, default: 'Unisex Salon' },
    heroHeadline: { type: String, default: 'Hair, done with intention.' },
    heroSubhead: { type: String, default: '' },
    heroBadge: { type: String, default: 'Mumbai · Unisex salon' },
    aboutCopy: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    instagram: { type: String, default: '' },
    address: { type: String, default: '' },
    mapsUrl: { type: String, default: '' },
    hours: { type: String, default: '' },
    messageTemplate: {
      type: String,
      default:
        'Hi {brand}! I would like to book an appointment.\n\n{items}\n\nEstimated total: {total}\nName: {name}',
    },
    announcement: { type: String, default: '' },
  },
  { timestamps: true },
);

export const Settings: Model<ISettings> = model<ISettings>('Settings', settingsSchema);
