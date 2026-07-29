import { motion } from 'framer-motion';
import FeatureCard from '../components/ui/FeatureCard';

const modules = [
  {
    title: 'Masters & Inventory',
    description: 'Foundational data for items, accounts, taxes, godowns, and wholesale operations.',
    features: [
      'Chart of accounts, tax masters (VAT / GST incl. CGST/SGST/IGST)',
      'Items with barcodes, part numbers, HSN/HS, serial/batch/warranty',
      'Multi-godown with ACL, routes & VAN salesmen',
      'Promotions engine, bill sundry & multi-currency charges',
    ],
    image: '/features/masters-module.png',
    edition: 'All editions',
    delay: 0.05,
  },
  {
    title: 'Sales & Purchase Cycle',
    description: 'End-to-end operational flow from quotation to settlement and returns.',
    features: [
      'Sales invoices, quotations, proforma & sales returns',
      'Purchase invoices, returns & stock transfer (Standard+)',
      'Payment, receipt & journal vouchers',
      'Barcode label print from transactions',
    ],
    image: '/features/transaction-module.png',
    edition: 'All editions',
    delay: 0.1,
  },
  {
    title: 'Accounting & Compliance',
    description: 'Statutory books, bank reconciliation, and regional tax filing built in.',
    features: [
      'Ledger, trial balance, P&L, balance sheet & day book',
      'UAE / Oman VAT filing & UAE e-invoice (Peppol/ASP)',
      'GST mode with HS/HSN codes',
      'Bank reconciliation with auto-match',
    ],
    image: '/features/reports-module.png',
    edition: 'All editions',
    delay: 0.15,
  },
  {
    title: 'CRM',
    description: 'Recently added — manage leads, pipeline, field visits, and support tickets.',
    features: [
      'Leads with scoring, qualification & conversion',
      'Opportunity pipeline (Kanban, stages, win prediction)',
      'Field visits with GPS check-in & activity tracking',
      'Support tickets with priority & SLA',
    ],
    image: '/features/crm-module.png',
    edition: 'Standard+',
    delay: 0.2,
  },
  {
    title: 'Analytics & MIS',
    description: 'Sales dashboards and management reports for data-driven decisions.',
    features: [
      'Sales report dashboard (item / party / group / date)',
      'MIS reports (bill / party / item)',
      'Bill sundry analysis',
      'Stock aging & dead stock reports',
    ],
    image: '/features/reports-module.png',
    edition: 'Standard+',
    delay: 0.25,
  },
  {
    title: 'Communications',
    description: 'Share documents and reach customers where they are.',
    features: [
      'WhatsApp send (invoices, receipts, returns, ledger)',
      'Cloud API or WhatsApp Web modes',
      'Email document sharing',
      'Party WhatsApp number on accounts',
    ],
    image: '/features/integrations-hub.png',
    edition: 'Standard+',
    delay: 0.3,
  },
  {
    title: 'Barcode & Label Designer',
    description: 'Recently expanded — design, bulk print, and reprint labels for retail and warehouse.',
    features: [
      'Drag-and-drop label designer',
      'Bulk printing with printer profiles (Zebra, TSC, Honeywell…)',
      'QR configs (item / URL / JSON)',
      '80mm thermal & A4 layouts, print history & reprint',
    ],
    image: '/features/barcode-module.png',
    edition: 'Basic+',
    delay: 0.35,
  },
  {
    title: 'Service Center',
    description: 'Recently added — full job card workflow from intake to service invoice.',
    features: [
      'Job cards: intake → diagnosis → quotation → tasks → sale',
      'Kanban board by status with role-based access',
      'Technician tasks, parts usage & quotation approval trail',
      'Service invoice PDF (A4/A5)',
    ],
    image: '/features/service-center-module.png',
    edition: 'Enterprise',
    delay: 0.4,
  },
  {
    title: 'Production',
    description: 'Manufacturing from raw materials to finished goods with BOM tracking.',
    features: [
      'Bill of Materials (BOM) management',
      'Production / assemble transactions',
      'Unassemble / disassemble',
      'Material consumption tracking',
    ],
    image: '/features/production-module.png',
    edition: 'Enterprise',
    delay: 0.45,
  },
  {
    title: 'HR & Payroll',
    description: 'Employee lifecycle and payroll tailored for regional compliance.',
    features: [
      'Employee records & monthly payroll',
      'Leave requests with UAE-oriented leave config',
      'Advance salary & loans (auto payroll deduction)',
      'Custom allowances & deductions',
    ],
    image: '/features/hr-payroll-module.png',
    edition: 'Enterprise',
    delay: 0.5,
  },
  {
    title: 'Android VAN Sales App',
    description: 'Recently built field client for route sales, collections, and van stock management.',
    features: [
      'Server setup via QR / deep link (bizapp365://config)',
      'New sale, returns, receipts & PDF print',
      'Van stock load/unload & route customers',
      'Outstanding balances, ledger & day reports',
    ],
    image: '/features/van-sales-module.png',
    edition: 'Field client',
    delay: 0.55,
  },
  {
    title: 'Configuration & System',
    description: 'Multi-tenant setup, document designers, backups, and admin controls.',
    features: [
      'Multi-company login, RBAC & edition-gated modules',
      'Invoice Designer v2, 80mm thermal & dot-matrix layouts',
      'Google Drive auto-backup (multi-schedule, timezone)',
      'Excel/XML import-export & local backup/restore',
    ],
    image: '/features/configuration-module.png',
    edition: 'All editions',
    delay: 0.6,
  },
];

const regionalHighlights = [
  { label: 'UAE / Oman VAT', detail: 'Filing reports & UAE VAT 201 boxes' },
  { label: 'UAE E-Invoice', detail: 'Peppol/ASP submit, QR & retry' },
  { label: 'GST India', detail: 'CGST/SGST/IGST tax mode' },
  { label: 'Arabic UI', detail: 'Bilingual English/Arabic with RTL' },
  { label: '80mm Thermal', detail: 'Receipt & label print layouts' },
  { label: 'Godown / VAN', detail: 'Multi-warehouse wholesale & route sales' },
];

const Features = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 pt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-[#9c27b0] dark:text-purple-400 font-medium text-sm mb-6 border border-purple-200 dark:border-purple-800">
            Basic · Standard · Enterprise
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Everything You Need to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1976d2] to-[#9c27b0]">Scale</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-balance">
            Explore the modules that make BizApp365 a complete ERP for SMEs — from core accounting to CRM, service center, field sales, and silent printing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-16"
        >
          {regionalHighlights.map(({ label, detail }) => (
            <div
              key={label}
              className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center"
            >
              <p className="font-bold text-sm text-slate-900 dark:text-white mb-1">{label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{detail}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            <FeatureCard
              key={module.title}
              title={module.title}
              description={module.description}
              features={module.features}
              image={module.image}
              edition={module.edition}
              delay={module.delay}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
