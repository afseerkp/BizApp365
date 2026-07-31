import { motion } from 'framer-motion';
import policy from '../content/privacyPolicy.json';

const articleClassName =
  'rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 md:p-12 shadow-xl text-slate-700 dark:text-slate-300 leading-relaxed space-y-6 [&_h2]:scroll-mt-28 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:pt-4 [&_h2]:border-t [&_h2]:border-slate-200 [&_h2]:dark:border-slate-700 [&_section:first-of-type_h2]:border-t-0 [&_section:first-of-type_h2]:pt-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-[#1976d2] [&_a]:hover:underline';

const Privacy = () => {
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
            Privacy <span className="text-[#9c27b0]">Policy</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Effective as of {policy.effectiveDate}
          </p>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          aria-label="Table of contents"
          className="mb-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-4">
            On this page
          </h2>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            {policy.sections.map((section) => (
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
          {policy.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}

          {policy.sections.map((section) => (
            <section key={section.id}>
              <h2 id={section.id}>{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul>
                  {section.bullets.map((item) => (
                    <li key={item.slice(0, 40)}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <p>
            If you have questions about this Privacy Policy, contact us at{' '}
            <a href={`mailto:${policy.contactEmail}`}>{policy.contactEmail}</a> or{' '}
            <a href={`mailto:${policy.supportEmail}`}>{policy.supportEmail}</a>.
          </p>
        </motion.article>
      </div>
    </div>
  );
};

export default Privacy;
