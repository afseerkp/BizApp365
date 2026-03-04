import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from '../components/ui/FeatureCard';
import HierarchicalTree from '../components/canvas/HierarchicalTree';
import CircularFlow from '../components/canvas/CircularFlow';
import FactoryScene from '../components/canvas/FactoryScene';
import OfficeScene from '../components/canvas/OfficeScene';
import ChartsScene from '../components/canvas/ChartsScene';
import GearsScene from '../components/canvas/GearsScene';

const Features = () => {
    const modules = [
        {
            title: "Masters Module",
            description: "Comprehensive management of foundational data including multi-level hierarchies.",
            features: [
                "Account Groups (parent-child relationships)",
                "Conditional Accounts setup",
                "Units of Measurement conversions",
                "Material Center (Godowns & Warehouses)"
            ],
            canvas: <HierarchicalTree />,
            delay: 0.1
        },
        {
            title: "Transaction Module",
            description: "End-to-end operational flow handling quotes, invoices, and automated receipts.",
            features: [
                "Sales & Purchase Invoices",
                "UAE E-Invoice Integration (Peppol)",
                "WhatsApp Invoice Delivery",
                "Payment & Receipt Vouchers"
            ],
            canvas: <CircularFlow />,
            delay: 0.2
        },
        {
            title: "Production Module",
            description: "Advanced manufacturing tracking from raw materials to finished goods.",
            features: [
                "Bill of Materials (BOM) management",
                "Material consumption tracking",
                "Finished goods production",
                "Unassemble Transactions"
            ],
            canvas: <FactoryScene />,
            delay: 0.3
        },
        {
            title: "HR & Payroll Module",
            description: "Complete employee lifecycle and complex payroll management tailored for compliance.",
            features: [
                "Employee Records Management",
                "Monthly Payroll Processing",
                "Leave Management (UAE-compliant)",
                "Custom Allowances & Deductions"
            ],
            canvas: <OfficeScene />,
            delay: 0.4
        },
        {
            title: "Reports & Analytics Module",
            description: "Real-time insights and statutory reports for data-driven decision making.",
            features: [
                "Balance Sheet & Trial Balance",
                "UAE VAT Filing (Output, Input, Net)",
                "Stock Summary & Movement",
                "MIS Reports (Party/Item-wise)"
            ],
            canvas: <ChartsScene />,
            delay: 0.5
        },
        {
            title: "Configuration & System",
            description: "Robust administrative controls and multi-tenant isolated architectures.",
            features: [
                "Multi-tenant Company Isolation",
                "Voucher Template Configuration",
                "Role-Based Permission Matrix",
                "Automated Backup & Excel Import"
            ],
            canvas: <GearsScene />,
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
                    className="text-center mb-16 pt-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-[#9c27b0] dark:text-purple-400 font-medium text-sm mb-6 border border-purple-200 dark:border-purple-800">
                        Enterprise Grade Modules
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
                        Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1976d2] to-[#9c27b0]">Scale</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-balance">
                        Explore the powerful modules that make BizApp365 the ultimate complete accounting and management solution for your business. Interactive 3D visualizers below showcase the exact functional flow.
                    </p>
                </motion.div>

                {/* 3D Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modules.map((module, index) => (
                        <FeatureCard
                            key={index}
                            title={module.title}
                            description={module.description}
                            features={module.features}
                            canvasContent={module.canvas}
                            delay={module.delay}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Features;
