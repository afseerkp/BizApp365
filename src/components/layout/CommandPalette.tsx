import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CornerDownLeft, FileText, Search } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { MODULES } from '../../data/modules';
import { ease } from '../../lib/motion';
import { cn } from '../../lib/cn';

type Item = { id: string; label: string; hint: string; to: string; group: 'pages' | 'modules'; icon: React.ComponentType<{ size?: number }> };

function PaletteDialog({ onClose }: { onClose: () => void }) {
  const { t, tm } = useLanguage();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const items = useMemo<Item[]>(() => {
    const pages: Item[] = [
      { id: 'home', label: t('nav.home'), hint: '/', to: '/', group: 'pages', icon: FileText },
      { id: 'features', label: t('nav.features'), hint: '/features', to: '/features', group: 'pages', icon: FileText },
      { id: 'pricing', label: t('nav.pricing'), hint: '/pricing', to: '/pricing', group: 'pages', icon: FileText },
      { id: 'integrations', label: t('nav.integrations'), hint: '/integrations', to: '/integrations', group: 'pages', icon: FileText },
      { id: 'tech', label: t('nav.tech'), hint: '/tech', to: '/tech', group: 'pages', icon: FileText },
      { id: 'demo', label: t('nav.bookDemo'), hint: '/demo', to: '/demo', group: 'pages', icon: FileText },
      { id: 'contact', label: t('nav.contact'), hint: '/contact', to: '/contact', group: 'pages', icon: FileText },
    ];
    const modules: Item[] = MODULES.map((m, i) => ({
      id: m.slug,
      label: tm.features.modules[i].title,
      hint: tm.features.modules[i].description + ' ' + tm.features.modules[i].features.join(' '),
      to: `/features#${m.slug}`,
      group: 'modules',
      icon: m.icon,
    }));
    return [...pages, ...modules];
  }, [t, tm]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((it) => (it.label + ' ' + it.hint).toLowerCase().includes(term));
  }, [items, q]);

  useEffect(() => {
    const restore = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => restore?.focus?.();
  }, []);

  const go = (item?: Item) => {
    if (!item) return;
    onClose();
    navigate(item.to);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab') {
      // keep focus inside the dialog
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    dialogRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const groups: Array<'pages' | 'modules'> = ['pages', 'modules'];

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('palette.open')}
        onKeyDown={onKeyDown}
        initial={{ opacity: 0, y: -12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.25, ease: ease.out }}
        className="relative w-full max-w-xl rounded-2xl border border-line bg-surface shadow-soft overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 border-b border-line">
          <Search size={18} className="text-fg-subtle shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            placeholder={t('palette.placeholder')}
            className="h-14 w-full bg-transparent text-base text-fg placeholder:text-fg-subtle outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={results[active] ? `pal-${results[active].id}` : undefined}
          />
          <kbd className="hidden sm:block rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle">ESC</kbd>
        </div>
        <div id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
          {results.length === 0 && <p className="px-3 py-10 text-center text-sm text-fg-subtle">{t('palette.empty')}</p>}
          {groups.map((g) => {
            const list = results.filter((r) => r.group === g);
            if (!list.length) return null;
            return (
              <div key={g} className="mb-1">
                <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">{t(`palette.${g}`)}</p>
                {list.map((item) => {
                  const i = results.indexOf(item);
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      id={`pal-${item.id}`}
                      data-idx={i}
                      role="option"
                      aria-selected={active === i}
                      type="button"
                      onMouseMove={() => setActive(i)}
                      onClick={() => go(item)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition-colors',
                        active === i ? 'bg-brand-600 text-white' : 'text-fg',
                      )}
                    >
                      <Icon size={16} />
                      <span className="flex-1 font-medium truncate">{item.label}</span>
                      {active === i ? <CornerDownLeft size={14} /> : <ArrowRight size={14} className="opacity-30 rtl:rotate-180" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 border-t border-line px-4 py-2.5 text-[11px] text-fg-subtle">
          <kbd className="rounded border border-line px-1 font-mono">↑</kbd>
          <kbd className="rounded border border-line px-1 font-mono">↓</kbd>
          {t('palette.hint')}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <AnimatePresence>{open && <PaletteDialog onClose={onClose} />}</AnimatePresence>;
}
