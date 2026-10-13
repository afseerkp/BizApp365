import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Check, Printer, Truck } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Container } from '../ds/Container';
import { Button } from '../ds/Button';
import { BrowserFrame } from '../ds/Frames';
import LiveDashboard from './LiveDashboard';
import { CONTACT } from '../../data/modules';
import { ease } from '../../lib/motion';

/** Splits a line into words that rise from a mask. Words (never characters) keep Arabic shaping intact. */
function KineticLine({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={className}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: ease.out, delay: delay + i * 0.06 }}
          >
            {word}
            {' '}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { tm } = useLanguage();
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start end', 'start 0.25'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const rotateX = useTransform(smooth, [0, 1], reduce ? [0, 0] : [24, 0]);
  const scale = useTransform(smooth, [0, 1], reduce ? [1, 1] : [0.9, 1]);
  const floatY = useTransform(smooth, [0, 1], reduce ? [0, 0] : [60, 0]);

  const h = tm.home.hero;

  return (
    <section className="relative overflow-hidden pt-32 sm:pt-40 pb-20 grain">
      {/* Aurora + grid backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
        <div className="absolute inset-0 bg-grid mask-radial opacity-70" />
        <div className="absolute -top-40 start-[10%] w-[42rem] h-[42rem] blob text-brand-500/30 dark:text-brand-600/40" />
        <div className="absolute top-20 end-[5%] w-[34rem] h-[34rem] blob text-violet-500/20" />
        <div className="absolute top-[40%] start-[40%] w-[26rem] h-[26rem] blob text-sand-400/15" />
      </div>

      <Container className="relative">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: ease.out }}
          >
            <Link
              to="/features#accounting"
              className="group inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/70 backdrop-blur py-1 ps-1 pe-3 text-xs sm:text-sm text-fg-muted hover:text-fg transition-colors"
            >
              <span className="rounded-full bg-gradient-to-r from-brand-600 to-violet-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">{h.badge}</span>
              {h.badgeText}
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </Link>
          </motion.div>

          <h1 className="mt-8 font-display font-bold tracking-[-0.045em] leading-[0.98] text-fg text-[clamp(2.75rem,8.4vw,7.25rem)] max-w-[15ch]">
            <KineticLine text={h.titleLine1} delay={0.1} />
            <KineticLine text={h.titleLine2} delay={0.35} />
            <span className="inline-block overflow-hidden align-bottom pb-[0.15em] -mb-[0.15em]">
              <motion.span
                className="inline-block font-serif italic font-normal tracking-[-0.02em] text-gradient pe-2"
                initial={reduce ? false : { y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: ease.out, delay: 0.5 }}
              >
                {h.titleAccent}
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.7 }}
            className="mt-7 max-w-2xl text-lg sm:text-xl leading-relaxed text-fg-muted"
          >
            {h.subtitle}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.85 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-3"
          >
            <Button to="/demo" size="lg" magnetic>
              {h.primary}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Button>
            <Button href={CONTACT.login} size="lg" variant="secondary" magnetic>
              {h.secondary}
            </Button>
          </motion.div>

          <motion.ul
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.05 }}
            className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-fg-muted"
          >
            {h.trust.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5">
                <Check size={15} className="text-emerald-500" /> {item}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Product stage — tilts flat as you scroll */}
        <div ref={stageRef} className="relative mt-16 sm:mt-20 [perspective:1600px]">
          <div className="absolute inset-x-[8%] -top-10 bottom-0 bg-[radial-gradient(ellipse_at_top,rgba(51,132,241,0.35),rgba(139,92,246,0.15)_45%,transparent_70%)]" aria-hidden />
          <motion.div
            style={{ rotateX, scale, transformOrigin: 'center top' }}
            initial={reduce ? false : { opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: ease.out, delay: 0.4 }}
            className="relative mx-auto max-w-6xl"
          >
            <BrowserFrame>
              <LiveDashboard />
            </BrowserFrame>
          </motion.div>

          {/* Floating proof cards */}
          <motion.div
            style={{ y: floatY }}
            className="hidden md:flex absolute -start-2 lg:-start-8 bottom-16 items-center gap-3 rounded-2xl border border-line bg-surface/90 backdrop-blur-xl p-3 pe-5 shadow-soft"
            aria-hidden
          >
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-sand-100 text-sand-600 dark:bg-sand-500/15 dark:text-sand-400">
              <Printer size={18} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-fg">{h.dash.printed}</span>
              <span className="block text-xs text-fg-subtle">{h.dash.printedSub}</span>
            </span>
          </motion.div>
          <motion.div
            style={{ y: floatY }}
            className="hidden md:flex absolute -end-2 lg:-end-8 -top-8 items-center gap-3 rounded-2xl border border-line bg-surface/90 backdrop-blur-xl p-3 pe-5 shadow-soft"
            aria-hidden
          >
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Truck size={18} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-fg">{h.dash.van}</span>
              <span className="block text-xs text-fg-subtle">{h.dash.vanSub}</span>
              <span className="mt-1.5 block h-1 w-32 overflow-hidden rounded-full bg-line">
                <span className="block h-full w-2/3 rounded-full bg-emerald-500" />
              </span>
            </span>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
