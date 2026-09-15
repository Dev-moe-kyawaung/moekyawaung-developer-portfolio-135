import { useState } from 'react';
import { Smartphone, Layers, Cloud, Gauge, ShieldCheck, Wrench, ArrowUpRight, Plus, Minus } from 'lucide-react';
import { SERVICES } from '../data';
import { Reveal, SectionHead } from './ui';

const ICONS: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  Smartphone, Layers, Cloud, Gauge, ShieldCheck,
};

/* asymmetric control-panel bento: one primary cell, four compact, one wide strip */
const SPAN = [
  'lg:col-span-3 lg:row-span-2',
  'lg:col-span-3',
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-6',
];

export default function Services() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="services" className="relative mx-auto max-w-[1440px] px-6 lg:px-10 py-20 md:py-28">
      <SectionHead
        index="03"
        kicker="Engagements"
        mm="ဝန်ဆောင်မှုများ"
        title={<>Six ways to <span className="heat-under">connect</span></>}
        desc="Six ways to work together. Every engagement ships finished — documentation, tests, and a handover that leaves the team faster than it was found."
      />

      <div className="grid gap-4 lg:grid-cols-6">
        {SERVICES.map((s, i) => {
          const Icon = ICONS[s.icon] ?? Wrench;
          const expanded = open === i;
          const primary = i === 0;
          const wide = i === SERVICES.length - 1;

          return (
            <Reveal key={s.title} delay={i * 70} className={SPAN[i]}>
              <article
                onMouseEnter={() => setOpen(i)}
                onFocus={() => setOpen(i)}
                className={`reactor-module group relative flex h-full cursor-default overflow-hidden p-5 transition-all duration-500 sm:p-6 ${
                  wide ? 'flex-col gap-6 sm:flex-row sm:items-center' : 'flex-col justify-between'
                } ${expanded ? 'border-[var(--line-strong)]' : ''}`}
              >
                <span className="bolts"><i /><i /></span>

                <div className="flex items-start justify-between gap-4">
                  <span className={`flex shrink-0 items-center justify-center border transition-all duration-500 ${
                    primary ? 'h-14 w-14' : 'h-10 w-10'
                  } ${expanded ? 'border-[var(--amber)] bg-[rgba(255,193,77,0.08)] text-[var(--amber)]' : 'border-[var(--line)] text-[var(--ion)]'}`}
                    style={{ clipPath: 'var(--cut-sm)' }}>
                    <Icon size={primary ? 24 : 17} />
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="font-mono2 text-[9px] uppercase tracking-[0.24em] text-[var(--faint)]">CH {String(i + 1).padStart(2, '0')}</span>
                    <span className={`flex h-6 w-6 items-center justify-center border text-[var(--dim)] transition-all ${expanded ? 'border-[var(--amber)] text-[var(--amber)]' : 'border-[var(--line-faint)]'}`}>
                      {expanded ? <Minus size={11} /> : <Plus size={11} />}
                    </span>
                  </span>
                </div>

                <div className={wide ? 'flex-1' : 'mt-4'}>
                  <h3 className={`font-display uppercase leading-[1.05] tracking-tight text-[var(--txt)] ${primary ? 'text-[24px] sm:text-[30px]' : 'text-[16px]'} ${wide ? 'text-[20px]' : ''}`}>
                    {s.title}
                  </h3>
                  <p className={`mt-2.5 text-[var(--dim)] leading-[1.7] ${primary ? 'max-w-[46ch] text-[14.5px]' : 'text-[13px]'}`}>
                    {s.desc}
                  </p>

                  {/* expands on focus — the only place copy grows */}
                  <div className={`faq-body ${expanded ? 'open' : ''}`}>
                    <div>
                      <p className="pt-3 text-[12.5px] leading-[1.7] text-[var(--txt-soft)]">
                        Typical cycle: discovery call → scope on one page → instrumented delivery with a written handover and a follow-up review two sprints later.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-1.5">
                    {s.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--faint)] border border-[var(--line-faint)]">{t}</span>
                    ))}
                    <a href="#contact" className="ml-auto flex items-center gap-1 font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--ion)] transition-colors hover:text-[var(--amber)]">
                      Route request <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>

                {/* load bar per channel */}
                <div className={`mt-5 ${wide ? 'sm:mt-0 sm:w-60 sm:shrink-0' : ''}`}>
                  <div className="gauge-track">
                    <div className="gauge-fill" style={{ width: `${[96, 88, 82, 90, 86, 78][i]}%` }} />
                  </div>
                  <div className="mt-1.5 flex justify-between font-mono2 text-[8.5px] uppercase tracking-[0.2em] text-[var(--fainter)]">
                    <span>channel capacity</span>
                    <span>{['full-time', '2 wk', '4-8 wk', '1 wk', 'rolling', 'scoped'][i]}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
