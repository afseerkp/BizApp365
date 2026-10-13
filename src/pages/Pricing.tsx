import { Fragment, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Minus } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Container } from '../components/ds/Container';
import { PageHero } from '../components/ds/PageHero';
import { Reveal } from '../components/ds/Reveal';
import { Button } from '../components/ds/Button';
import { Accordion } from '../components/ds/Accordion';
import Seo from '../components/seo/Seo';
import { cn } from '../lib/cn';

/* USD is the billing currency; AED and OMR are pegged, so conversion is exact. */
const CURRENCIES = {
  USD: { rate: 1, symbol: '$', decimals: 0 },
  AED: { rate: 3.6725, symbol: 'AED', decimals: 0 },
  OMR: { rate: 0.3845, symbol: 'OMR', decimals: 1 },
} as const;
type Currency = keyof typeof CURRENCIES;

const PLAN_SLUGS = ['basic', 'standard', 'enterprise'];

function Price({ usd, currency }: { usd: number; currency: Currency }) {
  const { lang } = useLanguage();
  const c = CURRENCIES[currency];
  const value = usd * c.rate;
  const text = new Intl.NumberFormat(lang === 'ar' ? 'ar-AE' : 'en-US', { minimumFractionDigits: c.decimals, maximumFractionDigits: c.decimals }).format(value);
  return (
    <span className="inline-flex items-baseline gap-1.5" dir="ltr">
      <span className="text-lg font-semibold text-fg-muted">{c.symbol}</span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={currency}
          initial={{ y: 24, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -24, opacity: 0, filter: 'blur(4px)' }}
          transition={{ duration: 0.35 }}
          className="font-display text-6xl font-bold tracking-[-0.05em] text-fg tabular-nums"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const Pricing = () => {
  const { t, tm } = useLanguage();
  const plans = tm.pricing.plans;
  const x = tm.pricingx;
  const [currency, setCurrency] = useState<Currency>('AED');

  return (
    <div>
      <Seo title={x.seoTitle} description={x.seoDescription} canonical="https://bizapp365.com/pricing/" />
      <PageHero eyebrow={x.eyebrow} title={t('pricing.titleBefore')} accent={t('pricing.titleHighlight')} subtitle={t('pricing.subtitle')}>
        <div className="mt-10 flex justify-center">
          <div role="radiogroup" aria-label={x.currency} className="inline-flex rounded-full border border-line bg-surface p-1">
            {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={currency === c}
                onClick={() => setCurrency(c)}
                className={cn('relative rounded-full px-5 py-2 text-sm font-semibold transition-colors', currency === c ? 'text-bg' : 'text-fg-muted hover:text-fg')}
              >
                {currency === c && <motion.span layoutId="cur-pill" className="absolute inset-0 rounded-full bg-fg" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
        </div>
      </PageHero>

      <Container className="pb-12">
        <div className="grid gap-5 lg:grid-cols-3 items-stretch">
          {plans.map((plan, i) => {
            const popular = i === 1;
            return (
              <Reveal key={plan.title} delay={i * 0.08}>
                <div
                  className={cn(
                    'relative flex h-full flex-col rounded-[28px] p-8',
                    popular
                      ? 'bg-ink-950 text-white shadow-[0_40px_80px_-30px_rgba(25,118,210,0.6)] ring-1 ring-brand-500/40 lg:-translate-y-3'
                      : 'border border-line bg-surface',
                  )}
                >
                  {popular && (
                    <>
                      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]" aria-hidden>
                        <div className="absolute -top-32 end-0 w-80 h-80 blob text-brand-600/40" />
                      </div>
                      <span className="absolute -top-3.5 start-8 rounded-full bg-gradient-to-r from-brand-500 to-violet-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                        {t('pricing.popular')}
                      </span>
                    </>
                  )}
                  <div className={cn('relative', popular && '[--fg:#fff] [--fg-muted:#cbd5e1] [--fg-subtle:#94a3b8] [--line:rgba(255,255,255,0.1)]')}>
                    <h2 className="font-display text-2xl font-bold text-fg">{plan.title}</h2>
                    <p className="mt-2 min-h-12 text-sm text-fg-muted">{plan.description}</p>
                    <div className="mt-6 flex items-end gap-2 h-20 overflow-hidden">
                      <Price usd={Number(plan.price)} currency={currency} />
                      <span className="mb-2 text-sm text-fg-subtle">{t('pricing.perMonth')}</span>
                    </div>
                    <div className="mt-6">
                      <Button to={`/demo?plan=${PLAN_SLUGS[i]}`} variant={popular ? 'light' : 'secondary'} full size="lg">
                        {x.choose.replace('{plan}', plan.title)} <ArrowRight size={16} className="rtl:rotate-180" />
                      </Button>
                    </div>
                    <ul className="mt-8 space-y-3 border-t border-line pt-6">
                      {plan.features.map((f) => (
                        <li key={f.name} className="flex items-start gap-3 text-sm">
                          {f.included ? (
                            <Check size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                          ) : (
                            <Minus size={16} className="mt-0.5 shrink-0 text-fg-subtle/60" />
                          )}
                          <span className={f.included ? 'text-fg' : 'text-fg-subtle'}>{f.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-8 text-center text-xs text-fg-subtle">{x.approx}</p>
        <p className="mt-2 text-center text-sm text-fg-muted max-w-2xl mx-auto">{t('pricing.footnote')}</p>
      </Container>

      {/* Comparison table */}
      <Container className="py-20 sm:py-28">
        <Reveal>
          <h2 className="text-center font-display text-4xl sm:text-5xl font-bold tracking-[-0.03em] text-fg">{x.compareTitle}</h2>
        </Reveal>
        <div className="mt-12 overflow-x-auto rounded-3xl border border-line bg-surface" data-lenis-prevent>
          <table className="w-full min-w-[640px] text-sm">
            <thead className="sticky top-0 bg-surface">
              <tr className="border-b border-line">
                <th scope="col" className="p-5 text-start font-semibold text-fg-subtle">{x.compareFeature}</th>
                {plans.map((p, i) => (
                  <th key={p.title} scope="col" className={cn('p-5 text-center font-display text-lg font-bold', i === 1 ? 'text-brand-600 dark:text-brand-400' : 'text-fg')}>
                    {p.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {x.compareGroups.map((g) => (
                <Fragment key={g.name}>
                  <tr className="bg-surface-2/60">
                    <th scope="colgroup" colSpan={4} className="px-5 py-3 text-start text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">
                      {g.name}
                    </th>
                  </tr>
                  {g.rows.map((r) => (
                    <tr key={r.f} className="border-t border-line">
                      <th scope="row" className="p-5 text-start font-medium text-fg">{r.f}</th>
                      {r.v.map((val, i) => (
                        <td key={i} className={cn('p-5 text-center', i === 1 && 'bg-brand-500/[0.04]')}>
                          {typeof val === 'string' ? (
                            <span className="font-semibold text-fg">{val}</span>
                          ) : val ? (
                            <Check size={18} className="mx-auto text-emerald-500" aria-label="Included" />
                          ) : (
                            <Minus size={18} className="mx-auto text-fg-subtle/50" aria-label="Not included" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      {/* Enterprise band */}
      <Container className="pb-20">
        <Reveal>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 rounded-3xl border border-line bg-gradient-to-r from-brand-600/[0.06] via-violet-500/[0.06] to-sand-400/[0.08] p-8 sm:p-10">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-fg">{x.enterpriseTitle}</h2>
              <p className="mt-2 text-fg-muted">{x.enterpriseBody}</p>
            </div>
            <Button to="/contact" size="lg">
              {x.enterpriseCta} <ArrowRight size={16} className="rtl:rotate-180" />
            </Button>
          </div>
        </Reveal>
      </Container>

      <Container size="md" className="pb-28">
        <Reveal>
          <h2 className="mb-8 font-display text-3xl font-bold tracking-tight text-fg">{x.faqTitle}</h2>
          <Accordion items={x.faq} />
        </Reveal>
      </Container>
    </div>
  );
};

export default Pricing;
