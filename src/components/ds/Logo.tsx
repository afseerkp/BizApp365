import { cn } from '../../lib/cn';

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo-128.png"
      alt=""
      width={128}
      height={128}
      className={cn('w-9 h-9 shrink-0 object-contain', className)}
      aria-hidden
    />
  );
}

export function Logo({ className, invert }: { className?: string; invert?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)} dir="ltr">
      <LogoMark />
      <span className={cn('font-display text-[1.35rem] font-bold tracking-[-0.03em]', invert ? 'text-white' : 'text-fg')}>
        BizApp<span className="text-brand-600 dark:text-brand-400">365</span>
      </span>
    </span>
  );
}
