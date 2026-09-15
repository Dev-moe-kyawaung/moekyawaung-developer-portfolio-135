import { useEffect, useRef, useState } from 'react';

/* ============================================================
   REACTOR DEFS — SVG filters powering the heatwave distortion.
   The turbulence baseFrequency is animated (SMIL) so anything
   wrapped in .heatwave visibly refracts like hot air.
   ============================================================ */
export function ReactorDefs() {
  const reduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <filter id="reactorHeat" x="-14%" y="-14%" width="128%" height="128%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves="2" seed="7" result="warp">
            {!reduced && (
              <animate attributeName="baseFrequency" dur="9s"
                values="0.012 0.05;0.022 0.075;0.010 0.045;0.012 0.05" repeatCount="indefinite" />
            )}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="reactorHeatSoft" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.03" numOctaves="1" seed="3" result="w">
            {!reduced && (
              <animate attributeName="baseFrequency" dur="13s"
                values="0.008 0.03;0.014 0.05;0.008 0.03" repeatCount="indefinite" />
            )}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="w" scale="4.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

/* ============================================================
   PLASMA FIELD — canvas ionization simulation.
   Charged ions stream on turbulence flow-lines, stretch into
   neon trails by velocity, arc-discharge to nearby ions, and
   the cursor acts as a high-voltage probe.
   ============================================================ */
export function PlasmaField({
  density = 0.0001,
  flow = 0.5,
  arcs = true,
  probe = true,
  className = '',
}: {
  density?: number; flow?: number; arcs?: boolean; probe?: boolean; className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, t0 = performance.now();
    const probePos = { x: -9999, y: -9999, on: false };

    /* thermal species: hottest blue → white core → ember → magenta instability */
    const SPECIES = [
      { rgb: '56,214,255', r: 1.9, wt: 0.44 },
      { rgb: '234,252,255', r: 1.4, wt: 0.2 },
      { rgb: '255,106,43', r: 2.4, wt: 0.24 },
      { rgb: '255,61,139', r: 2.9, wt: 0.12 },
    ];
    const pick = () => {
      let t = Math.random(), acc = 0;
      for (const s of SPECIES) { acc += s.wt; if (t <= acc) return s; }
      return SPECIES[0];
    };

    interface Ion { x: number; y: number; vx: number; vy: number; s: { rgb: string; r: number; wt: number }; charge: number; ph: number; }
    let ions: Ion[] = [];

    const seed = (): Ion => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -0.15 - Math.random() * 0.55,
      s: pick(),
      charge: 0.35 + Math.random() * 0.65,
      ph: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(28, Math.min(120, Math.round(w * h * density)));
      ions = Array.from({ length: n }, seed);
      ctx.fillStyle = 'rgba(8,9,13,1)';
      ctx.fillRect(0, 0, w, h);
    };

    const ARC = 118;

    const frame = (now: number) => {
      const time = (now - t0) * 0.001;

      /* motion trails — thermal decay */
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(8, 9, 13, 0.26)';
      ctx.fillRect(0, 0, w, h);

      /* integrate */
      for (const p of ions) {
        /* curl-ish flow field: upward plasma drift + lateral convection */
        const swirl = Math.sin(p.y * 0.006 + time * 0.7 + p.ph) * 0.06 * flow;
        p.vx += swirl;
        p.vy -= 0.006 * flow;

        /* probe ionization: cursor excites and pulls nearby ions */
        if (probe && probePos.on) {
          const dx = probePos.x - p.x, dy = probePos.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 30000 && d2 > 20) {
            const f = 0.00042 / Math.max(0.35, Math.sqrt(d2) / 90);
            p.vx += dx * f * 0.02;
            p.vy += dy * f * 0.02;
            p.charge = Math.min(1.6, p.charge + 0.03);
          }
        }

        p.charge += (0.6 - p.charge) * 0.008; /* relax back to nominal */
        p.vx *= 0.985; p.vy *= 0.985;
        p.vx = Math.max(-2.2, Math.min(2.2, p.vx));
        p.vy = Math.max(-2.6, Math.min(1.2, p.vy));
        p.x += p.vx; p.y += p.vy;

        if (p.x < -30) p.x = w + 20; else if (p.x > w + 30) p.x = -20;
        if (p.y < -30) { Object.assign(p, seed(), { y: h + 14, vy: -0.3 }); }
        else if (p.y > h + 40) { Object.assign(p, seed(), { y: -12 }); }
      }

      /* arc discharge between close ions */
      ctx.globalCompositeOperation = 'lighter';
      if (arcs) {
        for (let i = 0; i < ions.length; i++) {
          const a = ions[i];
          for (let j = i + 1; j < ions.length; j++) {
            const b = ions[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const dist = Math.hypot(dx, dy);
            if (dist > ARC) continue;
            const t = 1 - dist / ARC;
            ctx.strokeStyle = `rgba(${a.s.rgb}, ${0.16 * t})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            /* jagged bolt */
            const seg = 2;
            for (let k = 1; k <= seg; k++) {
              const f = k / (seg + 1);
              const jitter = (1 - t) * 6 + 3;
              ctx.lineTo(
                a.x + dx * f + (Math.random() - 0.5) * jitter,
                a.y + dy * f + (Math.random() - 0.5) * jitter,
              );
            }
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      /* ions with velocity streak + halo */
      for (const p of ions) {
        const speed = Math.hypot(p.vx, p.vy);
        const glow = Math.min(1, 0.32 + p.charge * 0.5);

        /* trailing streak (neon particle flow) */
        ctx.strokeStyle = `rgba(${p.s.rgb}, ${0.3 * glow})`;
        ctx.lineWidth = p.s.r * 0.9;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx * (2 + speed * 3.4), p.y - p.vy * (2 + speed * 3.4));
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        /* halo */
        const hr = p.s.r * (3.6 + p.charge * 3.4);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, hr);
        g.addColorStop(0, `rgba(${p.s.rgb}, ${0.5 * glow})`);
        g.addColorStop(1, `rgba(${p.s.rgb}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, hr, 0, Math.PI * 2);
        ctx.fill();

        /* core */
        ctx.fillStyle = `rgba(255,255,255,${0.7 * glow})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s.r * 0.55, 0, Math.PI * 2);
        ctx.fill();
      }

      /* probe field */
      if (probe && probePos.on) {
        ctx.strokeStyle = 'rgba(255,193,77,0.22)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(probePos.x, probePos.y, 52 + Math.sin(time * 3) * 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (!reduced) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      probePos.x = e.clientX - r.left;
      probePos.y = e.clientY - r.top;
      probePos.on = true;
    };
    const onLeave = () => { probePos.on = false; };

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
  }, [density, flow, arcs, probe]);

  return <canvas ref={ref} className={`absolute inset-0 h-full w-full pointer-events-none ${className}`} aria-hidden="true" />;
}

/* ============================================================
   CONTAINMENT CORE — the rotating energy heart.
   Nested coil rings, plasma torus, arc bolts, thermal readouts.
   ============================================================ */
export function ContainmentCore({
  size = 560,
  children,
  intensity = 1,
  label = 'CORE DIRECTOR',
}: {
  size?: number; children?: React.ReactNode; intensity?: number; label?: string;
}) {
  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg viewBox="0 0 560 560" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <radialGradient id="corePlasma" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eafcff" stopOpacity="0.9" />
            <stop offset="26%" stopColor="#38d6ff" stopOpacity="0.5" />
            <stop offset="58%" stopColor="#ff6a2b" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ff3d8b" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="coilHot" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38d6ff" />
            <stop offset="52%" stopColor="#eafcff" />
            <stop offset="100%" stopColor="#ff6a2b" />
          </linearGradient>
        </defs>

        {/* ambient plasma bloom */}
        <circle cx="280" cy="280" r="250" fill="url(#corePlasma)" opacity={0.42 * intensity} className="plasma-throb" />

        {/* outer stator coil ring */}
        <g className="reactor-spin-cw">
          <circle cx="280" cy="280" r="262" fill="none" stroke="url(#coilHot)" strokeWidth="1.6" strokeDasharray="54 22 8 22" opacity="0.75" />
          {Array.from({ length: 16 }).map((_, i) => (
            <rect key={i} x="276" y="8" width="8" height="26" rx="1"
              fill={i % 4 === 0 ? '#ffc14d' : '#38d6ff'} opacity="0.7"
              transform={`rotate(${i * 22.5} 280 280)`} />
          ))}
        </g>

        {/* containment ring with tick marks (counter-rotating) */}
        <g className="reactor-spin-ccw heatwave-soft">
          <circle cx="280" cy="280" r="228" fill="none" stroke="#ff6a2b" strokeWidth="1" opacity="0.6" />
          <circle cx="280" cy="280" r="216" fill="none" stroke="#eafcff" strokeWidth="0.7" strokeDasharray="2 10" opacity="0.5" />
          {Array.from({ length: 36 }).map((_, i) => (
            <line key={i} x1="280" y1="52" x2="280" y2={i % 3 === 0 ? 70 : 62}
              stroke="#eafcff" strokeWidth={i % 9 === 0 ? 2 : 0.8} opacity="0.55"
              transform={`rotate(${i * 10} 280 280)`} />
          ))}
        </g>

        {/* plasma torus — ellipse shells */}
        <g className="reactor-spin-cw" style={{ animationDuration: '11s' }}>
          <ellipse cx="280" cy="280" rx="186" ry="66" fill="none" stroke="#38d6ff" strokeWidth="1.5" opacity="0.55" transform="rotate(14 280 280)" />
          <circle cx="466" cy="280" r="6" fill="#38d6ff" transform="rotate(14 280 280)" style={{ filter: 'drop-shadow(0 0 10px #38d6ff)' }} />
        </g>
        <g className="reactor-spin-ccw" style={{ animationDuration: '15s' }}>
          <ellipse cx="280" cy="280" rx="186" ry="66" fill="none" stroke="#ff3d8b" strokeWidth="1.2" opacity="0.45" transform="rotate(-52 280 280)" />
          <circle cx="466" cy="280" r="4.5" fill="#ff3d8b" transform="rotate(-52 280 280)" style={{ filter: 'drop-shadow(0 0 9px #ff3d8b)' }} />
        </g>
        <g className="reactor-spin-cw" style={{ animationDuration: '21s' }}>
          <ellipse cx="280" cy="280" rx="186" ry="66" fill="none" stroke="#ffc14d" strokeWidth="1" opacity="0.4" transform="rotate(78 280 280)" />
          <circle cx="466" cy="280" r="3.6" fill="#ffc14d" transform="rotate(78 280 280)" style={{ filter: 'drop-shadow(0 0 8px #ffc14d)' }} />
        </g>

        {/* arc bolts flashing between ring and chamber */}
        {[8, 96, 200, 312].map((deg, i) => (
          <path key={deg}
            d="M 280 84 L 268 116 L 286 132 L 272 168"
            fill="none" stroke="#eafcff" strokeWidth="1.5"
            transform={`rotate(${deg} 280 280)`}
            opacity="0.85"
            style={{ animation: `boltFlash 2.6s ${i * 0.65}s ease-in-out infinite` }}
          />
        ))}

        {/* inner magnetic cage */}
        <circle cx="280" cy="280" r="152" fill="none" stroke="#38d6ff" strokeWidth="1" opacity="0.4" strokeDasharray="3 7" />
      </svg>

      <style>{`@keyframes boltFlash { 0%,100% { opacity: 0; } 6% { opacity: 1; } 12% { opacity: 0.15; } 20% { opacity: 0.9; } 34% { opacity: 0; } }`}</style>

      {/* chamber centre (portrait / content) */}
      <div className="relative heatwave-soft" style={{ width: size * 0.56, height: size * 0.56 }}>
        {children}
      </div>

      {/* ring label */}
      <span className="absolute -bottom-1 font-mono2 text-[9px] tracking-[0.34em] uppercase text-[var(--faint)]">
        {label}
      </span>
    </div>
  );
}

/* ============================================================
   CONTAINMENT STACK — architecture as stacked vessel plates.
   Mouse moves the rig; hovering a plate draws coolant current
   through it and lifts it off the stack on the Z axis.
   ============================================================ */
const HEAT = ['#38d6ff', '#eafcff', '#ffc14d', '#ff6a2b', '#ff3d8b', '#46e39b'];

export function ContainmentStack({ layers }: {
  layers: { layer: string; items: string[] }[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState<number | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTilt({
      y: ((e.clientX - r.left) / r.width - 0.5) * 16,
      x: -((e.clientY - r.top) / r.height - 0.5) * 12,
    });
  };

  return (
    <div ref={wrapRef} onMouseMove={onMove} onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      className="relative w-full" style={{ perspective: '1200px' }}>
      <div className="relative mx-auto flex max-w-[620px] flex-col gap-2.5 transition-transform duration-500 ease-out"
        style={{ transform: `rotateX(${14 + tilt.x}deg) rotateY(${tilt.y}deg)`, transformStyle: 'preserve-3d' }}>

        {layers.map((l, i) => {
          const c = HEAT[i % HEAT.length];
          const on = active === i;
          const load = 100 - i * 11;
          return (
            <div key={l.layer} onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)}
              className="group relative cursor-default border px-4 py-3.5 transition-all duration-400"
              style={{
                borderColor: on ? c : 'var(--line)',
                background: on ? 'rgba(12,16,24,0.96)' : 'rgba(10,12,18,0.8)',
                transform: on ? 'translateZ(46px) translateY(-4px)' : 'translateZ(0px)',
                boxShadow: on ? `0 0 34px ${c}44, inset 0 0 26px ${c}12` : 'none',
                clipPath: 'var(--cut-sm)',
              }}>
              {/* plate seam */}
              <span className="absolute left-0 top-0 h-full w-[3px]" style={{ background: `linear-gradient(180deg, ${c}, transparent)` }} />

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-3">
                  <span className="font-mono2 text-[9px] uppercase tracking-[0.22em] text-[var(--faint)]">PLATE {String(i + 1).padStart(2, '0')}</span>
                  <span className="font-orbit text-[13px] uppercase tracking-tight" style={{ color: on ? c : 'var(--txt)' }}>{l.layer}</span>
                </span>
                <span className="flex items-center gap-2 font-mono2 text-[9px] uppercase tracking-[0.16em]" style={{ color: c }}>
                  {load}% load <span className="micro-cluster"><span /><span /><span /></span>
                </span>
              </div>

              {/* coolant conduit */}
              <svg viewBox="0 0 600 10" className="mt-2.5 h-[10px] w-full" aria-hidden="true">
                <line x1="0" y1="5" x2="600" y2="5" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                <line x1="0" y1="5" x2={6 * load} y2="5" stroke={c} strokeWidth="1.8"
                  className={on ? 'conduit-line' : ''} opacity={on ? 1 : 0.55}
                  style={on ? { filter: `drop-shadow(0 0 6px ${c})` } : undefined} />
                <circle cx={6 * load} cy="5" r={on ? 3.4 : 2.2} fill={c} className={on ? 'atom-core' : ''} />
              </svg>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {l.items.map((it) => (
                  <span key={it} className="px-2 py-0.5 font-mono2 text-[9px] uppercase tracking-[0.1em] text-[var(--dim)]"
                    style={{ border: `1px solid ${on ? `${c}55` : 'var(--line-faint)'}`, background: on ? `${c}10` : 'transparent' }}>
                    {it}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[var(--line-faint)] pt-3 font-mono2 text-[9px] uppercase tracking-[0.2em] text-[var(--faint)]">
        <span>{active !== null ? `isolate · ${layers[active].layer}` : 'hover a plate to lift it off the vessel'}</span>
        <span className="text-[var(--stable)]">thermal map · rig {tilt.x.toFixed(1)}° / {tilt.y.toFixed(1)}°</span>
      </div>
    </div>
  );
}
