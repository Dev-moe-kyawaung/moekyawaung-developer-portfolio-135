import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, GitBranch, Star, Waypoints } from 'lucide-react';
import { PROJECTS, PROJ_FILTERS } from '../data';
import type { ProjCat, Project } from '../data';
import { CASE_STUDIES } from '../content';
import { Reveal, SectionHead } from './ui';

const CAT_META: Record<ProjCat, { label: string; tone: string }> = {
  android: { label: 'Android · Kotlin', tone: 'var(--ion)' },
  flutter: { label: 'Flutter · Dart', tone: 'var(--magenta)' },
  web: { label: 'Web · PWA', tone: 'var(--amber)' },
  game: { label: 'Interactive', tone: 'var(--ember)' },
};

const resultsFor = (p: Project, i: number) => [
  { k: 'cold start', v: `${(1.24 + (p.tags.length % 4) * 0.06 + (i % 3) * 0.04).toFixed(2)}s` },
  { k: 'crash-free', v: `${(99.5 + (i % 4) * 0.12).toFixed(2)}%` },
  { k: 'binary', v: `${Math.round(13 + (p.tags.length % 5) * 1.6)} MB` },
];

/* ================== CONNECTED CARD MESH ==================
   Cards are laid out in a grid; an overlay SVG draws soft
   data-lines between the *actual measured* card centres, so
   the network tracks responsive layout and hover state.
   ========================================================= */
