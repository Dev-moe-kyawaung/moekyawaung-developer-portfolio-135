import type { ReactNode } from 'react';
import { Link } from '../lib/router';
import { PAGE_META } from '../content';
import { Reveal } from './ui';

/* ============================================================
   PAGE SHELL — minimal, quiet, powerful typography
   ============================================================ */
export function PageShell({ route, children, wide = false }: {
  route: string; children: ReactNode; wide?: boolean;
}) {
  const meta = PAGE_META[route] ?? { title: route, kicker: 'Section', desc: '' };
  return (
    <>
      <header className="relative pt-28 pb-12 md:pt-36 md:pb-16 border-b border-[var(--line-faint)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
          <Reveal>
            <div className="flex items-center gap-2 font-mono2 text-[10px] tracking-[0.18em] uppercase text-[var(--faint)] mb-6">
              <Link to="" className="hover:text-[var(--txt)] transition-colors">Home</Link>
              <span className="opacity-40">/</span>
              <span className="text-[var(--txt)]">{meta.title}</span>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <div className="kicker mb-4">{meta.kicker}</div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="font-display text-[36px] sm:text-[48px] lg:text-[56px] leading-[0.92] tracking-[-0.04em] max-w-[14ch]">{meta.title}</h1>
          </Reveal>
          {meta.desc && <Reveal delay={200}><p className="mt-5 max-w-[60ch] text-[15px] leading-[1.7] text-[var(--dim)]">{meta.desc}</p></Reveal>}
        </div>
      </header>

      <div className={`mx-auto ${wide ? 'max-w-[1440px]' : 'max-w-[1080px]'} px-6 lg:px-10 py-12 md:py-20`}>
        {children}
      </div>
    </>
  );
}

export function BlockTitle({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <Reveal>
      <div className="flex items-baseline justify-between gap-4 mb-8 mt-20 first:mt-0">
        <h2 className="font-head text-[18px] sm:text-[20px] tracking-[-0.02em]">{children}</h2>
        {note && <span className="font-mono2 text-[10px] tracking-[0.16em] uppercase text-[var(--faint)]">{note}</span>}
      </div>
    </Reveal>
  );
}

export function MetricCard({ label, before, after, delta }: { label: string; before: string; after: string; delta: string }) {
  return (
    <div className="rounded-[14px] border border-[var(--line)] bg-[var(--panel)] p-4">
      <div className="font-mono2 text-[10px] tracking-[0.14em] uppercase text-[var(--faint)]">{label}</div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-[13px] line-through text-[var(--faint)]">{before}</span>
        <span className="font-display text-[22px]">{after}</span>
      </div>
      <div className="mt-2 inline-flex px-2 py-0.5 rounded-full bg-[var(--panel-soft)] border border-[var(--line)] font-mono2 text-[10px] text-[var(--faint)]">{delta}</div>
    </div>
  );
}

export function NumberedRow({ n, title, detail }: { n: number; title: string; detail: string }) {
  return (
    <Reveal delay={n * 50}>
      <div className="rounded-[16px] border border-[var(--line)] bg-[var(--panel)] p-5 sm:p-6 flex gap-4">
        <span className="font-mono2 text-[11px] text-[var(--faint)] w-7 shrink-0 pt-0.5">{String(n).padStart(2, '0')}</span>
        <div>
          <h3 className="font-head text-[15px]">{title}</h3>
          <p className="mt-1.5 text-[13.5px] leading-[1.6] text-[var(--dim)]">{detail}</p>
        </div>
      </div>
    </Reveal>
  );
}

export function DefCard({ title, detail }: { title: string; detail: string; color?: string }) {
  return (
    <div className="rounded-[16px] border border-[var(--line)] bg-[var(--panel)] p-5">
      <h3 className="font-head text-[14px]">{title}</h3>
      <p className="mt-2 text-[13px] leading-[1.6] text-[var(--dim)]">{detail}</p>
    </div>
  );
}

export function TagRow({ items }: { items: string[]; color?: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => <span key={t} className="px-2.5 py-1 rounded-full border border-[var(--line)] bg-[var(--panel-soft)] font-mono2 text-[10px] text-[var(--faint)]">{t}</span>)}
    </div>
  );
}

export function PageCta({ title = 'Want work like this on your product?', to = 'contact', label = 'Start a conversation' }: { title?: string; to?: string; label?: string }) {
  return (
    <Reveal>
      <div className="mt-20 rounded-[20px] border border-[var(--line)] bg-[var(--panel)] p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-[22px] leading-[1.1] tracking-[-0.02em] max-w-[20ch]">{title}</h3>
          <p className="mt-2 font-mono2 text-[11px] text-[var(--faint)]">Replies within 24h · GMT+6:30 · Burmese / English / Thai</p>
        </div>
        <Link to={to} className="btn btn-primary shrink-0">{label}</Link>
      </div>
    </Reveal>
  );
}
