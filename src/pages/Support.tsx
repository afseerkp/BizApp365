import { motion } from 'framer-motion';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import contentEn from '../content/support.en.json';
import contentAr from '../content/support.ar.json';
import type { SupportContent } from '../content/legalTypes';
import { LegalSections } from '../components/legal/LegalSections';
import { legalArticleClassName } from '../components/legal/legalStyles';
import Seo from '../components/seo/Seo';
import { useLanguage } from '../i18n/LanguageContext';
import { renderRichText } from '../utils/richText';

const Support = () => {
  const { lang, t } = useLanguage();
  const content = (lang === 'ar' ? contentAr : contentEn) as SupportContent;

  const channels = [
    { icon: Mail, href: `mailto:${content.supportEmail}`, label: content.supportEmail, external: false },
    { icon: Phone, href: `tel:${content.supportPhone.replace(/\s/g, '')}`, label: content.supportPhone, external: false },
    { icon: MessageCircle, href: content.whatsapp, label: t('footer.whatsapp'), external: true },
  ];

  return (
    <div className="min-h-screen pt-36 sm:pt-44 pb-24">
      <Seo title="BizApp365 Support" description={content.metaDescription} canonical="https://bizapp365.com/support/" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold text-fg tracking-[-0.03em] mb-4">
            {t('legal.supportTitleBefore')}{' '}
            <span className="font-serif italic font-normal text-gradient pe-1">{t('legal.supportTitleHighlight')}</span>
          </h1>
          <p className="text-lg font-semibold text-fg">{content.application}</p>
          <p className="text-sm text-fg-subtle mt-1">
            {t('legal.serviceProvider').replace('{name}', content.serviceProvider)}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {channels.map((c) => (
              <a
                key={c.href}
                href={c.href}
                {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-semibold text-fg transition-colors hover:border-brand-500/50"
              >
                <c.icon size={16} className="text-brand-600 dark:text-brand-400" />
                <span dir="ltr">{c.label}</span>
              </a>
            ))}
          </div>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={legalArticleClassName}
        >
          {content.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 80)}>{renderRichText(paragraph)}</p>
          ))}

          <LegalSections sections={content.sections} />

          <p className="text-sm text-fg-subtle">{t('legal.lastUpdated').replace('{date}', content.lastUpdated)}</p>
        </motion.article>
      </div>
    </div>
  );
};

export default Support;
