import { motion, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Container } from '../ds/Container';
import { Accent, SectionHeading } from '../ds/SectionHeading';
import { ease, viewportOnce } from '../../lib/motion';

export default function Problem() {
  const { tm } = useLanguage();
  const reduce = useReducedMotion();
  const p = tm.home.problem;

  return (
    <section className="py-28 sm:py-36">
      <Container>
        <SectionHeading
          eyebrow={p.eyebrow}
          title={
            <>
              {p.title} <Accent>{p.accent}</Accent>
            </>
          }
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: ease.out }}
            className="relative rounded-3xl border border-line bg-surface-2/60 p-8 sm:p-10"
          >
            <p className="text-sm font-semibold text-fg-subtle mb-6">{p.before.label}</p>
            <ul className="space-y-5">
              {p.before.items.map((item) => (
                <li key={item} className="flex gap-4 text-fg-muted">
                  <span className="mt-0.5 grid place-items-center w-6 h-6 shrink-0 rounded-full bg-rose-500/10 text-rose-500">
                    <X size={13} strokeWidth={3} />
                  </span>
                  <span className="line-through decoration-fg-subtle/40 decoration-1">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-700 p-8 sm:p-10 text-white shadow-[0_30px_80px_-30px_rgba(25,118,210,0.7)]"
          >
            <div className="absolute -top-24 -end-24 w-96 h-96 blob text-white/15" aria-hidden />
            <p className="relative text-sm font-semibold text-white/70 mb-6">{p.after.label}</p>
            <ul className="relative space-y-5">
              {p.after.items.map((item, i) => (
                <motion.li
                  key={item}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.6, ease: ease.out, delay: 0.3 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <span className="mt-0.5 grid place-items-center w-6 h-6 shrink-0 rounded-full bg-white text-brand-700">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span className="font-medium">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
