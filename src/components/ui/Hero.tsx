import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroDashboard from '../../assets/hero-dashboard.png';
import { useLanguage } from '../../i18n/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(165deg,#eef5fc_0%,#f8fafc_42%,#f3eef8_100%)] dark:bg-[linear-gradient(165deg,#0f172a_0%,#111827_50%,#1a1030_100%)]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,rgba(25,118,210,0.14),transparent_55%)]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(156,39,176,0.1),transparent_50%)]" />
      <div
        className="absolute inset-0 z-0 opacity-[0.35] dark:opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 75%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-[46%] flex flex-col items-center lg:items-start text-center lg:text-start"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-sm font-semibold tracking-[0.18em] uppercase text-[#1976d2] mb-5"
          >
            {t('hero.brand')}
          </motion.p>

          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-6">
            {t('hero.titleBefore')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1976d2] to-[#9c27b0]">
              {t('hero.titleHighlight')}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-xl text-balance mb-9 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          >
            <a
              href="https://login.bizapp365.com"
              className="inline-flex items-center justify-center gap-2 bg-[#1976d2] hover:bg-[#1565c0] text-white px-7 py-3.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-0.5"
            >
              {t('hero.login')} <ArrowRight size={18} className="rtl:rotate-180" />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:border-[#1976d2]/50 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
            >
              {t('hero.contactSales')}
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-[54%] relative"
        >
          <div className="absolute -inset-6 bg-gradient-to-tr from-[#1976d2]/25 via-transparent to-[#9c27b0]/25 rounded-[2rem] blur-3xl" />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#1976d2]/40 via-transparent to-[#9c27b0]/40 opacity-70" />
            <img
              src={heroDashboard}
              alt={t('hero.imageAlt')}
              className="relative w-full rounded-2xl shadow-2xl shadow-slate-900/10 border border-white/60 dark:border-slate-700/60"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
