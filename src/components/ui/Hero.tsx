import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1976d2]/5 via-transparent to-[#9c27b0]/5" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_30%_20%,rgba(25,118,210,0.08),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full flex flex-col lg:flex-row items-center gap-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left pt-10 lg:pt-0"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#1976d2] dark:text-blue-400 font-medium text-sm mb-6 border border-blue-200 dark:border-blue-800"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1976d2]" />
            </span>
            BizApp365 Multi-Tenant ERP
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
            The Complete ERP for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1976d2] to-[#9c27b0]">
              Growing SMEs
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl text-balance">
            Accounting, inventory, sales & purchases, CRM, service center, HR/payroll, barcode labeling, and VAN field sales — on web, Android, and silent-print extension.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full lg:w-1/2 relative mt-12 lg:mt-0"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1976d2]/20 to-[#9c27b0]/20 rounded-3xl blur-3xl scale-95" />
          <img
            src="/features/hero-dashboard.png"
            alt="BizApp365 ERP Dashboard"
            className="relative w-full rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-700/80"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
