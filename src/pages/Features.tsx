import { motion } from 'framer-motion';
import FeatureCard from '../components/ui/FeatureCard';
import { useLanguage } from '../i18n/LanguageContext';

const moduleImages = [
  '/features/masters-module.png',
  '/features/transaction-module.png',
  '/features/reports-module.png',
  '/features/crm-module.png',
  '/features/reports-module.png',
  '/features/integrations-hub.png',
  '/features/barcode-module.png',
  '/features/service-center-module.png',
  '/features/production-module.png',
  '/features/hr-payroll-module.png',
  '/features/van-sales-module.png',
  '/features/configuration-module.png',
];

const Features = () => {
  const { t, tm } = useLanguage();
  const editions = tm.features.editions;
  const modules = tm.features.modules;
  const regionalHighlights = tm.features.regional;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 pt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-[#9c27b0] dark:text-purple-400 font-medium text-sm mb-6 border border-purple-200 dark:border-purple-800">
            {t('features.badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            {t('features.titleBefore')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1976d2] to-[#9c27b0]">
              {t('features.titleHighlight')}
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-balance">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-16"
        >
          {regionalHighlights.map(({ label, detail }) => (
            <div
              key={label}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center"
            >
              <p className="font-bold text-sm text-slate-900 dark:text-white mb-1">{label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{detail}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <FeatureCard
              key={module.title}
              title={module.title}
              description={module.description}
              features={module.features}
              image={moduleImages[index]}
              edition={editions[module.editionKey as keyof typeof editions]}
              delay={0.05 * (index + 1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
