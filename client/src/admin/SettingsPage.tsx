import { useEffect, useState, type FormEvent } from 'react';
import { adminSettings, adminUpdateSettings } from '../api/endpoints';
import { FALLBACK_SETTINGS } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';

const TEXT_FIELDS: { key: keyof typeof FALLBACK_SETTINGS; label: string; hint?: string; textarea?: boolean }[] = [
  { key: 'brandName', label: 'Brand name' },
  { key: 'tagline', label: 'Tagline' },
  { key: 'heroBadge', label: 'Hero badge', hint: 'Small label above the headline' },
  { key: 'heroHeadline', label: 'Hero headline', textarea: true },
  { key: 'heroSubhead', label: 'Hero subheadline', textarea: true },
  { key: 'aboutCopy', label: 'About copy', textarea: true },
  { key: 'announcement', label: 'Announcement bar', hint: 'Leave empty to hide the bar' },
  { key: 'whatsappNumber', label: 'WhatsApp number', hint: 'Digits only, country code first — e.g. 919876543210' },
  { key: 'phone', label: 'Phone (display)' },
  { key: 'email', label: 'Email' },
  { key: 'instagram', label: 'Instagram URL' },
  { key: 'address', label: 'Address', textarea: true },
  { key: 'mapsUrl', label: 'Google Maps URL' },
  { key: 'hours', label: 'Opening hours' },
  { key: 'messageTemplate', label: 'WhatsApp message template', textarea: true, hint: 'Placeholders: {brand} {items} {total} {name}' },
];

export function SettingsPage() {
  const { push } = useToast();
  const [values, setValues] = useState({ ...FALLBACK_SETTINGS });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    adminSettings()
      .then((settings) => {
        if (!cancelled) setValues({ ...FALLBACK_SETTINGS, ...settings });
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load settings');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const saved = await adminUpdateSettings(values);
      setValues({ ...FALLBACK_SETTINGS, ...saved });
      push('Settings saved');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save settings');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="eyebrow">Site content</p>
      <h1 className="display-lg mt-2 text-champagne">Settings</h1>
      <p className="mt-2 text-[13px] text-ash">
        Everything here renders on the public site. Clear the WhatsApp number to disable booking buttons.
      </p>

      {error ? (
        <p className="mt-6 rounded-xl border border-red-400/30 bg-red-950/25 p-4 text-sm text-red-100">{error}</p>
      ) : null}

      {loading ? (
        <p className="mt-10 text-sm text-ash">Loading…</p>
      ) : (
        <form onSubmit={submit} className="mt-8 grid gap-4 rounded-2xl border border-champagne/10 bg-coal/60 p-6 sm:grid-cols-2">
          {TEXT_FIELDS.map((field) => (
            <div key={field.key} className={field.textarea ? 'sm:col-span-2' : ''}>
              <label className="label" htmlFor={`s-${field.key}`}>
                {field.label}
              </label>
              {field.textarea ? (
                <textarea
                  id={`s-${field.key}`}
                  className="input min-h-[90px]"
                  value={values[field.key]}
                  onChange={(event) => setValues({ ...values, [field.key]: event.target.value })}
                />
              ) : (
                <input
                  id={`s-${field.key}`}
                  className="input"
                  value={values[field.key]}
                  onChange={(event) => setValues({ ...values, [field.key]: event.target.value })}
                />
              )}
              {field.hint ? <p className="mt-1 text-[10px] text-ash/70">{field.hint}</p> : null}
            </div>
          ))}

          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" className="btn btn-sm" disabled={busy}>
              {busy ? 'Saving…' : 'Save settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
