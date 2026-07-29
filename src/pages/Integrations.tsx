import { motion } from 'framer-motion';
import { MessageCircle, Mail, Cloud, Printer, Smartphone, FileCheck } from 'lucide-react';

const integrations = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    edition: 'Standard+',
    description: 'Send invoices, receipts, returns, and ledger statements via WhatsApp Cloud API or WhatsApp Web.',
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: Mail,
    title: 'Email Sharing',
    edition: 'Standard+',
    description: 'Share documents directly from transactions with party email addresses on file.',
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: FileCheck,
    title: 'UAE E-Invoice (Peppol)',
    edition: 'UAE',
    description: 'Submit e-invoices via Peppol/ASP access point with QR codes and retry support.',
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    icon: Cloud,
    title: 'Google Drive Backup',
    edition: 'All editions',
    description: 'Automated cloud backup with multi-schedule, timezone settings, and configurable keep count.',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
  {
    icon: Smartphone,
    title: 'Android VAN App',
    edition: 'Field client',
    description: 'Route sales, van stock load/unload, receipts, and outstanding balances — synced with the web ERP.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: Printer,
    title: 'Direct Print Extension',
    edition: 'Hardware',
    description: 'Silent printing for invoices and barcode labels on Windows — separate printer profiles, no dialog.',
    color: 'text-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
];

const Integrations = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Seamless <span className="text-[#9c27b0]">Integrations</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-balance">
            Connect BizApp365 with WhatsApp, email, Google Drive, UAE e-invoicing, the Android VAN app, and silent-print hardware.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 w-full mb-16"
      >
        <img
          src="/features/integrations-hub.png"
          alt="BizApp365 integrations hub"
          loading="lazy"
          className="w-full rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 object-cover"
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map(({ icon: Icon, title, edition, description, color, bg }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {edition}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Integrations;
