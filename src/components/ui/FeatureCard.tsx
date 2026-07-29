import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  features: string[];
  image: string;
  delay?: number;
}

const FeatureCard = ({ title, description, features, image, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col group h-full"
    >
      <div className="h-64 sm:h-72 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-[#1976d2] transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6 flex-1">{description}</p>

        <ul className="space-y-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#1976d2] flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
