import {
  Boxes,
  ArrowLeftRight,
  Landmark,
  Users,
  BarChart3,
  MessageCircle,
  ScanBarcode,
  Wrench,
  Factory,
  BadgeCheck,
  Truck,
  Settings2,
  type LucideIcon,
} from 'lucide-react';

/** Static metadata for the 12 modules, index-aligned with `features.modules` in the i18n files. */
export type ModuleMeta = {
  slug: string;
  icon: LucideIcon;
  image: string;
  group: 'finance' | 'operations' | 'people' | 'field';
  tint: string;
};

export const MODULES: ModuleMeta[] = [
  { slug: 'masters-inventory', icon: Boxes, image: '/features/masters-module.webp', group: 'operations', tint: 'from-sky-500 to-brand-600' },
  { slug: 'sales-purchase', icon: ArrowLeftRight, image: '/features/transaction-module.webp', group: 'operations', tint: 'from-brand-500 to-brand-700' },
  { slug: 'accounting', icon: Landmark, image: '/features/reports-module.webp', group: 'finance', tint: 'from-brand-600 to-violet-600' },
  { slug: 'crm', icon: Users, image: '/features/crm-module.webp', group: 'people', tint: 'from-violet-500 to-fuchsia-600' },
  { slug: 'analytics', icon: BarChart3, image: '/features/reports-module.webp', group: 'finance', tint: 'from-indigo-500 to-violet-600' },
  { slug: 'communications', icon: MessageCircle, image: '/features/integrations-hub.webp', group: 'people', tint: 'from-emerald-500 to-teal-600' },
  { slug: 'barcode-labels', icon: ScanBarcode, image: '/features/barcode-module.webp', group: 'operations', tint: 'from-amber-500 to-orange-600' },
  { slug: 'service-center', icon: Wrench, image: '/features/service-center-module.webp', group: 'operations', tint: 'from-rose-500 to-pink-600' },
  { slug: 'production', icon: Factory, image: '/features/production-module.webp', group: 'operations', tint: 'from-slate-500 to-slate-700' },
  { slug: 'hr-payroll', icon: BadgeCheck, image: '/features/hr-payroll-module.webp', group: 'people', tint: 'from-teal-500 to-cyan-600' },
  { slug: 'van-sales', icon: Truck, image: '/features/van-sales-module.webp', group: 'field', tint: 'from-green-500 to-emerald-700' },
  { slug: 'configuration', icon: Settings2, image: '/features/configuration-module.webp', group: 'field', tint: 'from-zinc-500 to-zinc-700' },
];

export const MODULE_GROUPS = ['finance', 'operations', 'people', 'field'] as const;

export const CONTACT = {
  email: 'sales@bizapp365.com',
  phone: '+971582885633',
  phoneDisplay: '+971 58 288 5633',
  whatsapp: 'https://wa.me/971582885633',
  login: 'https://login.bizapp365.com',
};
