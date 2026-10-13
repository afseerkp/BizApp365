import { useId, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Container } from '../ds/Container';
import { Accent, SectionHeading } from '../ds/SectionHeading';
import { ease } from '../../lib/motion';
import { cn } from '../../lib/cn';

const IMAGES = [
  '/features/van-sales-module.webp',
  '/features/barcode-module.webp',
  '/features/service-center-module.webp',
  '/features/production-module.webp',
  '/features/hr-payroll-module.webp',
];

export default function Industries() {
  const { tm } = useLanguage();
  const ind = tm.home.industries;
  const [active, setActive] = useState(0);
  const base = useId();
  const item = ind.items[active];

  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const rtl = document.documentElement.dir === 'rtl';
    const next = (e.key === 'ArrowRight') !== rtl ? 1 : -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const n = (active + next + ind.items.length) % ind.items.length;
      setActive(n);
      document.getElementById(`${base}-tab-${n}`)?.focus();
    }
  };

  return (
    <section className="py-28 sm:py-36 bg-surface/40 border-y border-line">
      <Container>
        <SectionHeading
          eyebrow={ind.eyebrow}
          title={
            <>
              {ind.title} <Accent>{ind.accent}</Accent>
            </>
          }
        />

        <div role="tablist" aria-label={ind.eyebrow} className="mt-12 flex gap-1 overflow-x-auto scrollbar-none rounded-full border border-line bg-surface p-1 mx-auto w-fit max-w-full">
          {ind.items.map((it, i) => (
            <button
              key={it.name}
              id={`${base}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={active === i}
              aria-controls={`${base}-panel`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKey}
              className={cn('relative shrink-0 rounded-full px-4 sm:px-5 py-2.5 text-sm font-semibold transition-colors', active === i ? 'text-white' : 'text-fg-muted hover:text-fg')}
            >
              {active === i && (
                <motion.span layoutId="industry-pill" className="absolute inset-0 rounded-full bg-fg" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
              )}
              <span className={cn('relative', active === i && 'text-bg')}>{it.name}</span>
            </button>
          ))}
        </div>

        <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-tab-${active}`} className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: ease.out }}
              className="grid gap-8 lg:grid-cols-2 items-center rounded-[32px] border border-line bg-surface p-6 sm:p-10"
            >
              <div>
                <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg">{item.headline}</h3>
                <ul className="mt-7 space-y-4">
                  {item.points.map((pt) => (
                    <li key={pt} className="flex gap-3 text-fg-muted">
                      <span className="mt-0.5 grid place-items-center w-5 h-5 shrink-0 rounded-full bg-brand-600 text-white">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-2">
                  {item.modules.map((m) => (
                    <span key={m} className="rounded-full border border-line-strong px-3 py-1 text-xs font-semibold text-fg">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-[#eef1f8] aspect-[3/2]">
                <img src={IMAGES[active]} alt="" loading="lazy" decoding="async" width={1536} height={1024} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
