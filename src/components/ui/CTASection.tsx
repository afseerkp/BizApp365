import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-[#1976d2]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1976d2] to-[#9c27b0] opacity-90"></div>

            {/* Abstract circles background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-white opacity-10 blur-3xl"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        Ready to Transform Your Business?
                    </h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                        Join thousands of companies using BizApp365 to run their entire operations. Start your 30-day free trial today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/contact">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-[#1976d2] hover:bg-slate-50 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl"
                            >
                                Start Free Trial <ArrowRight size={20} />
                            </motion.button>
                        </Link>
                        <Link to="/demo">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                Watch Demo
                            </motion.button>
                        </Link>
                    </div>

                    <p className="mt-8 text-sm text-blue-200">
                        No credit card required. Cancel anytime.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
