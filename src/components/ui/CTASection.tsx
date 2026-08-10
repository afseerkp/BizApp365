import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';

const CTASection = () => {
    const { t } = useLanguage();

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1565c0] via-[#1976d2] to-[#7b1fa2]" />
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -start-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute bottom-[-10%] -end-[5%] w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)',
                        backgroundSize: '28px 28px',
                    }}
                />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        {t('cta.title')}
                    </h2>
                    <p className="text-xl text-blue-100/95 mb-10 max-w-2xl mx-auto text-balance">
                        {t('cta.subtitle')}
                    </p>

                    <div className="flex justify-center items-center">
                        <Link to="/contact">
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white text-[#1976d2] hover:bg-slate-50 px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center justify-center gap-2 shadow-xl shadow-black/15"
                            >
                                {t('cta.button')} <ArrowRight size={20} className="rtl:rotate-180" />
                            </motion.button>
                        </Link>
                    </div>

                    <p className="mt-8 text-sm text-blue-100/80">
                        {t('cta.note')}
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
