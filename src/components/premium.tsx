import { useEffect, useMemo, useState } from 'react';
import type { ReactNode, KeyboardEvent } from 'react';
import { Search, CornerDownLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { navigate } from '../lib/router';
import { NAV_GROUPS } from '../content';

/* ============================================================
   PARTICLES — disabled in minimal (kept for compat)
   ============================================================ */
export function Particles({ className = '' }: { density?: number; className?: string }) {
  return <div className={className} aria-hidden="true" />;
}

/* ============================================================
   MAGNETIC — disabled in minimal
   ============================================================ */
export function Magnetic({ children, className = '' }: { children: ReactNode; className?: string; strength?: number }) {
  return <span className={className}>{children}</span>;
}

/* ============================================================
   LIGHTBOX — minimal paper viewer
   ============================================================ */
export function Lightbox({ images }: { images: { src: string; caption: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = () => setOpen(null);
  const next = () => setOpen((p) => (p === null ? null : (p + 1) % images.length));
  const prev = () => setOpen((p) => (p === null ? null : (p - 1 + images.length) % images.length));

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (open === null) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  };

  useEffect(() => {
    document.body.style.overflow = open !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((im, i) => (
          <button key={im.src + i} onClick={() => setOpen(i)} className="relative overflow-hidden rounded-[14px] border border-[var(--line)] aspect-[4/3] group bg-[var(--bg-2)]">
            <img src={im.src} alt={im.caption} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          </button>
        ))}
      </div>

      {open !== null && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-[rgba(0,0,0,0.92)] backdrop-blur-xl" role="dialog" aria-modal="true" onKeyDown={onKey} tabIndex={-1}>
          <button onClick={close} aria-label="Close" className="absolute top-5 right-5 w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30">
            <X size={18} />
          </button>
          <button onClick={prev} aria-label="Prev" className="absolute left-4 w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white">
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} aria-label="Next" className="absolute right-4 w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white">
            <ChevronRight size={18} />
          </button>
          <figure className="max-w-5xl w-full">
            <img src={images[open].src} alt={images[open].caption} className="w-full max-h-[76vh] object-contain rounded-[16px]" />
            <figcaption className="mt-4 flex items-center justify-between">
              <span className="text-sm text-white/80">{images[open].caption}</span>
              <span className="font-mono2 text-[10px] tracking-[0.18em] text-white/40">{String(open + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

/* ============================================================
   COMMAND PALETTE — minimal quiet
   ============================================================ */
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);

  const commands = useMemo(() => NAV_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.group, to: i.to || '' }))), []);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(s) || c.group.toLowerCase().includes(s));
  }, [q, commands]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((p) => !p); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) { setQ(''); setSel(0); }
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => { setSel(0); }, [q]);

  const run = (to: string) => { setOpen(false); navigate(to); };

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Command palette" className="hidden md:flex items-center gap-2 px-3 h-8 rounded-full border border-[var(--line)] text-[var(--faint)] hover:text-[var(--txt)] hover:border-[var(--line-strong)] font-mono2 text-[10px] tracking-[0.12em] transition-colors">
        <Search size={12} /> <span className="hidden lg:inline">SEARCH</span> <span className="px-1.5 py-0.5 rounded bg-[var(--panel-soft)] border border-[var(--line)] text-[9px]">⌘K</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[16vh] px-4 bg-black/70 backdrop-blur-xl" onClick={() => setOpen(false)}>
          <div className="w-full max-w-[480px] rounded-[20px] overflow-hidden bg-[var(--panel-solid)] border border-[var(--line)] shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="flex items-center gap-3 px-5 h-[56px] border-b border-[var(--line)]">
              <Search size={16} className="text-[var(--faint)] shrink-0" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to…" className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[var(--faint)]"
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setSel((p) => Math.min(results.length - 1, p + 1)); }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setSel((p) => Math.max(0, p - 1)); }
                  if (e.key === 'Enter' && results[sel]) run(results[sel].to);
                }} />
            </div>
            <ul className="max-h-[48vh] overflow-y-auto py-2">
              {results.length === 0 && <li className="px-5 py-8 text-center font-mono2 text-xs text-[var(--faint)]">NO RESULTS</li>}
              {results.map((c, i) => (
                <li key={c.to + c.label}>
                  <button onMouseEnter={() => setSel(i)} onClick={() => run(c.to)} className={`w-full flex items-center justify-between px-5 py-3 text-left text-[13px] transition-colors ${i === sel ? 'bg-[var(--panel-soft)] text-[var(--txt)]' : 'text-[var(--dim)]'}`}>
                    <span className="flex items-center gap-3"><span className="font-mono2 text-[10px] text-[var(--faint)]">{c.group}</span> {c.label}</span>
                    {i === sel && <CornerDownLeft size={13} className="text-[var(--faint)]" />}
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-5 h-9 flex items-center justify-between border-t border-[var(--line)] font-mono2 text-[10px] text-[var(--faint)]">
              <span>↑↓ Navigate · ↵ Open · Esc Close</span><span>{results.length}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ============================================================
   SCROLL RAIL — minimal dots
   ============================================================ */
export function ScrollRail({ ids }: { ids: string[] }) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-40% 0px -50% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [ids]);

  return (
    <nav aria-label="Section rail" className="hidden xl:flex fixed right-5 top-1/2 -translate-y-1/2 z-30 flex-col gap-2.5">
      {ids.map((id) => (
        <a key={id} href={`#${id}`} aria-label={id} className="group flex justify-end">
          <span className={`block w-1 h-1 rounded-full transition-all duration-300 ${active === id ? 'bg-[var(--txt)] w-6' : 'bg-[var(--line-strong)] group-hover:bg-[var(--faint)]'}`} />
        </a>
      ))}
    </nav>
  );
}
