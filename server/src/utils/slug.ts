import type { Model } from 'mongoose';

type SlugCheckModel = Pick<Model<unknown>, 'exists'> | { exists(filter: Record<string, unknown>): Promise<unknown> };

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Returns a slug that is not yet taken by another document. */
export async function uniqueSlug(
  model: SlugCheckModel,
  base: string,
  ignoreId?: string,
): Promise<string> {
  const root = slugify(base) || 'item';
  let candidate = root;
  let counter = 2;

  while (await model.exists({ slug: candidate, ...(ignoreId ? { _id: { $ne: ignoreId } } : {}) })) {
    candidate = `${root}-${counter}`;
    counter += 1;
  }

  return candidate;
}
