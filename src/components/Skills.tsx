import { Smartphone, Layers, Globe2, BrainCircuit } from 'lucide-react';
import { Reveal, SectionHead } from './ui';
import { MARQUEE_ITEMS } from '../data';

/* ======================= THE STACK — grouped, refined ======================= */
const GROUPS = [
  {
    icon: Smartphone, title: 'Android', note: 'the first language',
    tone: 'var(--ion)',
    items: [
      { name: 'Kotlin · Coroutines · Flow', depth: 'daily since 2017', w: 97 },
      { name: 'Jetpack Compose · Material 3', depth: 'production since 1.0', w: 94 },
      { name: 'Room · SQLDelight · DataStore', depth: 'offline-first by default', w: 92 },
      { name: 'Hilt / kotlin-inject · WorkManager', depth: 'compile-time graphs', w: 90 },
      { name: 'Media3 · CameraX · Baseline Profiles', depth: 'measured on mid-rangers', w: 86 },
    ],
  },
  {
    icon: Layers, title: 'Mobile architecture', note: 'the cut of the suit',
    tone: 'var(--ember)',
    items: [
      { name: 'Clean Architecture · multi-module', depth: 'guardrails enforced in CI', w: 95 },
      { name: 'MVVM / MVI · unidirectional flow', depth: 'immutable state, replayable', w: 94 },
      { name: 'Kotlin Multiplatform · Compose MP', depth: '92% shared, 4 targets', w: 88 },
      { name: 'Offline-first sync engines', depth: 'idempotent ops, LWW merge', w: 91 },
      { name: 'Navigation 3 · adaptive layouts', depth: 'foldables, predictive back', w: 87 },
    ],
  },
  {
    icon: Globe2, title: 'APIs & services', note: 'the supply line',
    tone: 'var(--amber)',
    items: [
      { name: 'Retrofit · Ktor · OkHttp', depth: 'de-duplicated, pinned', w: 93 },
      { name: 'Firebase — Auth · Firestore · FCM', depth: 'streams into local truth', w: 91 },
      { name: 'REST · GraphQL · kotlinx-serialization', depth: 'DTOs stop at the edge', w: 90 },
      { name: 'Passkeys · WebAuthn · Keystore', depth: 'zero shared secrets', w: 88 },
      { name: 'CI/CD — GitHub Actions · Fastlane', depth: '4m 12s median PR cycle', w: 89 },
    ],
  },
  {
    icon: BrainCircuit, title: 'AI, on-device first', note: 'the quiet assistant',
    tone: 'var(--magenta)',
    items: [
      { name: 'LiteRT-LM · Gemma on-device', depth: '96ms first token, 150MB cap', w: 86 },
      { name: 'ML Kit GenAI · TFLite', depth: 'captioning under 180ms', w: 84 },
      { name: 'Claude API · tool-use pipelines', depth: 'schema-constrained output', w: 85 },
      { name: 'Privacy manifests · consent gates', depth: 'no silent egress, ever', w: 92 },
      { name: 'Eval suites · latency budgets', depth: '240-prompt nightly gate', w: 83 },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-[1440px] px-6 py-20 md:py-28 lg:px-10">
      <SectionHead
        index="02"
        kicker="The stack"
        mm="ကျွမ်းကျင်မှုများ"
        title={<>Capabilities, mapped as<br /><span className="grad-text">modular panels</span></>}
        desc="Four modular panels. Each line is a capability with a measured history — grouped the way the work is actually done, not the way a résumé template suggests."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {GROUPS.map((g, gi) => (
          <Reveal key={g.title} delay={(gi % 2) * 90}>
            <article className="reactor-module hud-scan group h-full overflow-hidden">
              <div className="hud-strip">
                <span className="flex items-center gap-2">
                  <g.icon size={12} style={{ color: g.tone }} /> {g.title}
                </span>
                <span className="font-serif-i normal-case tracking-normal text-[11px] text-[var(--faint)]">{g.note}</span>
              </div>
              <div className="space-y-5 p-6 sm:p-7">
                {g.items.map((it, i) => (
                  <div key={it.name} className="group/row">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="font-head text-[13.5px] text-[var(--txt-soft)]">{it.name}</span>
                      <span className="font-serif-i text-[12px] text-[var(--faint)]">{it.depth}</span>
                    </div>
                    <div className="gauge-track mt-2">
                      <div className="gauge-fill" style={{ width: `${it.w}%`, background: `linear-gradient(90deg, color-mix(in srgb, ${g.tone} 55%, transparent), ${g.tone})`, boxShadow: `0 0 12px color-mix(in srgb, ${g.tone} 40%, transparent)`, transitionDelay: `${i * 90}ms` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={140}>
        <p className="mx-auto mt-10 max-w-[64ch] text-center font-serif-i text-[15px] leading-[1.8] text-[var(--faint)]">
          “Depth over breadth — every line above has shipped, been profiled on a 2019-class device,
          and survived at least one unkind release week.”
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {MARQUEE_ITEMS.slice(0, 14).map((c) => (
            <span key={c} className="rounded-full border border-[var(--line-faint)] bg-[var(--panel-soft)] px-3.5 py-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--faint)] transition-colors hover:border-[var(--ion)] hover:text-[var(--amber)]">
              {c}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
