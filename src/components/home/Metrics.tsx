import { useLanguage } from '../../i18n/LanguageContext';
import { Container } from '../ds/Container';
import { Counter } from '../ds/Counter';
import { Reveal } from '../ds/Reveal';

/** Product facts (not customer claims) — safe to animate as big numbers. */
export default function Metrics() {
  const { tm } = useLanguage();
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-3xl border border-line bg-line">
          {tm.home.metrics.items.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.08} className="bg-bg p-7 sm:p-10">
              <dt className="sr-only">{m.label}</dt>
              <dd>
                <Counter value={m.value} className="block font-display text-6xl sm:text-7xl font-bold tracking-[-0.05em] text-gradient" />
                <span className="mt-3 block text-sm text-fg-muted leading-snug max-w-[18ch]">{m.label}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
