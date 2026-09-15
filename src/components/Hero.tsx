import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { ArrowRight, ChevronDown, Activity, MousePointer2 } from 'lucide-react';
import { PROFILE, ROLES, STATS, SOCIALS, I18N, IMAGES, MARQUEE_ITEMS } from '../data';
import { useTyping, useLang } from '../hooks';
import { SocialIcon, StatCounter, Reveal, Marquee } from './ui';
import { NeuralField } from './fx';

/* ---------------- interactive cortex ---------------- */
type Pt = { x: number; y: number };
const W = 520, H = 420;

const NODES: { id: string; x: number; y: number; label: string; sub: string; tone: string }[] = [
  { id: 'kotlin',  x: 96,  y: 96,  label: 'Kotlin',    sub: 'core language',   tone: 'var(--ion)' },
  { id: 'compose', x: 262, y: 44,  label: 'Compose',   sub: 'UI layer',        tone: 'var(--arc)' },
  { id: 'arch',    x: 424, y: 104, label: 'Clean Arch',sub: 'module boundary', tone: 'var(--ember)' },
  { id: 'fire',    x: 452, y: 268, label: 'Firebase',  sub: 'sync + relay',    tone: 'var(--magenta)' },
  { id: 'ai',      x: 250, y: 372, label: 'On-device AI', sub: 'LiteRT-LM',    tone: 'var(--stable)' },
  { id: 'room',    x: 72,  y: 268, label: 'Room',      sub: 'local truth',     tone: 'var(--amber)' },
  { id: 'hub',     x: 260, y: 208, label: 'MKA',       sub: 'you are here',    tone: 'var(--hot)' },
];

const EDGES: [string, string][] = [
  ['kotlin', 'hub'], ['compose', 'hub'], ['arch', 'hub'],
  ['fire', 'hub'], ['ai', 'hub'], ['room', 'hub'],
  ['kotlin', 'compose'], ['compose', 'arch'], ['arch', 'fire'],
  ['fire', 'ai'], ['ai', 'room'], ['room', 'kotlin'],
];

