import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const PricingCard = ({ title, price, description, features, isPopular, delay, popularLabel, perMonth, cta }: {
  title: string;
  price: string;
  description: string;
  features: { name: string; included: boolean }[];
  isPopular?: boolean;
  delay: number;
  popularLabel: string;
  perMonth: string;
  cta: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className={`relative rounded-3xl p-8 bg-white dark:bg-slate-800 border ${
        isPopular ? 'border-[#1976d2] shadow-2xl shadow-blue-500/20' : 'border-slate-200 dark:border-slate-700 shadow-lg'
      } flex flex-col h-full`}
    >
      {isPopular && (
        <div className="absolute -top-4 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 bg-gradient-to-r from-[#1976d2] to-[#9c27b0] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
          {popularLabel}
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 h-10">{description}</p>
        <div className="flex items-end justify-center gap-1">
          <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${price}</span>
          <span className="text-slate-500 dark:text-slate-400 mb-1">{perMonth}</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feature) => (
          <li key={feature.name} className="flex items-start gap-3">
            {feature.included ? (
              <Check className="w-5 h-5 text-[#2e7d32] shrink-0 mt-0.5" />
            ) : (
              <X className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" />
            )}
            <span className={`text-sm ${feature.included ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
              {feature.name}
            </span>
          </li>
        ))}
      </ul>

      <motion.button
        whileTap={{ scale: 0.95 }}
        className={`w-full py-4 rounded-xl font-bold transition-all ${
          isPopular
            ? 'bg-[#1976d2] hover:bg-[#1565c0] text-white shadow-lg shadow-blue-500/30'
            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white'
        }`}
      >
        {cta}
      </motion.button>
    </motion.div>
  );
};

const Pricing = () => {
  const { t, tm } = useLanguage();
  const plans = tm.pricing.plans;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('pricing.titleBefore')} <span className="text-[#1976d2]">{t('pricing.titleHighlight')}</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-balance">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard
              key={plan.title}
              title={plan.title}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              isPopular={index === 1}
              delay={0.1 * (index + 1)}
              popularLabel={t('pricing.popular')}
              perMonth={t('pricing.perMonth')}
              cta={t('pricing.cta')}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-slate-500 dark:text-slate-400 mt-10 max-w-2xl mx-auto"
        >
          {t('pricing.footnote')}
        </motion.p>
      </div>
    </div>
  );
};

export default Pricing;
