import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useLanguage } from '../../i18n/LanguageContext';

type Props = { value: number; decimals?: number; prefix?: string; suffix?: string; className?: string; duration?: number };

/** Counts up to `value` when scrolled into view, formatted for the active locale. */
export function Counter({ value, decimals = 0, prefix = '', suffix = '', className, duration = 1.6 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const { lang } = useLanguage();
  const mv = useMotionValue(0);

  const fmt = new Intl.NumberFormat(lang === 'ar' ? 'ar-AE' : 'en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const text = useTransform(mv, (v) => `${prefix}${fmt.format(v)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      mv.set(value);
      return;
    }
    const controls = animate(mv, value, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, value, reduce, duration, mv]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}
