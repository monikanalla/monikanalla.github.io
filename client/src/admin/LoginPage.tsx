import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo';
import { useAdminAuth } from './AdminAuthContext';

export function LoginPage() {
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <Link to="/" className="text-[10px] uppercase tracking-[0.2em] text-ash transition hover:text-champagne">
          ← Back to site
        </Link>

        <div className="mt-8 rounded-2xl border border-champagne/10 bg-coal/70 p-7">
          <BrandLogo className="h-11 w-auto" />
          <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-copper-300">Admin sign in</p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                className="input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                className="input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {error ? (
              <p className="rounded-lg border border-red-400/30 bg-red-950/30 px-3 py-2 text-[12px] text-red-100">
                {error}
              </p>
            ) : null}

            <button type="submit" className="btn w-full" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-[10px] leading-relaxed text-ash/70">
            The first admin is created by <code className="text-champagne/80">npm run seed</code> from your server
            environment variables. The first sign-in forces a password change.
          </p>
        </div>
      </div>
    </div>
  );
}
