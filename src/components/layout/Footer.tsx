import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1976d2] to-[#9c27b0] flex items-center justify-center text-white font-bold text-lg">
                                B
                            </div>
                            <span className="font-bold text-xl text-white">BizApp365</span>
                        </Link>
                        <p className="text-sm text-slate-400 mb-6">
                            Complete Business Management Solution with Multi-tenant accounting, HR, production, and more.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link to="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                            <li><Link to="/demo" className="hover:text-white transition-colors">Book a Demo</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/tech" className="hover:text-white transition-colors">Tech Stack</Link></li>
                            <li><Link to="/documentation" className="hover:text-white transition-colors">Documentation</Link></li>
                            <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="mb-2">Support: support@bizapp365.com</li>
                            <li className="mb-2">Sales: sales@bizapp365.com</li>
                            <li className="mb-2">Phone: +971582885633</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col justify-center items-center text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} BizApp365. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
