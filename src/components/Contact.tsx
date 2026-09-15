import { useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PROFILE, SOCIALS } from '../data';
import { Reveal, SectionHead, SocialIcon } from './ui';

interface FormState { name: string; email: string; subject: string; message: string; }
type Errors = Partial<Record<keyof FormState, string>>;
const EMPTY: FormState = { name: '', email: '', subject: '', message: '' };

const MM = {
  name: 'နာမည်ကို အနည်းဆုံး ၃ လုံး ထည့်ပေးပါ။',
  email: 'အီးမေးလ်မှန်ကန်စွာ ထည့်ပေးပါ။',
  subject: 'ခေါင်းစဉ် ထည့်ပေးပါ။',
  message: 'စာတို ၁၀ လုံးထက် ပိုရေးပေးပါ။',
  okTitle: 'စာရောက်ရှိသွားပါပြီ။',
  okBody: '၂၄ နာရီအတွင်း ပြန်ကြားပေးပါမည်။',
};

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 3) e.name = MM.name;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = MM.email;
  if (f.subject.trim().length < 2) e.subject = MM.subject;
  if (f.message.trim().length < 10) e.message = MM.message;
  return e;
}

function Field({ label, name, value, error, textarea, onChange }: {
  label: string; name: keyof FormState; value: string; error?: string; textarea?: boolean; onChange: (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <div>
      <label htmlFor={`f-${name}`} className="block font-mono2 text-[10px] tracking-[0.14em] uppercase text-[var(--faint)] mb-2">{label}</label>
      {textarea ? (
        <textarea id={`f-${name}`} rows={5} value={value} onChange={onChange(name)} placeholder={label} className={`field ${error ? 'field-error' : ''}`} />
      ) : (
        <input id={`f-${name}`} type={name === 'email' ? 'email' : 'text'} value={value} onChange={onChange(name)} placeholder={label} className={`field ${error ? 'field-error' : ''}`} />
      )}
      {error && <p className="mt-2 font-mono2 text-[11px] text-[#ff6b7a]">{error}</p>}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) { setSent(true); setForm(EMPTY); setTimeout(() => setSent(false), 6000); }
  };

  return (
    <section id="contact" className="mx-auto max-w-[1440px] px-6 lg:px-10 py-24 md:py-32">
      <SectionHead index="10" kicker="Contact" title={<>Let’s build something reliable, polished, and useful.</>} desc="Tell me about your app, team, and deadline. Replies within 24 hours business days." />

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
        <Reveal>
          <form onSubmit={onSubmit} noValidate className="rounded-[20px] border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-mono2 text-[11px] tracking-[0.18em] uppercase text-[var(--faint)]">Transmission</h3>
              <span className="font-mono2 text-[10px] text-[var(--fainter)]">Encrypted · Direct to inbox</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" name="name" value={form.name} error={errors.name} onChange={set} />
              <Field label="Email" name="email" value={form.email} error={errors.email} onChange={set} />
            </div>
            <Field label="Subject" name="subject" value={form.subject} error={errors.subject} onChange={set} />
            <Field label="Message" name="message" value={form.message} error={errors.message} onChange={set} textarea />
            <button type="submit" className="btn btn-primary w-full justify-center h-11">Send message</button>
            {sent && (
              <div className="flex items-start gap-3 rounded-[12px] border border-[rgba(154,230,180,0.3)] bg-[rgba(154,230,180,0.08)] p-4">
                <CheckCircle2 size={18} className="text-[#9ae6b4] mt-0.5 shrink-0" />
                <div><p className="text-[13px] font-medium">{MM.okTitle}</p><p className="mt-1 text-[12px] text-[var(--dim)]">{MM.okBody}</p></div>
              </div>
            )}
          </form>
        </Reveal>

        <div className="space-y-4">
          <Reveal delay={80}>
            <div className="rounded-[16px] border border-[var(--line)] bg-[var(--panel)] p-5">
              <div className="font-mono2 text-[10px] tracking-[0.16em] uppercase text-[var(--faint)] mb-3">Direct</div>
              <div className="space-y-2 font-mono2 text-[12px] text-[var(--dim)]">
                <div>{PROFILE.phones[0]} · {PROFILE.phones[1]}</div>
                <div>{PROFILE.primaryEmail}</div>
                <div className="text-[var(--faint)]">{PROFILE.location} · GMT+6:30</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-[16px] border border-[var(--line)] overflow-hidden bg-[var(--bg-2)]">
              <iframe title="Map" src="https://maps.google.com/maps?q=Tachileik%2C%20Myanmar&t=&z=12&ie=UTF8&iwloc=&output=embed" loading="lazy" className="w-full h-[240px] border-0 grayscale" />
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a key={s.key} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="w-8 h-8 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--faint)] hover:text-[var(--txt)] hover:border-[var(--line-strong)] transition-colors">
                  <SocialIcon name={s.key} size={14} />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
