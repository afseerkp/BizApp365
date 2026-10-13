import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function BrowserFrame({ children, url = 'app.bizapp365.com', className }: { children: ReactNode; url?: string; className?: string }) {
  return (
    <div className={cn('rounded-[20px] border border-line-strong bg-surface shadow-soft overflow-hidden', className)}>
      <div className="flex items-center gap-3 px-4 h-10 border-b border-line bg-surface-2/70" dir="ltr">
        <div className="flex gap-1.5" aria-hidden>
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex items-center gap-1.5 rounded-md bg-surface px-3 py-1 text-[11px] text-fg-subtle border border-line min-w-0 max-w-[60%]">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <span className="truncate">{url}</span>
        </div>
        <span className="w-12" aria-hidden />
      </div>
      {children}
    </div>
  );
}

export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('relative rounded-[2.4rem] bg-ink-900 p-2.5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/10', className)}>
      <div className="relative overflow-hidden rounded-[1.9rem] bg-surface">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 h-5 w-20 rounded-full bg-ink-900 z-10" aria-hidden />
        {children}
      </div>
    </div>
  );
}
