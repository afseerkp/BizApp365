import { motion } from 'framer-motion';
import { Layers, Database, Globe, Lock, Workflow, Cpu } from 'lucide-react';

const TechStack = () => {
  const stackCategories = [
    {
      title: 'Frontend Experience',
      icon: <Layers className="w-6 h-6 text-[#1976d2]" />,
      techs: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'],
      description: 'A blazing-fast, strictly-typed UI layer with seamless animations and responsive design.',
    },
    {
      title: 'Backend & API',
      icon: <Cpu className="w-6 h-6 text-[#9c27b0]" />,
      techs: ['Node.js', 'Express.js', 'TypeScript', 'Prisma ORM', 'RESTful APIs', 'GraphQL (Upcoming)'],
      description: 'Robust, scalable backend architecture processing thousands of transactions efficiently.',
    },
    {
      title: 'Database & Storage',
      icon: <Database className="w-6 h-6 text-[#2e7d32]" />,
      techs: ['PostgreSQL 15+', 'Redis', 'AWS S3', 'Multi-tenant Schemas'],
      description: 'Enterprise-grade isolated data storage ensuring complete privacy for each tenant.',
    },
    {
      title: 'Infrastructure & DevOps',
      icon: <Globe className="w-6 h-6 text-[#ff9800]" />,
      techs: ['Docker & Compose', 'Kubernetes', 'AWS / Azure', 'GitHub Actions CI/CD'],
      description: 'Containerized, high-availability deployments supporting zero-downtime updates.',
    },
    {
      title: 'Integrations',
      icon: <Workflow className="w-6 h-6 text-[#0db7ed]" />,
      techs: ['WhatsApp Business API', 'UAE Peppol Access Point', 'Stripe / Payfort', 'Excel Import/Export'],
      description: 'Connecting your business to the wider ecosystem with seamless 3rd party integrations.',
    },
    {
      title: 'Security & Auth',
      icon: <Lock className="w-6 h-6 text-[#d32f2f]" />,
      techs: ['JWT Authentication', 'Role-Based Access Control', 'AES-256 Encryption', 'HTTPS / SSL'],
      description: 'Bank-level security protecting sensitive financial and payroll data.',
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="w-full mb-12 relative overflow-hidden bg-slate-900">
        <img
          src="/features/tech-stack-hero.png"
          alt="Modern technology architecture"
          loading="lazy"
          className="w-full h-[400px] lg:h-[500px] object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 text-slate-300 font-medium text-sm mb-4 border border-slate-700">
            Powered by the best
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight text-center">
            Modern{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#61DAFB] to-[#3178C6]">
              Architecture
            </span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-balance">
            BizApp365 is built upon a foundation of cutting-edge, open-source technologies designed for maximum scale, security, and developer velocity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stackCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6">
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{category.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">{category.description}</p>

              <div className="flex flex-wrap gap-2">
                {category.techs.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
