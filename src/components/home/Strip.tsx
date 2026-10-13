import { useLanguage } from '../../i18n/LanguageContext';
import { Marquee } from '../ds/Marquee';
import { Container } from '../ds/Container';

export default function Strip() {
  const { tm } = useLanguage();
  const s = tm.home.strip;
  return (
    <section className="py-14 border-y border-line bg-surface/50" aria-label={s.label}>
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-fg-subtle mb-7">{s.label}</p>
      </Container>
      <Marquee duration={45}>
        {s.items.map((item) => (
          <span key={item} className="mx-6 sm:mx-10 inline-flex items-center gap-3 whitespace-nowrap font-display text-xl sm:text-2xl font-semibold tracking-tight text-fg/45">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500/60" aria-hidden />
            {item}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
