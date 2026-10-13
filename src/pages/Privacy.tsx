import { motion } from 'framer-motion';
import policyEn from '../content/privacyPolicy.en.json';
import policyAr from '../content/privacyPolicy.ar.json';
import type { PrivacyPolicyContent } from '../content/legalTypes';
import { LegalSections } from '../components/legal/LegalSections';
import { legalArticleClassName } from '../components/legal/legalStyles';
import Seo from '../components/seo/Seo';
import { useLanguage } from '../i18n/LanguageContext';
import { renderRichText } from '../utils/richText';

const Privacy = () => {
  const { lang, t } = useLanguage();
  const policy = (lang === 'ar' ? policyAr : policyEn) as PrivacyPolicyContent;

  return (
    <div className="min-h-screen pt-36 sm:pt-44 pb-24">
      <Seo
        title="BizApp365 Privacy Policy"
        description={policy.metaDescription}
        canonical="https://bizapp365.com/privacy/"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold text-fg tracking-[-0.03em] mb-4">
            {t('legal.privacyTitleBefore')}{' '}
            <span className="font-serif italic font-normal text-gradient pe-1">{t('legal.privacyTitleHighlight')}</span>
          </h1>
          <p className="text-lg font-semibold text-fg">{policy.application}</p>
          <p className="text-sm text-fg-subtle mt-1">
            {t('legal.serviceProvider').replace('{name}', policy.serviceProvider)}
          </p>
          <p className="text-sm text-fg-subtle mt-3">
            {t('legal.effectiveDate').replace('{date}', policy.effectiveDate)}
          </p>
          <p className="text-sm text-fg-subtle">
            {t('legal.lastUpdated').replace('{date}', policy.lastUpdated)}
          </p>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          aria-label={t('legal.onThisPage')}
          className="mb-10 rounded-2xl border border-line bg-surface p-6 shadow-sm"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-fg-subtle mb-4">
            {t('legal.onThisPage')}
          </h2>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            {policy.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-brand-600 dark:text-brand-400 hover:text-[#1565c0] dark:hover:text-[#42a5f5] transition-colors"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={legalArticleClassName}
        >
          {policy.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 80)}>{renderRichText(paragraph)}</p>
          ))}

          <LegalSections sections={policy.sections} />
        </motion.article>
      </div>
    </div>
  );
};

export default Privacy;
