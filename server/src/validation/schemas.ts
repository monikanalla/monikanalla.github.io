import { z } from 'zod';

const imageUrl = z.string().trim().min(1).max(500);

export const loginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(6).max(200),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6).max(200),
  newPassword: z
    .string()
    .min(10, 'Use at least 10 characters')
    .max(200)
    .regex(/[a-zA-Z]/, 'Include a letter')
    .regex(/[0-9]/, 'Include a number'),
});

export const productInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  shortDescription: z.string().trim().max(240).optional(),
  description: z.string().trim().max(5000).optional(),
  price: z.coerce.number().min(0).max(1_000_000),
  compareAtPrice: z.coerce.number().min(0).max(1_000_000).nullable().optional(),
  duration: z.string().trim().max(60).optional(),
  type: z.enum(['service', 'retail']).optional(),
  category: z.string().trim().min(1),
  images: z.array(imageUrl).max(10).optional(),
  variants: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(80),
        price: z.coerce.number().min(0).max(1_000_000),
      }),
    )
    .max(20)
    .optional(),
  bestseller: z.boolean().optional(),
  featured: z.boolean().optional(),
  outOfStock: z.boolean().optional(),
  order: z.coerce.number().int().optional(),
  seo: z
    .object({
      title: z.string().trim().max(160).optional(),
      description: z.string().trim().max(300).optional(),
    })
    .optional(),
});

export const productPatchSchema = productInputSchema.partial();

export const categoryInputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(400).optional(),
  image: z.string().trim().max(500).optional(),
  order: z.coerce.number().int().optional(),
});

export const categoryPatchSchema = categoryInputSchema.partial();

export const reviewInputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  rating: z.coerce.number().int().min(1).max(5),
  text: z.string().trim().min(10).max(700),
  service: z.string().trim().max(120).optional(),
});

export const reviewPatchSchema = z.object({
  approved: z.boolean().optional(),
  name: z.string().trim().min(2).max(80).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  text: z.string().trim().min(10).max(700).optional(),
  service: z.string().trim().max(120).optional(),
});

export const galleryInputSchema = z.object({
  image: imageUrl,
  title: z.string().trim().max(120).optional(),
  caption: z.string().trim().max(240).optional(),
  inSlider: z.boolean().optional(),
  order: z.coerce.number().int().optional(),
});

export const galleryPatchSchema = galleryInputSchema.partial();

export const settingsSchema = z.object({
  brandName: z.string().trim().max(80).optional(),
  tagline: z.string().trim().max(120).optional(),
  heroHeadline: z.string().trim().max(160).optional(),
  heroSubhead: z.string().trim().max(400).optional(),
  heroBadge: z.string().trim().max(120).optional(),
  aboutCopy: z.string().trim().max(3000).optional(),
  whatsappNumber: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9]*$/, 'Digits only, with country code and no + or spaces')
    .optional(),
  phone: z.string().trim().max(40).optional(),
  email: z.string().trim().max(160).optional(),
  instagram: z.string().trim().max(300).optional(),
  address: z.string().trim().max(400).optional(),
  mapsUrl: z.string().trim().max(600).optional(),
  hours: z.string().trim().max(200).optional(),
  messageTemplate: z.string().trim().max(1200).optional(),
  announcement: z.string().trim().max(200).optional(),
});

export const reorderSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(200),
});

export const pageViewSchema = z.object({
  path: z.string().trim().min(1).max(300),
});
