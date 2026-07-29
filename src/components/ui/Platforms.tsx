import { motion } from 'framer-motion';
import { Globe, Smartphone, Printer } from 'lucide-react';

const platforms = [
  {
    icon: Globe,
    title: 'Web ERP',
    subtitle: 'Full platform',
    description:
      'Complete multi-tenant ERP in the browser — accounting, inventory, CRM, service center, HR, production, reports, and configuration.',
    highlights: ['Multi-company login', 'Customizable dashboard', 'Arabic / English RTL', 'Docker + HTTPS deploy'],
    color: 'from-[#1976d2] to-[#1565c0]',
    delay: 0.1,
  },
  {
    icon: Smartphone,
    title: 'Android VAN Sales',
    subtitle: 'Field client',
    description:
      'Purpose-built for route sales and wholesale delivery — sell, collect, load/unload van stock, and check outstanding balances on the road.',
    highlights: ['QR server setup', 'New sale & returns', 'Van stock load/unload', 'GPS customer creation'],
    color: 'from-[#2e7d32] to-[#1b5e20]',
    delay: 0.2,
  },
  {
    icon: Printer,
    title: 'Direct Print Extension',
    subtitle: 'Silent printing',
    description:
      'Browser extension for Windows that prints invoices and barcode labels silently — no print dialog, separate printer profiles per document type.',
    highlights: ['Silent invoice print', 'Dedicated label printer', 'Windows native host', 'Zebra / TSC / thermal'],
    color: 'from-[#9c27b0] to-[#7b1fa2]',
    delay: 0.3,
  },
];

const Platforms = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm mb-6 border border-slate-200 dark:border-slate-700">
            Three ways to work
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Web · Android · Extension
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-balance">
            Run your back office on the web, sell in the field with the VAN app, and print silently at the counter with the browser extension.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {platforms.map(({ icon: Icon, title, subtitle, description, highlights, color, delay }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay }}
              className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 flex flex-col"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 shadow-lg`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{subtitle}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6 flex-1">{description}</p>
              <ul className="space-y-2">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1976d2] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Platforms;
