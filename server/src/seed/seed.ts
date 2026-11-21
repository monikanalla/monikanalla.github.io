import { connectDatabase, disconnectDatabase } from '../config/database';
import { env } from '../config/env';
import { AdminUser, hashPassword } from '../models/AdminUser.model';
import { Category } from '../models/Category.model';
import { Product } from '../models/Product.model';
import { GalleryItem } from '../models/GalleryItem.model';
import { Review } from '../models/Review.model';
import { Settings } from '../models/Settings.model';
import { PageView } from '../models/PageView.model';
import { slugify } from '../utils/slug';

const RESET = process.argv.includes('--reset');

/** Real photography downloaded from the salon's public Instagram grid. */
const PHOTO = (name: string) => `/instagram/${name}.jpg`;

const categories = [
  {
    name: 'Hair & Colour',
    slug: 'hair-colour',
    order: 0,
    description: 'Global colour, balayage, highlights, keratin and hair spa.',
    image: PHOTO('work-06'),
  },
  {
    name: 'Cut & Style',
    slug: 'cut-style',
    order: 1,
    description: 'Precision cuts, blow-dry and finish for men and women.',
    image: PHOTO('work-05'),
  },
  {
    name: 'Extensions & Patch',
    slug: 'extensions-patch',
    order: 2,
    description: 'Micro-ring, clip-in, glue and stitched extensions, plus hair patch fitting.',
    image: PHOTO('work-04'),
  },
  {
    name: 'Nails',
    slug: 'nails',
    order: 3,
    description: 'Gel polish, nail extensions and hand-painted nail art.',
    image: PHOTO('work-09'),
  },
  {
    name: 'Skin & Lashes',
    slug: 'skin-lashes',
    order: 4,
    description: 'Carbon facials, clean-ups, microblading and eyelash extensions.',
    image: PHOTO('work-01'),
  },
];

/**
 * Prices are deliberately left at 0 (= "On request") unless the salon has
 * published a starting price — the amount depends on hair length and density.
 * The one confirmed figure comes from their own extensions post.
 */
const services = [
  {
    name: 'Global Hair Colour',
    category: 'hair-colour',
    price: 0,
    duration: '90–120 min',
    featured: true,
    bestseller: true,
    shortDescription: 'One even tone from root to tip, finished with a gloss.',
    image: 'work-02',
  },
  {
    name: 'Balayage',
    category: 'hair-colour',
    price: 0,
    duration: '150–180 min',
    featured: true,
    shortDescription: 'Freehand, sun-kissed dimension that grows out softly.',
    image: 'work-08',
  },
  {
    name: 'Highlights',
    category: 'hair-colour',
    price: 0,
    duration: '120–150 min',
    shortDescription: 'Hand-painted pieces around the face and crown.',
    image: 'work-03',
  },
  {
    name: 'Keratin Smoothening',
    category: 'hair-colour',
    price: 0,
    duration: '150 min',
    shortDescription: 'Frizz control that keeps natural movement in the hair.',
    image: 'work-10',
  },
  {
    name: 'Hair Spa',
    category: 'hair-colour',
    price: 0,
    duration: '45–60 min',
    shortDescription: 'Steam, scalp massage and a conditioning mask.',
    image: 'work-02',
  },
  {
    name: 'Root Touch-Up',
    category: 'hair-colour',
    price: 0,
    duration: '45 min',
    shortDescription: 'Colour refresh at the regrowth line between full visits.',
    image: 'work-10',
  },
  {
    name: 'Haircut (Women)',
    category: 'cut-style',
    price: 0,
    duration: '45 min',
    featured: true,
    shortDescription: 'Consultation, precision cut, wash and finish.',
    image: 'work-03',
  },
  {
    name: 'Haircut (Men)',
    category: 'cut-style',
    price: 0,
    duration: '30 min',
    shortDescription: 'Clipper and scissor cut, styled to finish.',
    image: 'work-05',
  },
  {
    name: 'Blow Dry & Styling',
    category: 'cut-style',
    price: 0,
    duration: '40 min',
    shortDescription: 'Smooth or texturised finish for an occasion.',
    image: 'work-06',
  },
  {
    name: 'Hair Extensions',
    category: 'extensions-patch',
    price: 3999,
    duration: '2–4 hr',
    featured: true,
    bestseller: true,
    shortDescription: 'Micro-ring, clip-in, glue, weft and stitch extensions — starting from ₹3,999.',
    image: 'work-04',
  },
  {
    name: 'Hair Patch & Wig Fitting',
    category: 'extensions-patch',
    price: 0,
    duration: '60–90 min',
    shortDescription: 'Custom-matched patch and wig fitting, cut and blended in.',
    image: 'work-01',
  },
  {
    name: 'Nail Extensions',
    category: 'nails',
    price: 0,
    duration: '90 min',
    featured: true,
    shortDescription: 'Builder-gel or acrylic extensions shaped to your hand.',
    image: 'work-09',
  },
  {
    name: 'Gel Polish',
    category: 'nails',
    price: 0,
    duration: '45 min',
    shortDescription: 'Long-wear colour with a clean, glossy finish.',
    image: 'work-07',
  },
  {
    name: 'Nail Art',
    category: 'nails',
    price: 0,
    duration: '30–60 min',
    shortDescription: 'Chrome, French or hand-painted art over your set.',
    image: 'work-09',
  },
  {
    name: 'Carbon Facial',
    category: 'skin-lashes',
    price: 0,
    duration: '60 min',
    featured: true,
    bestseller: true,
    shortDescription: 'Deep-pore carbon facial for texture, oil and dullness.',
    image: 'work-01',
  },
  {
    name: 'Clean-Up & Detan',
    category: 'skin-lashes',
    price: 0,
    duration: '40 min',
    shortDescription: 'Quick reset for tan and congestion between facials.',
    image: 'work-01',
  },
  {
    name: 'Microblading',
    category: 'skin-lashes',
    price: 0,
    duration: '120 min',
    featured: true,
    shortDescription: 'Feather-stroke brows mapped to your face.',
    image: 'work-01',
  },
  {
    name: 'Eyelash Extensions',
    category: 'skin-lashes',
    price: 0,
    duration: '90 min',
    shortDescription: 'Classic, hybrid or volume lash sets.',
    image: 'work-01',
  },
];

