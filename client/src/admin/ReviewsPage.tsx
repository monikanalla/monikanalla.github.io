import { useCallback, useEffect, useState } from 'react';
import { adminDeleteReview, adminReviews, adminUpdateReview } from '../api/endpoints';
import type { Review } from '../api/types';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../lib/format';

export function ReviewsPage() {
  const { push } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setReviews(await adminReviews());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load reviews');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setApproved = async (review: Review, approved: boolean) => {
    try {
      await adminUpdateReview(review._id, { approved });
      push(approved ? 'Review published' : 'Review hidden');
      void load();
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not update', 'error');
    }
  };

  const remove = async (review: Review) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await adminDeleteReview(review._id);
      push('Review deleted');
      void load();
    } catch (err) {
      push(err instanceof Error ? err.message : 'Could not delete', 'error');
    }
  };

  const pending = reviews.filter((review) => !review.approved);

  return (
    <div>
      <div>
        <p className="eyebrow">Moderation</p>
        <h1 className="display-lg mt-2 text-champagne">Reviews</h1>
        <p className="mt-2 text-[13px] text-ash">
          {pending.length} awaiting approval. Only approved reviews appear on the site.
        </p>
      </div>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-400/30 bg-red-950/25 p-4 text-sm text-red-100">{error}</p>
      ) : null}

      {loading ? (
        <p className="mt-10 text-sm text-ash">Loading…</p>
      ) : reviews.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-champagne/15 p-10 text-center text-sm text-ash">
          No reviews yet. Guests can submit one from the home page — it lands here first.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {reviews.map((review) => (
            <article
              key={review._id}
              className={`rounded-2xl border p-5 ${
                review.approved ? 'border-champagne/10 bg-coal/50' : 'border-copper-300/30 bg-copper-400/5'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-[14px] text-champagne">{review.name}</p>
                    <p className="text-[12px] text-copper-300" aria-label={`${review.rating} out of 5`}>
                      {'★'.repeat(review.rating)}
                    </p>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-ash">
                      {review.approved ? 'Live' : 'Pending'}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-ash/70">
                    {formatDate(review.createdAt)}
                    {review.service ? ` · ${review.service}` : ''}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {review.approved ? (
                    <button
                      type="button"
                      onClick={() => void setApproved(review, false)}
                      className="rounded-lg border border-champagne/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-ash hover:text-champagne"
                    >
                      Hide
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void setApproved(review, true)}
                      className="rounded-lg border border-copper-300/50 bg-copper-400/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-copper-100"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void remove(review)}
                    className="rounded-lg border border-red-400/25 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-red-200 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-champagne/85">{review.text}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
