import { useMemo, useState } from 'react';
import { MousePointerClick, Contrast, Type, Ruler, Move, LayoutTemplate, Boxes } from 'lucide-react';
import { Chip, CodePanel, Led, Meter, Panel, SubHead, TabStrip } from './shared';

/* ======================= A2 · CMP DESIGN SYSTEM ======================= */
type Mode = 'dark' | 'light' | 'contrast';
type Tab = 'tokens' | 'preview' | 'anatomy' | 'json' | 'kotlin' | 'adaptive';

const ROLE = {
  primary: { dark: '#38D6FF', light: '#00607C', contrast: '#00384A' },
  onPrimary: { dark: '#04141C', light: '#FFFFFF', contrast: '#FFFFFF' },
  primaryContainer: { dark: '#0E4E63', light: '#B5E9FF', contrast: '#CFF3FF' },
  onPrimaryContainer: { dark: '#C4F1FF', light: '#00293A', contrast: '#001B26' },
  secondary: { dark: '#FFC14D', light: '#7A5300', contrast: '#4A3100' },
  tertiary: { dark: '#FF6A2B', light: '#8C2F00', contrast: '#5F1F00' },
  surface: { dark: '#08090D', light: '#F7F9FB', contrast: '#FFFFFF' },
  onSurface: { dark: '#F2F5F8', light: '#0B1017', contrast: '#000000' },
  surfaceVariant: { dark: '#14171F', light: '#E4E8EE', contrast: '#F0F0F0' },
  onSurfaceVariant: { dark: '#97A3B3', light: '#4A566A', contrast: '#20272F' },
  outline: { dark: '#3C444F', light: '#A9B4C4', contrast: '#000000' },
  error: { dark: '#FF4D5E', light: '#8C1D1D', contrast: '#5C0000' },
} satisfies Record<string, Record<Mode, string>>;

const ROLES = Object.keys(ROLE) as (keyof typeof ROLE)[];