const gallery = [
  { image: PHOTO('work-06'), title: 'Balayage, blow-dried', caption: 'Colour and finish from the HAIR5S chair.', order: 0, inSlider: true },
  { image: PHOTO('work-09'), title: 'Silver chrome set', caption: 'Nail extensions with hand-painted art.', order: 1, inSlider: true },
  { image: PHOTO('work-04'), title: 'Micro-ring extensions', caption: 'Length and volume, blended into the natural hair.', order: 2, inSlider: true },
  { image: PHOTO('work-03'), title: 'Dimensional highlights', caption: 'Face-framing pieces, styled soft.', order: 3, inSlider: true },
  { image: PHOTO('work-05'), title: 'Fresh cut, fresh attitude', caption: 'Men’s cut and finish.', order: 4, inSlider: true },
  { image: PHOTO('work-08'), title: 'Premium balayage', caption: 'Before-and-after dimension.', order: 5, inSlider: false },
  { image: PHOTO('work-02'), title: 'The reveal', caption: 'In the chair at HAIR5S.', order: 6, inSlider: false },
  { image: PHOTO('work-10'), title: 'Colour in progress', caption: 'Sectioned and painted by hand.', order: 7, inSlider: false },
  { image: PHOTO('work-01'), title: 'The salon', caption: 'HAIR5S Unisex Salon, Mumbai.', order: 8, inSlider: false },
];

async function run(): Promise<void> {
  await connectDatabase();

  if (RESET) {
    await Promise.all([
      Product.deleteMany({}),
      Category.deleteMany({}),
      GalleryItem.deleteMany({}),
      Review.deleteMany({}),
      PageView.deleteMany({}),
      Settings.deleteMany({}),
    ]);
    console.log('[seed] cleared catalogue, gallery, reviews, analytics and settings');
  }

  /* admin account */
  const email = env.ADMIN_EMAIL.toLowerCase();
  const existingAdmin = await AdminUser.findOne({ email });
  if (!existingAdmin) {
    await AdminUser.create({
      email,
      passwordHash: await hashPassword(env.ADMIN_PASSWORD),
      mustChangePassword: true,
    });
    console.log(`[seed] admin created: ${email} (first sign-in must set a new password)`);
  } else {
    console.log(`[seed] admin already exists: ${email}`);
  }

  /* settings */
  const existingSettings = await Settings.findOne({ singleton: 'singleton' });
  if (!existingSettings) {
    await Settings.create({
      singleton: 'singleton',
      brandName: 'HAIR5S',
      tagline: 'Unisex Salon · Mumbai',
      heroHeadline: 'Cut. Colour. Confidence.',
      heroSubhead:
        'A unisex salon in Mumbai for colour, keratin, extensions, lashes, nails and skin — booked over WhatsApp, finished in the chair.',
      heroBadge: 'Mumbai · Unisex salon',
      aboutCopy:
        'HAIR5S is a unisex salon in Mumbai working across hair, skin and nails: colour and balayage, keratin, extensions and hair patch, carbon facials, microblading, lashes and nail art. One team, one standard of finish — for men and women in the same chair.',
      whatsappNumber: '',
      phone: '',
      email: '',
      instagram: 'https://www.instagram.com/hair5s/',
      address: 'Mumbai, Maharashtra',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=HAIR5S+Unisex+Salon+Mumbai',
      hours: 'Call to confirm today’s timings',
      announcement: 'Appointments are confirmed on WhatsApp — no online payment needed.',
    });
    console.log('[seed] settings created');
  } else {
    console.log('[seed] settings already exist (left untouched)');
  }

  /* categories + services */
  const categoryIds = new Map<string, string>();
  for (const category of categories) {
    const doc = await Category.findOneAndUpdate(
      { slug: category.slug },
      { $setOnInsert: category },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    categoryIds.set(category.slug, doc.id);
  }

  let created = 0;
  for (const [index, service] of services.entries()) {
    const slug = slugify(service.name);
    const exists = await Product.exists({ slug });
    if (exists) continue;

    await Product.create({
      name: service.name,
      slug,
      shortDescription: service.shortDescription,
      description: service.shortDescription,
      price: service.price,
      duration: service.duration,
      type: 'service',
      category: categoryIds.get(service.category),
      images: [PHOTO(service.image)],
      featured: Boolean(service.featured),
      bestseller: Boolean(service.bestseller),
      order: index,
      seo: { title: `${service.name} · HAIR5S`, description: service.shortDescription },
    });
    created += 1;
  }

  /* gallery / slider */
  if ((await GalleryItem.countDocuments()) === 0) {
    await GalleryItem.insertMany(gallery);
    console.log(`[seed] gallery created (${gallery.length} real salon photos)`);
  }

  console.log(`[seed] done — ${services.length} services in ${categories.length} categories (${created} new)`);
  console.log('[seed] prices not published by the salon are left as "On request": edit them in Admin → Services.');

  await disconnectDatabase();
}

run().catch(async (error) => {
  console.error('[seed] failed:', error);
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
