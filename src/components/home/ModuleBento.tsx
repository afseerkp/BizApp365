import type { MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Container } from '../ds/Container';
import { Accent, SectionHeading } from '../ds/SectionHeading';
import { Reveal } from '../ds/Reveal';
import { Button } from '../ds/Button';
import { MODULES } from '../../data/modules';
import { cn } from '../../lib/cn';

/* ---------- Micro-visuals (pure CSS/SVG, animate on hover) ---------- */

function LedgerViz() {
  return (
    <div className="flex items-end gap-2 h-28" aria-hidden dir="ltr">
      {[40, 64, 52, 78, 60, 88, 72, 96].map((h, i) => (
        <span
          key={i}
          className="flex-1 rounded-t-lg bg-gradient-to-t from-brand-600/70 to-violet-500/70 origin-bottom transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-110"
          style={{ height: `${h}%`, transitionDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  );
}

function StockViz() {
  return (
    <div className="space-y-2" aria-hidden dir="ltr">
      {[82, 56, 34].map((w, i) => (
        <div key={i} className="h-2 rounded-full bg-line overflow-hidden">
          <span
            className="block h-full rounded-full bg-sky-500 transition-[width] duration-700 ease-[cubic-bezier(.22,1,.36,1)] w-[var(--w)] group-hover:w-[calc(var(--w)-18%)]"
            style={{ ['--w' as string]: `${w}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function KanbanViz() {
  return (
    <div className="grid grid-cols-3 gap-1.5" aria-hidden>
      {[3, 2, 1].map((n, col) => (
        <div key={col} className="rounded-lg bg-surface-2 p-1.5 space-y-1.5 min-h-16">
          {Array.from({ length: n }).map((_, i) => (
            <span
              key={i}
              className={cn(
                'block h-3 rounded bg-violet-500/30 transition-transform duration-500',
                col === 0 && i === 0 && 'group-hover:translate-x-[calc(100%+0.75rem)] rtl:group-hover:-translate-x-[calc(100%+0.75rem)] bg-violet-500/70',
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function BarcodeViz() {
  const bars = [2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2];
  return (
    <div className="relative h-14 flex items-stretch gap-[3px] overflow-hidden" aria-hidden dir="ltr">
      {bars.map((w, i) => (
        <span key={i} className="bg-fg/80 rounded-[1px]" style={{ width: w * 2 }} />
      ))}
      <span className="absolute inset-y-0 w-0.5 bg-rose-500 shadow-[0_0_12px_2px_rgba(244,63,94,0.7)] start-0 transition-[inset-inline-start] duration-1000 ease-in-out group-hover:start-full" />
    </div>
  );
}

function RouteViz() {
  return (
    <svg viewBox="0 0 220 60" className="w-full h-14" aria-hidden>
      <path d="M8 46 C 50 10, 90 56, 130 28 S 200 20, 212 12" fill="none" stroke="var(--line-strong)" strokeWidth="2" strokeDasharray="4 5" />
      <path
        d="M8 46 C 50 10, 90 56, 130 28 S 200 20, 212 12"
        fill="none"
        stroke="var(--color-success-500)"
        strokeWidth="2.5"
        strokeLinecap="round"
        pathLength={1}
        className="[stroke-dasharray:1] [stroke-dashoffset:0.65] transition-[stroke-dashoffset] duration-1000 ease-out group-hover:[stroke-dashoffset:0]"
      />
      {[[8, 46], [130, 28], [212, 12]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="4" fill="var(--surface)" stroke="var(--color-success-500)" strokeWidth="2" />
      ))}
    </svg>
  );
}

function ChatViz() {
  return (
    <div className="space-y-1.5" aria-hidden>
      <span className="block w-3/4 h-5 rounded-xl rounded-ss-sm bg-surface-2" />
      <span className="block w-2/3 h-5 ms-auto rounded-xl rounded-se-sm bg-emerald-500/70 translate-y-1 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
    </div>
  );
}

const VIZ: Record<string, ReactNode> = {
  accounting: <LedgerViz />,
  'masters-inventory': <StockViz />,
  crm: <KanbanViz />,
  'barcode-labels': <BarcodeViz />,
  'van-sales': <RouteViz />,
  communications: <ChatViz />,
};

/* 12-col bento placement, index-aligned with MODULES */
const SPAN: Record<string, string> = {
  accounting: 'lg:col-span-5 lg:row-span-2',
  'masters-inventory': 'lg:col-span-4',
  'sales-purchase': 'lg:col-span-3',
  crm: 'lg:col-span-4',
  'barcode-labels': 'lg:col-span-3',
  'service-center': 'lg:col-span-3',
  production: 'lg:col-span-3',
  'hr-payroll': 'lg:col-span-3',
  analytics: 'lg:col-span-3',
  communications: 'lg:col-span-4',
  'van-sales': 'lg:col-span-5',
  configuration: 'lg:col-span-3',
};
const ORDER = ['accounting', 'masters-inventory', 'sales-purchase', 'crm', 'barcode-labels', 'service-center', 'production', 'hr-payroll', 'analytics', 'communications', 'van-sales', 'configuration'];

function spotlight(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}

export default function ModuleBento() {
  const { t, tm } = useLanguage();
  const m = tm.home.modules;
  const modules = tm.features.modules;
  const editions = tm.features.editions;

  return (
    <section className="py-28 sm:py-36">
      <Container>
        <SectionHeading
          eyebrow={m.eyebrow}
          title={
            <>
              {m.title} <Accent>{m.accent}</Accent>
            </>
          }
          subtitle={m.subtitle}
        />

        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[minmax(190px,auto)]">
          {ORDER.map((slug, n) => {
            const i = MODULES.findIndex((x) => x.slug === slug);
            const meta = MODULES[i];
            const mod = modules[i];
            const viz = VIZ[slug];
            const big = slug === 'accounting';
            return (
              <Reveal key={slug} delay={(n % 4) * 0.06} className={cn(SPAN[slug], big && 'sm:col-span-2 lg:col-span-5')}>
                <Link
                  to={`/features#${slug}`}
                  onMouseMove={spotlight}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface p-6 transition-[border-color,transform] duration-500 hover:-translate-y-0.5 hover:border-brand-500/40"
                >
                  <span
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{ background: 'radial-gradient(420px circle at var(--mx) var(--my), var(--glow), transparent 60%)' }}
                    aria-hidden
                  />
                  <div className="relative flex items-start justify-between gap-3">
                    <span className={cn('grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br text-white shadow-md', meta.tint)}>
                      <meta.icon size={18} />
                    </span>
                    <span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold text-fg-subtle transition-opacity duration-300 group-hover:opacity-0">
                      {editions[mod.editionKey as keyof typeof editions]}
                    </span>
                  </div>
                  <div className={cn('relative mt-5', big ? 'mb-8' : 'mb-4')}>
                    <h3 className={cn('font-bold tracking-tight text-fg', big ? 'text-3xl' : 'text-lg')}>{mod.title}</h3>
                    <p className={cn('mt-2 text-fg-muted leading-relaxed', big ? 'text-base max-w-sm' : 'text-sm')}>{mod.description}</p>
                  </div>
                  {viz && <div className="relative mt-auto">{viz}</div>}
                  {big && (
                    <ul className="relative mt-6 space-y-2 text-sm text-fg-muted">
                      {mod.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex gap-2">
                          <span className="mt-2 w-1 h-1 rounded-full bg-brand-500 shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <span className="absolute top-6 end-6 opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0" aria-hidden>
                    <ArrowUpRight size={16} className="text-brand-600 rtl:-scale-x-100" />
                  </span>
                  <span className="sr-only">{t('home.modules.more')}</span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Button to="/features" variant="secondary" size="lg">
            {m.cta}
          </Button>
        </div>
      </Container>
    </section>
  );
}
