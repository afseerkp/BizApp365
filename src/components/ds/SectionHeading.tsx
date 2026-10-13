import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Reveal } from './Reveal';

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400', className)}>
      <span className="h-px w-6 bg-current opacity-60" aria-hidden />
      {children}
    </p>
  );
}

type Props = {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'center' | 'start';
  className?: string;
  as?: 'h1' | 'h2';
  invert?: boolean;
};

export function SectionHeading({ eyebrow, title, subtitle, align = 'center', className, as = 'h2', invert }: Props) {
  const H = as;
  return (
    <Reveal
      className={cn(
        'flex flex-col gap-5',
        align === 'center' ? 'items-center text-center mx-auto max-w-3xl' : 'items-start text-start max-w-2xl',
        className,
      )}
    >
      {eyebrow && <Eyebrow className={invert ? 'text-brand-300 dark:text-brand-300' : undefined}>{eyebrow}</Eyebrow>}
      <H
        className={cn(
          'font-display font-bold tracking-[-0.03em] leading-[1.04]',
          as === 'h1' ? 'text-[clamp(2.6rem,6vw,5.25rem)]' : 'text-[clamp(2.1rem,4.4vw,3.75rem)]',
          invert ? 'text-white' : 'text-fg',
        )}
      >
        {title}
      </H>
      {subtitle && <p className={cn('text-lg md:text-xl leading-relaxed', invert ? 'text-slate-300' : 'text-fg-muted')}>{subtitle}</p>}
    </Reveal>
  );
}

/** Italic serif accent word used inside headlines. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="font-serif italic font-normal tracking-normal text-gradient pe-1">{children}</span>;
}
