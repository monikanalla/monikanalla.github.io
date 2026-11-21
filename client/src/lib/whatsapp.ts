import type { CartItem, Settings } from '../api/types';
import { formatINR } from './format';

const FALLBACK_TEMPLATE =
  'Hi {brand}! I would like to book an appointment.\n\n{items}\n\nEstimated total: {total}\nName: {name}';

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function buildWhatsAppMessage(
  settings: Settings | null,
  items: CartItem[],
  customerName = '',
): string {
  const template = settings?.messageTemplate?.trim() || FALLBACK_TEMPLATE;

  const lines = items
    .map((item) => {
      const label = item.variant ? `${item.name} — ${item.variant}` : item.name;
      const qty = item.qty > 1 ? ` × ${item.qty}` : '';
      return `• ${label}${qty} — ${formatINR(item.price * item.qty)}`;
    })
    .join('\n');

  return template
    .replace(/{brand}/g, settings?.brandName || 'HAIR5S')
    .replace(/{items}/g, lines || '• (no services selected yet)')
    .replace(/{total}/g, formatINR(cartTotal(items)))
    .replace(/{name}/g, customerName.trim() || '(your name)');
}

/** wa.me links only exist when a real business number is configured. */
export function whatsappLink(settings: Settings | null, message: string): string | null {
  const digits = (settings?.whatsappNumber ?? '').replace(/\D/g, '');
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export const telLink = (settings: Settings | null): string | null => {
  const digits = (settings?.phone ?? '').replace(/[^\d+]/g, '');
  return digits.length >= 6 ? `tel:${digits}` : null;
};
