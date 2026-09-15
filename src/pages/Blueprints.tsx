import { useState } from 'react';
import { ArrowUpRight, Boxes, Palette, Cpu, Fingerprint, LayoutGrid, Radio } from 'lucide-react';
import { Reveal } from '../components/ui';
import { Led } from '../components/blueprints/shared';
import KmpFlow from '../components/blueprints/KmpFlow';
import DesignSystem from '../components/blueprints/DesignSystem';
import OnDeviceGenAi from '../components/blueprints/OnDeviceGenAi';
import ZeroTrustAuth from '../components/blueprints/ZeroTrustAuth';
import AdaptiveNav from '../components/blueprints/AdaptiveNav';

/* ============================================================
   BLUEPRINT DECK — five production architecture specs
   ============================================================ */
type Key = 'a1' | 'a2' | 'a3' | 'a4' | 'a5';

const DECK: {
  id: Key; code: string; title: string; kind: string; icon: React.ReactNode;
  summary: string; proves: string[]; metrics: [string, string][]; body: () => React.ReactNode;
}[] = [
  {
    id: 'a1', code: 'A1', title: 'Kotlin Multiplatform topology', kind: 'architecture · interactive graph',
    icon: <Boxes size={15} />,
    summary: 'One shared core — data, domain, repository contracts — under four shells: Android Compose, iOS SwiftUI, Desktop Compose and Web/Wasm. Dependency direction, expect/actual ledger and the CI matrix are all inspectable.',
    proves: ['dependency inversion enforced by a build rule, not a wiki page', 'expect/actual limited to four genuine capability seams', 'one commonTest suite runs against all four targets'],
    metrics: [['shared code', '92 %'], ['cold PR cycle', '4 m 12 s'], ['domain tests', '1 204 · 380 ms'], ['platform imports in core', '0']],
    body: () => <KmpFlow />,
  },
  {
    id: 'a2', code: 'A2', title: 'Compose Multiplatform design system', kind: 'design-system-as-code · Figma ⇄ Kotlin',
    icon: <Palette size={15} />,
    summary: 'Colour, type, spacing, motion and shape tokens generated once and consumed by Compose on three platforms plus a SwiftUI bridge. Contrast is computed live; the JSON and the Kotlin theme are the same object.',
    proves: ['light / dark / high-contrast modes with measured WCAG ratios', 'dynamic type 0.9–1.6× with a separate Myanmar ramp', 'a 600 ms motion ceiling enforced by lint'],
    metrics: [['token roles', '12 × 3 modes'], ['type roles', '9'], ['AA gate', 'CI blocking'], ['hand-edited colours', '0']],
    body: () => <DesignSystem />,
  },
  {
    id: 'a3', code: 'A3', title: 'On-device GenAI runtime', kind: 'LiteRT-LM + ML Kit GenAI · budgets',
    icon: <Cpu size={15} />,
    summary: 'Summarisation and captioning run on the handset: ModelManager lifecycle with mmap weights, warm priming, thermal throttling, pressure eviction and a consent-gated cloud path — inside stated latency and RAM budgets.',
    proves: ['first token 96 ms p50 against a 200 ms ceiling', '128 MB RSS under a 150 MB cap, incl. weights', 'privacy manifest shown in-app, not buried'],
    metrics: [['decode', '38 tok/s'], ['RSS peak', '128 MB'], ['fallback rate', '0.7 %'], ['egress by default', 'none']],
    body: () => <OnDeviceGenAi />,
  },
  {
    id: 'a4', code: 'A4', title: 'Zero-trust biometric auth', kind: 'passkeys · continuous · fintech',
    icon: <Fingerprint size={15} />,
    summary: 'Passkeys on Android and iOS with hardware-bound keys, single-use nonces, behavioural scoring for the whole session, and a degradation ladder that ends in containment — never in a password.',
    proves: ['sequence ceremony playable lane by lane', 'screen states share one enum across Compose and SwiftUI', 'cadence sampler measurable in the page'],
    metrics: [['ATO incidents', '0 / 14 mo'], ['FRR · FAR', '1.8 % · 0.3 %'], ['shared secrets held', '0'], ['session lease', '5 min scoped']],
    body: () => <ZeroTrustAuth />,
  },
  {
    id: 'a5', code: 'A5', title: 'Adaptive navigation & foldables', kind: 'WindowSizeClass · Navigation 3',
    icon: <LayoutGrid size={15} />,
    summary: 'Canonical layouts chosen from window size class, a serialisable scene graph that survives posture changes and process death, and predictive back where the gesture drives the frame — scrub it here.',
    proves: ['list-detail / supporting pane / feed chosen by class, never device', 'selection held as a key so reflow cannot misfire', 'posture change preserves scroll, selection and draft'],
    metrics: [['breakpoints', '4 buckets'], ['pop threshold', '0.42'], ['re-fetch on rotate', '0'], ['isTablet checks', 'banned']],
    body: () => <AdaptiveNav />,
  },
];

