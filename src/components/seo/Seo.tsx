import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description: string;
  canonical: string;
};

function upsertMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const DEFAULT_TITLE = 'BizApp365 — Complete ERP for Growing SMEs';
const DEFAULT_DESCRIPTION =
  'BizApp365 — Multi-tenant ERP for SMEs. Accounting, inventory, CRM, HR, VAN sales, and silent printing.';

export default function Seo({ title, description, canonical }: SeoProps) {
  useEffect(() => {
    document.title = title;
    upsertMeta('description', description);
    upsertCanonical(canonical);

    return () => {
      document.title = DEFAULT_TITLE;
      upsertMeta('description', DEFAULT_DESCRIPTION);
      upsertCanonical('https://bizapp365.com/');
    };
  }, [title, description, canonical]);

  return null;
}
