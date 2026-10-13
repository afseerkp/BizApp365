import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Container } from '../components/ds/Container';
import { PageHero } from '../components/ds/PageHero';
import { Reveal } from '../components/ds/Reveal';
import { Marquee } from '../components/ds/Marquee';
import Seo from '../components/seo/Seo';
import FinalCta from '../components/home/FinalCta';
import { MODULES } from '../data/modules';
import { cn } from '../lib/cn';

const Features = () => {
  const { t, tm } = useLanguage();
  const modules = tm.features.modules;
  const editions = tm.features.editions;
  const [active, setActive] = useState(MODULES[0].slug);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    MODULES.forEach((m) => {
      const el = document.getElementById(m.slug);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div>
      <Seo title={tm.features.seoTitle} description={tm.features.seoDescription} canonical="https://bizapp365.com/features/" />
      <PageHero eyebrow={t('features.badge')} title={t('features.titleBefore')} accent={t('features.titleHighlight')} subtitle={t('features.subtitle')} />

      <div className="border-y border-line bg-surface/50 py-6">
        <Marquee duration={50}>
          {tm.features.regional.map((r) => (
            <span key={r.label} className="mx-3 inline-flex items-center gap-3 rounded-full border border-line bg-surface px-4 py-2 whitespace-nowrap">
              <span className="text-sm font-semibold text-fg">{r.label}</span>
              <span className="text-xs text-fg-subtle">{r.detail}</span>
            </span>
          ))}
        </Marquee>
      </div>

      <Container className="py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
          <nav aria-label={t('features.tocTitle')} className="hidden lg:block">
            <div className="sticky top-32">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle mb-4">{t('features.tocTitle')}</p>
              <ul className="space-y-0.5 border-s border-line">
                {MODULES.map((m, i) => (
                  <li key={m.slug}>
                    <Link
                      to={{ hash: m.slug }}
                      replace
                      aria-current={active === m.slug ? 'true' : undefined}
                      className={cn(
                        '-ms-px block border-s-2 ps-4 py-1.5 text-sm transition-colors',
                        active === m.slug ? 'border-brand-600 text-fg font-semibold' : 'border-transparent text-fg-subtle hover:text-fg',
                      )}
                    >
                      {modules[i].title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="space-y-24 sm:space-y-32">
            {MODULES.map((m, i) => {
              const mod = modules[i];
              return (
                <section key={m.slug} id={m.slug} className="scroll-mt-32">
                  <Reveal className="grid gap-8 xl:grid-cols-2 items-center">
                    <div className={cn(i % 2 === 1 && 'xl:order-2')}>
                      <div className="flex items-center gap-3">
                        <span className={cn('grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br text-white shadow-md', m.tint)}>
                          <m.icon size={20} />
                        </span>
                        <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-fg-subtle">
                          {t('features.includedIn')} {editions[mod.editionKey as keyof typeof editions]}
                        </span>
                      </div>
                      <h2 className="mt-6 font-display text-4xl sm:text-5xl font-bold tracking-[-0.03em] text-fg">{mod.title}</h2>
                      <p className="mt-4 text-lg text-fg-muted leading-relaxed">{mod.description}</p>
                      <ul className="mt-7 space-y-3.5">
                        {mod.features.map((f) => (
                          <li key={f} className="flex gap-3 text-fg">
                            <span className="mt-0.5 grid place-items-center w-5 h-5 shrink-0 rounded-full bg-brand-600/10 text-brand-600 dark:text-brand-400">
                              <Check size={12} strokeWidth={3} />
                            </span>
                            <span className="text-[15px]">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className={cn('relative overflow-hidden rounded-3xl border border-line bg-[#eef1f8] aspect-[3/2]', i % 2 === 1 && 'xl:order-1')}>
                      <img src={m.image} alt={mod.title} loading="lazy" decoding="async" width={1536} height={1024} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.03]" />
                    </div>
                  </Reveal>
                </section>
              );
            })}
          </div>
        </div>
      </Container>

      <FinalCta title={t('features.ctaTitle')} accent="" />
    </div>
  );
};

export default Features;
