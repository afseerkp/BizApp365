import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Mail, MessageCircle, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Container } from '../components/ds/Container';
import { PageHero } from '../components/ds/PageHero';
import { Reveal } from '../components/ds/Reveal';
import { Button } from '../components/ds/Button';
import { TextField, TextArea, SelectField } from '../components/ds/Field';
import { isEmail } from '../lib/validate';
import Seo from '../components/seo/Seo';
import { CONTACT } from '../data/modules';
import { buildMessage } from '../lib/message';

type Values = { name: string; company: string; email: string; phone: string; size: string; message: string };

const Contact = () => {
  const { tm } = useLanguage();
  const x = tm.contactx;
  const f = x.form;
  const [v, setV] = useState<Values>({ name: '', company: '', email: '', phone: '', size: tm.contact.sizes[0], message: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [sent, setSent] = useState(false);

  const set = (k: keyof Values) => (e: { target: { value: string } }) => setV((s) => ({ ...s, [k]: e.target.value }));
  const labels = { name: f.name, company: f.company, email: f.email, phone: f.phone, size: f.size, message: f.message };

  const validate = () => {
    const e: typeof errors = {};
    if (!v.name.trim()) e.name = f.required;
    if (!isEmail(v.email)) e.email = v.email ? f.invalidEmail : f.required;
    if (!v.message.trim()) e.message = f.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const subject = `${f.mailSubject} ${v.company || v.name}`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildMessage(v, labels))}`;
    setSent(true);
  };

  const sendWhatsApp = () => {
    if (!validate()) return;
    window.open(`${CONTACT.whatsapp}?text=${encodeURIComponent(buildMessage(v, labels))}`, '_blank', 'noopener');
  };

  const channels = [
    { icon: Mail, href: `mailto:${CONTACT.email}`, ...x.channels[0] },
    { icon: Phone, href: `tel:${CONTACT.phone}`, ...x.channels[1] },
    { icon: MessageCircle, href: CONTACT.whatsapp, ...x.channels[2] },
  ];

  return (
    <div>
      <Seo title={x.seoTitle} description={x.seoDescription} canonical="https://bizapp365.com/contact/" />
      <PageHero eyebrow={x.eyebrow} title={x.title} accent={x.accent} subtitle={x.subtitle} />

      <Container className="pb-28">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] items-start">
          <div className="space-y-3">
            {channels.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.06}>
                <a
                  href={c.href}
                  {...(i === 2 ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand-500/50"
                >
                  <span className="grid place-items-center w-12 h-12 shrink-0 rounded-xl bg-brand-600/10 text-brand-600 dark:text-brand-400">
                    <c.icon size={20} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-fg-subtle">{c.label}</span>
                    <span className="block font-semibold text-fg truncate" dir={i < 2 ? 'ltr' : undefined}>{c.value}</span>
                  </span>
                  <ArrowRight size={18} className="text-fg-subtle transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </a>
              </Reveal>
            ))}
            <Reveal delay={0.2}>
              <p className="flex items-center gap-2 px-2 pt-3 text-sm text-fg-muted">
                <MapPin size={16} className="text-brand-600 dark:text-brand-400" /> {x.regions}
              </p>
            </Reveal>
          </div>

          <Reveal className="rounded-[28px] border border-line bg-surface p-6 sm:p-10 shadow-soft">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-16 text-center" role="status" aria-live="polite">
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="inline-grid place-items-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 size={32} />
                  </motion.span>
                  <h2 className="mt-6 font-display text-3xl font-bold text-fg">{f.successTitle}</h2>
                  <p className="mt-3 text-fg-muted max-w-sm mx-auto">{f.successBody}</p>
                  <div className="mt-8">
                    <Button variant="secondary" onClick={() => setSent(false)}>{f.again}</Button>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" noValidate onSubmit={onSubmit} exit={{ opacity: 0 }} className="grid gap-5 sm:grid-cols-2">
                  <TextField label={f.name} value={v.name} onChange={set('name')} error={errors.name} autoComplete="name" required />
                  <TextField label={f.company} value={v.company} onChange={set('company')} autoComplete="organization" />
                  <TextField label={f.email} type="email" value={v.email} onChange={set('email')} error={errors.email} autoComplete="email" required dir="ltr" />
                  <TextField label={f.phone} type="tel" value={v.phone} onChange={set('phone')} autoComplete="tel" dir="ltr" />
                  <SelectField label={f.size} value={v.size} onChange={set('size')} className="sm:col-span-2">
                    {tm.contact.sizes.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </SelectField>
                  <TextArea label={f.message} rows={5} value={v.message} onChange={set('message')} error={errors.message} placeholder={f.messagePh} className="sm:col-span-2" required />
                  <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
                    <Button type="submit" size="lg">
                      {f.submit} <ArrowRight size={16} className="rtl:rotate-180" />
                    </Button>
                    <Button variant="ghost" size="lg" onClick={sendWhatsApp}>
                      <MessageCircle size={16} /> {f.sendWhatsApp}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </Container>
    </div>
  );
};

export default Contact;
