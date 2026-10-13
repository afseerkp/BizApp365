import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MessageCircle, Mail, Cloud, Printer, Smartphone, FileCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Container } from '../components/ds/Container';
import { PageHero } from '../components/ds/PageHero';
import { LogoMark } from '../components/ds/Logo';
import { Chip } from '../components/ds/Field';
import Seo from '../components/seo/Seo';
import FinalCta from '../components/home/FinalCta';
import { ease, viewportOnce } from '../lib/motion';

const ICONS = [MessageCircle, Mail, FileCheck, Cloud, Smartphone, Printer];
const TINTS = ['text-emerald-500', 'text-sky-500', 'text-violet-500', 'text-amber-500', 'text-green-500', 'text-orange-500'];

function Hub() {
  const { tm } = useLanguage();
  const reduce = useReducedMotion();
  const items = tm.integrations.items;
  const R = 150;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]" dir="ltr">
      <svg viewBox="-200 -200 400 400" className="absolute inset-0 w-full h-full" aria-hidden>
        <circle r={R} fill="none" stroke="var(--line-strong)" strokeDasharray="2 6" />
        <circle r={R * 0.55} fill="none" stroke="var(--line)" />
        {items.map((_, i) => {
          const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <motion.line
              key={i}
              x1={0}
              y1={0}
              x2={Math.cos(a) * R}
              y2={Math.sin(a) * R}
              stroke="var(--color-brand-500)"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              initial={reduce ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={viewportOnce}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: ease.out }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative grid place-items-center w-24 h-24 rounded-3xl bg-surface border border-line shadow-soft">
          <span className="absolute inset-0 rounded-3xl bg-brand-500/20 animate-ping motion-reduce:hidden" aria-hidden />
          <LogoMark className="w-14 h-14" />
        </div>
      </div>
      {items.map((it, i) => {
        const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
        const Icon = ICONS[i];
        return (
          <motion.div
            key={it.title}
            className="absolute grid place-items-center w-14 h-14 -ms-7 -mt-7 rounded-2xl border border-line bg-surface shadow-soft"
            style={{ left: `${50 + (Math.cos(a) * R * 100) / 400}%`, top: `${50 + (Math.sin(a) * R * 100) / 400}%` }}
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={viewportOnce}
            transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 260, damping: 18 }}
            title={it.title}
          >
            <Icon size={22} className={TINTS[i]} />
          </motion.div>
        );
      })}
    </div>
  );
}

const Integrations = () => {
  const { t, tm } = useLanguage();
  const x = tm.integrationsx;
  const items = tm.integrations.items;
  const cats = Array.from(new Set(x.categories));
  const [filter, setFilter] = useState<string | null>(null);
  const visible = items.map((it, i) => ({ ...it, i, cat: x.categories[i] })).filter((it) => !filter || it.cat === filter);

  return (
    <div>
      <Seo title={x.seoTitle} description={x.seoDescription} canonical="https://bizapp365.com/integrations/" />
      <PageHero eyebrow={x.eyebrow} title={t('integrations.titleBefore')} accent={t('integrations.titleHighlight')} subtitle={t('integrations.subtitle')} />

      <Container className="pb-24">
        <Hub />

        <div className="mt-20 flex flex-wrap justify-center gap-2" role="group" aria-label={x.eyebrow}>
          <Chip selected={filter === null} onClick={() => setFilter(null)}>
            {x.all}
          </Chip>
          {cats.map((c) => (
            <Chip key={c} selected={filter === c} onClick={() => setFilter(c)}>
              {c}
            </Chip>
          ))}
        </div>

        <motion.div layout className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((it) => {
              const Icon = ICONS[it.i];
              return (
                <motion.article
                  key={it.title}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: ease.out }}
                  className="rounded-3xl border border-line bg-surface p-7 transition-colors hover:border-brand-500/40"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid place-items-center w-12 h-12 rounded-2xl bg-surface-2">
                      <Icon size={22} className={TINTS[it.i]} />
                    </span>
                    <span className="rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-fg-subtle">{it.edition}</span>
                  </div>
                  <h2 className="mt-6 !font-sans text-lg font-bold text-fg">{it.title}</h2>
                  <p className="mt-2 text-sm text-fg-muted leading-relaxed">{it.description}</p>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-600 dark:text-brand-400">{it.cat}</p>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </Container>
      <FinalCta />
    </div>
  );
};

export default Integrations;
