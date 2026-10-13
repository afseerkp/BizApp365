import { useLanguage } from '../../i18n/LanguageContext';
import { Container } from '../ds/Container';
import { SectionHeading } from '../ds/SectionHeading';
import { Accordion } from '../ds/Accordion';
import { Reveal } from '../ds/Reveal';

export default function Faq() {
  const { tm } = useLanguage();
  const f = tm.home.faq;
  return (
    <section className="py-28 sm:py-36 bg-surface/40 border-t border-line">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-32 self-start">
            <SectionHeading align="start" eyebrow={f.eyebrow} title={f.title} />
          </div>
          <Reveal>
            <Accordion items={f.items} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
