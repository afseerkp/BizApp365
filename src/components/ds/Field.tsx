import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn';

const control =
  'w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-fg placeholder:text-fg-subtle/70 outline-none transition-[border-color,box-shadow] focus:border-brand-500 focus:shadow-[0_0_0_4px_var(--glow)]';

type Base = { label: string; error?: string; className?: string };

function Wrap({ id, label, error, className, children }: Base & { id: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-fg">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-xs font-medium text-rose-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({ label, error, className, ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Wrap id={id} label={label} error={error} className={className}>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={cn(control, error ? 'border-rose-500' : 'border-line-strong')} {...rest} />
    </Wrap>
  );
}

export function TextArea({ label, error, className, ...rest }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Wrap id={id} label={label} error={error} className={className}>
      <textarea id={id} aria-invalid={!!error} className={cn(control, 'resize-none', error ? 'border-rose-500' : 'border-line-strong')} {...rest} />
    </Wrap>
  );
}

export function SelectField({ label, error, className, children, ...rest }: Base & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  const id = useId();
  return (
    <Wrap id={id} label={label} error={error} className={className}>
      <div className="relative">
        <select id={id} className={cn(control, 'appearance-none pe-10 border-line-strong')} {...rest}>
          {children}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-fg-subtle" aria-hidden />
      </div>
    </Wrap>
  );
}

export function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
        selected ? 'border-brand-600 bg-brand-600 text-white' : 'border-line-strong text-fg-muted hover:text-fg hover:border-brand-500/50',
      )}
    >
      {children}
    </button>
  );
}

