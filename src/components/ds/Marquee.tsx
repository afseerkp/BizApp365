import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** Infinite horizontal marquee. Rendered LTR so the loop math is direction-agnostic. */
export function Marquee({ children, className, duration = 40 }: { children: ReactNode; className?: string; duration?: number }) {
  const style = { '--marquee-duration': `${duration}s` } as CSSProperties;
  return (
    <div className={cn('relative overflow-hidden mask-fade-x', className)} dir="ltr">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none" style={style}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
