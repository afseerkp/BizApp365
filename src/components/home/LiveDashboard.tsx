import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LayoutGrid, Boxes, Landmark, Users, Truck, BarChart3, Settings2, Search, Bell } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { ease } from '../../lib/motion';

const CHART = [32, 38, 35, 44, 41, 52, 49, 58, 55, 66, 63, 74];

function chartPath(values: number[], w: number, h: number, close = false) {
  const max = 80;
  const step = w / (values.length - 1);
  const pts = values.map((v, i) => [i * step, h - (v / max) * h] as const);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
  }
  if (close) d += ` L ${w} ${h} L 0 ${h} Z`;
  return d;
}

type Invoice = { id: number; c: number; amount: number; paid: boolean };

/** A hand-built, translatable "live" ERP dashboard — crisper and lighter than a screenshot. */
export default function LiveDashboard() {
  const { t, tm, lang } = useLanguage();
  const reduce = useReducedMotion();
  const customers = tm.home.hero.dash.customers;
  const fmt = new Intl.NumberFormat(lang === 'ar' ? 'ar-AE' : 'en-US', { maximumFractionDigits: 0 });

  const [sales, setSales] = useState(48260);
  const [invoices, setInvoices] = useState<Invoice[]>(() =>
    [0, 1, 2, 3].map((i) => ({ id: 418 - i, c: i, amount: [2635, 1180, 4920, 760][i], paid: i % 2 === 1 })),
  );

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      const amount = 400 + Math.round(Math.random() * 3200);
      setSales((s) => s + amount);
      setInvoices((list) => {
        const next = list[0].id + 1;
        return [{ id: next, c: next % 4, amount, paid: Math.random() > 0.5 }, ...list.slice(0, 3)];
      });
    }, 3200);
    return () => window.clearInterval(id);
  }, [reduce]);

  const kpis = [
    { label: t('home.hero.dash.sales'), value: sales, delta: '+12.4%', up: true },
    { label: t('home.hero.dash.receivables'), value: 126480, delta: '-3.1%', up: false },
    { label: t('home.hero.dash.stock'), value: 842300, delta: '+4.8%', up: true },
    { label: t('home.hero.dash.vat'), value: 12009, delta: 'Q3', up: true },
  ];

  const sideIcons = [LayoutGrid, Landmark, Boxes, Users, Truck, BarChart3, Settings2];

  return (
    <div className="flex text-start" style={{ minHeight: 0 }}>
      <aside className="hidden sm:flex w-14 shrink-0 flex-col items-center gap-2 border-e border-line bg-surface-2/50 py-4" aria-hidden>
        {sideIcons.map((Icon, i) => (
          <span key={i} className={`grid place-items-center w-9 h-9 rounded-xl ${i === 0 ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : 'text-fg-subtle'}`}>
            <Icon size={16} />
          </span>
        ))}
      </aside>

      <div className="flex-1 min-w-0 p-3 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <h3 className="!font-sans text-sm sm:text-base font-bold text-fg">{t('home.hero.dash.overview')}</h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </span>
              {t('home.hero.dash.live')}
            </span>
          </div>
          <div className="flex items-center gap-2 text-fg-subtle" aria-hidden>
            <span className="hidden md:flex items-center gap-2 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] w-40">
              <Search size={12} /> …
            </span>
            <Bell size={15} />
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-sand-400 to-sand-600" />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-3">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.6, ease: ease.out }}
              className="rounded-xl border border-line bg-surface p-3"
            >
              <p className="text-[10px] sm:text-[11px] font-medium text-fg-subtle truncate">{k.label}</p>
              <p className="mt-1 font-display text-base sm:text-xl font-bold tracking-tight text-fg tabular-nums" dir="ltr">
                <span className="text-[10px] font-semibold text-fg-subtle me-1">AED</span>
                {fmt.format(k.value)}
              </p>
              <p className={`mt-0.5 text-[10px] font-semibold ${k.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`} dir="ltr">
                {k.delta}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-3">
          <div className="rounded-xl border border-line bg-surface p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-fg-muted">{t('home.hero.dash.chart')}</p>
              <p className="text-[10px] text-fg-subtle">{t('home.hero.dash.synced')}</p>
            </div>
            <svg viewBox="0 0 400 140" className="w-full h-28 sm:h-36" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="dash-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--color-brand-500)" stopOpacity="0.35" />
                  <stop offset="1" stopColor="var(--color-brand-500)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="dash-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="var(--color-brand-500)" />
                  <stop offset="1" stopColor="var(--color-violet-500)" />
                </linearGradient>
              </defs>
              {[35, 70, 105].map((y) => (
                <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="var(--line)" strokeDasharray="3 5" />
              ))}
              <motion.path
                d={chartPath(CHART, 400, 130, true)}
                fill="url(#dash-fill)"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              />
              <motion.path
                d={chartPath(CHART, 400, 130)}
                fill="none"
                stroke="url(#dash-line)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.7, duration: 1.6, ease: ease.inOut }}
              />
              <motion.circle
                cx="400"
                cy={130 - (74 / 80) * 130}
                r="4.5"
                fill="var(--color-violet-500)"
                stroke="var(--surface)"
                strokeWidth="2"
                initial={reduce ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2.2, type: 'spring' }}
              />
            </svg>
          </div>

          <div className="hidden sm:block rounded-xl border border-line bg-surface p-3 sm:p-4 overflow-hidden">
            <p className="text-[11px] font-semibold text-fg-muted mb-2">{t('home.hero.dash.recent')}</p>
            <ul className="space-y-1.5 relative">
              <AnimatePresence initial={false}>
                {invoices.map((inv) => (
                  <motion.li
                    key={inv.id}
                    layout={!reduce}
                    initial={{ opacity: 0, y: -10, backgroundColor: 'rgba(25,118,210,0.12)' }}
                    animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(25,118,210,0)' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: ease.out }}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5"
                  >
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold text-fg truncate">{customers[inv.c % customers.length]}</span>
                      <span className="block text-[10px] text-fg-subtle font-mono" dir="ltr">INV-2026-0{inv.id}</span>
                    </span>
                    <span className="text-end shrink-0">
                      <span className="block text-[11px] font-bold text-fg tabular-nums" dir="ltr">{fmt.format(inv.amount)}</span>
                      <span className={`block text-[9px] font-semibold ${inv.paid ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {inv.paid ? t('home.hero.dash.paid') : t('home.hero.dash.due')}
                      </span>
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
