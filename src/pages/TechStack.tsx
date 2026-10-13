import { motion, useReducedMotion } from 'framer-motion';
import { Layers, Database, Globe, Lock, Workflow, Cpu } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Container } from '../components/ds/Container';
import { PageHero } from '../components/ds/PageHero';
import { Reveal } from '../components/ds/Reveal';
import Seo from '../components/seo/Seo';
import Security from '../components/home/Security';
import FinalCta from '../components/home/FinalCta';
import { ease, viewportOnce } from '../lib/motion';
import { cn } from '../lib/cn';

const ICONS = [Layers, Cpu, Database, Globe, Workflow, Lock];
const LAYER_TINTS = ['from-brand-500 to-brand-700', 'from-violet-500 to-violet-700', 'from-emerald-500 to-emerald-700', 'from-sand-400 to-sand-600'];

function Architecture() {
  const { tm } = useLanguage();
  const reduce = useReducedMotion();
  const layers = tm.techx.layers;
  return (
    <div className="relative rounded-[32px] border border-line bg-surface p-5 sm:p-8">
      <div className="space-y-3">
        {layers.map((l, i) => (
          <motion.div
            key={l.name}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: i * 0.12, duration: 0.6, ease: ease.out }}
            className="relative grid gap-3 sm:grid-cols-[150px_1fr] items-center rounded-2xl border border-line bg-surface-2/60 p-4"
          >
            <span className="flex items-center gap-3">
              <span className={cn('w-2.5 h-10 rounded-full bg-gradient-to-b', LAYER_TINTS[i])} />
              <span className="font-display text-lg font-bold text-fg">{l.name}</span>
            </span>
            <span className="flex flex-wrap gap-2">
              {l.items.map((it) => (
                <span key={it} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-fg">
                  {it}
                </span>
              ))}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const TechStack = () => {
  const { tm } = useLanguage();
  const x = tm.techx;
  return (
    <div>
      <Seo title={x.seoTitle} description={x.seoDescription} canonical="https://bizapp365.com/tech/" />
      <PageHero eyebrow={x.eyebrow} title={x.title} accent={x.accent} subtitle={tm.tech.subtitle} />

      <Container className="pb-12">
        <Reveal>
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.14em] text-fg-subtle !font-sans">{x.layersTitle}</h2>
        </Reveal>
        <Architecture />
      </Container>

      <Security />

      <Container className="pb-24">
        <Reveal>
          <h2 className="mb-10 font-display text-4xl sm:text-5xl font-bold tracking-[-0.03em] text-fg">{x.stackTitle}</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tm.tech.categories.map((c, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={c.title} delay={(i % 3) * 0.07} className="rounded-3xl border border-line bg-surface p-7">
                <Icon size={22} className="text-brand-600 dark:text-brand-400" />
                <h3 className="mt-5 !font-sans text-lg font-bold text-fg">{c.title}</h3>
                <p className="mt-2 text-sm text-fg-muted">{c.description}</p>
                <div className="mt-5 flex flex-wrap gap-2" dir="ltr">
                  {c.techs.map((tech) => (
                    <span key={tech} className="rounded-lg bg-surface-2 px-2.5 py-1 font-mono text-xs text-fg-muted">
                      {tech}
                    </span>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
      <FinalCta />
    </div>
  );
};

export default TechStack;
