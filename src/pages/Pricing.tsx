import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const PricingCard = ({ title, price, description, features, isPopular, delay }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -10, rotateX: 5, rotateY: -5, scale: 1.02 }}
            className={`relative rounded-3xl p-8 bg-white dark:bg-slate-800 border ${isPopular ? 'border-[#1976d2] shadow-2xl shadow-blue-500/20' : 'border-slate-200 dark:border-slate-700 shadow-lg'
                } flex flex-col h-full transform-gpu perspective-1000`}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1976d2] to-[#9c27b0] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md transform translate-z-10">
                    Most Popular
                </div>
            )}

            <div className="text-center mb-8 transform translate-z-10">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 h-10">{description}</p>
                <div className="flex items-end justify-center gap-1">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${price}</span>
                    <span className="text-slate-500 dark:text-slate-400 mb-1">/mo</span>
                </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1 transform translate-z-5">
                {features.map((feature: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
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
                className={`w-full py-4 rounded-xl font-bold transition-all transform translate-z-20 ${isPopular
                        ? 'bg-[#1976d2] hover:bg-[#1565c0] text-white shadow-lg shadow-blue-500/30'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white'
                    }`}
            >
                Start 30-Day Free Trial
            </motion.button>
        </motion.div>
    );
};

const Pricing = () => {
    const plans = [
        {
            title: "Basic License",
            price: "49",
            description: "Essential features for small businesses starting out.",
            isPopular: false,
            delay: 0.1,
            features: [
                { name: "Accounting & General Ledger", included: true },
                { name: "Sales & Purchase Invoices", included: true },
                { name: "Basic Inventory (1 Location)", included: true },
                { name: "Up to 3 Users", included: true },
                { name: "Email Support", included: true },
                { name: "Production & BOM", included: false },
                { name: "UAE E-Invoice / Peppol", included: false },
                { name: "HR & Payroll", included: false },
            ]
        },
        {
            title: "Standard License",
            price: "99",
            description: "Advanced features for growing businesses with multiple locations.",
            isPopular: true,
            delay: 0.2,
            features: [
                { name: "Everything in Basic", included: true },
                { name: "Multi-Location Inventory", included: true },
                { name: "Production & BOM tracking", included: true },
                { name: "Up to 10 Users", included: true },
                { name: "WhatsApp & E-Invoice Integration", included: true },
                { name: "Priority Support", included: true },
                { name: "HR & Payroll Module", included: true },
                { name: "Multi-Company Architecture", included: false },
            ]
        },
        {
            title: "Enterprise License",
            price: "199",
            description: "Full features, unlimited users & transactions for large enterprises.",
            isPopular: false,
            delay: 0.3,
            features: [
                { name: "Everything in Standard", included: true },
                { name: "Unlimited Users", included: true },
                { name: "Multi-Company Architecture", included: true },
                { name: "Advanced Role & Permission Matrix", included: true },
                { name: "Custom API Integrations", included: true },
                { name: "Dedicated Account Manager", included: true },
                { name: "On-Premise Deployment Option", included: true },
                { name: "Custom Report Builder", included: true },
            ]
        }
    ];

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
                        Transparent <span className="text-[#1976d2]">Pricing</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-balance">
                        Choose the perfect plan for your business needs. All plans include a 30-day free trial with no credit card required.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto perspective-1000">
                    {plans.map((plan, idx) => (
                        <PricingCard key={idx} {...plan} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pricing;
