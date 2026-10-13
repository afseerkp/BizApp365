import { motion, useReducedMotion } from 'framer-motion';
import { Check, Plus, Wallet, Package } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Container } from '../ds/Container';
import { Accent, SectionHeading } from '../ds/SectionHeading';
import { PhoneFrame } from '../ds/Frames';
import { Reveal } from '../ds/Reveal';
import { ease, viewportOnce } from '../../lib/motion';

/* Approximate relative positions on an abstract UAE → Oman map (viewBox 600×380). */
const STOPS: Array<[number, number]> = [
  [262, 168], // Dubai
  [290, 146], // Sharjah
  [150, 238], // Abu Dhabi
  [300, 262], // Al Ain
  [420, 126], // Sohar
  [528, 186], // Muscat
];
const ROUTE = 'M262 168 C 272 156, 280 150, 290 146 C 240 160, 190 210, 150 238 C 200 262, 250 270, 300 262 C 340 210, 380 150, 420 126 C 460 120, 500 150, 528 186';

function RouteMap() {
  const { tm } = useLanguage();
  const reduce = useReducedMotion();
  const names = tm.home.field.stops;

  return (
    <svg viewBox="90 60 640 320" className="w-full h-auto" role="img" aria-label={names.join(' → ')}>
      <defs>
        <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.2" fill="rgba(255,255,255,0.12)" />
        </pattern>
        <linearGradient id="route-g" x1="0" x2="1">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#e5b768" />
        </linearGradient>
        <radialGradient id="land-g" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="rgba(89,162,251,0.18)" />
          <stop offset="1" stopColor="rgba(89,162,251,0)" />
        </radialGradient>
      </defs>
      <rect x="90" y="60" width="640" height="320" fill="url(#dots)" />
      {/* Abstract landmass silhouette */}
      <path
        d="M40 300 C 90 250, 150 230, 210 200 C 250 180, 270 150, 300 120 C 330 92, 380 90, 430 96 C 480 104, 530 130, 572 170 C 590 200, 580 250, 540 290 C 470 340, 300 360, 160 350 C 100 345, 60 330, 40 300 Z"
        fill="url(#land-g)"
        stroke="rgba(255,255,255,0.08)"
      />
      <path d={ROUTE} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" strokeDasharray="4 6" />
      <motion.path
        id="van-route"
        d={ROUTE}
        fill="none"
        stroke="url(#route-g)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 3, ease: ease.inOut }}
      />
      {STOPS.map(([x, y], i) => (
        <g key={i}>
          <motion.circle
            cx={x}
            cy={y}
            r="14"
            fill="rgba(52,211,153,0.15)"
            initial={reduce ? false : { scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={viewportOnce}
            transition={{ delay: 0.3 + i * 0.45, type: 'spring', stiffness: 200 }}
          />
          <circle cx={x} cy={y} r="5" fill="#0b1020" stroke="#34d399" strokeWidth="2.5" />
          <text x={x} y={y - 20} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">
            {names[i]}
          </text>
        </g>
      ))}
      {!reduce && (
        <g>
          <circle r="9" fill="#e5b768" stroke="#0b1020" strokeWidth="3">
            <animateMotion dur="9s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
              <mpath href="#van-route" />
            </animateMotion>
          </circle>
        </g>
      )}
    </svg>
  );
}

function VanPhone() {
  const { tm } = useLanguage();
  const p = tm.home.field.phone;
  return (
    <PhoneFrame className="w-[250px]">
      <div className="pt-10 pb-5 px-4 bg-gradient-to-b from-emerald-600 to-emerald-700 text-white">
        <p className="text-[11px] text-white/70">{p.route}</p>
        <p className="text-sm font-bold">{p.stop}</p>
        <div className="mt-3 rounded-xl bg-white/15 p-3 backdrop-blur">
          <p className="text-sm font-semibold">{p.customer}</p>
          <p className="mt-1 flex justify-between text-[11px] text-white/80">
            <span>{p.balance}</span>
            <span className="font-bold text-white">{p.balanceValue}</span>
          </p>
        </div>
      </div>
      <div className="p-4 space-y-3 bg-surface">
        <div className="grid grid-cols-2 gap-2">
          <span className="flex flex-col items-center gap-1 rounded-xl bg-brand-600 py-3 text-[11px] font-semibold text-white">
            <Plus size={16} /> {p.newSale}
          </span>
          <span className="flex flex-col items-center gap-1 rounded-xl bg-surface-2 py-3 text-[11px] font-semibold text-fg">
            <Wallet size={16} /> {p.collect}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-line p-3">
          <span className="flex items-center gap-2 text-[11px] font-semibold text-fg">
            <Package size={14} className="text-emerald-600" /> {p.vanStock}
          </span>
          <span className="text-[11px] text-fg-subtle">{p.items}</span>
        </div>
        <div className="rounded-xl border border-line p-3">
          <p className="text-[10px] text-fg-subtle">{p.collected}</p>
          <p className="font-display text-lg font-bold text-fg">{p.collectedValue}</p>
        </div>
      </div>
    </PhoneFrame>
  );
}

export default function FieldSection() {
  const { tm } = useLanguage();
  const f = tm.home.field;
  return (
    <section className="relative overflow-hidden bg-ink-950 text-white py-28 sm:py-36 grain">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-40 start-1/3 w-[40rem] h-[40rem] blob text-emerald-500/10" />
        <div className="absolute bottom-0 end-0 w-[30rem] h-[30rem] blob text-brand-600/20" />
      </div>
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] items-center">
          <div>
            <SectionHeading
              invert
              align="start"
              eyebrow={f.eyebrow}
              title={
                <>
                  {f.title} <Accent>{f.accent}</Accent>
                </>
              }
              subtitle={f.subtitle}
            />
            <div className="mt-10 grid sm:grid-cols-2 gap-4" role="list">
              {f.points.map((pt, i) => (
                <Reveal key={pt} delay={0.1 + i * 0.07} role="listitem">
                  <p className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-200 h-full">
                    <Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                    {pt}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal className="relative">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.02] p-4 sm:p-6">
              <RouteMap />
            </div>
            <div className="absolute right-0 bottom-0 hidden sm:block translate-y-[18%] scale-[0.72] origin-bottom-right rotate-[4deg]">
              <VanPhone />
            </div>
          </Reveal>
        </div>
        <div className="sm:hidden mt-10 flex justify-center">
          <VanPhone />
        </div>
      </Container>
    </section>
  );
}
