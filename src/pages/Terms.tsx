import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import termsEn from '../content/terms.en.json';
import termsAr from '../content/terms.ar.json';
import { useLanguage } from '../i18n/LanguageContext';

type TermsSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  paragraphsAfterBullets?: string[];
  bullets2?: string[];
  closingParagraphs?: string[];
  links?: { label: string; href: string }[];
  privacyLinkIn?: string;
};

const articleClassName =
  'rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 md:p-12 shadow-xl text-slate-700 dark:text-slate-300 leading-relaxed space-y-6 [&_h2]:scroll-mt-28 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:pt-4 [&_h2]:border-t [&_h2]:border-slate-200 [&_h2]:dark:border-slate-700 [&_h2:first-of-type]:border-t-0 [&_h2:first-of-type]:pt-0 [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-2 [&_a]:text-[#1976d2] [&_a]:hover:underline [&_strong]:text-slate-900 [&_strong]:dark:text-white';

function renderParagraph(text: string, privacyLabel: string, key: string) {
  if (text.includes(privacyLabel) && (text.includes('Privacy Policy') || text.includes('سياسة الخصوصية'))) {
    const parts = text.split(privacyLabel);
    return (
      <p key={key}>
        {parts[0]}
        <Link to="/privacy">{privacyLabel}</Link>
        {parts[1]}
      </p>
    );
  }

  const email = 'mail@afseer.com';
  if (text.includes(email)) {
    const parts = text.split(email);
    return (
      <p key={key}>
        {parts.map((part, index) => (
          <span key={`${key}-${index}`}>
            {part}
            {index < parts.length - 1 && <a href={`mailto:${email}`}>{email}</a>}
          </span>
        ))}
      </p>
    );
  }

  return <p key={key}>{text}</p>;
}

const Terms = () => {
  const { lang, t } = useLanguage();
  const terms = lang === 'ar' ? termsAr : termsEn;
  const sections = terms.sections as TermsSection[];
  const privacyLabel = terms.privacyPolicyLabel;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('legal.termsTitleBefore')}{' '}
            <span className="text-[#9c27b0]">{t('legal.termsTitleHighlight')}</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('legal.effectiveAsOf').replace('{date}', terms.effectiveDate)}
          </p>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          aria-label={t('legal.onThisPage')}
          className="mb-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
            {t('legal.onThisPage')}
          </h2>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-[#1976d2] hover:text-[#1565c0] dark:hover:text-[#42a5f5] transition-colors"
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
          className={articleClassName}
        >
          {terms.intro.map((paragraph, index) =>
            renderParagraph(paragraph, privacyLabel, `intro-${index}`),
          )}

          {sections.map((section) => (
            <section key={section.id}>
              <h2 id={section.id}>{section.title}</h2>

              {section.links && (
                <ul>
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {section.paragraphs?.map((paragraph, index) =>
                renderParagraph(paragraph, privacyLabel, `${section.id}-p-${index}`),
              )}

              {section.bullets && (
                <ul>
                  {section.bullets.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </ul>
              )}

              {section.paragraphsAfterBullets?.map((paragraph, index) =>
                renderParagraph(paragraph, privacyLabel, `${section.id}-pa-${index}`),
              )}

              {section.bullets2 && (
                <ul>
                  {section.bullets2.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </ul>
              )}

              {section.closingParagraphs?.map((paragraph, index) =>
                renderParagraph(paragraph, privacyLabel, `${section.id}-c-${index}`),
              )}
            </section>
          ))}
        </motion.article>
      </div>
    </div>
  );
};

export default Terms;