export default function Hero() {
  const lang = useLang();
  const t = I18N[lang];
  const typed = useTyping(ROLES, 46, 22, 2200);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState('hub');
  const [dragId, setDragId] = useState<string | null>(null);
  const [pos, setPos] = useState<Record<string, Pt>>(() =>
    Object.fromEntries(NODES.map((n) => [n.id, { x: n.x, y: n.y }])),
  );
  const [pulse, setPulse] = useState<{ from: string; at: number }[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => { const id = setTimeout(() => setMounted(true), 60); return () => clearTimeout(id); }, []);

  /* idle firing so the cortex always thinks */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      const e = EDGES[Math.floor(Math.random() * EDGES.length)];
      setPulse((p) => [...p.slice(-6), { from: `${e[0]}>${e[1]}`, at: performance.now() }]);
    }, 1900);
    return () => clearInterval(id);
  }, []);

  /* clean up finished pulses */
  useEffect(() => {
    if (!pulse.length) return;
    const id = setTimeout(() => setPulse((p) => p.slice(1)), 1500);
    return () => clearTimeout(id);
  }, [pulse]);

  const toLocal = useCallback((e: ReactMouseEvent | globalThis.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    return {
      x: ((e as globalThis.MouseEvent).clientX - r.left) / r.width * W,
      y: ((e as globalThis.MouseEvent).clientY - r.top) / r.height * H,
    };
  }, []);

  useEffect(() => {
    if (!dragId) return;
    const move = (e: globalThis.MouseEvent) => {
      const p = toLocal(e);
      setPos((prev) => ({ ...prev, [dragId]: { x: Math.max(24, Math.min(W - 24, p.x)), y: Math.max(24, Math.min(H - 24, p.y)) } }));
    };
    const up = () => setDragId(null);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [dragId, toLocal]);

  const fireTo = (id: string) => {
    setActive(id);
    setPulse((p) => [...p.slice(-6), { from: `hub>${id}`, at: performance.now() }, { from: `${id}>hub`, at: performance.now() + 220 }]);
  };

  const enter = (d: number) => ({
    transitionDelay: `${d}ms`,
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'none' : 'translateY(18px)',
    transition: 'opacity 0.9s cubic-bezier(0.2,0.8,0.2,1), transform 0.9s cubic-bezier(0.2,0.8,0.2,1)',
  } as React.CSSProperties);

  const activeNode = NODES.find((n) => n.id === active)!;
  const activeInfo: Record<string, string> = useMemo(() => ({
    kotlin: 'Coroutines and Flow carry every async path. Twelve years in, it is still the language I think in.',
    compose: 'Declarative UI as a pure function of state — keyed lists and stable models keep recomposition microscopic.',
    arch: 'Domain stays platform-free, declared as contracts. A build rule fails the PR if an Android import appears.',
    fire: 'Firestore and FCM behind repository interfaces; the network is a sync mechanism, never a requirement.',
    ai: 'LiteRT-LM on the handset: 96 ms first token, 150 MB ceiling, cloud only with explicit consent.',
    room: 'Local database is the source of truth. Reads resolve offline instantly; mutations replay when the relay returns.',
    hub: 'Everything routes through the same core — one presenter layer, four platform shells. That is the whole design.',
  }), []);

  return (
    <section id="home" className="relative flex min-h-screen flex-col overflow-hidden">
      <div className="absolute inset-0 -z-[5]" aria-hidden="true">
        <NeuralField density={0.00007} link={135} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 78% 64% at 50% 40%, transparent 28%, var(--bg) 100%)' }} />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 items-center px-6 pb-12 pt-32 lg:px-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-6">

          {/* ---------- statement ---------- */}
          <div>
            <p style={enter(60)} className={`mb-6 flex flex-wrap items-center gap-3 font-mono2 text-[10px] uppercase tracking-[0.28em] text-[var(--ion)] ${lang === 'mm' ? 'font-mm' : ''}`}>
              <span className="h-px w-9 bg-gradient-to-r from-[var(--ion)] to-transparent" />
              Neural interface · <span className="font-mm text-[var(--amber)]">{PROFILE.mmName}</span>
            </p>

            <h1 style={enter(140)} className="font-display text-[clamp(2.4rem,5.8vw,4.6rem)] leading-[1.03] tracking-[-0.03em] text-[var(--txt)]">
              I build mobile systems
              <br />
              that <span className="grad-text">think before</span>
              <br />
              they <span className="text-[var(--arc)]">respond.</span>
            </h1>

            <p style={enter(260)} className={`mt-7 max-w-[54ch] text-[15px] leading-[1.8] text-[var(--dim)] ${lang === 'mm' ? 'font-mm' : ''}`}>
              Twelve years of Android and Flutter engineering wired into one architecture — clean boundaries,
              offline-first data, on-device intelligence. Every path is instrumented, measured on real hardware,
              and stable at <span className="text-[var(--arc)]">99.9% crash-free</span> across 3,000+ deployments.
            </p>

            <div style={enter(340)} className="mt-7 inline-flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--panel-soft)] py-2.5 pl-4 pr-5">
              <Activity size={14} className="text-[var(--ion)]" />
              <p className="font-mono2 text-[11.5px] tracking-tight text-[var(--txt-soft)] sm:text-[12.5px]">
                {typed}<span className="type-caret" />
              </p>
            </div>

            <div style={enter(420)} className="mt-9 flex flex-wrap gap-3">
              <a href="#projects" className="btn btn-primary">Explore the network <ArrowRight size={15} /></a>
              <a href="#contact" className="btn btn-ghost">Open a channel</a>
            </div>

            <div style={enter(500)} className="mt-9 flex flex-wrap items-center gap-2">
              <span className="mr-2 font-mono2 text-[9px] uppercase tracking-[0.24em] text-[var(--fainter)]">Signal</span>
              {SOCIALS.slice(0, 8).map((s) => (
                <a key={s.key} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  aria-label={s.label} title={`${s.label} · ${s.handle}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--panel-soft)] text-[var(--dim)] transition-all hover:-translate-y-0.5 hover:border-[var(--ion)] hover:text-[var(--ion)] hover:shadow-[var(--glow-ion)]">
                  <SocialIcon name={s.key} size={14} />
                </a>
              ))}
              <span className={`ml-2 flex items-center gap-2 font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--faint)] ${lang === 'mm' ? 'font-mm' : ''}`}>
                <span className="pulse-dot" /> {t.available}
              </span>
            </div>
          </div>

          {/* ---------- interactive cortex ---------- */}
          <div style={enter(300)} className="relative mx-auto w-full max-w-[560px]">
            <div className="reactor-module overflow-hidden">
              <div className="hud-strip">
                <span className="flex items-center gap-2">
                  <span className="led" /> cortex · live topology
                </span>
                <span className="flex items-center gap-1.5 normal-case tracking-normal">
                  <MousePointer2 size={11} /> drag nodes
                </span>
              </div>

              <div className="relative bg-[rgba(6,9,16,0.55)] p-2">
                <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="h-[380px] w-full touch-none sm:h-[420px]" role="img" aria-label="Interactive architecture network">
                  <defs>
                    <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(111,227,255,0.30)" />
                      <stop offset="100%" stopColor="rgba(111,227,255,0)" />
                    </radialGradient>
                    <clipPath id="hubClip"><circle r="19" cx="0" cy="0" /></clipPath>
                  </defs>

                  {/* base wiring */}
                  {EDGES.map(([a, b], i) => {
                    const A = pos[a], B = pos[b];
                    const hot = active === a || active === b;
                    return (
                      <g key={i}>
                        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                          stroke="rgba(140,200,235,0.12)" strokeWidth="1" />
                        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                          stroke={hot ? 'var(--ion)' : 'rgba(111,227,255,0.35)'}
                          strokeWidth={hot ? 1.8 : 1.1}
                          className="conduit-line"
                          opacity={hot ? 1 : 0.7} />
                      </g>
                    );
                  })}

                  {/* travelling impulses */}
                  {pulse.map((p, i) => {
                    const [a, b] = p.from.split('>');
                    const A = pos[a], B = pos[b];
                    if (!A || !B) return null;
                    return (
                      <circle key={`${p.at}-${i}`} r="3.2" fill="#ffffff">
                        <animateMotion dur="1.1s" fill="freeze" path={`M ${A.x} ${A.y} L ${B.x} ${B.y}`} />
                        <animate attributeName="opacity" values="0;1;1;0" dur="1.1s" fill="freeze" />
                      </circle>
                    );
                  })}

                  {/* hub aura */}
                  <circle cx={pos.hub.x} cy={pos.hub.y} r="72" fill="url(#hubGlow)" className="reactor-pulse" />

                  {/* nodes */}
                  {NODES.map((n) => {
                    const p = pos[n.id];
                    const isHub = n.id === 'hub';
                    const on = active === n.id;
                    return (
                      <g key={n.id} transform={`translate(${p.x} ${p.y})`}
                        onMouseDown={(e) => { e.preventDefault(); setDragId(n.id); }}
                        onMouseEnter={() => !dragId && setActive(n.id)}
                        onClick={() => !dragId && fireTo(n.id)}
                        className="cursor-grab active:cursor-grabbing">
                        <circle r={isHub ? 34 : 26} fill="transparent" />
                        {isHub ? (
                          <>
                            <image href={IMAGES.avatar} x={-19} y={-19} width={38} height={38}
                              clipPath="url(#hubClip)" preserveAspectRatio="xMidYMid slice" />
                            <circle r={22} fill="none" stroke={n.tone} strokeWidth="2"
                              className="atom-core" style={{ filter: `drop-shadow(0 0 12px ${n.tone})` }} />
                          </>
                        ) : (
                          <>
                            <circle r={on ? 17 : 14}
                              fill="var(--bg-2)" stroke={n.tone} strokeWidth={on ? 2 : 1.2}
                              className={on ? 'atom-core' : ''}
                              style={on ? { filter: `drop-shadow(0 0 12px ${n.tone})` } : undefined} />
                            <circle r={on ? 5.5 : 4.5} fill={n.tone} />
                          </>
                        )}
                        <text y={isHub ? 44 : 36} textAnchor="middle" fill={on ? 'var(--txt)' : 'var(--dim)'}
                          style={{ font: '600 11px "Space Grotesk", sans-serif', pointerEvents: 'none' }}>
                          {n.label}
                        </text>
                        <text y={isHub ? 57 : 48} textAnchor="middle" fill="var(--faint)"
                          style={{ font: '8px "IBM Plex Mono", monospace', pointerEvents: 'none' }}>
                          {n.sub}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* inspector */}
              <div className="border-t border-[var(--line-faint)] p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-[15px] text-[var(--txt)]">{activeNode.label}</span>
                  <span className="font-mono2 text-[9px] uppercase tracking-[0.18em] text-[var(--ion)]">node · {activeNode.id}</span>
                </div>
                <p className="mt-2 text-[12.5px] leading-[1.7] text-[var(--dim)]">{activeInfo[active]}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Reveal className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-10 lg:px-10">
        <div className="reactor-module hud-scan overflow-hidden">
          <div className="hud-strip">
            <span>signal log · twelve seasons</span>
            <span className="flex items-center gap-2 text-[var(--stable)]"><span className="led" /> measured in production</span>
          </div>
          <div className="grid grid-cols-2 divide-[var(--line-faint)] md:grid-cols-4 md:divide-x">
            {STATS.map((s) => <StatCounter key={s.label} stat={s} />)}
          </div>
        </div>
      </Reveal>

      <Marquee items={MARQUEE_ITEMS} />

      <div className="relative z-10 flex justify-center pb-4 pt-2">
        <a href="#about" aria-label="Continue" className="flex flex-col items-center gap-1 text-[var(--faint)] transition-colors hover:text-[var(--ion)]">
          <span className="font-mono2 text-[8px] uppercase tracking-[0.3em]">descend</span>
          <ChevronDown size={14} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
}


