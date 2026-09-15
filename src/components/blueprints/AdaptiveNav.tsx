import { useMemo, useState } from 'react';
import { Columns2, Rows3, GitCommitHorizontal, Hand, RotateCcw, Save, Smartphone } from 'lucide-react';
import { Chip, CodePanel, Led, Panel, Spec, SubHead } from './shared';

/* ======================= A5 · ADAPTIVE NAVIGATION ======================= */
type Layout = 'list-detail' | 'supporting' | 'feed';

const POSTURES = [
  { name: 'phone portrait', w: 412, h: 915 },
  { name: 'fold outer', w: 348, h: 710 },
  { name: 'fold half-open', w: 673, h: 841 },
  { name: 'book / tablet', w: 800, h: 1280 },
  { name: 'tablet landscape', w: 1280, h: 800 },
  { name: 'desktop', w: 1600, h: 900 },
];

const CLASS_OF = (w: number) => (w < 600 ? 'compact' : w < 840 ? 'medium' : w < 1200 ? 'expanded' : 'large');
const H_CLASS_OF = (h: number, w: number) => (h < w * 0.8 ? 'short' : h < 1.4 * w ? 'medium' : 'tall');

const RULES: { layout: Layout; when: string; slots: string; motion: string; state: string }[] = [
  {
    layout: 'list-detail',
    when: 'width ≥ 840dp · height ≥ list height',
    slots: 'list 360dp fixed · detail fills remainder · rail 80dp',
    motion: 'detail entry is fade + 8dp rise, never horizontal — the list is already visible',
    state: 'list scroll index and selection are held in one NavModel; a detail push does not recreate the list composable',
  },
  {
    layout: 'supporting',
    when: '600–839dp, or expanded with a transient side task',
    slots: 'primary 62% · supporting pane 38% (min 320dp) · scrim on fold',
    motion: 'pane slides 24dp with emphasized 450ms; primary list narrows but does not reflow its grid',
    state: 'pane content survives rotation; closing the pane returns focus to the originating row',
  },
  {
    layout: 'feed',
    when: 'compact · height ≥ width (portrait) · single-hand zones',
    slots: 'full-bleed feed · bottom bar 64dp · FAB above nav in right-hand thumb zone',
    motion: 'push = 24dp slide + scrim; pop = predictive drag with live card offset',
    state: 'scroll position per tab, restored by SceneKey; draft text is held in the presenter, not the composable',
  },
];

const NAV3 = `// :core:navigation — one scene graph, four shells (Navigation 3 / androidx.navigation3)
@Serializable
sealed interface Scene {
    @Serializable data object Feed : Scene
    @Serializable data class Detail(val itemId: ItemId, val originIndex: Int) : Scene
    @Serializable data class Pane(val itemId: ItemId) : Scene          // medium+ only
    @Serializable data class Compose(val draft: DraftId?) : Scene
}

@Composable
fun rememberNavModel(saved: SavedStateRegistry): NavModel {
    // The back stack is DATA, not framework state: it serialises, so a posture
    // change, process death, or a deep link restore through the same path.
    return rememberSaveable(savedStateRegistry = saved, saver = NavModelSaver) {
        NavModel(backStack = persistentListOf(Scene.Feed))
    }
}

class NavModel(val backStack: List<Scene>) {
    val layout: Layout
        get() = when {
            backStack.size == 1 && isCompact -> Layout.Feed
            supportsPane -> Layout.Supporting
            else -> Layout.ListDetail
        }
    fun onWindowSizeChanged(old: WindowSizeClass, new: WindowSizeClass) {
        // compact -> expanded: promote the top Detail into a pane, keep selection
        if (!old.isCompact && new.isCompact && top is Scene.Pane) pop()
        if (old.isCompact && !new.isCompact && top is Scene.Detail) promote(top)
    }
}`;

const PREDICTIVE = `// predictive back — the scene animates with the gesture, not after it
@OptIn(ExperimentalPredictiveBackApi::class)
@Composable
fun BackAwareScene(
    model: NavModel,
    content: @Composable (Progress: Float) -> Unit,   // 0f..1f drives the card
) {
    val progress = LocalOnBackPressedDispatcherOwner.current!!
        .onBackPressedDispatcher.predictiveBackProgress.collectAsState()

    val offset = with(LocalDensity.current) { 24.dp.toPx() * progress.value }
    Box(Modifier
        .graphicsLayer {
            translationX = offset
            scaleX = 1f - 0.04f * progress.value
            alpha = 1f - 0.28f * progress.value
        }
        .background(scrimFor(progress.value)),
    ) { content(progress.value) }

    // Cancel mid-gesture: spring back with MotionSpec.Standard, no state change.
    // Commit: model.pop() only when the gesture passes the 0.42 threshold.
}`;