/* real WCAG relative-luminance contrast — computed, not asserted */
const lum = (hex: string) => {
  const c = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const TYPE = [
  { role: 'displayLarge', font: 'Space Grotesk', size: 57, lh: 64, wt: 700, track: -0.25, use: 'hero numeral, reactor title' },
  { role: 'displaySmall', font: 'Space Grotesk', size: 36, lh: 44, wt: 700, track: 0, use: 'page title' },
  { role: 'headlineMedium', font: 'Space Grotesk', size: 28, lh: 36, wt: 600, track: -0.15, use: 'section head' },
  { role: 'titleLarge', font: 'Chakra Petch', size: 22, lh: 28, wt: 600, track: 0.1, use: 'card title' },
  { role: 'titleMedium', font: 'Chakra Petch', size: 16, lh: 24, wt: 600, track: 0.15, use: 'sheet header' },
  { role: 'bodyLarge', font: 'Barlow', size: 16, lh: 24, wt: 400, track: 0, use: 'paragraph, spec prose' },
  { role: 'bodyMedium', font: 'Barlow', size: 14, lh: 20, wt: 400, track: 0, use: 'secondary copy' },
  { role: 'labelLarge', font: 'Chakra Petch', size: 14, lh: 20, wt: 600, track: 0.1, use: 'button text' },
  { role: 'labelSmall', font: 'IBM Plex Mono', size: 11, lh: 16, wt: 500, track: 0.4, use: 'telemetry, tokens' },
];

const SPACE = [
  { name: 'space-0', dp: 0, use: 'flush icon slot' },
  { name: 'space-1', dp: 4, use: 'chip inner gap' },
  { name: 'space-2', dp: 8, use: 'label → value' },
  { name: 'space-3', dp: 12, use: 'control horizontal pad' },
  { name: 'space-4', dp: 16, use: 'card padding (compact)' },
  { name: 'space-5', dp: 24, use: 'card padding (medium)' },
  { name: 'space-6', dp: 32, use: 'section inset' },
  { name: 'space-7', dp: 48, use: 'screen gutter' },
  { name: 'space-8', dp: 64, use: 'hero / sheet top' },
];

const MOTION = [
  { name: 'easing.standard', value: 'cubicBezier(0.2, 0.0, 0.0, 1.0)', use: 'enter + exit, most state' },
  { name: 'easing.emphasized', value: 'cubicBezier(0.2, 0.0, 0.0, 1.0) + overshoot 1.04', use: 'sheet, modal' },
  { name: 'easing.legacy', value: 'cubicBezier(0.4, 0.0, 1.0, 1.0)', use: 'exit only — never for entrance' },
  { name: 'easing.spring', value: 'spring(damping 0.86, stiffness 380)', use: 'pressed release, tabs' },
  { name: 'duration.short2', value: '100ms', use: 'state layer, ripple' },
  { name: 'duration.medium2', value: '300ms', use: 'colour + elevation' },
  { name: 'duration.long2', value: '450ms', use: 'pane reveal' },
  { name: 'duration.warp', value: '600ms max', use: 'hard ceiling for any screen motion' },
];

const BREAKPOINTS = [
  { name: 'compact', range: '0–599dp', grid: '1 col · 16dp gutter', nav: 'bottom bar', pane: 'none — full screen push', targets: 'phone portrait, fold outer' },
  { name: 'medium', range: '600–839dp', grid: '2 col · 24dp gutter', nav: 'rail (80dp)', pane: 'supporting on demand', targets: 'fold inner, small tablet' },
  { name: 'expanded', range: '840–1199dp', grid: '3 col · 24dp gutter', nav: 'permanent rail', pane: 'always docked 360–480dp', targets: 'tablet, foldable hinge' },
  { name: 'large', range: '1200dp+', grid: '4 col max 1280 · centred', nav: 'rail + top bar', pane: 'docked + list-detail', targets: 'desktop, web' },
];

const FIGMA = {
  $schema: 'https://design.openui.io/schema.json',
  name: 'Reactor DS · CMP v1.4',
  description: 'Cross-platform tokens consumed by Compose Multiplatform (Android, Desktop, Web/Wasm) and the SwiftUI iOS bridge.',
  modes: ['dark', 'light', 'contrast'],
  color: Object.fromEntries(ROLES.map((r) => [r, { type: 'color', value: ROLE[r] }])),
  number: {
    space: Object.fromEntries(SPACE.map((s, i) => [`space-${i}`, { type: 'number', value: s.dp, unit: 'dp', description: s.use }])),
    radius: { 'radius-none': { type: 'number', value: 0 }, 'radius-sm': { type: 'number', value: 4 }, 'radius-md': { type: 'number', value: 10 }, 'radius-lg': { type: 'number', value: 16 }, 'radius-full': { type: 'number', value: 999 } },
    elevation: { level0: 0, level1: 2, level2: 6, level3: 12, note: 'shadow dp; Android real elevation, desktop/web composited blur' },
  },
  typography: Object.fromEntries(TYPE.map((t) => [t.role, {
    type: 'typography',
    value: { fontFamily: t.font, fontWeight: t.wt, fontSize: t.size, lineHeight: t.lh, letterSpacing: t.track },
    description: t.use,
  }])),
  transition: Object.fromEntries(MOTION.map((m) => [m.name, { type: 'transition', value: { duration: 300, timingFunction: m.value }, description: m.use }])),
  breakpoint: BREAKPOINTS.map((b) => ({ name: b.name, range: b.range, grid: b.grid, navigation: b.nav, pane: b.pane })),
};

const KOTLIN = `// file: core/designsystem/src/commonMain/kotlin/dev/mka/reactor/Color.kt
@Immutable
data class ReactorColors(
    val primary: Color, val onPrimary: Color,
    val primaryContainer: Color, val onPrimaryContainer: Color,
    val secondary: Color, val tertiary: Color,
    val surface: Color, val onSurface: Color,
    val surfaceVariant: Color, val onSurfaceVariant: Color,
    val outline: Color, val error: Color,
    val isHighContrast: Boolean = false,
)

internal val DarkReactor = ReactorColors(
    primary = Color(0xFF38D6FF), onPrimary = Color(0xFF04141C),
    primaryContainer = Color(0xFF0E4E63), onPrimaryContainer = Color(0xFFC4F1FF),
    secondary = Color(0xFFFFC14D), tertiary = Color(0xFFFF6A2B),
    surface = Color(0xFF08090D), onSurface = Color(0xFFF2F5F8),
    surfaceVariant = Color(0xFF14171F), onSurfaceVariant = Color(0xFF97A3B3),
    outline = Color(0xFF3C444F), error = Color(0xFFFF4D5E),
)

// generated token source is asserted against figma.tokens.json in CI —
// a hand-edit that drifts from the source of truth fails the build.
@Test fun tokens_match_figma() {
    ROLES.forEach { role ->
        assertEquals(figmaHex(role, "dark"), ReactorTheme.darkScheme.hexFor(role))
    }
}`;

const KOTLIN2 = `// file: core/designsystem/src/commonMain/kotlin/dev/mka/reactor/Theme.kt
@Composable
fun ReactorTheme(
    scheme: ThemePreference = ThemePreference.system(),   // expect/actual
    scale: Float = FontScale.current,                      // honour OS text size
    content: @Composable () -> Unit,
) {
    val colors = remember(scheme) { scheme.toReactorColors() }
    val typography = remember(scale) { ReactorTypography.of(scale) }  // 0.9x – 1.6x
    CompositionLocalProvider(
        LocalReactorColors provides colors,
        LocalReactorMotion provides ReactorMotion.Standard,
        LocalReactorSpacing provides ReactorSpacing.Compact4,
    ) {
        MaterialTheme(colorScheme = colors.toM3(), typography = typography, shapes = ReactorShapes, content = content)
    }
}

object ReactorMotion {
    val Standard = MotionSpec(easing = CubicBezierEasing(0.2f, 0f, 0f, 1f), duration = 300)
    val Sheet = MotionSpec(easing = Emphasized, duration = 450, spring = Spring(0.86f, 380f))
    val Press = MotionSpec(easing = Standard, duration = 100)
    // single global ceiling keeps anyone from inventing a 1.2s transition
    const val MAX = 600
}`;

export default function DesignSystem() {
  const [mode, setMode] = useState<Mode>('dark');
  const [tab, setTab] = useState<Tab>('tokens');
  const [scale, setScale] = useState(1);
  const [state, setState] = useState<'rest' | 'hover' | 'focus' | 'pressed' | 'disabled'>('rest');
  const [w, setW] = useState(900);
  const [demo, setDemo] = useState(0);

  const c = useMemo(() => Object.fromEntries(ROLES.map((r) => [r, ROLE[r][mode]])) as Record<string, string>, [mode]);

  const bp = w <= 599 ? BREAKPOINTS[0] : w <= 839 ? BREAKPOINTS[1] : w <= 1199 ? BREAKPOINTS[2] : BREAKPOINTS[3];
  const body = bp.name === 'compact' ? 1 : bp.name === 'medium' ? 2 : 3;
  const on = c.onSurface;

  /* count foreground/background pairs that clear 4.5:1 in the active mode */
  const pairs: [string, string][] = [
    ['onSurface', 'surface'], ['onSurfaceVariant', 'surfaceVariant'],
    ['onPrimary', 'primary'], ['onPrimaryContainer', 'primaryContainer'],
  ];
  const aa = pairs.map(([fg, bg]) => ({ fg, ratio: contrast(c[fg], c[bg]), pass: contrast(c[fg], c[bg]) >= 4.5 }));

  return (
    <div className="space-y-5">
      {/* controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="font-mono2 text-[9px] uppercase tracking-[0.22em] text-[var(--fainter)]">mode</span>
          {(['dark', 'light', 'contrast'] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m}
              className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.14em] transition-colors ${
                mode === m ? 'border-[var(--ion)] bg-[rgba(56,214,255,0.1)] text-[var(--ion)]' : 'border-[var(--line-faint)] text-[var(--faint)] hover:text-[var(--txt)]'
              }`}>
              {m === 'contrast' && <Contrast size={11} />} {m}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 font-mono2 text-[9px] uppercase tracking-[0.2em] text-[var(--fainter)]">
          type scale {scale.toFixed(2)}×
          <input type="range" min={0.9} max={1.6} step={0.02} value={scale} onChange={(e) => setScale(+e.target.value)} className="range w-32" />
        </label>
        <span className="ml-auto flex flex-wrap items-center gap-2 font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--faint)]">
          <Led tone={aa.every((x) => x.pass) ? 'ok' : 'warn'} /> AA gate
          {aa.map((x) => (
            <span key={x.fg} className="normal-case tracking-normal" style={{ color: x.pass ? 'var(--stable)' : 'var(--danger)' }}>
              {x.fg} {x.ratio.toFixed(2)}
            </span>
          ))}
        </span>
      </div>

      <TabStrip<Tab>
        value={tab}
        onChange={setTab}
        items={[
          { id: 'tokens', label: 'token tables' },
          { id: 'preview', label: 'live preview' },
          { id: 'anatomy', label: 'component anatomy' },
          { id: 'adaptive', label: 'adaptive rules' },
          { id: 'json', label: 'figma json' },
          { id: 'kotlin', label: 'compose theme' },
        ]}
      />

      {/* ---------- TOKENS ---------- */}
      {tab === 'tokens' && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Colour roles" note={`${mode} · ratio vs surface`}>
            <div className="space-y-1.5">
              {ROLES.map((r) => {
                const ratio = contrast(c[r], c.surface);
                const pairRatio = r.startsWith('on') ? contrast(c[r], c[mode === 'light' ? 'surfaceVariant' : 'surfaceVariant']) : ratio;
                const pass = (r.startsWith('on') ? pairRatio : ratio) >= (r.startsWith('on') ? 4.5 : 0);
                return (
                  <div key={r} className="flex items-center gap-3">
                    <span className="h-7 w-10 shrink-0 border border-[var(--line-faint)]" style={{ background: c[r] }} />
                    <span className="font-mono2 text-[10.5px] text-[var(--txt-soft)]">{r}</span>
                    <span className="font-mono2 text-[9.5px] uppercase text-[var(--faint)]">{c[r]}</span>
                    {r.startsWith('on') ? (
                      <span className="ml-auto flex items-center gap-2 font-mono2 text-[9px] uppercase tracking-[0.14em]">
                        <span style={{ color: pass ? 'var(--stable)' : 'var(--danger)' }}>{pairRatio.toFixed(2)}:1</span>
                        <span style={{ color: pass ? 'var(--stable)' : 'var(--danger)' }}>{pass ? 'AA' : 'fail'}</span>
                      </span>
                    ) : (
                      <span className="ml-auto font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--fainter)]">vs surface {ratio.toFixed(2)}:1</span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 border-t border-[var(--line-faint)] pt-3 text-[12px] leading-[1.7] text-[var(--dim)]">
              Ratios are computed at render from the hexes in this table, so a token edit that drops{' '}
              <span className="font-mono2 text-[var(--ion)]">onSurfaceVariant</span> below 4.5:1 fails the same assertion in CI —{' '}
              <span className="text-[var(--amber)]">12.71:1</span> body contrast in dark,{' '}
              <span className="text-[var(--amber)]">7.05:1</span> minimum in high-contrast.
            </p>
          </Panel>

          <Panel title="Typography ramp" note={`scaled × ${scale.toFixed(2)}`}>
            <div className="mb-3 flex items-center gap-2 font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--faint)]">
              <Type size={11} /> display: Space Grotesk · body: Barlow · numeric: IBM Plex Mono
            </div>
            <div className="divide-y divide-[var(--line-faint)] border-y border-[var(--line-faint)]">
              {TYPE.map((t) => (
                <div key={t.role} className="flex items-baseline gap-4 py-2.5">
                  <span className="w-[132px] shrink-0 font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--faint)]">{t.role}</span>
                  <span className="min-w-0 flex-1 truncate"
                    style={{ fontFamily: `'${t.font}', sans-serif`, fontSize: t.size * scale * 0.62, lineHeight: 1.15, fontWeight: t.wt, letterSpacing: `${t.track}px`, color: 'var(--txt)' }}>
                    Containment 148 MK
                  </span>
                  <span className="hidden shrink-0 font-mono2 text-[9px] text-[var(--fainter)] sm:block">{Math.round(t.size * scale)}/{Math.round(t.lh * scale)}dp</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-[1.7] text-[var(--dim)]">
              Scale multiplies size <em>and</em> line height, clamped 0.9–1.6× from the OS setting. Myanmar runs a separate ramp with +2dp line height
              because stacked diacritics collide at Material defaults; the same 14dp body role keeps its identity across scripts.
            </p>
          </Panel>

          <Panel title="Spacing · 4dp base" note="single scale, no half steps">
            <div className="space-y-2">
              {SPACE.map((s) => (
                <div key={s.name} className="group flex items-center gap-3">
                  <span className="w-[92px] shrink-0 font-mono2 text-[9.5px] uppercase tracking-[0.12em] text-[var(--faint)]">{s.name}</span>
                  <span className="h-3 shrink-0 transition-all duration-300 group-hover:brightness-150"
                    style={{ width: Math.max(3, s.dp) * 2.6, background: 'linear-gradient(90deg, var(--ion), var(--amber))', opacity: 0.75 }} />
                  <span className="font-orbit text-[11px] tabular-nums text-[var(--txt)]">{s.dp}dp</span>
                  <span className="ml-auto hidden font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--fainter)] sm:block">{s.use}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Motion tokens" note="ceiling 600ms">
            <div className="space-y-3">
              {MOTION.map((m) => (
                <div key={m.name} className="seq-row grid-cols-[1fr] items-start gap-1 border-0 p-0 pb-2">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--ion)]">{m.name}</span>
                    <span className="font-mono2 text-[9.5px] text-[var(--faint)]">{m.value}</span>
                    <span className="ml-auto font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--fainter)]">{m.use}</span>
                  </div>
                  <button
                    onClick={() => setDemo((d) => d + 1)}
                    className="mt-1.5 flex w-full items-center gap-2 border border-[var(--line-faint)] bg-[rgba(4,6,10,0.6)] px-3 py-2 text-left transition-colors hover:border-[var(--amber)]"
                  >
                    <span key={demo} className="block h-3 w-3 bg-[var(--amber)]"
                      style={{ animation: m.name.includes('spring') ? undefined : `bpDemo 900ms ${m.name.includes('emph') ? 'cubic-bezier(0.2,0,0,1.2)' : 'cubic-bezier(0.2,0,0,1)'}` }} />
                    <span className="font-mono2 text-[9px] uppercase tracking-[0.18em] text-[var(--faint)]"><MousePointerClick size={10} className="mr-1 inline" />click to replay</span>
                  </button>
                </div>
              ))}
            </div>
            <style>{`@keyframes bpDemo { 0% { transform: translateX(0); opacity: .3 } 55% { transform: translateX(60px); opacity: 1 } 100% { transform: translateX(0); opacity: .3 } }`}</style>
          </Panel>
        </div>
      )}

      {/* ---------- PREVIEW ---------- */}
      {tab === 'preview' && (
        <Panel title="Rendered from tokens" note={`${mode} · ${scale.toFixed(2)}× · no hard-coded values`}>
          <div
            className="grid gap-5 p-5 transition-colors duration-500"
            style={{ background: c.surface, color: on, border: `1px solid ${c.outline}` }}
          >
            {/* buttons */}
            <div>
              <div className="mb-2 font-mono2 text-[9px] uppercase tracking-[0.2em]" style={{ color: c.onSurfaceVariant }}>Button · {state}</div>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { v: 'filled', bg: c.primary, fg: c.onPrimary, bd: 'transparent' },
                  { v: 'tonal', bg: c.primaryContainer, fg: c.onPrimaryContainer, bd: 'transparent' },
                  { v: 'outlined', bg: 'transparent', fg: c.primary, bd: c.primary },
                  { v: 'text', bg: 'transparent', fg: c.primary, bd: 'transparent' },
                ].map((b) => {
                  const pressed = state === 'pressed';
                  const hovered = state === 'hover';
                  return (
                    <button key={b.v}
                      style={{
                        background: b.bg, color: b.fg, border: `1px solid ${b.bd}`,
                        opacity: state === 'disabled' ? 0.38 : 1,
                        boxShadow: state === 'focus' ? `0 0 0 2px ${c.surface}, 0 0 0 4px ${c.primary}` : 'none',
                        transform: pressed ? 'scale(0.97)' : hovered ? 'translateY(-1px)' : 'none',
                        borderRadius: 10, fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600,
                        fontSize: 14 * scale, letterSpacing: '0.06em', padding: `${10 * scale}px ${18 * scale}px`,
                        transition: 'transform 100ms cubic-bezier(0.2,0,0,1), box-shadow 100ms',
                      }}>
                      {b.v}
                    </button>
                  );
                })}
                <span className="ml-auto flex gap-1.5">
                  {(['rest', 'hover', 'focus', 'pressed', 'disabled'] as const).map((s) => (
                    <button key={s} onClick={() => setState(s)} aria-pressed={state === s}
                      className="border px-2 py-1 font-mono2 text-[8.5px] uppercase tracking-[0.14em]"
                      style={{ borderColor: state === s ? c.primary : 'transparent', color: state === s ? c.primary : c.onSurfaceVariant }}>
                      {s}
                    </button>
                  ))}
                </span>
              </div>
            </div>

            {/* cards + list */}
            <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
              <div style={{ background: c.surfaceVariant, border: `1px solid ${c.outline}`, borderRadius: 16, padding: 20 }}>
                <div className="font-mono2 text-[9px] uppercase tracking-[0.2em]" style={{ color: c.secondary }}>card · elevated</div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22 * scale, lineHeight: 1.15, marginTop: 8 }}>
                  Containment loop stable
                </div>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14 * scale, lineHeight: 1.6, marginTop: 8, color: c.onSurfaceVariant }}>
                  Card carries the only elevation in this list; inner rows never raise again — two layers maximum keeps hierarchy legible.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span style={{ background: c.tertiary, color: '#0B1017', borderRadius: 999, padding: '4px 10px', fontSize: 11 * scale, fontFamily: "'IBM Plex Mono', monospace" }}>148 MK</span>
                  <span style={{ border: `1px solid ${c.outline}`, color: c.onSurfaceVariant, borderRadius: 999, padding: '4px 10px', fontSize: 11 * scale, fontFamily: "'IBM Plex Mono', monospace" }}>99.9%</span>
                  <span className="ml-auto" style={{ color: c.primary, fontSize: 12 * scale, fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600 }}>open →</span>
                </div>
              </div>

              <div style={{ border: `1px solid ${c.outline}`, borderRadius: 16, overflow: 'hidden' }}>
                {['Stabilise loop', 'Thermal budget', 'Vault health', 'Rollout gates'].map((row, i) => (
                  <div key={row} className="flex items-center gap-3" style={{ padding: `${12 * scale}px 16px`, borderTop: i ? `1px solid ${c.outline}` : undefined }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: i === 2 ? c.error : c.primary }} />
                    <span style={{ fontSize: 15 * scale, fontFamily: "'Barlow', sans-serif" }}>{row}</span>
                    <span className="ml-auto" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 * scale, color: c.onSurfaceVariant }}>
                      {['ok', 'ok', 'alert', 'ok'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* sheet */}
            <div>
              <div className="mb-2 font-mono2 text-[9px] uppercase tracking-[0.2em]" style={{ color: c.onSurfaceVariant }}>Modal bottom sheet · emphasized 450ms</div>
              <div style={{ background: c.surfaceVariant, borderRadius: '16px 16px 0 0', padding: 18, maxWidth: 340 }}>
                <span style={{ display: 'block', width: 32, height: 4, borderRadius: 999, background: c.outline, marginBottom: 12 }} />
                <div style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 600, fontSize: 16 * scale }}>Select telemetry window</div>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13 * scale, color: c.onSurfaceVariant, marginTop: 6 }}>
                  Scrim 32% dark · return key closes · content scrolls under the handle, not past the top.
                </p>
                <div className="mt-3 flex gap-2">
                  <span style={{ background: c.primary, color: c.onPrimary, borderRadius: 999, padding: '8px 14px', fontSize: 12 * scale }}>Apply</span>
                  <span style={{ border: `1px solid ${c.outline}`, color: c.onSurfaceVariant, borderRadius: 999, padding: '8px 14px', fontSize: 12 * scale }}>Cancel</span>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      )}

      {/* ---------- ANATOMY ---------- */}
      {tab === 'anatomy' && (
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: <MousePointerClick size={12} />, title: 'Button anatomy', parts: [
                ['container', 'state-layer tint on press, 8% → 12%'],
                ['label', 'labelLarge, 0.06em, never wraps — truncates'],
                ['icon slot', '18dp, leading, gap 8dp'],
                ['state layer', 'single overlay, no per-state colour forks'],
                ['focus indicator', '2px ring + 2px offset, keyboard only'],
                ['touch target', '48dp min height, enforced by modifier'],
              ],
            },
            {
              icon: <Boxes size={12} />, title: 'Card anatomy', parts: [
                ['shape', 'radius-lg 16dp, no nested radii'],
                ['padding', 'space-5 24dp compact · space-6 on expanded'],
                ['elevation', 'level1; siblings never level2+'],
                ['media slot', '16:9 max, scrim for text overlay'],
                ['actions', 'max 2, trailing, text button for secondary'],
                ['divider', 'outline at 12% — hairline, not opaque'],
              ],
            },
            {
              icon: <LayoutTemplate size={12} />, title: 'Sheet anatomy', parts: [
                ['drag handle', '32×4dp, 12dp above title'],
                ['title', 'titleMedium 16dp Chakra Petch 600'],
                ['scrim', '32% opacity, tap-to-dismiss on compact only'],
                ['max height', '92% of window, content scrolls inside'],
                ['peek', '16% on compact; medium opens at 50%'],
                ['dismiss', 'predictive back closes sheet before navigation'],
              ],
            },
          ].map((a) => (
            <Panel key={a.title} title={a.title} right={<span className="text-[var(--faint)] flex items-center gap-1.5">{a.icon} spec</span>}>
              <div className="space-y-2.5">
                {a.parts.map(([k, v], i) => (
                  <div key={k} className="flex gap-3">
                    <span className="mt-0.5 font-mono2 text-[9px] text-[var(--fainter)]">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <div className="font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--ion)]">{k}</div>
                      <div className="mt-0.5 text-[12px] leading-[1.6] text-[var(--dim)]">{v}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      )}

      {/* ---------- ADAPTIVE ---------- */}
      {tab === 'adaptive' && (
        <Panel title="Adaptive breakpoint rules" note="WindowSizeClass driven" right={<span className="flex items-center gap-1.5"><Ruler size={11} /> {w}dp</span>}>
          <input type="range" min={320} max={1440} step={1} value={w} onChange={(e) => setW(+e.target.value)} className="range mb-4" aria-label="Preview width in dp" />
          <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
            <div className="overflow-hidden border border-[var(--line)] bg-[var(--bg-2)]">
              <div className="flex items-center justify-between border-b border-[var(--line-faint)] px-3 py-1.5 font-mono2 text-[9px] uppercase tracking-[0.16em]">
                <span className="text-[var(--ion)]">{bp.name}</span>
                <span className="text-[var(--faint)]">wSizeClass · {body} col</span>
              </div>
              <div className="p-3" style={{ width: `${Math.min(100, (w / 1440) * 100)}%`, minWidth: 168, transition: 'width 260ms cubic-bezier(0.2,0,0,1)' }}>
                <div className="flex gap-2">
                  {bp.name !== 'compact' && (
                    <div className="flex w-9 shrink-0 flex-col items-center gap-2 border border-[var(--line-faint)] py-2">
                      {[0, 1, 2, 3].map((i) => <span key={i} className="h-2 w-2" style={{ background: i === 0 ? 'var(--amber)' : 'var(--fainter)' }} />)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1 space-y-2">
                    {Array.from({ length: body === 1 ? 4 : 3 }).map((_, i) => (
                      <div key={i} className="border border-[var(--line-faint)] p-2">
                        <div className="h-1.5 w-2/3 bg-[var(--fainter)]" />
                        <div className="mt-1.5 h-1.5 w-1/3 bg-[var(--line-faint)]" />
                      </div>
                    ))}
                  </div>
                  {body >= 3 && (
                    <div className="hidden w-32 shrink-0 space-y-2 border-l border-[var(--line-faint)] pl-2 md:block">
                      <div className="h-1.5 w-3/4 bg-[var(--ion)] opacity-60" />
                      <div className="h-1.5 w-full bg-[var(--line-faint)]" />
                      <div className="h-1.5 w-2/3 bg-[var(--line-faint)]" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="matrix" style={{ gridTemplateColumns: '108px 1fr 1fr' }}>
              <div data-head="1">bucket</div><div data-head="1">grid / nav</div><div data-head="1">pane</div>
              {BREAKPOINTS.map((b) => (
                [
                  <div key={b.name} data-active={b.name === bp.name ? '1' : '0'} className="font-orbit text-[11.5px] uppercase">
                    {b.name}<span className="ml-2 font-mono2 text-[9px] normal-case tracking-normal text-[var(--faint)]">{b.range}</span>
                  </div>,
                  <div key={b.name + 'g'} className="text-[11.5px] text-[var(--dim)]">{b.grid}<span className="block text-[var(--fainter)]">{b.nav}</span></div>,
                  <div key={b.name + 'p'} className="text-[11.5px] text-[var(--dim)]">{b.pane}<span className="block text-[var(--fainter)]">{b.targets}</span></div>,
                ]
              ))}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Meter label="fold hinge angle" value={92} max={180} unit="°" tone="var(--amber)" hint="posture: half-open" />
            <div className="border border-[var(--line-faint)] p-3">
              <SubHead note="hard rule">Foldable posture</SubHead>
              <p className="text-[12px] leading-[1.65] text-[var(--dim)]">
                Above 150° the app behaves as a book: list left, detail right, hinge gutter 16dp dead zone. Below it, single pane with the sheet for detail.
              </p>
            </div>
            <div className="border border-[var(--line-faint)] p-3">
              <SubHead note="never">Anti-patterns blocked</SubHead>
              <p className="text-[12px] leading-[1.65] text-[var(--dim)]">
                No <span className="font-mono2">if (isTablet)</span>. No magic numbers in views — lint flags any dimension not drawn from a spacing token.
              </p>
            </div>
          </div>
        </Panel>
      )}

      {/* ---------- JSON ---------- */}
      {tab === 'json' && (
        <Panel title="Figma-ready tokens" note="figma.tokens.json · imported via Tokens Studio" right={<span className="flex items-center gap-1.5"><Move size={11} /> round-tripped</span>}>
          <CodePanel code={JSON.stringify(FIGMA, null, 2)} file="tokens/figma.tokens.json" maxH={560} />
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip tone="var(--ion)">generated, never hand-edited</Chip>
            <Chip tone="var(--stable)">CI diff gate</Chip>
            <Chip>swift export via plugin</Chip>
            <Chip>3 modes</Chip>
          </div>
        </Panel>
      )}

      {/* ---------- KOTLIN ---------- */}
      {tab === 'kotlin' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Theme implementation" note="commonMain · Material 3 + custom">
            <CodePanel code={KOTLIN} file="dev/mka/reactor/Color.kt" maxH={430} />
          </Panel>
          <Panel title="Theme entry + motion" note="expect/actual for OS prefs">
            <CodePanel code={KOTLIN2} file="dev/mka/reactor/Theme.kt" maxH={430} />
            <p className="mt-3 text-[12px] leading-[1.7] text-[var(--dim)]">
              The iOS side consumes the same tokens through a generated <span className="font-mono2 text-[var(--ion)]">ReactorTheme+SwiftUI</span> shim, so a
              token change lands on five surfaces — Android, iOS, desktop, web and the Figma library — from one commit.
            </p>
          </Panel>
        </div>
      )}
    </div>
  );
}