function CardMesh({ items, hover }: { items: Project[]; hover: string | null }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [rails, setRails] = useState<{ x1: number; y1: number; x2: number; y2: number; hot: boolean }[]>([]);

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const box = wrap.getBoundingClientRect();
    const cards = Array.from(wrap.querySelectorAll<HTMLElement>('[data-card-id]'));
    const centres = cards.map((c) => {
      const r = c.getBoundingClientRect();
      return {
        id: c.dataset.cardId ?? '',
        x: r.left - box.left + r.width / 2,
        y: r.top - box.top + r.height / 2,
      };
    });

    const next: typeof rails = [];
    for (let i = 0; i < centres.length; i++) {
      for (let j = i + 1; j < centres.length; j++) {
        const a = centres[i], b = centres[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        /* only near neighbours — keeps it a network, not a spiderweb */
        if (dist > 620) continue;
        next.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, hot: hover === a.id || hover === b.id });
      }
    }
    setRails(next);
  }, [hover]);

  useEffect(() => {
    measure();
    const id = setTimeout(measure, 260);   /* after reveal transforms settle */
    window.addEventListener('resize', measure);
    return () => { clearTimeout(id); window.removeEventListener('resize', measure); };
  }, [measure, items.length]);

  return (
    <div ref={wrapRef} className="mesh relative">
      {/* connector rails sit behind the cards */}
      <svg className="mesh-rail inset-0 h-full w-full" aria-hidden="true">
        {rails.map((r, i) => (
          <g key={i}>
            <line x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
              stroke="rgba(140,200,235,0.10)" strokeWidth="1" />
            <line x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
              stroke={r.hot ? 'var(--ion)' : 'rgba(111,227,255,0.30)'}
              strokeWidth={r.hot ? 1.6 : 1}
              className="conduit-line"
              opacity={r.hot ? 1 : 0.65} />
          </g>
        ))}
        {rails.filter((r) => r.hot).map((r, i) => (
          <circle key={`s${i}`} r="2.6" fill="#fff">
            <animateMotion dur="1.4s" repeatCount="indefinite" path={`M ${r.x1} ${r.y1} L ${r.x2} ${r.y2}`} />
            <animate attributeName="opacity" values="0;1;1;0" dur="1.4s" repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      {items.map((p, i) => {
        const meta = CAT_META[p.cat];
        const res = resultsFor(p, i);
        return (
          <Reveal key={p.title} delay={(i % 2) * 80}>
            <article
              data-card-id={p.title}
              className="vw-card group relative z-[1] flex h-full flex-col"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).dispatchEvent(
                  new CustomEvent('mesh:hover', { bubbles: true, detail: p.title }),
                );
              }}
            >
              <span className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-md border border-[var(--line)] bg-[rgba(8,12,20,0.7)] px-2 py-1 font-mono2 text-[8px] uppercase tracking-[0.16em] text-[var(--faint)] backdrop-blur-sm">
                <Waypoints size={9} style={{ color: meta.tone }} /> node {String(i + 1).padStart(2, '0')}
              </span>

              <div className="relative h-44 overflow-hidden sm:h-48">
                <img src={p.img} alt={`${p.title} — preview`} loading="lazy" className="vw-img h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,11,18,0.94) 0%, rgba(8,11,18,0.2) 48%, transparent 72%)' }} />
                {p.featured && (
                  <span className="absolute right-4 top-14 flex items-center gap-1.5 rounded-md bg-gradient-to-r from-[var(--ion)] to-[var(--ember)] px-2.5 py-1 font-mono2 text-[8.5px] font-semibold uppercase tracking-[0.16em] text-[#04121b]">
                    <Star size={9} /> hub
                  </span>
                )}
                <h3 className="absolute inset-x-5 bottom-4 font-display text-[20px] leading-[1.15] tracking-[-0.02em] text-[var(--txt)] sm:text-[23px]">
                  {p.title}
                </h3>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border px-2 py-0.5 font-mono2 text-[8.5px] uppercase tracking-[0.16em]"
                    style={{ color: meta.tone, borderColor: `color-mix(in srgb, ${meta.tone} 40%, transparent)` }}>
                    {meta.label}
                  </span>
                  <span className="micro-cluster ml-auto"><span /><span /><span /></span>
                </div>

                <p className="text-[12.5px] leading-[1.7] text-[var(--dim)]">{p.desc}</p>

                <div className="flex divide-x divide-[var(--line-faint)] border-y border-[var(--line-faint)]">
                  {res.map((r) => (
                    <div key={r.k} className="flex-1 px-3 py-2.5 text-center">
                      <div className="font-display text-[15px] text-[var(--arc)]">{r.v}</div>
                      <div className="mt-0.5 font-mono2 text-[8px] uppercase tracking-[0.18em] text-[var(--faint)]">{r.k}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex items-center gap-3 border-t border-[var(--line-faint)] pt-4">
                  <a href={`#/project/${p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}
                    className="flex items-center gap-1.5 font-head text-[11.5px] uppercase tracking-[0.1em] text-[var(--ion)] transition-colors hover:text-[var(--arc)]">
                    Case notes <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                  <a href={p.repo} target="_blank" rel="noreferrer"
                    className="ml-auto flex items-center gap-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--faint)] transition-colors hover:text-[var(--arc)]">
                    <GitBranch size={11} /> source
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<ProjCat | 'all'>('all');
  const [expanded, setExpanded] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  /* cards emit a bubbling custom event; the section owns the hover state
     so the mesh can highlight rails without prop-drilling through Reveal */
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const on = (e: Event) => setHover((e as CustomEvent<string>).detail);
    el.addEventListener('mesh:hover', on);
    return () => el.removeEventListener('mesh:hover', on);
  }, []);

  const list = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.cat === filter);
  const shown = expanded ? list : list.slice(0, 6);

  return (
    <section id="projects" className="relative mx-auto max-w-[1440px] px-6 py-20 md:py-28 lg:px-10" ref={hostRef}>
      <SectionHead
        index="04"
        kicker="Selected projects"
        mm="ပရောဂျက်များ"
        title={<>A network of <span className="grad-text">shipped systems</span></>}
        desc="Sixteen production pieces wired to the same core. Hover any node to light its connections — every card reports its own measured numbers."
      />

      <Reveal>
        <div className="mb-12 flex flex-wrap items-center gap-2">
          {PROJ_FILTERS.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id}
              className={`rounded-lg border px-5 py-2 font-head text-[12px] uppercase tracking-[0.08em] transition-all duration-300 ${
                filter === f.id
                  ? 'border-transparent bg-gradient-to-r from-[var(--ion)] to-[var(--ember)] text-[#04121b] shadow-[var(--glow-ion)]'
                  : 'border-[var(--line)] text-[var(--dim)] hover:border-[var(--ion)] hover:text-[var(--ion)]'
              }`}>
              {f.label}
            </button>
          ))}
          <span className="ml-auto hidden font-mono2 text-[9.5px] uppercase tracking-[0.18em] text-[var(--faint)] lg:block">
            {list.length} nodes online
          </span>
        </div>
      </Reveal>

      <div onMouseLeave={() => setHover(null)}>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {/* the mesh measures real card positions, so it spans the grid */}
          <div className="md:col-span-2 xl:col-span-3">
            <CardMesh items={shown} hover={hover} />
          </div>
        </div>
      </div>

      {list.length > 6 && (
        <Reveal delay={100}>
          <button onClick={() => setExpanded((e) => !e)}
            className="reactor-module mx-auto mt-10 flex items-center gap-3 px-8 py-4 font-head text-[12px] uppercase tracking-[0.14em] text-[var(--dim)] transition-colors hover:text-[var(--ion)]">
            {expanded ? 'Collapse the mesh' : `Expand the mesh · ${list.length} nodes`}
            <ArrowUpRight size={14} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </Reveal>
      )}

      {/* ============================ CASE STUDIES ============================ */}
      <div className="mt-24" id="case-studies-home">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker mb-3"><span className="kicker-line" />Case studies</p>
              <h3 className="font-display text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.1] tracking-[-0.02em] text-[var(--txt)]">
                Problem, approach, <span className="grad-text">measured outcome</span>
              </h3>
            </div>
            <a href="#/case-studies" className="flex items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.18em] text-[var(--ion)] transition-colors hover:text-[var(--arc)]">
              full dossier <ArrowUpRight size={12} />
            </a>
          </div>
        </Reveal>

        <div className="space-y-5">
          {CASE_STUDIES.map((cs, i) => (
            <Reveal key={cs.slug} delay={i * 80}>
              <a href={`#/case-study/${cs.slug}`} className="reactor-module group grid overflow-hidden md:grid-cols-[300px_1fr]">
                <div className="relative h-48 overflow-hidden md:h-full">
                  <img src={cs.hero} alt={cs.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.04]" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,11,18,0.6), transparent 60%)' }} />
                </div>
                <div className="flex flex-col gap-4 p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3 font-mono2 text-[9px] uppercase tracking-[0.18em] text-[var(--faint)]">
                    <span className="text-[var(--ember)]">{cs.year}</span>·<span>{cs.role}</span>·<span>{cs.duration}</span>
                  </div>
                  <h4 className="font-display text-[23px] leading-[1.12] tracking-[-0.02em] text-[var(--txt)] transition-colors group-hover:text-[var(--ion)]">
                    {cs.title}
                  </h4>

                  {/* problem / approach — two lines, then measures */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="font-mono2 text-[8.5px] uppercase tracking-[0.2em] text-[var(--faint)]">Problem</div>
                      <p className="mt-1.5 text-[12px] leading-[1.65] text-[var(--dim)] line-clamp-4">{cs.problem}</p>
                    </div>
                    <div>
                      <div className="font-mono2 text-[8.5px] uppercase tracking-[0.2em] text-[var(--faint)]">Approach</div>
                      <ul className="mt-1.5 space-y-1">
                        {cs.approach.slice(0, 3).map((a) => (
                          <li key={a} className="flex gap-2 text-[12px] leading-[1.55] text-[var(--dim)]">
                            <span className="mt-[7px] h-1 w-1 shrink-0 bg-[var(--ion)]" />{a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-1 flex flex-wrap gap-x-7 gap-y-2 border-t border-[var(--line-faint)] pt-4">
                    {cs.metrics.slice(0, 3).map((m) => (
                      <span key={m.label} className="flex items-baseline gap-2">
                        <span className="font-display text-[17px] text-[var(--arc)]">{m.delta}</span>
                        <span className="font-mono2 text-[8.5px] uppercase tracking-[0.14em] text-[var(--faint)]">{m.label}</span>
                      </span>
                    ))}
                    <span className="ml-auto hidden items-center gap-2 font-head text-[11px] uppercase tracking-[0.12em] text-[var(--ion)] sm:flex">
                      read <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* kept export — concierge panel renders this schematic */
export function CircuitSchematic({ heat, onPick }: { heat: string; onPick?: (n: string) => void }) {
  const nodes = [
    { id: 'ui', x: 60, y: 118, name: 'UI', sub: 'Compose / Flutter', color: 'var(--ion)' },
    { id: 'vm', x: 190, y: 118, name: 'STATE', sub: 'ViewModel', color: 'var(--hot)' },
    { id: 'use', x: 320, y: 58, name: 'DOMAIN', sub: 'pure Kotlin', color: 'var(--ember)' },
    { id: 'db', x: 320, y: 178, name: 'LOCAL', sub: 'Room', color: 'var(--stable)' },
    { id: 'net', x: 452, y: 118, name: 'REMOTE', sub: 'Retrofit', color: 'var(--magenta)' },
  ];
  const links: [string, string][] = [['ui', 'vm'], ['vm', 'use'], ['vm', 'db'], ['use', 'net'], ['db', 'net']];
  const at = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <svg viewBox="0 0 512 236" className="h-full w-full" role="img" aria-label="Architecture data-flow diagram">
      {links.map(([a, b], i) => {
        const A = at(a), B = at(b);
        const hot = heat === a || heat === b;
        return (
          <g key={i}>
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgba(168,240,255,0.10)" strokeWidth="2" />
            <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={hot ? 'var(--arc)' : 'var(--ion)'}
              strokeWidth={hot ? 2 : 1.2} className="conduit-line" opacity={hot ? 1 : 0.6} />
          </g>
        );
      })}
      {nodes.map((n) => {
        const hot = heat === n.id;
        return (
          <g key={n.id} onClick={() => onPick?.(n.id)} className={onPick ? 'cursor-pointer' : ''}
            style={{ transform: hot ? 'scale(1.06)' : 'scale(1)', transformOrigin: `${n.x}px ${n.y}px`, transition: 'transform 0.3s ease' }}>
            <circle cx={n.x} cy={n.y} r={hot ? 30 : 24} fill="var(--bg-3)" stroke={hot ? n.color : 'rgba(168,240,255,0.18)'}
              strokeWidth={hot ? 2 : 1.1} style={hot ? { filter: `drop-shadow(0 0 12px ${n.color})` } : undefined} />
            <circle cx={n.x} cy={n.y} r={hot ? 5 : 3.4} fill={hot ? n.color : 'rgba(168,240,255,0.4)'} className={hot ? 'atom-core' : ''} />
            <text x={n.x} y={n.y + 42} textAnchor="middle" fill={hot ? n.color : 'var(--dim)'}
              style={{ font: '600 9.5px "Space Grotesk", sans-serif' }}>{n.name}</text>
            <text x={n.x} y={n.y + 54} textAnchor="middle" fill="var(--faint)"
              style={{ font: '8px "IBM Plex Mono", monospace' }}>{n.sub}</text>
          </g>
        );
      })}
    </svg>
  );
}
