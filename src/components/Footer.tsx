import { useState } from 'react';
import type { FormEvent } from 'react';
import { Check } from 'lucide-react';
import { PROFILE, NAV_LINKS, SOCIALS } from '../data';
import { NAV_GROUPS } from '../content';
import { useCopy } from '../hooks';
import { SocialIcon } from './ui';

export default function Footer() {
  const [nlEmail, setNlEmail] = useState('');
  const [nlOk, setNlOk] = useState(false);
  const { copied, copy } = useCopy();

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(nlEmail)) { setNlOk(true); setNlEmail(''); setTimeout(() => setNlOk(false), 5000); }
  };

  return (
    <footer className="border-t border-[var(--line-faint)] bg-[var(--bg-2)]/50">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_0.8fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-7 h-7 rounded-full bg-[var(--txt)] text-[var(--bg)] flex items-center justify-center font-display text-[13px] font-bold">M</span>
              <span className="font-head text-[13px]">Moe Kyaw Aung</span>
              <span className="font-mono2 text-[10px] text-[var(--faint)] uppercase tracking-wide">· Neural Interface</span>
            </div>
            <p className="text-[13px] leading-[1.6] text-[var(--dim)] max-w-[36ch]">Building secure, scalable, user-friendly mobile systems for 12 years — quiet, precise, measurable. Code with culture. Build with purpose.</p>
            <form onSubmit={subscribe} className="mt-6 flex gap-2 max-w-[320px]">
              <input type="email" required value={nlEmail} onChange={(e) => setNlEmail(e.target.value)} placeholder="you@company.com" className="field flex-1 !h-9 text-[13px]" />
              <button type="submit" className="w-9 h-9 rounded-full bg-[var(--txt)] text-[var(--bg)] flex items-center justify-center shrink-0">{nlOk ? <Check size={14} /> : <span className="text-[12px]">→</span>}</button>
            </form>
            {nlOk && <p className="mt-2 font-mono2 text-[11px] text-[#9ae6b4]">Subscribed — release notes will arrive quietly.</p>}
          </div>

          <div>
            <h4 className="font-mono2 text-[10px] tracking-[0.18em] uppercase text-[var(--faint)] mb-4">Explore</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((l) => <li key={l.id}><a href={`#${l.id}`} className="text-[13px] text-[var(--dim)] hover:text-[var(--txt)] transition-colors">{l.en}</a></li>)}
            </ul>
          </div>

          <div>
            <h4 className="font-mono2 text-[10px] tracking-[0.18em] uppercase text-[var(--faint)] mb-4">Archive</h4>
            <ul className="space-y-2 text-[13px] text-[var(--dim)]">
              <li>32 GitHub namespaces</li><li>31 Lovable builds</li><li>20 email aliases</li><li>40+ certificates</li><li>600+ repos</li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono2 text-[10px] tracking-[0.18em] uppercase text-[var(--faint)] mb-4">Signal</h4>
            <div className="space-y-2 font-mono2 text-[11px] text-[var(--dim)]">
              <div>{PROFILE.phones[0]}</div>
              <button onClick={() => copy(PROFILE.primaryEmail)} className="flex items-center gap-2 hover:text-[var(--txt)] transition-colors">{PROFILE.primaryEmail} {copied && <Check size={11} className="text-[#9ae6b4]" />}</button>
              <div className="text-[var(--faint)]">{PROFILE.location}</div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {SOCIALS.slice(0, 10).map((s) => <a key={s.key} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="w-7 h-7 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--faint)] hover:text-[var(--txt)] hover:border-[var(--line-strong)] transition-colors"><SocialIcon name={s.key} size={12} /></a>)}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--line-faint)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-8">
          <h4 className="font-mono2 text-[10px] tracking-[0.18em] uppercase text-[var(--faint)] mb-6">Sitemap — 30 pages</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {NAV_GROUPS.map((g) => (
              <div key={g.group}>
                <h5 className="font-mono2 text-[10px] tracking-[0.14em] uppercase text-[var(--fainter)] mb-3">{g.group}</h5>
                <ul className="space-y-1.5">{g.items.map((it) => <li key={it.to + it.label}><a href={it.to ? `#/${it.to}` : '#/'} className="text-[12px] text-[var(--dim)] hover:text-[var(--txt)] transition-colors">{it.label}</a></li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--line-faint)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 h-[52px] flex items-center justify-between">
          <span className="font-mono2 text-[10px] tracking-[0.16em] text-[var(--faint)] uppercase">© 2026 Moe Kyaw Aung · Neural Interface · Signals measured, claims verified</span>
          <span className="font-mono2 text-[10px] tracking-[0.16em] text-[var(--fainter)] uppercase hidden sm:block">Engineered in Myanmar</span>
        </div>
      </div>
    </footer>
  );
}
