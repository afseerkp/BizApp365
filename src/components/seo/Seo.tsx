import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description: string;
  canonical: string;
  /** Optional JSON-LD object injected for this page only. */
  jsonLd?: Record<string, unknown>;
};

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
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

const DEFAULT_TITLE = 'BizApp365 — Complete ERP for Growing SMEs in the UAE & Oman';
const DEFAULT_DESCRIPTION =
  'BizApp365 is the real-time ERP for GCC SMEs: accounting, UAE/Oman VAT & Peppol e-invoicing, inventory, CRM, HR & payroll, Android VAN sales and silent printing — in English and Arabic.';

function apply(title: string, description: string, canonical: string) {
  document.title = title;
  upsertMeta('name', 'description', description);
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', canonical);
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);
  upsertCanonical(canonical);
}

export default function Seo({ title, description, canonical, jsonLd }: SeoProps) {
  useEffect(() => {
    apply(title, description, canonical);
    return () => apply(DEFAULT_TITLE, DEFAULT_DESCRIPTION, 'https://bizapp365.com/');
  }, [title, description, canonical]);

  const ld = jsonLd ? JSON.stringify(jsonLd) : '';
  useEffect(() => {
    if (!ld) return;
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.text = ld;
    document.head.appendChild(el);
    return () => el.remove();
  }, [ld]);

  return null;
}
