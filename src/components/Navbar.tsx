import { useEffect, useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { NAV_LINKS, I18N } from '../data';
import type { Lang } from '../data';
import { NAV_GROUPS } from '../content';
import { useScrollY, useLang } from '../hooks';
import { Link, useRoute } from '../lib/router';
import { CommandPalette } from './premium';

interface Props {
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  setLang: (l: Lang) => void;
}

export default function Navbar({ theme, setTheme, setLang }: Props) {
  const y = useScrollY();
  const lang = useLang();
  const route = useRoute();
  const t = I18N[lang];
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');

  useEffect(() => {
    if (route !== '') return;
    const obs = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-38% 0px -55% 0px' });
    NAV_LINKS.forEach((l) => { const el = document.getElementById(l.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [route]);

  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);

  const home = route === '';

  return (
    <>
      <header className={`nav-shell fixed top-0 inset-x-0 z-50 ${y > 20 ? 'scrolled' : ''}`}>
        <nav className="mx-auto max-w-[1440px] px-6 lg:px-10 h-[64px] flex items-center justify-between gap-6">
          {/* logo — quiet wordmark */}
          <Link to="" className="flex items-center gap-3 shrink-0" ariaLabel="Home">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--bg-2)] shadow-[var(--glow-ion)]">
              <span className="font-display text-[15px] text-[var(--arc)]">M</span>
              <span className="absolute inset-0 rounded-full border border-dashed border-[var(--ion)]/35 reactor-spin-cw" />
            </span>
            <span className="hidden flex-col leading-[1] sm:flex">
              <span className="font-display text-[14px] tracking-[-0.02em]">Moe Kyaw Aung</span>
              <span className="mt-0.5 font-mono2 text-[8.5px] uppercase tracking-[0.22em] text-[var(--ion)]">Neural interface</span>
            </span>
          </Link>

          {/* desktop nav — minimal text links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.slice(0, 6).map((l) => {
              const isActive = home ? active === l.id : route === l.id;
              return home ? (
                <a key={l.id} href={`#${l.id}`} className={`nav-link ${isActive ? 'active' : ''}`}>{l.en}</a>
              ) : (
                <Link key={l.id} to={l.id === 'home' ? '' : l.id} className={`nav-link ${isActive ? 'active' : ''}`}>{l.en}</Link>
              );
            })}
          </div>

          {/* actions */}
          <div className="flex items-center gap-2.5">
            <CommandPalette />
            <div className="hidden md:flex items-center rounded-full border border-[var(--line)] p-0.5">
              {(['en', 'mm'] as Lang[]).map((l) => (
                <button key={l} onClick={() => setLang(l)} className={`px-2.5 h-6 rounded-full text-[10px] font-mono2 tracking-wide transition-colors ${lang === l ? 'bg-[var(--txt)] text-[var(--bg)]' : 'text-[var(--faint)] hover:text-[var(--txt)]'}`}>{l.toUpperCase()}</button>
              ))}
            </div>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Theme" className="w-8 h-8 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--faint)] hover:text-[var(--txt)] hover:border-[var(--line-strong)] transition-colors">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <Link to="contact" className="hidden md:inline-flex btn btn-primary !h-8 !px-4 !text-[12px]">{t.contactMe}</Link>
            <button className="lg:hidden w-8 h-8 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--faint)]" onClick={() => setOpen(true)} aria-label="Menu">
              <Menu size={16} />
            </button>
          </div>
        </nav>
        {/* thin progress */}
        <div className="h-px bg-transparent">
          <div className="h-full bg-[var(--txt)] transition-[width] duration-150" style={{ width: `${Math.min(100, (y / Math.max(1, document.body.scrollHeight - innerHeight)) * 100)}%` }} />
        </div>
      </header>

      {/* Mobile drawer — minimal sheet */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-400 ${open ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <aside className={`absolute right-0 top-0 h-full w-[86%] max-w-[360px] bg-[var(--panel-solid)] border-l border-[var(--line)] p-6 flex flex-col gap-8 overflow-y-auto transition-transform duration-400 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between">
            <span className="font-mono2 text-[10px] tracking-[0.2em] text-[var(--faint)] uppercase">Navigation</span>
            <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--faint)]"><X size={16} /></button>
          </div>
          <div className="space-y-8">
            {NAV_GROUPS.map((g) => (
              <div key={g.group}>
                <h3 className="font-mono2 text-[10px] tracking-[0.18em] text-[var(--faint)] uppercase mb-3">{g.group}</h3>
                <ul className="space-y-1">
                  {g.items.map((it) => (
                    <li key={it.to}><Link to={it.to} className="block py-2 text-[14px] text-[var(--dim)] hover:text-[var(--txt)] transition-colors">{it.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}
