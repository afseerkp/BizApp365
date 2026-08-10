import { motion } from 'framer-motion';
import { Shield, Zap, Layout, Lock, Globe2, Printer } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const icons = [
  <Layout className="w-8 h-8 text-[#1976d2]" key="layout" />,
  <Zap className="w-8 h-8 text-[#ff9800]" key="zap" />,
  <Globe2 className="w-8 h-8 text-[#2e7d32]" key="globe" />,
  <Lock className="w-8 h-8 text-[#d32f2f]" key="lock" />,
  <Shield className="w-8 h-8 text-[#9c27b0]" key="shield" />,
  <Printer className="w-8 h-8 text-[#0db7ed]" key="printer" />,
];

const HighlightCard = ({ title, description, icon, delay }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.45, delay }}
      className="group bg-white dark:bg-slate-800/80 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5 hover:border-[#1976d2]/25"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
};

const Highlights = () => {
  const { t, tm } = useLanguage();
  const items = tm.highlights.items;

  return (
    <div className="pt-24 pb-24 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold tracking-[0.16em] uppercase text-[#1976d2] mb-4">
            {t('highlights.eyebrow')}
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            {t('highlights.title')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-balance">
            {t('highlights.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, index) => (
            <HighlightCard
              key={item.title}
              title={item.title}
              description={item.description}
              icon={icons[index]}
              delay={0.05 * (index + 1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Highlights;
