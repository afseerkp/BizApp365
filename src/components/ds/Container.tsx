import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function Container({ children, className, size = 'xl' }: { children: ReactNode; className?: string; size?: 'md' | 'lg' | 'xl' }) {
  const max = size === 'md' ? 'max-w-4xl' : size === 'lg' ? 'max-w-6xl' : 'max-w-7xl';
  return <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', max, className)}>{children}</div>;
}