export default function AdaptiveNav() {
  const [w, setW] = useState(1280);
  const [h, setH] = useState(800);
  const [layout, setLayout] = useState<Layout>('list-detail');
  const [peek, setPeek] = useState(0.28);
  const [stack, setStack] = useState(['Feed', 'Detail · cell-14', 'Sheet · refit']);
  const [preserved, setPreserved] = useState(true);

  const wc = CLASS_OF(w);
  const hc = H_CLASS_OF(h, w);
  const rule = RULES.find((r) => r.layout === layout)!;
  const suggested = useMemo<Layout>(() => (wc === 'compact' ? 'feed' : wc === 'medium' ? 'supporting' : 'list-detail'), [wc]);

  const cols = layout === 'feed' ? 1 : layout === 'supporting' ? 2 : 2;
  const listItems = Math.max(4, Math.min(12, Math.floor((h / 96) * (layout === 'feed' ? 1 : 1))));

  const push = (s: string) => setStack((p) => [...p.slice(-3), s]);
  const pop = () => setStack((p) => (p.length > 1 ? p.slice(0, -1) : p));

  return (
    <div className="space-y-5">
      {/* simulator controls */}
      <div className="bp-card grid gap-4 p-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1.5 flex items-baseline justify-between font-mono2 text-[9px] uppercase tracking-[0.18em] text-[var(--faint)]">
              <span>window width</span><span className="text-[var(--ion)]">{w}dp</span>
            </span>
            <input type="range" min={320} max={1800} value={w} onChange={(e) => setW(+e.target.value)} className="range" aria-label="Window width in dp" />
          </label>
          <label className="block">
            <span className="mb-1.5 flex items-baseline justify-between font-mono2 text-[9px] uppercase tracking-[0.18em] text-[var(--faint)]">
              <span>window height</span><span className="text-[var(--amber)]">{h}dp</span>
            </span>
            <input type="range" min={360} max={1400} value={h} onChange={(e) => setH(+e.target.value)} className="range" aria-label="Window height in dp" />
          </label>
          <div className="flex flex-wrap gap-1.5">
            {POSTURES.map((p) => (
              <button key={p.name} onClick={() => { setW(p.w); setH(p.h); }}
                className={`border px-2.5 py-1 font-mono2 text-[9px] uppercase tracking-[0.12em] transition-colors ${
                  p.w === w && p.h === h ? 'border-[var(--ion)] text-[var(--ion)]' : 'border-[var(--line-faint)] text-[var(--faint)] hover:text-[var(--txt)]'
                }`}>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 self-start">
          {[
            { k: 'wSizeClass', v: wc },
            { k: 'hSizeClass', v: hc },
            { k: 'suggested', v: suggested },
            { k: 'rail', v: wc === 'compact' ? 'bottom bar' : 'permanent 80dp' },
          ].map((x) => (
            <div key={x.k} className="border border-[var(--line-faint)] bg-[rgba(4,6,10,0.55)] px-3 py-2">
              <div className="font-mono2 text-[8.5px] uppercase tracking-[0.18em] text-[var(--faint)]">{x.k}</div>
              <div className="mt-0.5 font-orbit text-[12px]" style={{ color: x.k === 'suggested' && suggested !== layout ? 'var(--amber)' : 'var(--txt)' }}>{x.v}</div>
            </div>
          ))}
          {suggested !== layout && (
            <button onClick={() => setLayout(suggested)} className="col-span-2 border border-[var(--amber)] px-3 py-2 font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--amber)] transition-colors hover:bg-[rgba(255,193,77,0.1)]">
              window crossed a threshold → adopt {suggested}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        {/* live layout */}
        <Panel title="Canonical layout" note={`${layout} · ${w}×${h}dp`} right={<span className="flex items-center gap-1.5"><Led tone="ok" /> live</span>}>
          <div className="flex flex-wrap gap-1.5">
            {RULES.map((r) => (
              <button key={r.layout} onClick={() => setLayout(r.layout)} aria-pressed={layout === r.layout}
                className={`flex items-center gap-1.5 border px-3 py-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.14em] transition-colors ${
                  layout === r.layout ? 'border-[var(--ion)] bg-[rgba(56,214,255,0.1)] text-[var(--ion)]' : 'border-[var(--line-faint)] text-[var(--faint)] hover:text-[var(--txt)]'
                }`}>
                {r.layout === 'list-detail' ? <Columns2 size={11} /> : r.layout === 'feed' ? <Rows3 size={11} /> : <GitCommitHorizontal size={11} />}
                {r.layout}
              </button>
            ))}
          </div>

          {/* preview surface */}
          <div className="mt-4 overflow-x-auto border border-[var(--line)] bg-[rgba(4,6,10,0.5)] p-4">
            <div
              className="mx-auto flex overflow-hidden border border-[var(--line-strong)] bg-[var(--bg-2)] transition-all duration-300"
              style={{ width: Math.max(280, Math.min(w, 1180)) * 0.62, height: Math.max(220, Math.min(h, 1400)) * 0.34 }}
            >
              {wc !== 'compact' && (
                <div className="flex w-9 shrink-0 flex-col items-center gap-2 border-r border-[var(--line-faint)] py-2.5">
                  {[0, 1, 2, 3].map((i) => <span key={i} className="h-2 w-2" style={{ background: i === 0 ? 'var(--amber)' : 'var(--fainter)' }} />)}
                </div>
              )}
              <div className="min-w-0 flex-1 divide-y divide-[var(--line-faint)] overflow-hidden">
                {Array.from({ length: listItems }).map((_, i) => (
                  <div key={i} className={`flex items-center gap-2 px-2.5 py-1.5 transition-colors ${i === 2 ? 'bg-[rgba(56,214,255,0.1)]' : ''}`}>
                    <span className="h-3 w-3 shrink-0 border" style={{ borderColor: i === 2 ? 'var(--ion)' : 'var(--line-faint)' }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono2 text-[8px] text-[var(--txt-soft)]">item {String(i + 1).padStart(2, '0')} · containment log</span>
                      {layout === 'feed' && <span className="mt-0.5 block h-1 w-2/3 bg-[var(--line-faint)]" />}
                    </span>
                    <span className="h-1 w-6 shrink-0 bg-[var(--line-faint)]" />
                  </div>
                ))}
              </div>
              {cols === 2 && (
                <div className="hidden min-w-0 flex-1 flex-col gap-2 border-l border-[var(--line-faint)] p-2.5 md:flex">
                  <span className="h-1.5 w-2/3 bg-[var(--ion)] opacity-70" />
                  <span className="h-1.5 w-full bg-[var(--line-faint)]" />
                  <span className="h-1.5 w-4/5 bg-[var(--line-faint)]" />
                  <span className="mt-auto flex gap-1.5">
                    <span className="h-4 w-14 bg-[var(--ion)]/30" />
                    <span className="h-4 w-10 border border-[var(--line-faint)]" />
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-2.5 text-[12px] leading-[1.65]">
            {[
              ['trigger', rule.when],
              ['slots', rule.slots],
              ['motion', rule.motion],
              ['state', rule.state],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-wrap gap-x-3">
                <span className="w-[76px] shrink-0 font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--faint)]">{k}</span>
                <span className="min-w-0 flex-1 text-[var(--dim)]">{v}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* back stack + posture change */}
        <div className="space-y-4">
          <Panel title="Back stack · NavModel" note="serialised data" right={<Save size={11} />}>
            <ol className="space-y-1.5">
              {stack.map((s, i) => (
                <li key={`${s}-${i}`} className="bp-row flex items-center gap-2.5 border border-[var(--line-faint)] px-3 py-2">
                  <span className="font-mono2 text-[9px] text-[var(--fainter)]">{String(i + 1).padStart(2, '0')}</span>
                  <span className="min-w-0 flex-1 truncate font-mono2 text-[10.5px] text-[var(--txt-soft)]">{s}</span>
                  {i === stack.length - 1 && <Led />}
                </li>
              ))}
            </ol>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <button onClick={() => push('Pane · refit-note')} className="border border-[var(--line)] px-3 py-1.5 font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--dim)] hover:border-[var(--ion)] hover:text-[var(--ion)]">push scene</button>
              <button onClick={pop} className="border border-[var(--line)] px-3 py-1.5 font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--dim)] hover:border-[var(--ember)] hover:text-[var(--ember)]">pop</button>
              <button onClick={() => { setW(wc === 'compact' ? 1280 : 412); setH(wc === 'compact' ? 800 : 915); setPreserved(true); }}
                className="flex items-center gap-1.5 border border-[var(--amber)] px-3 py-1.5 font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--amber)] hover:bg-[rgba(255,193,77,0.1)]">
                <RotateCcw size={10} /> simulate posture change
              </button>
            </div>
            <p className="mt-3 flex items-center gap-2 border-t border-[var(--line-faint)] pt-3 text-[11.5px] leading-[1.6] text-[var(--dim)]">
              <Hand size={12} className="shrink-0 text-[var(--stable)]" />
              {preserved
                ? 'Selection, scroll index and the draft buffer are held by the presenter, so the posture change re-lays out without a re-fetch — no flicker, no lost typing.'
                : 'Stack rebuilt from default: this is what happens when state lives in a composable instead of the model.'}
            </p>
            <button onClick={() => setPreserved((p) => !p)} className="mt-1 font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--ion)] hover:text-[var(--amber)]">
              toggle state ownership →
            </button>
          </Panel>

          <Panel title="Predictive back" note="scrub the gesture" right={<span className="font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--amber)]">{(peek * 100).toFixed(0)}%</span>}>
            <input type="range" min={0} max={1} step={0.01} value={peek} onChange={(e) => setPeek(+e.target.value)} className="range" aria-label="Predictive back progress" />
            <div className="relative mt-3 h-[104px] overflow-hidden border border-[var(--line-faint)] bg-[rgba(4,6,10,0.6)]">
              <div className="absolute inset-0 p-2.5">
                <div className="h-1.5 w-1/3 bg-[var(--line-faint)]" />
                <div className="mt-1.5 h-1.5 w-1/2 bg-[var(--line-faint)]" />
              </div>
              <div
                className="absolute inset-1 border border-[var(--line-strong)] bg-[var(--panel-solid)]"
                style={{
                  transform: `translateX(${peek * 62}%) scale(${1 - peek * 0.06})`,
                  opacity: 1 - peek * 0.3,
                }}
              >
                <div className="flex items-center justify-between border-b border-[var(--line-faint)] px-2 py-1">
                  <span className="font-mono2 text-[8px] uppercase tracking-[0.16em] text-[var(--faint)]">scene · sheet</span>
                  <span className="font-mono2 text-[8px]" style={{ color: peek > 0.42 ? 'var(--amber)' : 'var(--fainter)' }}>{peek > 0.42 ? 'release → pop' : 'release → cancel'}</span>
                </div>
                <div className="p-2">
                  <div className="h-1.5 w-2/3" style={{ background: 'var(--ion)', opacity: 0.55 }} />
                  <div className="mt-1.5 h-1.5 w-full bg-[var(--line-faint)]" />
                  <div className="mt-1.5 h-1.5 w-3/5 bg-[var(--line-faint)]" />
                </div>
              </div>
              <div className="absolute inset-0 bg-black transition-opacity duration-200" style={{ opacity: 0.34 * (1 - peek) }} />
            </div>
            <Spec rows={[
              ['threshold', '0.42 of min(width, height)'],
              ['cancel', 'spring back · no state mutation'],
              ['commit', 'pop only after the finger lifts past threshold'],
              ['parity', 'same curve on Android gesture, iOS edge-swipe, desktop Esc'],
            ]} />
          </Panel>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Panel title="Navigation 3 scene graph" note="expect/actual free · serialisable">
          <CodePanel code={NAV3} file="core/navigation/…/NavModel.kt" maxH={430} />
        </Panel>
        <Panel title="Layout contract" note="what never changes">
          <SubHead note="invariants">Cross-posture rules</SubHead>
          <ul className="space-y-2 text-[12px] leading-[1.65] text-[var(--dim)]">
            {[
              'Selection is a key, never an index — indices break when a grid reflows.',
              'Every pane gets its own scroll state container, keyed by scene id.',
              'Gutter tokens, not absolute widths; a foldable book reads as two windows.',
              'Keyboard focus follows the promoted pane, so Tab order stays sane after a posture change.',
              'The layout is derived from class, never from device type — no isTablet in review.',
            ].map((t) => (
              <li key={t} className="flex gap-2.5"><span className="mt-1.5 h-1 w-1 shrink-0 bg-[var(--ion)]" />{t}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Chip tone="var(--ion)">WindowSizeClass</Chip>
            <Chip tone="var(--amber)">rememberSaveable + Saver</Chip>
            <Chip tone="var(--stable)">Material 3 adaptive</Chip>
            <Chip><Smartphone size={9} className="mr-1 inline" />4 targets</Chip>
          </div>
        </Panel>
      </div>

      <Panel title="Gesture-driven motion" note="progress is an input, not an animation">
        <CodePanel code={PREDICTIVE} file="core/designsystem/…/BackAwareScene.kt" maxH={360} />
      </Panel>
    </div>
  );
}
