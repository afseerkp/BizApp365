import { useRef, type ReactNode, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useSpring } from 'framer-motion';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light';
type Size = 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white shadow-[0_8px_24px_-8px_rgba(25,118,210,0.65),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-brand-700',
  secondary: 'bg-surface text-fg border border-line-strong hover:border-brand-500/60 shadow-sm',
  ghost: 'text-fg hover:bg-surface-2',
  light: 'bg-white text-ink-900 hover:bg-brand-50 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)]',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-14 px-7 text-[15px]',
};

type Props = {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  external?: boolean;
  disabled?: boolean;
  full?: boolean;
};

/** Button / link with an optional magnetic pull toward the cursor (pointer devices, motion-safe). */
export function Button({ children, to, href, variant = 'primary', size = 'md', magnetic, className, onClick, type = 'button', external, disabled, full }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 18 });
  const y = useSpring(0, { stiffness: 220, damping: 18 });

  const onMove = (e: MouseEvent) => {
    if (!magnetic || reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.32);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cls = cn(
    'relative inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,border-color,box-shadow,color] duration-300 select-none whitespace-nowrap disabled:opacity-60 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    full && 'w-full',
    className,
  );

  return (
    <motion.span ref={ref} style={{ x, y }} onMouseMove={onMove} onMouseLeave={onLeave} className={cn('group', full ? 'flex w-full' : 'inline-flex')}>
      {to ? (
        <Link to={to} className={cls} onClick={onClick}>
          {children}
        </Link>
      ) : href ? (
        <a href={href} className={cls} onClick={onClick} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {children}
        </a>
      ) : (
        <button type={type} className={cls} onClick={onClick} disabled={disabled}>
          {children}
        </button>
      )}
    </motion.span>
  );
}
