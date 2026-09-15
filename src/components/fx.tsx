import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useScrollY } from '../hooks';

/* ============================================================
   NEURAL FIELD — a live network of synapses.
   Nodes drift on a slow flow field, link within a radius, and
   fire a travelling impulse along a link at random intervals so
   the network visibly *thinks*. The cursor is a probe: nodes
   within range light up, pull toward it, and link to it.
   Respects prefers-reduced-motion (renders one static frame).
   ============================================================ */
export function NeuralField({
  density = 0.00006,
  link = 150,
  impulses = true,
  probe = true,
  className = '',
}: {
  density?: number; link?: number; impulses?: boolean; probe?: boolean; className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, t0 = performance.now();
    const p = { x: -9999, y: -9999, on: false };

    const TONES = ['111, 227, 255', '126, 166, 255', '169, 140, 255'];
    interface Node {
      x: number; y: number; vx: number; vy: number; r: number;
      rgb: string; ph: number; charge: number;
    }
    interface Spark { a: number; b: number; t: number; speed: number; rgb: string; }
    let nodes: Node[] = [];
    let sparks: Spark[] = [];

    const make = (): Node => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: 1 + Math.random() * 1.8,
      rgb: TONES[Math.floor(Math.random() * TONES.length)],
      ph: Math.random() * Math.PI * 2,
      charge: 0,
    });

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(24, Math.min(110, Math.round(w * h * density)));
      nodes = Array.from({ length: n }, make);
      sparks = [];
    };

    const frame = (now: number) => {
      const t = (now - t0) * 0.001;
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        /* slow drift + gentle sway */
        n.vx += Math.sin(n.y * 0.008 + t * 0.35 + n.ph) * 0.004;
        n.vy += Math.cos(n.x * 0.008 + t * 0.3 + n.ph) * 0.004;

        /* probe: excite and attract */
        if (probe && p.on) {
          const dx = p.x - n.x, dy = p.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 26000 && d2 > 25) {
            n.vx += dx * 0.00016;
            n.vy += dy * 0.00016;
            n.charge = Math.min(1, n.charge + 0.05);
          }
        }
        n.vx *= 0.99; n.vy *= 0.99;
        n.vx = Math.max(-0.6, Math.min(0.6, n.vx));
        n.vy = Math.max(-0.6, Math.min(0.6, n.vy));
        n.x += n.vx; n.y += n.vy;
        n.charge *= 0.985;

        if (n.x < -20) n.x = w + 15; else if (n.x > w + 20) n.x = -15;
        if (n.y < -20) n.y = h + 15; else if (n.y > h + 20) n.y = -15;
      }

      /* links */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > link) continue;
          const alpha = (1 - dist / link) * 0.22;
          ctx.strokeStyle = `rgba(${a.rgb}, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();

          /* fire a synapse occasionally on strong links */
          if (impulses && dist < link * 0.55 && Math.random() < 0.0009) {
            sparks.push({ a: i, b: j, t: 0, speed: 0.6 + Math.random() * 0.9, rgb: a.rgb });
          }
        }
      }

      /* probe tether */
      if (probe && p.on) {
        for (const n of nodes) {
          const d = Math.hypot(p.x - n.x, p.y - n.y);
          if (d < 170) {
            ctx.strokeStyle = `rgba(168, 240, 255, ${0.20 * (1 - d / 170)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }
        ctx.strokeStyle = 'rgba(168, 240, 255, 0.16)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 46 + Math.sin(t * 2.2) * 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      /* travelling impulses */
      sparks = sparks.filter((s) => s.t < 1);
      for (const s of sparks) {
        const a = nodes[s.a], b = nodes[s.b];
        if (!a || !b) continue;
        s.t += 0.016 * s.speed * 2.2;
        const e = s.t;
        const x = a.x + (b.x - a.x) * e;
        const y = a.y + (b.y - a.y) * e;
        const fade = Math.sin(Math.PI * e);

        /* the wire brightens, then a bright bead rides it */
        ctx.strokeStyle = `rgba(${s.rgb}, ${0.30 * fade})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fillStyle = `rgba(255,255,255,${0.85 * fade})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.9 * fade + 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      /* nodes */
      for (const n of nodes) {
        const glow = Math.min(1, 0.3 + n.charge * 0.7);
        const br = 1 + Math.sin(t * 1.6 + n.ph) * 0.25 + n.charge;

        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 7);
        g.addColorStop(0, `rgba(${n.rgb}, ${0.34 * glow})`);
        g.addColorStop(1, `rgba(${n.rgb}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,255,255,${0.6 * glow})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (0.5 + br * 0.25), 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      p.x = e.clientX - r.left;
      p.y = e.clientY - r.top;
      p.on = true;
    };
    const onLeave = () => { p.on = false; };

    resize();
    frame(performance.now());
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseout', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
    };
  }, [density, link, impulses, probe]);

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />;
}

/* ============ PRELOADER — synapses coming online ============ */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const dur = 1550;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => { setGone(true); setTimeout(onDone, 620); }, 200);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  const stages = ['spawning synapses', 'linking cortex', 'calibrating signals', 'interface live'];
  const stage = stages[Math.min(stages.length - 1, Math.floor(pct / 26))];

  return (
    <div className={`preloader ${gone ? 'done' : ''}`} aria-hidden={gone}>
      <div className="chamber">
        <div className="coil-lattice" />
        <div className="heat-floor" />
      </div>
      <NeuralField density={0.00009} link={130} className="opacity-90" />

      <div className="relative flex flex-col items-center gap-7 px-6">
        {/* three-node motif */}
        <div className="relative h-24 w-28">
          <svg viewBox="0 0 112 96" className="h-full w-full">
            <line x1="22" y1="24" x2="90" y2="20" stroke="var(--ion)" strokeWidth="1" opacity="0.5" className="conduit-line" />
            <line x1="22" y1="24" x2="56" y2="78" stroke="var(--ember)" strokeWidth="1" opacity="0.5" className="conduit-line" />
            <line x1="90" y1="20" x2="56" y2="78" stroke="var(--magenta)" strokeWidth="1" opacity="0.5" className="conduit-line" />
            {[[22, 24], [90, 20], [56, 78]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="6" fill="var(--bg)" stroke="var(--ion)" strokeWidth="1.4" className="atom-core" style={{ animationDelay: `${i * 0.4}s` }} />
            ))}
          </svg>
        </div>

        <div className="font-mono2 text-[9.5px] uppercase tracking-[0.36em] text-[var(--ion)]">
          MKA · neural interface
        </div>

        <div className="w-[280px]">
          <div className="gauge-track">
            <div className="gauge-fill" style={{ width: `${pct}%`, transition: 'width 130ms linear' }} />
          </div>
          <div className="mt-3 flex items-baseline justify-between font-mono2 text-[10px]">
            <span className="lowercase tracking-normal text-[var(--dim)]">{stage}…</span>
            <span className="text-[var(--arc)] tabular-nums">{pct}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ CURSOR — native pointer ============ */
export function Cursor() { return null; }

/* ============ BACKGROUND ============ */
export function Background() {
  return (
    <div className="chamber" aria-hidden="true">
      <div className="contain-rings" />
      <div className="coil-lattice" />
      <div className="plasma-haze" style={{ left: '-6%' }} />
      <div className="plasma-haze" style={{ right: '-8%', background: 'linear-gradient(to bottom, rgba(169,140,255,0.05), transparent 58%)' }} />
      <NeuralField density={0.000038} link={120} className="opacity-70" />
      <div className="heat-floor" />
    </div>
  );
}

/* ============ TILT (API compat) ============ */
export function Tilt({ children, className = '' }: { children: React.ReactNode; className?: string; max?: number }) {
  return <div className={className}>{children}</div>;
}

/* ============ BACK TO TOP ============ */
export function BackToTop() {
  const y = useScrollY();
  const show = y > 460;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--line-strong)] bg-[var(--panel)] text-[var(--ion)] backdrop-blur-md transition-all duration-500 hover:border-[var(--ion)] hover:shadow-[var(--glow-ion)] ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <ArrowUp size={17} />
    </button>
  );
}

/* ============ STICKY CTA ============ */
export function StickyCta() {
  const y = useScrollY();
  const show = y > 760;
  return (
    <a
      href="#contact"
      className={`fixed bottom-6 left-6 z-40 hidden items-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] py-2.5 pl-3 pr-4 font-mono2 text-[10px] uppercase tracking-[0.16em] backdrop-blur-md transition-all duration-500 hover:border-[var(--ion)] hover:shadow-[var(--glow-ion)] md:flex ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <span className="pulse-dot" />
      <span className="text-[var(--dim)]">Open a channel</span>
    </a>
  );
}
