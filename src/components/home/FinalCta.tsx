import { ArrowRight, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Container } from '../ds/Container';
import { Button } from '../ds/Button';
import { Reveal } from '../ds/Reveal';
import { CONTACT } from '../../data/modules';

type Props = { title?: string; accent?: string; subtitle?: string };

export default function FinalCta({ title, accent, subtitle }: Props) {
  const { tm } = useLanguage();
  const c = tm.home.cta;
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[40px] bg-ink-950 px-6 py-20 sm:px-16 sm:py-28 text-center text-white grain">
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute -top-[70%] left-1/2 -translate-x-1/2 w-[70rem] h-[70rem] animate-[spin_40s_linear_infinite] motion-reduce:animate-none">
                <div className="absolute top-[10%] left-[15%] w-[34rem] h-[34rem] blob text-brand-600/60" />
                <div className="absolute top-[20%] right-[10%] w-[30rem] h-[30rem] blob text-violet-600/55" />
                <div className="absolute bottom-[15%] left-[35%] w-[28rem] h-[28rem] blob text-sand-500/35" />
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(7,11,22,0.9),transparent_70%)]" />
              <div
                className="absolute inset-0 opacity-[0.15]"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)', backgroundSize: '26px 26px' }}
              />
            </div>
            <div className="relative">
              <h2 className="font-display font-bold tracking-[-0.04em] leading-[1] text-[clamp(2.5rem,6.5vw,5.5rem)]">
                {title ?? c.title}{' '}
                <span className="font-serif italic font-normal tracking-normal bg-gradient-to-r from-brand-300 via-violet-300 to-sand-300 bg-clip-text text-transparent">
                  {accent ?? c.accent}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">{subtitle ?? c.subtitle}</p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button to="/demo" size="lg" variant="light" magnetic>
                  {c.primary}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </Button>
                <Button href={CONTACT.whatsapp} external size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10" magnetic>
                  <MessageCircle size={18} /> {c.secondary}
                </Button>
              </div>
              <p className="mt-8 text-sm text-slate-400">{c.note}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
