import { Reveal } from '../components/Reveal';
import { Seo } from '../components/Seo';
import { useSettings } from '../context/SettingsContext';
import { buildWhatsAppMessage, telLink, whatsappLink } from '../lib/whatsapp';

export function ContactPage() {
  const { settings } = useSettings();
  const wa = whatsappLink(settings, buildWhatsAppMessage(settings, [], ''));
  const tel = telLink(settings);

  const mapQuery = encodeURIComponent(settings.address || 'HAIR5S Unisex Salon Mumbai');

  return (
    <>
      <Seo
        title="Visit the salon"
        description="HAIR5S Unisex Salon, Mumbai — directions, timings and WhatsApp booking."
        path="/contact"
      />

      <section className="container-x pt-14 sm:pt-20">
        <p className="eyebrow">Visit</p>
        <h1 className="display-xl mt-4 max-w-2xl text-char">
          Find the
          <br />
          <span className="display-serif text-wine-500">chair.</span>
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-ash">
          Walk-ins are welcome when there is space in the day — on weekends, send a message first and we will hold a
          slot.
        </p>
      </section>

      <section className="container-x grid gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <Reveal>
            <div className="card p-6">
              <p className="eyebrow">Address</p>
              <p className="mt-3 text-sm leading-relaxed text-char/90">{settings.address || 'Mumbai, Maharashtra'}</p>
              <p className="mt-2 text-[12px] leading-relaxed text-ash">
                The exact street address and directions are confirmed on WhatsApp before your appointment.
              </p>
              {settings.mapsUrl ? (
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-4 inline-flex text-[10px] font-semibold uppercase tracking-[0.18em] text-wine-500 hover:text-char"
                >
                  Open in Google Maps →
                </a>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="card p-6">
              <p className="eyebrow">Hours</p>
              <p className="mt-3 text-sm text-char/90">{settings.hours || 'Message us for today’s timings'}</p>
              <p className="mt-1 text-[11px] text-ash">Last appointment 45 minutes before close</p>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="card p-6">
              <p className="eyebrow">Talk to us</p>
              <div className="mt-4 space-y-3 text-sm">
                {settings.phone ? (
                  <p className="flex items-center justify-between gap-4">
                    <span className="text-ash">Phone</span>
                    <a href={tel ?? undefined} className="text-char transition hover:text-wine-500">
                      {settings.phone}
                    </a>
                  </p>
                ) : null}
                {settings.instagram ? (
                  <p className="flex items-center justify-between gap-4">
                    <span className="text-ash">Instagram</span>
                    <a
                      href={settings.instagram}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-char transition hover:text-wine-500"
                    >
                      @hair5s
                    </a>
                  </p>
                ) : null}
                <p className="flex items-center justify-between gap-4">
                  <span className="text-ash">Bookings</span>
                  <span className="text-char">{wa ? 'WhatsApp' : 'Not configured'}</span>
                </p>
              </div>

              {wa ? (
                <a href={wa} target="_blank" rel="noreferrer noopener" className="btn mt-5 w-full">
                  Message on WhatsApp
                </a>
              ) : (
                <p className="mt-5 rounded-xl border border-dashed border-char/20 p-3 text-center text-[11px] text-ash">
                  Set the WhatsApp number in Admin → Settings to enable booking.
                </p>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal delay={60}>
          <div className="h-full min-h-[420px] overflow-hidden rounded-[24px] border border-char/10">
            <iframe
              title="HAIR5S location map"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="h-full min-h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </section>

      <section className="container-x pb-10">
        <div className="rounded-[20px] border border-char/10 bg-paper p-6 text-[12px] leading-relaxed text-ash">
          <strong className="text-char">Getting there:</strong> message the salon on WhatsApp and we will send the
          exact address pin plus parking notes for the day. No payment is taken on this site — everything is
          confirmed in the chat.
        </div>
      </section>
    </>
  );
}
