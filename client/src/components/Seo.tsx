import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title: string;
  description?: string;
  path?: string;
}

export function Seo({ title, description, path }: SeoProps) {
  const fullTitle = `${title} · HAIR5S`;
  const site = (import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined) ?? window.location.origin;
  const url = path ? `${site.replace(/\/$/, '')}${path}` : site;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      <meta property="og:title" content={fullTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
