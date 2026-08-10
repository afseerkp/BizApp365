import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, type Lang } from '../../i18n/LanguageContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { t, lang, setLang } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 8);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { name: t('nav.home'), path: '/' },
        { name: t('nav.features'), path: '/features' },
        { name: t('nav.tech'), path: '/tech' },
        { name: t('nav.pricing'), path: '/pricing' },
        { name: t('nav.contact'), path: '/contact' },
    ];

    const LangToggle = ({ className = '' }: { className?: string }) => (
        <div className={`inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs font-semibold ${className}`}>
            {([
                { code: 'en' as Lang, label: t('nav.langEn') },
                { code: 'ar' as Lang, label: t('nav.langAr') },
            ]).map(({ code, label }) => (
                <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    className={`px-2.5 py-1.5 rounded-md transition-colors ${
                        lang === code
                            ? 'bg-[#1976d2] text-white'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    aria-pressed={lang === code}
                >
                    {label}
                </button>
            ))}
        </div>
    );

    return (
        <nav
            className={`fixed top-0 inset-x-0 z-50 bg-white dark:bg-slate-900 transition-[padding,box-shadow] duration-300 ${
                isScrolled || mobileMenuOpen
                    ? 'py-3 shadow-sm border-b border-slate-200 dark:border-slate-800'
                    : 'py-5 border-b border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1976d2] to-[#9c27b0] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                            B
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                            BizApp365
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors hover:text-[#1976d2] hover:bg-slate-100 dark:hover:bg-slate-800 ${
                                        location.pathname === link.path
                                            ? 'text-[#1976d2] bg-blue-50 dark:bg-slate-800'
                                            : 'text-slate-600 dark:text-slate-300'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <LangToggle />
                        <a
                            href="https://login.bizapp365.com"
                            className="bg-[#1976d2] hover:bg-[#1565c0] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:-translate-y-0.5"
                        >
                            {t('nav.login')}
                        </a>
                    </div>

                    <div className="md:hidden flex items-center gap-3">
                        <LangToggle />
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-slate-600 dark:text-slate-300 hover:text-[#1976d2]"
                            aria-label={mobileMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block text-base font-medium text-slate-600 dark:text-slate-300 hover:text-[#1976d2]"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-4">
                                <a
                                    href="https://login.bizapp365.com"
                                    className="block text-center w-full py-2.5 bg-[#1976d2] text-white font-medium rounded-lg"
                                >
                                    {t('nav.login')}
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
