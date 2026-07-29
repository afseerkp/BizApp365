import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  features: string[];
  image?: string;
  edition?: string;
  delay?: number;
}

const editionStyles: Record<string, string> = {
  Basic: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'Basic+': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'Standard+': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Enterprise: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'All editions': 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  'Field client': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Hardware: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
};

const FeatureCard = ({ title, description, features, image, edition, delay = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col group h-full"
    >
      {image && (
        <div className="h-64 sm:h-72 w-full relative overflow-hidden bg-slate-100 dark:bg-slate-900">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        </div>
      )}

      <div className="p-8 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#1976d2] transition-colors">
            {title}
          </h3>
          {edition && (
            <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${editionStyles[edition] ?? editionStyles['All editions']}`}>
              {edition}
            </span>
          )}
        </div>
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
