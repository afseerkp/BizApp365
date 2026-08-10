import { motion } from 'framer-motion';
import { Globe, Smartphone, Printer } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

const icons = [Globe, Smartphone, Printer];
const colors = [
  'from-[#1976d2] to-[#1565c0]',
  'from-[#2e7d32] to-[#1b5e20]',
  'from-[#9c27b0] to-[#7b1fa2]',
];

const Platforms = () => {
  const { t, tm } = useLanguage();
  const items = tm.platforms.items;

  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold tracking-[0.16em] uppercase text-[#1976d2] mb-4">
            {t('platforms.eyebrow')}
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('platforms.title')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-balance">
            {t('platforms.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                className="group relative bg-slate-50/80 dark:bg-slate-800/60 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-700/80 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-[#1976d2]/30 hover:shadow-xl hover:shadow-blue-500/5"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[index]} flex items-center justify-center mb-6 shadow-lg shadow-slate-900/10 transition-transform duration-300 group-hover:scale-105`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{item.subtitle}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6 flex-1 leading-relaxed">{item.description}</p>
                <ul className="space-y-2.5">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1976d2] shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Platforms;
