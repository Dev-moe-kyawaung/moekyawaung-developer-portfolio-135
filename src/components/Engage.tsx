import { useEffect, useState } from 'react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { PLANS, TESTIMONIALS, FAQS } from '../data';
import type { Currency } from '../data';
import { Reveal, SectionHead } from './ui';

function fmt(cur: Currency, v?: number): string {
  if (v === undefined) return '';
  const n = v.toLocaleString('en-US');
  if (cur === 'USD') return `$${n}`;
  if (cur === 'THB') return `฿${n}`;
  return `${n} K`;
}

export function Pricing() {
  const [cur, setCur] = useState<Currency>('USD');
  return (
    <section id="pricing" className="mx-auto max-w-[1440px] px-6 lg:px-10 py-24 md:py-32">
      <SectionHead index="07" kicker="Pricing" title={<>Transparent rates — no hidden fees.</>} desc="Every package starts with a free 20-minute discovery call. MMK / THB / USD." />
      <Reveal>
        <div className="flex items-center gap-2 mb-8">
          <span className="font-mono2 text-[10px] tracking-[0.18em] uppercase text-[var(--faint)]">Currency</span>
          {(['USD', 'MMK', 'THB'] as Currency[]).map((c) => (
            <button key={c} onClick={() => setCur(c)} className={`h-7 px-3 rounded-full border text-[11px] font-mono2 transition-colors ${cur === c ? 'bg-[var(--txt)] text-[var(--bg)] border-[var(--txt)]' : 'border-[var(--line)] text-[var(--faint)] hover:text-[var(--txt)]'}`}>{c}</button>
          ))}
        </div>
      </Reveal>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {PLANS.map((p, i) => (
          <Reveal key={p.name} delay={i * 60} className="h-full">
            <div className={`rounded-[20px] border p-6 flex flex-col gap-5 h-full ${p.featured ? 'border-[var(--txt)] bg-[var(--panel)]' : 'border-[var(--line)] bg-[var(--panel)]'}`}>
              <div>
                <h3 className="font-head text-[16px]">{p.name}</h3>
                <p className="mt-2 text-[12.5px] leading-[1.6] text-[var(--dim)] min-h-[3em]">{p.blurb}</p>
              </div>
              <div className="flex items-baseline gap-2">
                {p.custom ? <span className="font-display text-[28px]">Custom</span> : <><span className="font-display text-[28px]">{fmt(cur, cur === 'USD' ? p.usd : cur === 'MMK' ? p.mmk : p.thb)}</span><span className="font-mono2 text-[11px] text-[var(--faint)]">/ {p.unit}</span></>}
              </div>
              <ul className="space-y-2.5 flex-1">
                {p.features.map((f) => <li key={f} className="flex items-start gap-2 text-[12.5px] text-[var(--dim)]"><Check size={14} className="text-[var(--faint)] mt-0.5 shrink-0" />{f}</li>)}
              </ul>
              <a href="#contact" className={`btn w-full justify-center text-[12px] h-10 ${p.featured ? 'btn-primary' : 'btn-ghost'}`}>{p.custom ? 'Request quote' : 'Book now'}</a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Testimonials() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = TESTIMONIALS.length;
  useEffect(() => { if (paused) return; const id = setInterval(() => setIdx((p) => (p + 1) % n), 5600); return () => clearInterval(id); }, [paused, n]);
  const item = TESTIMONIALS[idx];

  return (
    <section id="testimonials" className="mx-auto max-w-[1440px] px-6 lg:px-10 py-24 md:py-32">
      <SectionHead index="08" kicker="Testimonials" title={<>What teams say — short, specific, verifiable.</>} />
      <Reveal>
        <div className="max-w-[760px] mx-auto" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="rounded-[20px] border border-[var(--line)] bg-[var(--panel)] p-8 sm:p-10">
            <p className="font-news text-[20px] sm:text-[22px] leading-[1.5] tracking-[-0.01em] text-center">“{item.quote}”</p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[var(--panel-soft)] border border-[var(--line)] flex items-center justify-center font-mono2 text-[10px]">{item.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
              <span className="text-left"><span className="block text-[13px] font-medium">{item.name}</span><span className="block font-mono2 text-[10px] text-[var(--faint)] uppercase tracking-wide">{item.role}</span></span>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <button onClick={() => setIdx((p) => (p - 1 + n) % n)} className="w-8 h-8 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--faint)] hover:text-[var(--txt)]"><ChevronLeft size={14} /></button>
            <div className="flex gap-1.5">{TESTIMONIALS.map((_, i) => <span key={i} className={`h-1 rounded-full transition-all ${i === idx ? 'w-6 bg-[var(--txt)]' : 'w-2 bg-[var(--line)]'}`} />)}</div>
            <button onClick={() => setIdx((p) => (p + 1) % n)} className="w-8 h-8 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--faint)] hover:text-[var(--txt)]"><ChevronRight size={14} /></button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="mx-auto max-w-[1440px] px-6 lg:px-10 py-24 md:py-32">
      <SectionHead index="09" kicker="FAQ" title={<>Common questions — answered plainly.</>} />
      <div className="max-w-[720px] space-y-2.5">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 40}>
              <div className={`rounded-[14px] border transition-colors ${isOpen ? 'border-[var(--line-strong)] bg-[var(--panel)]' : 'border-[var(--line)] bg-[var(--panel)]'}`}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="text-[14px] font-medium leading-[1.4]">{f.q}</span>
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[12px] transition-transform ${isOpen ? 'rotate-45 border-[var(--txt)]' : 'border-[var(--line)] text-[var(--faint)]'}`}>+</span>
                </button>
                <div className={`faq-body ${isOpen ? 'open' : ''}`}><div><p className="px-5 pb-5 text-[13.5px] leading-[1.7] text-[var(--dim)]">{f.a}</p></div></div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
