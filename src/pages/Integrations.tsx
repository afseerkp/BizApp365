import { motion } from 'framer-motion';

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
            Connect BizApp365 with the tools you already use. Send notifications via WhatsApp and comply with UAE E-Invoicing standards instantly.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 w-full"
      >
        <img
          src="/features/integrations-hub.png"
          alt="BizApp365 integrations hub"
          loading="lazy"
          className="w-full rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 object-cover"
        />
      </motion.div>
    </div>
  );
};

export default Integrations;
