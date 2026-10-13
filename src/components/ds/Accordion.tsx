import { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { ease } from '../../lib/motion';

export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${base}-b${i}`;
        const panelId = `${base}-p${i}`;
        return (
          <div key={item.q}>
            <h3 className="!font-sans">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-start text-lg font-semibold text-fg hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                {item.q}
                <span
                  className={`grid place-items-center shrink-0 w-9 h-9 rounded-full border transition-[transform,background-color] duration-300 ${
                    isOpen ? 'rotate-45 bg-brand-600 border-brand-600 text-white' : 'border-line-strong'
                  }`}
                  aria-hidden
                >
                  <Plus size={16} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: ease.out }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 pe-14 text-fg-muted leading-relaxed">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
