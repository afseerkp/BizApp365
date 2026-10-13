import { motion, useReducedMotion } from 'framer-motion';
import { Database, HardDriveDownload, KeyRound, Lock, Server, ShieldCheck, Building2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Container } from '../ds/Container';
import { Accent, SectionHeading } from '../ds/SectionHeading';
import { Reveal } from '../ds/Reveal';
import { Button } from '../ds/Button';
import { viewportOnce } from '../../lib/motion';

const ICONS = [Database, KeyRound, Lock, HardDriveDownload, Building2, Server];

function TenantViz() {
  const reduce = useReducedMotion();
  const tenants = ['company_a', 'company_b', 'company_c'];
  return (
    <div className="relative rounded-[32px] border border-line bg-surface p-6 sm:p-8 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-grid opacity-60 mask-radial" />
      <div className="relative flex flex-col items-center gap-5">
        <div className="flex items-center gap-2 rounded-2xl bg-fg text-bg px-5 py-3 font-semibold text-sm shadow-lg">
          <ShieldCheck size={16} /> HTTPS · JWT · RBAC
        </div>
        <svg viewBox="0 0 300 40" className="w-full max-w-xs h-10">
          {[50, 150, 250].map((x, i) => (
            <motion.path
              key={x}
              d={`M150 0 C 150 20, ${x} 20, ${x} 40`}
              fill="none"
              stroke="var(--color-brand-500)"
              strokeWidth="1.5"
              strokeDasharray="3 4"
              initial={reduce ? false : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={viewportOnce}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.8 }}
            />
          ))}
        </svg>
        <div className="grid grid-cols-3 gap-3 w-full" dir="ltr">
          {tenants.map((t, i) => (
            <motion.div
              key={t}
              initial={reduce ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.6 }}
              className="rounded-2xl border border-line-strong bg-surface p-3 text-center"
            >
              <Database size={20} className="mx-auto text-brand-600 dark:text-brand-400" />
              <p className="mt-2 font-mono text-[10px] sm:text-xs text-fg">{t}</p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
                <Lock size={9} /> isolated
              </span>
            </motion.div>
          ))}
        </div>
        <p className="font-mono text-[11px] text-fg-subtle">PostgreSQL · schema-per-company</p>
      </div>
    </div>
  );
}

export default function Security() {
  const { tm } = useLanguage();
  const s = tm.home.security;
  return (
    <section className="py-28 sm:py-36">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] items-center">
          <div>
            <SectionHeading
              align="start"
              eyebrow={s.eyebrow}
              title={
                <>
                  {s.title} <Accent>{s.accent}</Accent>
                </>
              }
              subtitle={s.subtitle}
            />
            <Reveal className="mt-8">
              <Button to="/tech" variant="secondary">
                {s.cta}
              </Button>
            </Reveal>
          </div>
          <Reveal>
            <TenantViz />
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {s.items.map((it, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={it.t} delay={(i % 3) * 0.06} className="bg-bg p-7">
                <Icon size={20} className="text-brand-600 dark:text-brand-400" />
                <h3 className="mt-4 !font-sans text-base font-bold text-fg">{it.t}</h3>
                <p className="mt-1.5 text-sm text-fg-muted leading-relaxed">{it.d}</p>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