export default function BlueprintsPage() {
  const [active, setActive] = useState<Key>('a1');
  const d = DECK.find((x) => x.id === active)!;

  return (
    <div className="relative mx-auto max-w-[1560px] px-4 py-20 sm:px-6 lg:px-10 md:py-24">
      {/* deck header */}
      <header className="mb-8 border-b border-[var(--line-faint)] pb-8">
        <Reveal>
          <p className="mb-4 flex flex-wrap items-center gap-3 font-mono2 text-[10px] uppercase tracking-[0.26em] text-[var(--ion)]">
            <span className="h-px w-9 bg-[var(--ember)]" /> engineering blueprints · deck 07
          </p>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <Reveal delay={60}>
            <h1 className="font-display text-[clamp(1.9rem,4.4vw,3.4rem)] uppercase leading-[1.02] tracking-tight text-[var(--txt)]">
              Five production systems,<br /><span className="text-[var(--amber)]">drawn as built</span>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <div className="flex flex-col gap-3 lg:items-end">
              <p className="max-w-[46ch] text-[13.5px] leading-[1.75] text-[var(--dim)] lg:text-right">
                Not screenshots — the actual boundaries, budgets, failure paths and gates behind the work.
                Every panel here is interactive and every number came from a measured run.
              </p>
              <span className="flex items-center gap-2 font-mono2 text-[9px] uppercase tracking-[0.18em] text-[var(--faint)]">
                <Radio size={11} className="text-[var(--stable)]" /> rev 2026.02 · 5 sheets
              </span>
            </div>
          </Reveal>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[268px_1fr]">
        {/* index rail */}
        <nav aria-label="Blueprint index" className="h-max xl:sticky xl:top-24">
          <ol className="flex gap-2 overflow-x-auto pb-1 xl:flex-col xl:overflow-visible xl:pb-0">
            {DECK.map((x) => {
              const on = x.id === active;
              return (
                <li key={x.id} className="shrink-0 xl:shrink">
                  <button onClick={() => setActive(x.id)} aria-current={on ? 'true' : undefined}
                    className={`bp-card group flex w-full items-start gap-3 p-3.5 text-left transition-all duration-300 ${on ? '!border-[var(--ion)]' : ''}`}
                    style={on ? { boxShadow: 'var(--glow-ion)' } : undefined}>
                    <span className="mt-0.5 shrink-0 transition-colors" style={{ color: on ? 'var(--amber)' : 'var(--faint)' }}>{x.icon}</span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className="font-mono2 text-[9px] uppercase tracking-[0.2em]" style={{ color: on ? 'var(--ion)' : 'var(--fainter)' }}>{x.code}</span>
                        {on && <Led />}
                      </span>
                      <span className={`mt-1 block font-head text-[12.5px] uppercase leading-tight tracking-[0.02em] ${on ? 'text-[var(--txt)]' : 'text-[var(--dim)]'}`}>
                        {x.title}
                      </span>
                      <span className="mt-1 hidden font-mono2 text-[8.5px] uppercase tracking-[0.14em] text-[var(--fainter)] xl:block">{x.kind}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <a href="#contact" className="mt-3 hidden w-full items-center justify-center gap-2 border border-[var(--line)] px-4 py-3 font-mono2 text-[9.5px] uppercase tracking-[0.18em] text-[var(--dim)] transition-colors hover:border-[var(--amber)] hover:text-[var(--amber)] xl:flex">
            request these for your product <ArrowUpRight size={12} />
          </a>
        </nav>

        {/* sheet */}
        <div key={d.id} className="sheet-in min-w-0 space-y-4">
          <div className="bp-card overflow-hidden">
            <div className="hud-strip">
              <span className="flex items-center gap-2"><Led tone="hot" /> sheet {d.code} · {d.kind}</span>
              <span className="text-[var(--fainter)]">rev 2026.02</span>
            </div>
            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="font-display text-[22px] uppercase leading-[1.06] tracking-tight text-[var(--txt)] sm:text-[26px]">{d.title}</h2>
                <p className="mt-3 max-w-[62ch] text-[13.5px] leading-[1.75] text-[var(--dim)]">{d.summary}</p>
              </div>
              <div className="grid gap-4">
                <div>
                  <span className="font-mono2 text-[9px] uppercase tracking-[0.2em] text-[var(--faint)]">this sheet proves</span>
                  <ul className="mt-2 space-y-1.5">
                    {d.proves.map((p) => (
                      <li key={p} className="flex gap-2.5 text-[12px] leading-[1.6] text-[var(--txt-soft)]">
                        <span className="mt-[7px] h-1 w-1 shrink-0 bg-[var(--ion)]" />{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="matrix" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  {d.metrics.map(([k, v]) => [
                    <div key={k} className="font-mono2 text-[9px] uppercase tracking-[0.14em] !text-[var(--faint)]">{k}</div>,
                    <div key={k + 'v'} className="text-right font-orbit text-[12.5px] !text-[var(--amber)]">{v}</div>,
                  ])}
                </div>
              </div>
            </div>
          </div>

          {d.body()}
        </div>
      </div>
    </div>
  );
}

/* ---------- home teaser ---------- */
export function BlueprintsTeaser() {
  const [hover, setHover] = useState<Key | null>(null);
  return (
    <section id="blueprints" className="relative mx-auto max-w-[1440px] px-6 py-20 md:py-24 lg:px-10">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
        <div>
          <p className="kicker mb-4"><span className="kicker-line" />blueprint deck</p>
          <h2 className="font-display text-[clamp(1.7rem,3.4vw,2.6rem)] uppercase leading-[1.04] tracking-tight text-[var(--txt)]">
            Five systems <span className="text-[var(--ember)]">drawn as built</span>
          </h2>
          <p className="mt-4 max-w-[46ch] text-[13.5px] leading-[1.75] text-[var(--dim)]">
            Interactive architecture sheets: the KMP containment graph, the design-system pipeline, an on-device GenAI runtime,
            a zero-trust auth ceremony and foldable navigation — with the budgets and gates that keep them honest.
          </p>
        </div>
        <ol className="divide-y divide-[var(--line-faint)] border-y border-[var(--line-faint)]">
          {DECK.map((x) => (
            <li key={x.id}>
              <a href="#/blueprints"
                onMouseEnter={() => setHover(x.id)} onMouseLeave={() => setHover(null)}
                className={`bp-row flex items-center gap-4 px-1 py-3.5 transition-all ${hover === x.id ? 'bg-[var(--panel-soft)]' : ''}`}>
                <span className="font-mono2 text-[9.5px] uppercase tracking-[0.2em] text-[var(--fainter)]">{x.code}</span>
                <span className="shrink-0 transition-colors" style={{ color: hover === x.id ? 'var(--ion)' : 'var(--faint)' }}>{x.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-head text-[13.5px] uppercase tracking-[0.02em] text-[var(--txt)]">{x.title}</span>
                  <span className="mt-0.5 hidden truncate font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--faint)] sm:block">{x.kind}</span>
                </span>
                <span className="hidden shrink-0 items-center gap-3 md:flex">
                  {x.metrics.slice(0, 2).map(([k, v]) => (
                    <span key={k} className="font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--fainter)]">
                      {k} <span className="text-[var(--amber)]">{v}</span>
                    </span>
                  ))}
                </span>
                <ArrowUpRight size={14} className="shrink-0 text-[var(--fainter)] transition-all group-hover:text-[var(--ion)]" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
