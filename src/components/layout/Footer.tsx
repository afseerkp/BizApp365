import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Container } from '../ds/Container';
import { Logo } from '../ds/Logo';
import { LangToggle, ThemeToggle } from './Navbar';
import { CONTACT, MODULES } from '../../data/modules';

const Footer = () => {
  const { t, tm } = useLanguage();
  const linkCls = 'text-fg-muted hover:text-fg transition-colors';

  return (
    <footer className="relative overflow-hidden border-t border-line bg-surface">
      <Container className="pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link to="/" aria-label="BizApp365 home">
              <Logo />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-fg-muted">{t('footer.tagline')}</p>
            <p className="mt-8 font-display text-2xl font-semibold tracking-tight text-fg">{t('footer.ready')}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-2 text-sm text-fg hover:border-brand-500/60 transition-colors">
                <Mail size={14} /> {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phone}`} className="inline-flex items-center gap-2 rounded-full border border-line-strong px-3.5 py-2 text-sm text-fg hover:border-brand-500/60 transition-colors" dir="ltr">
                <Phone size={14} /> {CONTACT.phoneDisplay}
              </a>
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp/10 text-[#128c4a] dark:text-whatsapp px-3.5 py-2 text-sm font-medium">
                <MessageCircle size={14} /> {t('footer.whatsapp')}
              </a>
            </div>
          </div>

          <nav aria-label={t('footer.product')}>
            <h2 className="!font-sans text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle mb-5">{t('footer.product')}</h2>
            <ul className="space-y-3 text-sm">
              {MODULES.slice(0, 6).map((m, i) => (
                <li key={m.slug}>
                  <Link to={`/features#${m.slug}`} className={linkCls}>
                    {tm.features.modules[i].title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('footer.company')}>
            <h2 className="!font-sans text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle mb-5">{t('footer.company')}</h2>
            <ul className="space-y-3 text-sm">
              <li><Link to="/features" className={linkCls}>{t('footer.features')}</Link></li>
              <li><Link to="/pricing" className={linkCls}>{t('footer.pricing')}</Link></li>
              <li><Link to="/integrations" className={linkCls}>{t('footer.integrations')}</Link></li>
              <li><Link to="/tech" className={linkCls}>{t('nav.tech')}</Link></li>
              <li><Link to="/demo" className={linkCls}>{t('footer.demo')}</Link></li>
              <li><Link to="/contact" className={linkCls}>{t('nav.contact')}</Link></li>
            </ul>
          </nav>

          <nav aria-label={t('footer.resources')}>
            <h2 className="!font-sans text-xs font-semibold uppercase tracking-[0.14em] text-fg-subtle mb-5">{t('footer.resources')}</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={CONTACT.login} className={`${linkCls} inline-flex items-center gap-1`}>
                  {t('nav.login')} <ArrowUpRight size={13} className="rtl:-scale-x-100" />
                </a>
              </li>
              <li><Link to="/privacy" className={linkCls}>{t('footer.privacy')}</Link></li>
              <li><Link to="/terms" className={linkCls}>{t('footer.terms')}</Link></li>
              <li><Link to="/support" className={linkCls}>{t('footer.support')}</Link></li>
              <li><Link to="/delete-account" className={linkCls}>{t('footer.deleteAccount')}</Link></li>
            </ul>
          </nav>
        </div>
      </Container>

      {/* Oversized wordmark */}
      <div className="relative select-none pointer-events-none" aria-hidden dir="ltr">
        <p className="font-display font-bold leading-[0.8] tracking-[-0.06em] text-center text-[clamp(4.5rem,21vw,22rem)] bg-gradient-to-b from-fg/[0.09] to-transparent bg-clip-text text-transparent">
          BizApp365
        </p>
      </div>

      <Container className="pb-8">
        <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between border-t border-line pt-6 text-xs text-fg-subtle">
          <p>
            &copy; {new Date().getFullYear()} BizApp365. {t('footer.rights')} · {t('footer.regions')}
          </p>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LangToggle />
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
