import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { BarChart3, Boxes, CheckCircle2, FileText, Landmark, MessageCircle, Printer, ReceiptText } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Container } from '../ds/Container';
import { Accent, SectionHeading } from '../ds/SectionHeading';
import { ease } from '../../lib/motion';
import { cn } from '../../lib/cn';

const STEP_ICONS = [ReceiptText, Boxes, Landmark, FileText, BarChart3];

function Rolling({ from, to, run }: { from: number; to: number; run: boolean }) {
  const mv = useMotionValue(from);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!run) {
      mv.set(from);
      return;
    }
    if (reduce) {
      mv.set(to);
      return;
    }
    const c = animate(mv, to, { duration: 1.1, ease: ease.out });
    return () => c.stop();
  }, [run, from, to, reduce, mv]);
  return <motion.span className="tabular-nums">{rounded}</motion.span>;
}

function Panel({ title, icon: Icon, active, done, children, label }: { title: string; icon: typeof Boxes; active: boolean; done: boolean; children: ReactNode; label: string }) {
  // On phones only the active panel is shown so the sticky stage fits the screen.
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98, transition: { duration: 0.2 } }}
      transition={{ duration: 0.6, ease: ease.out }}
      className={cn(
        !active && 'max-sm:hidden',
        'relative rounded-2xl border bg-surface p-4 transition-[box-shadow,border-color,opacity] duration-500',
        active ? 'border-brand-500/60 shadow-[0_0_0_4px_var(--glow),0_20px_40px_-20px_rgba(25,118,210,0.5)]' : 'border-line shadow-sm',
        done && !active && 'opacity-80',
      )}
    >
      <div className={cn('flex items-center justify-between gap-2', (active || !done) && 'mb-3')}>
        <p className="inline-flex items-center gap-2 text-xs font-semibold text-fg-muted">
          <Icon size={14} className="text-brand-600 dark:text-brand-400" />
          {title}
        </p>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={11} /> {label}
        </span>
      </div>
      {/* Completed steps collapse to their title row so the stack always fits the screen */}
      <AnimatePresence initial={false}>
        {(active || !done) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: ease.out }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Stage({ step, all = false }: { step: number; all?: boolean }) {
  const { tm } = useLanguage();
  const v = tm.home.story.v;
  const updated = tm.home.story.updated;

  return (
    <div className="grid gap-3 sm:grid-cols-[1fr_1.1fr] items-start w-full">
      {/* Invoice — always present, the origin of everything */}
      <div className="relative rounded-2xl border border-line-strong bg-surface p-5 shadow-soft">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-600 dark:text-brand-400">{v.invoice}</p>
            <p className="font-mono text-xs text-fg-subtle mt-0.5" dir="ltr">{v.invNo}</p>
          </div>
          <span className="rounded-lg bg-surface-2 px-2 py-1 text-[11px] font-semibold text-fg">{v.customer}</span>
        </div>
        <ul className={cn('space-y-2 text-xs', step > 0 && 'max-sm:hidden')}>
          {v.lines.map((l, i) => (
            <motion.li
              key={l.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.12, duration: 0.5, ease: ease.out }}
              className="flex items-center justify-between gap-3 border-b border-dashed border-line pb-2"
            >
              <span className="text-fg truncate">{l.name}</span>
              <span className="flex gap-4 shrink-0 tabular-nums text-fg-muted" dir="ltr">
                <span>×{l.qty}</span>
                <span className="w-16 text-end text-fg">{l.amount}</span>
              </span>
            </motion.li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 text-xs" dir="auto">
          <p className="flex justify-between text-fg-muted"><span>{v.subtotal}</span><span className="tabular-nums" dir="ltr">{v.subtotalValue}</span></p>
          <p className="flex justify-between text-fg-muted"><span>{v.vat}</span><span className="tabular-nums" dir="ltr">{v.vatValue}</span></p>
          <p className="flex justify-between pt-2 font-display text-lg font-bold text-fg"><span>{v.total}</span><span className="tabular-nums" dir="ltr">{v.totalValue}</span></p>
        </div>
        {/* Pulse travelling out of the invoice */}
        {step > 0 && (
          <motion.span
            key={step}
            className="absolute top-1/2 -end-1.5 hidden sm:block w-3 h-3 rounded-full bg-brand-500"
            initial={{ scale: 0.6, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1 }}
            aria-hidden
          />
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {step >= 1 && (
            <Panel key="stock" title={v.stockTitle} icon={Boxes} active={all || step === 1} done={step > 1} label={updated}>
              <ul className="space-y-2 text-xs">
                {v.stockRows.map((r) => (
                  <li key={r.name} className="flex items-center gap-3">
                    <span className="flex-1 text-fg truncate">{r.name}</span>
                    <span className="h-1.5 w-20 overflow-hidden rounded-full bg-line" aria-hidden>
                      <motion.span
                        className="block h-full rounded-full bg-brand-500"
                        initial={{ width: `${(r.from / 240) * 100}%` }}
                        animate={{ width: `${(r.to / 240) * 100}%` }}
                        transition={{ duration: 1.1, ease: ease.out }}
                      />
                    </span>
                    <span className="w-14 text-end font-semibold text-fg" dir="ltr">
                      <Rolling from={r.from} to={r.to} run={step >= 1} />
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
          {step >= 2 && (
            <Panel key="ledger" title={v.ledgerTitle} icon={Landmark} active={all || step === 2} done={step > 2} label={updated}>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-fg-subtle">
                    <th className="text-start font-medium pb-1" />
                    <th className="text-end font-medium pb-1">{v.debit}</th>
                    <th className="text-end font-medium pb-1">{v.credit}</th>
                  </tr>
                </thead>
                <tbody>
                  {v.ledgerRows.map((r, i) => (
                    <motion.tr
                      key={r.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 + i * 0.15 }}
                      className="border-t border-line"
                    >
                      <td className="py-1.5 text-fg">{r.name}</td>
                      <td className="py-1.5 text-end tabular-nums text-fg" dir="ltr">{r.dr}</td>
                      <td className="py-1.5 text-end tabular-nums text-fg" dir="ltr">{r.cr}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          )}
          {step >= 3 && (
            <Panel key="vat" title={v.vatTitle} icon={FileText} active={all || step === 3} done={step > 3} label={updated}>
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="text-fg-muted">{v.vatBox}</span>
                <span className="font-semibold tabular-nums text-fg" dir="ltr">+125.50</span>
              </div>
              <div className="mt-3 flex items-center gap-3 rounded-xl bg-surface-2 p-2.5">
                <motion.span
                  initial={{ scale: 2, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: -8, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.3 }}
                  className="grid place-items-center w-11 h-11 shrink-0 rounded-full border-2 border-emerald-500 text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-400"
                >
                  QR ✓
                </motion.span>
                <span className="text-xs">
                  <span className="block font-semibold text-fg">{v.peppol}</span>
                  <span className="block text-fg-subtle">{v.peppolStatus}</span>
                </span>
              </div>
            </Panel>
          )}
          {step >= 4 && (
            <Panel key="dash" title={v.dashTitle} icon={BarChart3} active={all || step === 4} done={false} label={updated}>
              <div className="flex items-end gap-1.5 h-14" aria-hidden dir="ltr">
                {[38, 52, 45, 60, 55, 68, 92].map((h, i) => (
                  <motion.span
                    key={i}
                    className={cn('flex-1 rounded-t-md', i === 6 ? 'bg-gradient-to-t from-brand-600 to-violet-500' : 'bg-brand-500/25')}
                    initial={{ height: i === 6 ? '55%' : `${h}%` }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, ease: ease.out, delay: 0.2 }}
                  />
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2 rounded-lg bg-sand-100 dark:bg-sand-500/10 px-2 py-1.5 text-sand-600 dark:text-sand-400 font-semibold"
                >
                  <Printer size={13} /> {v.printed}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-2 py-1.5 text-emerald-600 dark:text-emerald-400 font-semibold"
                >
                  <MessageCircle size={13} /> {v.whatsapp}
                </motion.span>
              </div>
            </Panel>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Static layout for reduced-motion users — every step, fully visible. */
function StaticStory() {
  const { tm } = useLanguage();
  const s = tm.home.story;
  return (
    <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.3fr] items-start">
      <ol className="space-y-8">
        {s.steps.map((st, i) => (
          <li key={st.title} className="flex gap-4">
            <span className="font-mono text-sm text-brand-600 dark:text-brand-400">0{i + 1}</span>
            <div>
              <h3 className="text-xl font-bold text-fg">{st.title}</h3>
              <p className="mt-1 text-fg-muted">{st.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <Stage step={4} all />
    </div>
  );
}

export default function Story() {
  const { tm } = useLanguage();
  const s = tm.home.story;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setStep(Math.min(s.steps.length - 1, Math.max(0, Math.floor(p * s.steps.length * 0.999 + 0.0001))));
  });

  const heading = (
    <SectionHeading
      eyebrow={s.eyebrow}
      title={
        <>
          {s.title} <Accent>{s.accent}</Accent>
        </>
      }
      subtitle={s.subtitle}
    />
  );

  if (reduce) {
    return (
      <section className="py-28 bg-surface/40 border-y border-line">
        <Container>
          {heading}
          <StaticStory />
        </Container>
      </section>
    );
  }

  return (
    <section className="relative border-y border-line bg-surface/40">
      <Container className="pt-28 sm:pt-36">{heading}</Container>

      <div ref={ref} className="relative" style={{ height: `${s.steps.length * 85 + 40}vh` }}>
        <div className="sticky top-0 h-[100dvh] flex items-center overflow-hidden">
          <Container>
            <div className="grid gap-8 lg:gap-16 lg:grid-cols-[0.9fr_1.3fr] items-center">
              {/* Step rail */}
              <div className="relative">
                <div className="absolute start-[15px] top-2 bottom-2 w-px bg-line hidden lg:block" aria-hidden>
                  <motion.div className="w-px origin-top bg-gradient-to-b from-brand-500 to-violet-500 h-full" style={{ scaleY: progress }} />
                </div>
                <ol className="hidden lg:block space-y-7">
                  {s.steps.map((st, i) => {
                    const Icon = STEP_ICONS[i];
                    const isActive = i === step;
                    return (
                      <li key={st.title} className={cn('relative flex gap-5 transition-opacity duration-500', isActive ? 'opacity-100' : 'opacity-35')}>
                        <span
                          className={cn(
                            'relative z-10 grid place-items-center w-8 h-8 shrink-0 rounded-full border transition-colors duration-500',
                            i <= step ? 'bg-brand-600 border-brand-600 text-white' : 'bg-surface border-line-strong text-fg-subtle',
                          )}
                        >
                          <Icon size={14} />
                        </span>
                        <div>
                          <h3 className="text-xl font-bold text-fg tracking-tight">{st.title}</h3>
                          <AnimatePresence initial={false}>
                            {isActive && (
                              <motion.p
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.45, ease: ease.out }}
                                className="overflow-hidden text-fg-muted leading-relaxed pt-2 max-w-md"
                              >
                                {st.body}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {/* Mobile: current step only */}
                <div className="lg:hidden">
                  <div className="flex gap-1.5 mb-4" aria-hidden>
                    {s.steps.map((_, i) => (
                      <span key={i} className={cn('h-1 flex-1 rounded-full transition-colors duration-500', i <= step ? 'bg-brand-600' : 'bg-line')} />
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35 }}
                    >
                      <p className="font-mono text-xs text-brand-600 dark:text-brand-400">0{step + 1} / 0{s.steps.length}</p>
                      <h3 className="mt-1 text-2xl font-bold text-fg">{s.steps[step].title}</h3>
                      <p className="mt-1 text-sm text-fg-muted">{s.steps[step].body}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-8 bg-[radial-gradient(ellipse_at_center,var(--glow),transparent_65%)]" aria-hidden />
                <div className="relative max-h-[62dvh] lg:max-h-none overflow-hidden">
                  <Stage step={step} />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}
