import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, Moon, Search, Sun, X, ArrowUpRight, Globe, Smartphone, Printer } from 'lucide-react';
import { useLanguage, type Lang } from '../../i18n/LanguageContext';
import { useTheme } from '../../theme/ThemeContext';
import { Logo } from '../ds/Logo';
import { Button } from '../ds/Button';
import { MODULES, MODULE_GROUPS, CONTACT } from '../../data/modules';
import { ease } from '../../lib/motion';
import { cn } from '../../lib/cn';

export function LangToggle({ className = '' }: { className?: string }) {
  const { t, lang, setLang } = useLanguage();
  return (
    <div className={cn('inline-flex items-center rounded-full border border-line-strong p-0.5 text-xs font-semibold', className)} role="group" aria-label="Language">
      {([
        { code: 'en' as Lang, label: t('nav.langEn') },
        { code: 'ar' as Lang, label: t('nav.langAr') },
      ]).map(({ code, label }) => (
        <button
          key={code}
          type="button"
          lang={code}
          onClick={() => setLang(code)}
          className={cn(
            'px-2.5 py-1 rounded-full transition-colors',
            lang === code ? 'bg-fg text-bg' : 'text-fg-muted hover:text-fg',
          )}
          aria-pressed={lang === code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function ThemeToggle() {
  const { resolved, toggle } = useTheme();
  const { t } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('nav.toggleTheme')}
      className="grid place-items-center w-9 h-9 rounded-full text-fg-muted hover:text-fg hover:bg-surface-2 transition-colors"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={resolved}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {resolved === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

const platformIcons = [Globe, Smartphone, Printer];

function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  const { t, tm } = useLanguage();
  const modules = tm.features.modules;
  return (
    <div className="grid grid-cols-[1fr_280px] gap-0 w-[min(1040px,calc(100vw-48px))]">
      <div className="grid grid-cols-4 gap-6 p-7">
        {MODULE_GROUPS.map((g) => (
          <div key={g}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-subtle mb-3">{t(`nav.groups.${g}`)}</p>
            <ul className="space-y-1">
              {MODULES.map((m, i) =>
                m.group === g ? (
                  <li key={m.slug}>
                    <Link
                      to={`/features#${m.slug}`}
                      onClick={onNavigate}
                      className="group flex items-start gap-2.5 rounded-xl p-2 -mx-2 hover:bg-surface-2 transition-colors"
                    >
                      <span className={cn('mt-0.5 grid place-items-center w-7 h-7 shrink-0 rounded-lg bg-gradient-to-br text-white', m.tint)}>
                        <m.icon size={14} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-fg leading-tight">{modules[i].title}</span>
                        <span className="block text-xs text-fg-subtle leading-snug mt-0.5 line-clamp-2">{modules[i].description}</span>
                      </span>
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative overflow-hidden border-s border-line bg-surface-2/60 p-7 flex flex-col">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-subtle mb-3">{t('nav.platformsTitle')}</p>
        <ul className="space-y-3 mb-6">
          {tm.platforms.items.map((p, i) => {
            const Icon = platformIcons[i];
            return (
              <li key={p.title} className="flex items-center gap-3 text-sm">
                <span className="grid place-items-center w-8 h-8 rounded-lg bg-surface border border-line text-brand-600 dark:text-brand-400">
                  <Icon size={15} />
                </span>
                <span>
                  <span className="block font-semibold text-fg leading-tight">{p.title}</span>
                  <span className="block text-xs text-fg-subtle">{p.subtitle}</span>
                </span>
              </li>
            );
          })}
        </ul>
        <Link
          to="/features"
          onClick={onNavigate}
          className="mt-auto group rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 p-5 text-white shadow-lg"
        >
          <span className="flex items-center justify-between font-semibold">
            {t('nav.allModules')}
            <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" />
          </span>
          <span className="block text-xs text-white/75 mt-1">{t('nav.allModulesSub')}</span>
        </Link>
      </div>
    </div>
  );
}

export default function Navbar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const routeKey = location.pathname + location.hash;
  const [lastRoute, setLastRoute] = useState(routeKey);
  if (lastRoute !== routeKey) {
    setLastRoute(routeKey);
    setMobileOpen(false);
    setMegaOpen(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? 'hidden' : '';
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMegaOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [megaOpen]);

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 120);
  };

  const links = [
    { name: t('nav.pricing'), path: '/pricing' },
    { name: t('nav.integrations'), path: '/integrations' },
    { name: t('nav.tech'), path: '/tech' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-4 pt-3">
      <nav
        aria-label="Main"
        className={cn(
          'relative mx-auto max-w-7xl rounded-2xl transition-[background-color,box-shadow,border-color,padding] duration-500',
          scrolled || megaOpen || mobileOpen
            ? 'bg-surface/80 backdrop-blur-xl border border-line shadow-[0_8px_32px_-12px_rgba(11,16,32,0.18)] py-2'
            : 'bg-transparent border border-transparent py-3',
        )}
      >
        <div className="flex items-center justify-between gap-4 px-3 sm:px-4">
          <Link to="/" aria-label="BizApp365 home" className="shrink-0">
            <Logo />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
              <button
                type="button"
                aria-expanded={megaOpen}
                aria-haspopup="true"
                onClick={() => setMegaOpen((v) => !v)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                  megaOpen || location.pathname === '/features' ? 'text-fg bg-surface-2' : 'text-fg-muted hover:text-fg',
                )}
              >
                {t('nav.product')}
                <ChevronDown size={15} className={cn('transition-transform duration-300', megaOpen && 'rotate-180')} />
              </button>
            </div>
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                    isActive ? 'text-fg bg-surface-2' : 'text-fg-muted hover:text-fg',
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label={t('palette.open')}
              className="inline-flex items-center gap-2 h-9 rounded-full border border-line-strong ps-3 pe-1.5 text-xs text-fg-subtle hover:text-fg hover:border-brand-500/50 transition-colors"
            >
              <Search size={14} />
              {t('nav.search')}
              <kbd className="rounded-md bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-fg-muted" dir="ltr">
                {isMac ? '⌘K' : 'Ctrl K'}
              </kbd>
            </button>
            <ThemeToggle />
            <LangToggle />
            <a href={CONTACT.login} className="px-3 py-2 text-sm font-medium text-fg-muted hover:text-fg transition-colors">
              {t('nav.login')}
            </a>
            <Button to="/demo" size="md" className="h-10">
              {t('nav.bookDemo')}
            </Button>
          </div>

          <div className="flex lg:hidden items-center gap-1">
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label={t('palette.open')}
              className="grid place-items-center w-10 h-10 rounded-full text-fg-muted hover:text-fg"
            >
              <Search size={18} />
            </button>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              className="grid place-items-center w-10 h-10 rounded-full bg-fg text-bg"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.985 }}
              transition={{ duration: 0.25, ease: ease.out }}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              className="hidden lg:flex absolute inset-x-0 top-full justify-center pt-2"
            >
              <div className="rounded-3xl border border-line bg-surface shadow-soft overflow-hidden">
                <MegaMenu onNavigate={() => setMegaOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: ease.out }}
              className="lg:hidden overflow-hidden"
            >
              <div className="px-4 pt-4 pb-5 max-h-[calc(100dvh-96px)] overflow-y-auto" data-lenis-prevent>
                <ul className="space-y-1">
                  {[{ name: t('nav.features'), path: '/features' }, ...links].map((link, i) => (
                    <motion.li
                      key={link.path}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease: ease.out }}
                    >
                      <NavLink
                        to={link.path}
                        className={({ isActive }) =>
                          cn('block py-2.5 font-display text-3xl font-semibold tracking-tight', isActive ? 'text-brand-600 dark:text-brand-400' : 'text-fg')
                        }
                      >
                        {link.name}
                      </NavLink>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between">
                  <LangToggle />
                  <a href={CONTACT.login} className="text-sm font-semibold text-fg-muted">
                    {t('nav.login')}
                  </a>
                </div>
                <Button to="/demo" size="lg" full className="mt-5">
                  {t('nav.bookDemo')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
