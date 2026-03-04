import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Layout, Users, Lock, Smartphone } from 'lucide-react';

const HighlightCard = ({ title, description, icon, delay }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -10, rotateX: 10, rotateY: -10, scale: 1.05 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col items-center text-center transform-gpu perspective-1000"
            style={{ transformStyle: 'preserve-3d' }}
        >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center mb-6 shadow-inner transform translate-z-20">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 transform translate-z-10">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{description}</p>
        </motion.div>
    );
};

const Highlights = () => {
    const highlights = [
        {
            title: "Multi-Tenant Architecture",
            description: "True schema-per-company isolation ensuring complete data privacy and security across all your subsidiaries.",
            icon: <Layout className="w-10 h-10 text-[#1976d2]" />,
            delay: 0.1
        },
        {
            title: "Real-time Synchronization",
            description: "Instant updates across all modules. When a sale is made, inventory and accounts reflect it instantly.",
            icon: <Zap className="w-10 h-10 text-[#ff9800]" />,
            delay: 0.2
        },
        {
            title: "Bank-Grade Security",
            description: "End-to-end encryption, regular automated backups, and 99.99% uptime guarantee for peace of mind.",
            icon: <Shield className="w-10 h-10 text-[#2e7d32]" />,
            delay: 0.3
        },
        {
            title: "Role-Based Access Control",
            description: "Granular permission settings allowing you to restrict access down to specific forms or fields.",
            icon: <Lock className="w-10 h-10 text-[#d32f2f]" />,
            delay: 0.4
        },
        {
            title: "Unlimited Scalability",
            description: "Cloud-native infrastructure that grows with your business, handling millions of transactions flawlessly.",
            icon: <Users className="w-10 h-10 text-[#9c27b0]" />,
            delay: 0.5
        },
        {
            title: "Mobile Optimized",
            description: "Fully responsive design ensures you can manage your business from any device, anywhere in the world.",
            icon: <Smartphone className="w-10 h-10 text-[#0db7ed]" />,
            delay: 0.6
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
                        Why Choose <span className="text-[#1976d2]">BizApp365?</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-balance">
                        Discover the key architectural benefits that set our platform apart from legacy ERP solutions.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
                    {highlights.map((highlight, idx) => (
                        <HighlightCard key={idx} {...highlight} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Highlights;
