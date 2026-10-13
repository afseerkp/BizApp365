import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CalendarCheck2, CheckCircle2, MessageCircle } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Container } from '../components/ds/Container';
import { PageHero } from '../components/ds/PageHero';
import { Reveal } from '../components/ds/Reveal';
import { Button } from '../components/ds/Button';
import { TextField, TextArea, SelectField, Chip } from '../components/ds/Field';
import { isEmail } from '../lib/validate';
import Seo from '../components/seo/Seo';
import { CONTACT, MODULES } from '../data/modules';
import { buildMessage } from '../lib/message';
import { ease } from '../lib/motion';
import { cn } from '../lib/cn';

const PLAN_SLUGS = ['basic', 'standard', 'enterprise'];

const Demo = () => {
  const { tm } = useLanguage();
  const x = tm.demox;
  const f = tm.contactx.form;
  const [params] = useSearchParams();
  const planParam = PLAN_SLUGS.indexOf(params.get('plan') ?? '');
  const moduleParam = MODULES.findIndex((m) => m.slug === params.get('module'));

  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [v, setV] = useState({ name: '', company: '', email: '', phone: '', size: tm.contact.sizes[0], plan: planParam >= 0 ? String(planParam) : '', when: '0', message: '' });
  const [mods, setMods] = useState<number[]>(moduleParam >= 0 ? [moduleParam] : []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: keyof typeof v) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));

  const next = () => {
    const e: Record<string, string> = {};
    if (!v.name.trim()) e.name = f.required;
    if (!v.company.trim()) e.company = f.required;
    if (!isEmail(v.email)) e.email = v.email ? f.invalidEmail : f.required;
    setErrors(e);
    if (Object.keys(e).length === 0) setStep(1);
  };

  const payload = () => {
    const values = {
      name: v.name,
      company: v.company,
      email: v.email,
      phone: v.phone,
      size: v.size,
      plan: v.plan ? tm.pricing.plans[Number(v.plan)].title : x.planAny,
      modules: mods.map((i) => tm.features.modules[i].title).join(', '),
      when: x.whenOptions[Number(v.when)],
      message: v.message,
    };
    const labels = { name: f.name, company: f.company, email: f.email, phone: f.phone, size: f.size, plan: x.plan, modules: f.modules, when: x.when, message: f.message };
    return buildMessage(values, labels);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (step === 0) return next();
    const subject = `${x.eyebrow} — ${v.company}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(payload())}`;
    setSent(true);
  };

  return (
    <div>
      <Seo title={x.seoTitle} description={x.seoDescription} canonical="https://bizapp365.com/demo/" />
      <PageHero eyebrow={x.eyebrow} title={x.title} accent={x.accent} subtitle={x.subtitle} />

      <Container className="pb-28">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] items-start">
          <Reveal className="rounded-[28px] bg-ink-950 text-white p-8 sm:p-10 relative overflow-hidden grain">
            <div className="pointer-events-none absolute -top-24 -end-24 w-80 h-80 blob text-brand-600/40" aria-hidden />
            <CalendarCheck2 className="relative text-brand-300" size={28} />
            <h2 className="relative mt-5 font-display text-2xl font-bold">{x.agendaTitle}</h2>
            <ol className="relative mt-6 space-y-4">
              {x.agenda.map((a, i) => (
                <li key={a} className="flex gap-4 text-slate-300">
                  <span className="font-mono text-sm text-brand-300">0{i + 1}</span>
                  {a}
                </li>
              ))}
            </ol>
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="relative mt-10 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
              <MessageCircle size={16} /> {tm.home.cta.secondary}
            </a>
          </Reveal>

          <Reveal className="rounded-[28px] border border-line bg-surface p-6 sm:p-10 shadow-soft">
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-16 text-center" role="status" aria-live="polite">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="inline-grid place-items-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 size={32} />
                </motion.span>
                <h2 className="mt-6 font-display text-3xl font-bold text-fg">{f.successTitle}</h2>
                <p className="mt-3 text-fg-muted max-w-sm mx-auto">{f.successBody}</p>
              </motion.div>
            ) : (
              <form noValidate onSubmit={onSubmit}>
                <div className="flex items-center justify-between mb-8">
                  <p className="text-sm font-semibold text-fg">{step === 0 ? x.step1 : x.step2}</p>
                  <p className="text-xs text-fg-subtle" aria-live="polite">{x.stepOf.replace('{n}', String(step + 1))}</p>
                </div>
                <div className="mb-8 grid grid-cols-2 gap-1.5" aria-hidden>
                  {[0, 1].map((i) => (
                    <span key={i} className={cn('h-1 rounded-full transition-colors duration-500', i <= step ? 'bg-brand-600' : 'bg-line')} />
                  ))}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  {step === 0 ? (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: ease.out }} className="grid gap-5 sm:grid-cols-2">
                      <TextField label={f.name} value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" required />
                      <TextField label={f.company} value={v.company} onChange={set('company')} error={errors.company} autoComplete="organization" required />
                      <TextField label={f.email} type="email" value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" required dir="ltr" />
                      <TextField label={f.phone} type="tel" value={v.phone} onChange={set('phone')} autoComplete="tel" dir="ltr" />
                      <SelectField label={f.size} value={v.size} onChange={set('size')} className="sm:col-span-2">
                        {tm.contact.sizes.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </SelectField>
                    </motion.div>
                  ) : (
                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.35, ease: ease.out }} className="grid gap-5 sm:grid-cols-2">
                      <fieldset className="sm:col-span-2">
                        <legend className="mb-3 text-sm font-medium text-fg">{f.modules}</legend>
                        <div className="flex flex-wrap gap-2">
                          {tm.features.modules.map((m, i) => (
                            <Chip key={m.title} selected={mods.includes(i)} onClick={() => setMods((s) => (s.includes(i) ? s.filter((n) => n !== i) : [...s, i]))}>
                              {m.title}
                            </Chip>
                          ))}
                        </div>
                      </fieldset>
                      <SelectField label={x.plan} value={v.plan} onChange={set('plan')}>
                        <option value="">{x.planAny}</option>
                        {tm.pricing.plans.map((p, i) => (
                          <option key={p.title} value={String(i)}>{p.title}</option>
                        ))}
                      </SelectField>
                      <SelectField label={x.when} value={v.when} onChange={set('when')}>
                        {x.whenOptions.map((w, i) => (
                          <option key={w} value={String(i)}>{w}</option>
                        ))}
                      </SelectField>
                      <TextArea label={f.message} rows={4} value={v.message} onChange={set('message')} placeholder={f.messagePh} className="sm:col-span-2" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-8 flex items-center justify-between gap-3">
                  {step === 1 ? (
                    <Button variant="ghost" onClick={() => setStep(0)}>
                      <ArrowLeft size={16} className="rtl:rotate-180" /> {x.back}
                    </Button>
                  ) : (
                    <span />
                  )}
                  <Button type="submit" size="lg">
                    {step === 0 ? x.next : x.submit} <ArrowRight size={16} className="rtl:rotate-180" />
                  </Button>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </div>
  );
};

export default Demo;
