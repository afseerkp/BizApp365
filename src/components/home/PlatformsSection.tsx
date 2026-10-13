import { Globe, Printer, Smartphone } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Container } from '../ds/Container';
import { Accent, SectionHeading } from '../ds/SectionHeading';
import { Reveal } from '../ds/Reveal';
import { BrowserFrame, PhoneFrame } from '../ds/Frames';

function WebMock() {
  return (
    <BrowserFrame className="rounded-xl" url="app.bizapp365.com">
      <div className="grid grid-cols-[48px_1fr] h-40" aria-hidden>
        <div className="border-e border-line bg-surface-2/60 p-2 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`block h-5 rounded-md ${i === 1 ? 'bg-brand-600' : 'bg-line'}`} />
          ))}
        </div>
        <div className="p-3 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-10 rounded-lg border border-line bg-surface" />
            ))}
          </div>
          <div className="h-16 rounded-lg border border-line bg-gradient-to-t from-brand-500/15 to-transparent" />
        </div>
      </div>
    </BrowserFrame>
  );
}

function PhoneMock() {
  return (
    <PhoneFrame className="w-36 mx-auto">
      <div className="h-56 p-3 pt-8 space-y-2" aria-hidden>
        <span className="block h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700" />
        <div className="grid grid-cols-2 gap-1.5">
          <span className="h-9 rounded-lg bg-surface-2" />
          <span className="h-9 rounded-lg bg-surface-2" />
        </div>
        {[0, 1, 2].map((i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-line" />
            <span className="h-2 flex-1 rounded bg-line" />
          </span>
        ))}
      </div>
    </PhoneFrame>
  );
}

function PrintMock() {
  return (
    <div className="relative h-56 grid place-items-center" aria-hidden>
      <div className="relative w-44">
        <div className="relative z-10 h-16 rounded-2xl bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-xl ring-1 ring-white/10">
          <span className="absolute top-3 start-4 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
          <span className="absolute bottom-3 inset-x-6 h-1.5 rounded-full bg-black/60" />
        </div>
        <div className="mx-auto -mt-2 w-32 rounded-b-md bg-white shadow-md px-3 pt-4 pb-3 space-y-1.5 animate-[float_5s_ease-in-out_infinite] motion-reduce:animate-none">
          <span className="block h-1.5 w-2/3 rounded bg-zinc-300" />
          <span className="block h-1 w-full rounded bg-zinc-200" />
          <span className="block h-1 w-5/6 rounded bg-zinc-200" />
          <span className="flex gap-[2px] h-5 pt-1" dir="ltr">
            {[2, 1, 3, 1, 2, 1, 3, 1, 1, 2, 1, 3].map((w, i) => (
              <span key={i} className="bg-zinc-800" style={{ width: w }} />
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}

const MOCKS = [WebMock, PhoneMock, PrintMock];
const ICONS = [Globe, Smartphone, Printer];

export default function PlatformsSection() {
  const { tm } = useLanguage();
  const h = tm.home.platforms;
  const items = tm.platforms.items;

  return (
    <section className="py-28 sm:py-36 bg-surface/40 border-y border-line">
      <Container>
        <SectionHeading
          eyebrow={h.eyebrow}
          title={
            <>
              {h.title} <Accent>{h.accent}</Accent>
            </>
          }
          subtitle={h.subtitle}
        />
        <div className="mt-16 grid gap-4 lg:grid-cols-3">
          {items.map((item, i) => {
            const Mock = MOCKS[i];
            const Icon = ICONS[i];
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <article className="group h-full flex flex-col rounded-3xl border border-line bg-surface overflow-hidden transition-colors hover:border-brand-500/40">
                  <div className="relative px-6 pt-8 pb-4 bg-gradient-to-b from-surface-2 to-surface">
                    <div className="transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-1.5">
                      <Mock />
                    </div>
                  </div>
                  <div className="flex-1 p-7 pt-4">
                    <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-400">
                      <Icon size={14} /> {item.subtitle}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold tracking-tight text-fg">{item.title}</h3>
                    <p className="mt-3 text-fg-muted leading-relaxed">{item.description}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {item.highlights.map((hl) => (
                        <li key={hl} className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium text-fg-muted">
                          {hl}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
