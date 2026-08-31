import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-slate-950 border-t border-slate-800 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1976d2] to-[#9c27b0] flex items-center justify-center text-white font-bold text-lg">
                                B
                            </div>
                            <span className="font-bold text-xl text-white tracking-tight">BizApp365</span>
                        </Link>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            {t('footer.tagline')}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4 tracking-tight">{t('footer.product')}</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/features" className="hover:text-white transition-colors">{t('footer.features')}</Link></li>
                            <li><Link to="/pricing" className="hover:text-white transition-colors">{t('footer.pricing')}</Link></li>
                            <li><Link to="/integrations" className="hover:text-white transition-colors">{t('footer.integrations')}</Link></li>
                            <li><Link to="/demo" className="hover:text-white transition-colors">{t('footer.demo')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4 tracking-tight">{t('footer.resources')}</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link to="/tech" className="hover:text-white transition-colors">{t('footer.tech')}</Link></li>
                            <li><Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
                            <li><Link to="/delete-account" className="hover:text-white transition-colors">{t('footer.deleteAccount')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4 tracking-tight">{t('footer.contact')}</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <a href="mailto:sales@bizapp365.com" className="hover:text-white transition-colors">
                                    sales@bizapp365.com
                                </a>
                            </li>
                            <li>
                                <a href="tel:+971582885633" className="hover:text-white transition-colors">
                                    +971 58 288 5633
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col justify-center items-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} BizApp365. {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
