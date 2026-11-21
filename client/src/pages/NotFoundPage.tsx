import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" />
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="eyebrow">404</p>
        <h1 className="display-lg mt-4 text-champagne">This page has been cut.</h1>
        <p className="mt-3 max-w-sm text-sm text-ash">
          The link is broken or the page moved. The service menu is the best place to start again.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to="/" className="btn">
            Home
          </Link>
          <Link to="/services" className="btn-ghost">
            Service menu
          </Link>
        </div>
      </div>
    </>
  );
}
