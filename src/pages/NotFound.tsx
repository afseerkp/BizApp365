import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Container } from '../components/ds/Container';
import { Button } from '../components/ds/Button';

const NotFound = () => {
  const { tm } = useLanguage();
  const reduce = useReducedMotion();
  const n = tm.notFound;

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <section className="relative overflow-hidden pt-40 pb-32 min-h-[80vh] flex items-center">
      <div className="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-60" aria-hidden />
      <Container className="relative text-center">
        <svg viewBox="0 0 400 120" className="mx-auto w-full max-w-md h-auto" aria-hidden>
          <path d="M20 90 C 100 20, 160 110, 220 60 S 330 30, 380 70" fill="none" stroke="var(--line-strong)" strokeWidth="2" strokeDasharray="5 7" />
          {!reduce && (
            <circle r="8" fill="var(--color-sand-400)">
              <animateMotion dur="5s" repeatCount="indefinite" path="M20 90 C 100 20, 160 110, 220 60 S 330 30, 380 70" />
            </circle>
          )}
          <circle cx="20" cy="90" r="6" fill="var(--color-brand-500)" />
          <circle cx="380" cy="70" r="6" fill="var(--color-violet-500)" />
        </svg>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 font-display text-[clamp(5rem,18vw,11rem)] font-bold leading-none tracking-[-0.06em] text-gradient"
        >
          404
        </motion.p>
        <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold tracking-tight text-fg">{n.title}</h1>
        <p className="mt-3 text-fg-muted">{n.subtitle}</p>
        <div className="mt-10">
          <Button to="/" size="lg">
            {n.home} <ArrowRight size={16} className="rtl:rotate-180" />
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default NotFound;
