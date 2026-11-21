import { useState, type FormEvent } from 'react';
import { adminChangePassword } from '../api/endpoints';
import { useToast } from '../context/ToastContext';
import { useAdminAuth } from './AdminAuthContext';

export function ChangePasswordPage() {
  const { admin, signOut, setMustChangePassword } = useAdminAuth();
  const { push } = useToast();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (next !== confirm) {
      setError('The new passwords do not match');
      return;
    }

    setBusy(true);
    setError(null);

    try {
      await adminChangePassword(current, next);
      setMustChangePassword(false);
      push('Password updated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not change password');
    } finally {
      setBusy(false);
    }
  };

  const forced = admin?.mustChangePassword;

  return (
    <div className={forced ? 'flex min-h-screen items-center justify-center px-5' : ''}>
      <div className={forced ? 'w-full max-w-md' : 'max-w-md'}>
        <p className="eyebrow">Security</p>
        <h1 className="display-lg mt-2 text-champagne">Change password</h1>
        {forced ? (
          <p className="mt-3 rounded-xl border border-copper-300/30 bg-copper-400/10 p-3 text-[12px] leading-relaxed text-copper-100">
            This account is still using the bootstrap password. Set a new one to unlock the panel.
          </p>
        ) : (
          <p className="mt-3 text-[13px] text-ash">
            Use at least 10 characters with a letter and a number.
          </p>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl border border-champagne/10 bg-coal/60 p-6">
          <div>
            <label className="label" htmlFor="cp-current">Current password</label>
            <input
              id="cp-current"
              type="password"
              autoComplete="current-password"
              required
              className="input"
              value={current}
              onChange={(event) => setCurrent(event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="cp-new">New password</label>
            <input
              id="cp-new"
              type="password"
              autoComplete="new-password"
              required
              minLength={10}
              className="input"
              value={next}
              onChange={(event) => setNext(event.target.value)}
            />
          </div>

          <div>
            <label className="label" htmlFor="cp-confirm">Confirm new password</label>
            <input
              id="cp-confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={10}
              className="input"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-red-400/30 bg-red-950/30 px-3 py-2 text-[12px] text-red-100">
              {error}
            </p>
          ) : null}

          <button type="submit" className="btn w-full" disabled={busy}>
            {busy ? 'Updating…' : 'Update password'}
          </button>

          {forced ? (
            <button type="button" onClick={signOut} className="w-full text-[10px] uppercase tracking-[0.16em] text-ash hover:text-champagne">
              Sign out instead
            </button>
          ) : null}
        </form>
      </div>
    </div>
  );
}
