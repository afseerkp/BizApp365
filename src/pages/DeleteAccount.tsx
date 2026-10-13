import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import contentEn from '../content/deleteAccount.en.json';
import contentAr from '../content/deleteAccount.ar.json';
import type { DeleteAccountContent } from '../content/legalTypes';
import { LegalSections } from '../components/legal/LegalSections';
import { legalArticleClassName } from '../components/legal/legalStyles';
import Seo from '../components/seo/Seo';
import { useLanguage } from '../i18n/LanguageContext';
import { renderRichText } from '../utils/richText';

const DeleteAccount = () => {
  const { lang, t } = useLanguage();
  const content = (lang === 'ar' ? contentAr : contentEn) as DeleteAccountContent;
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [details, setDetails] = useState('');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const body = [
      'Please delete my BizApp365 account and associated personal data.',
      '',
      `Account email: ${email.trim()}`,
      `Company / tenant: ${company.trim() || '(not provided)'}`,
      details.trim() ? `Additional details: ${details.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const href = `mailto:${content.contactEmail}?subject=${encodeURIComponent(content.form.mailtoSubject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  return (
    <div className="min-h-screen pt-36 sm:pt-44 pb-24">
      <Seo
        title="Delete BizApp365 Account"
        description={content.metaDescription}
        canonical="https://bizapp365.com/delete-account/"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold text-fg tracking-[-0.03em] mb-4">
            {t('legal.deleteTitleBefore')}{' '}
            <span className="font-serif italic font-normal text-gradient pe-1">{t('legal.deleteTitleHighlight')}</span>
          </h1>
          <p className="text-lg font-semibold text-fg">{content.application}</p>
          <p className="text-sm text-fg-subtle mt-1">
            {t('legal.serviceProvider').replace('{name}', content.serviceProvider)}
          </p>
          <p className="text-sm text-fg-subtle mt-3">
            {t('legal.lastUpdated').replace('{date}', content.lastUpdated)}
          </p>
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

          <section>
            <h2 id="request-form">{content.form.heading}</h2>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label htmlFor="delete-email" className="block text-sm font-medium text-fg-muted mb-2">
                  {content.form.emailLabel}
                </label>
                <input
                  id="delete-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-line bg-surface-2 text-fg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                />
              </div>
              <div>
                <label htmlFor="delete-company" className="block text-sm font-medium text-fg-muted mb-2">
                  {content.form.companyLabel}
                </label>
                <input
                  id="delete-company"
                  type="text"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-line bg-surface-2 text-fg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none"
                />
              </div>
              <div>
                <label htmlFor="delete-details" className="block text-sm font-medium text-fg-muted mb-2">
                  {content.form.detailsLabel}
                </label>
                <textarea
                  id="delete-details"
                  rows={4}
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-line bg-surface-2 text-fg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-brand-600/25"
              >
                {content.form.submit}
              </button>
            </form>
            <p className="text-sm text-fg-subtle mt-4">{renderRichText(content.form.note)}</p>
          </section>
        </motion.article>
      </div>
    </div>
  );
};

export default DeleteAccount;
