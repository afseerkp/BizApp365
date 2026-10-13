import { motion, useReducedMotion } from 'framer-motion';
import { FileCheck2, Languages, ReceiptText, Scale } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Container } from '../ds/Container';
import { Accent, SectionHeading } from '../ds/SectionHeading';
import { Reveal } from '../ds/Reveal';
import { ease, viewportOnce } from '../../lib/motion';

const ICONS = [ReceiptText, FileCheck2, Languages, Scale];

function VatDocument() {
  const { tm } = useLanguage();
  const reduce = useReducedMotion();
  const d = tm.home.compliance.doc;

  return (
    <div className="relative mx-auto max-w-lg">
      <div className="absolute inset-4 translate-x-4 translate-y-4 rotate-2 rounded-3xl bg-surface-2 border border-line" aria-hidden />
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: -1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.9, ease: ease.out }}
        className="relative rounded-3xl border border-line-strong bg-surface p-7 sm:p-9 shadow-soft"
      >
        <div className="flex items-start justify-between border-b border-line pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle">{d.form}</p>
            <h3 className="mt-1 text-2xl font-bold text-fg">{d.title}</h3>
            <p className="mt-1 text-xs text-fg-subtle">{d.period}</p>
          </div>
          <div className="flex gap-1" aria-hidden>
            <span className="w-2 h-8 rounded-full bg-[#00843d]" />
            <span className="w-2 h-8 rounded-full bg-white border border-line" />
            <span className="w-2 h-8 rounded-full bg-black" />
            <span className="w-2 h-8 rounded-full bg-[#c8102e]" />
          </div>
        </div>
        <ul className="divide-y divide-line">
          {d.rows.map((r, i) => (
            <motion.li
              key={r.label}
              initial={reduce ? false : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5, ease: ease.out }}
              className="flex items-center justify-between gap-4 py-3.5 text-sm"
            >
              <span className="text-fg-muted font-mono text-[12px] sm:text-[13px]">{r.label}</span>
              <span className="font-semibold tabular-nums text-fg" dir="ltr">{r.amount}</span>
            </motion.li>
          ))}
        </ul>
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-3 flex items-center justify-between rounded-2xl bg-gradient-to-r from-brand-600 to-violet-600 px-5 py-4 text-white"
        >
          <span className="text-sm font-semibold">{d.net}</span>
          <span className="font-display text-xl font-bold" dir="ltr">{d.netValue}</span>
        </motion.div>

        {/* Seal stamp */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 2.4, rotate: -40 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -14 }}
          viewport={viewportOnce}
          transition={{ delay: 1.5, type: 'spring', stiffness: 260, damping: 13 }}
          className="absolute -top-6 -end-4 sm:-end-8 grid place-items-center w-28 h-28 rounded-full border-[3px] border-emerald-500 bg-surface/90 backdrop-blur text-emerald-600 dark:text-emerald-400 shadow-lg"
          aria-hidden
        >
          <span className="absolute inset-1.5 rounded-full border border-dashed border-emerald-500/60" />
          <span className="text-center leading-tight">
            <span className="block font-display text-lg font-bold">{d.seal}</span>
            <span className="block text-[10px] font-bold uppercase tracking-wider">✓ {d.sealSub}</span>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Compliance() {
  const { tm } = useLanguage();
  const c = tm.home.compliance;
  return (
    <section className="py-28 sm:py-36 overflow-hidden">
      <Container>
        <div className="grid gap-16 lg:grid-cols-2 items-center">
          <div>
            <SectionHeading
              align="start"
              eyebrow={c.eyebrow}
              title={
                <>
                  {c.title} <Accent>{c.accent}</Accent>
                </>
              }
              subtitle={c.subtitle}
            />
            <div className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-8">
              {c.points.map((pt, i) => {
                const Icon = ICONS[i];
                return (
                  <Reveal key={pt.t} delay={i * 0.07}>
                    <Icon size={20} className="text-brand-600 dark:text-brand-400" />
                    <h3 className="mt-3 !font-sans text-base font-bold text-fg">{pt.t}</h3>
                    <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{pt.d}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
          <VatDocument />
        </div>
      </Container>
    </section>
  );
}
