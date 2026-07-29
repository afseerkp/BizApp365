import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const PricingCard = ({ title, price, description, features, isPopular, delay }: {
  title: string;
  price: string;
  description: string;
  features: { name: string; included: boolean }[];
  isPopular?: boolean;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10, rotateX: 5, rotateY: -5, scale: 1.02 }}
      className={`relative rounded-3xl p-8 bg-white dark:bg-slate-800 border ${
        isPopular ? 'border-[#1976d2] shadow-2xl shadow-blue-500/20' : 'border-slate-200 dark:border-slate-700 shadow-lg'
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
        {features.map((feature, idx) => (
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
        className={`w-full py-4 rounded-xl font-bold transition-all transform translate-z-20 ${
          isPopular
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
      title: 'Basic',
      price: '49',
      description: 'Core ERP for small businesses — accounting, sales, inventory, and labels.',
      isPopular: false,
      delay: 0.1,
      features: [
        { name: 'Accounting, sales & purchase invoices', included: true },
        { name: 'Barcode & label designer', included: true },
        { name: '80mm thermal & A4 print layouts', included: true },
        { name: 'Google Drive auto-backup', included: true },
        { name: 'VAT or GST tax mode', included: true },
        { name: 'Up to 3 users', included: true },
        { name: 'CRM, WhatsApp & MIS analytics', included: false },
        { name: 'Service Center, HR & Production', included: false },
      ],
    },
    {
      title: 'Standard',
      price: '99',
      description: 'Growing businesses — CRM, communications, MIS, and multi-godown inventory.',
      isPopular: true,
      delay: 0.2,
      features: [
        { name: 'Everything in Basic', included: true },
        { name: 'CRM (leads, pipeline, field visits, tickets)', included: true },
        { name: 'WhatsApp & email document sharing', included: true },
        { name: 'MIS reports & sales analytics dashboard', included: true },
        { name: 'Multi-godown inventory & stock transfer', included: true },
        { name: 'Stock aging & dead stock reports', included: true },
        { name: 'Up to 10 users', included: true },
        { name: 'Service Center, HR & Production', included: false },
      ],
    },
    {
      title: 'Enterprise',
      price: '199',
      description: 'Full platform — service center, HR/payroll, production, and unlimited scale.',
      isPopular: false,
      delay: 0.3,
      features: [
        { name: 'Everything in Standard', included: true },
        { name: 'Service Center (job cards, Kanban, technicians)', included: true },
        { name: 'HR & Payroll (UAE leave, loans, deductions)', included: true },
        { name: 'Production & BOM (assemble / disassemble)', included: true },
        { name: 'Unlimited users & transactions', included: true },
        { name: 'Advanced RBAC & multi-company architecture', included: true },
        { name: 'Android VAN sales app (field client)', included: true },
        { name: 'Silent print browser extension', included: true },
      ],
    },
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
            Basic, Standard, and Enterprise editions — plus a 30-day trial. ACT2 activation keys with user and transaction limits.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto perspective-1000">
          {plans.map((plan) => (
            <PricingCard key={plan.title} {...plan} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-slate-500 dark:text-slate-400 mt-10 max-w-2xl mx-auto"
        >
          All editions include local backup, Excel/XML import-export, document designers, and bilingual English/Arabic UI. Contact us for on-premise Docker deployment.
        </motion.p>
      </div>
    </div>
  );
};

export default Pricing;
