import { useState } from 'react';
import { ExternalLink, Copy, Check, Mail, GitBranch } from 'lucide-react';
import { CERTS, CERT_CATS, GITHUB_ACCOUNTS, LOVABLE_APPS, EMAILS, SOCIALS } from '../data';
import { useCopy } from '../hooks';
import { Reveal, SectionHead, SocialIcon } from './ui';

export function Certificates() {
  const [cat, setCat] = useState<string>('All');
  const cats = CERT_CATS as readonly string[];
  const list = cat === 'All' ? CERTS : CERTS.filter((c) => c.cat === cat);

  return (
    <section id="certificates" className="mx-auto max-w-[1440px] px-6 lg:px-10 py-24 md:py-32">
      <SectionHead
        index="05"
        kicker="Credentials"
        title={<>Verified learning — 40+ certificates across 9 domains.</>}
        desc="Each certificate links to a verifiable ID. Search and filter by category."
      />
      <Reveal>
        <div className="flex flex-wrap gap-2 mb-10">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={`h-8 px-4 rounded-full border text-[12px] font-mono2 transition-colors ${cat === c ? 'bg-[var(--txt)] text-[var(--bg)] border-[var(--txt)]' : 'border-[var(--line)] text-[var(--faint)] hover:text-[var(--txt)]'}`}>
              {c}
            </button>
          ))}
        </div>
      </Reveal>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {list.map((cert, i) => (
          <Reveal key={cert.id} delay={(i % 4) * 40}>
            <a href={`https://www.programminghub.io/certificate?id=${cert.id}`} target="_blank" rel="noreferrer" className="rounded-[14px] border border-[var(--line)] bg-[var(--panel)] p-4 flex flex-col gap-3 hover:border-[var(--line-strong)] transition-colors">
              <div className="flex items-start justify-between">
                <span className="font-head text-[13px] leading-snug">{cert.name}</span>
                <ExternalLink size={12} className="text-[var(--faint)]" />
              </div>
              <div className="mt-auto flex items-center justify-between font-mono2 text-[10px] text-[var(--faint)]">
                <span>{cert.date}</span><span>#{cert.id.slice(-6)}</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

type Tab = 'github' | 'lovable' | 'email' | 'social';
const TABS: { id: Tab; label: string; count: number }[] = [
  { id: 'github', label: 'GitHub', count: GITHUB_ACCOUNTS.length },
  { id: 'lovable', label: 'Lovable', count: LOVABLE_APPS.length },
  { id: 'email', label: 'Emails', count: EMAILS.length },
  { id: 'social', label: 'Social', count: SOCIALS.length },
];

function EmailCard({ email }: { email: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="rounded-[12px] border border-[var(--line)] bg-[var(--panel)] p-3.5 flex items-center justify-between gap-3">
      <a href={`mailto:${email}`} className="flex items-center gap-2.5 min-w-0">
        <span className="w-7 h-7 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--faint)] shrink-0"><Mail size={12} /></span>
        <span className="font-mono2 text-[12px] text-[var(--dim)] truncate">{email}</span>
      </a>
      <button onClick={() => copy(email)} className="w-7 h-7 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--faint)] hover:text-[var(--txt)]">
        {copied ? <Check size={12} /> : <Copy size={12} />}
      </button>
    </div>
  );
}

export function Collections() {
  const [tab, setTab] = useState<Tab>('github');
  return (
    <section id="collections" className="mx-auto max-w-[1440px] px-6 lg:px-10 py-24 md:py-32">
      <SectionHead index="06" kicker="Archive" title={<>One developer, many namespaces — a quiet archive.</>} />
      <Reveal>
        <div className="flex flex-wrap gap-2 mb-10">
          {TABS.map((tb) => (
            <button key={tb.id} onClick={() => setTab(tb.id)} className={`h-8 px-4 rounded-full border text-[12px] font-mono2 flex items-center gap-2 transition-colors ${tab === tb.id ? 'bg-[var(--txt)] text-[var(--bg)] border-[var(--txt)]' : 'border-[var(--line)] text-[var(--faint)] hover:text-[var(--txt)]'}`}>
              {tb.label} <span className="text-[10px] opacity-60">{tb.count}</span>
            </button>
          ))}
        </div>
      </Reveal>

      {tab === 'github' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {GITHUB_ACCOUNTS.map((u, i) => (
            <Reveal key={u + i} delay={(i % 4) * 30}>
              <a href={u} target="_blank" rel="noreferrer" className="rounded-[12px] border border-[var(--line)] bg-[var(--panel)] p-3.5 flex items-center gap-2.5 hover:border-[var(--line-strong)] transition-colors">
                <span className="w-7 h-7 rounded-full bg-[var(--panel-soft)] border border-[var(--line)] flex items-center justify-center text-[var(--faint)]"><GitBranch size={12} /></span>
                <span className="font-mono2 text-[11px] truncate text-[var(--dim)]">{new URL(u).hostname.split('.')[0]}</span>
              </a>
            </Reveal>
          ))}
        </div>
      )}

      {tab === 'lovable' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {LOVABLE_APPS.map((u, i) => (
            <Reveal key={u + i} delay={(i % 4) * 30}>
              <a href={u} target="_blank" rel="noreferrer" className="rounded-[12px] border border-[var(--line)] bg-[var(--panel)] p-3.5 font-mono2 text-[11px] text-[var(--dim)] truncate hover:border-[var(--line-strong)]">{u.replace('https://', '')}</a>
            </Reveal>
          ))}
        </div>
      )}

      {tab === 'email' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {EMAILS.map((e, i) => <Reveal key={e} delay={(i % 3) * 30}><EmailCard email={e} /></Reveal>)}
        </div>
      )}

      {tab === 'social' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
          {SOCIALS.map((s, i) => (
            <Reveal key={s.key} delay={(i % 5) * 30}>
              <a href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="rounded-[12px] border border-[var(--line)] bg-[var(--panel)] p-4 flex items-center gap-3 hover:border-[var(--line-strong)] transition-colors">
                <span className="w-8 h-8 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--faint)]"><SocialIcon name={s.key} size={14} /></span>
                <span className="min-w-0"><span className="block text-[13px] font-medium leading-tight">{s.label}</span><span className="block font-mono2 text-[10px] text-[var(--faint)] truncate">{s.handle}</span></span>
              </a>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
