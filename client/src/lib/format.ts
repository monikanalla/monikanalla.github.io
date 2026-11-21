export const formatINR = (value: number): string => {
  if (!value || value <= 0) return 'On request';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (value: string): string =>
  new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const categoryLabel = (category: { name: string } | string | undefined): string =>
  typeof category === 'string' || !category ? 'Service' : category.name;
