import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ReactFlow, ReactFlowProvider, Background, BackgroundVariant, MiniMap, Handle, Position,
  MarkerType, useNodesState, useEdgesState, useReactFlow, type Node, type Edge, type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Maximize2, Play, Pause, GitBranch, Boxes, ShieldCheck } from 'lucide-react';
import { Chip, CodePanel, Led, Panel, SubHead } from './shared';

/* ======================= A1 · KMP ARCHITECTURE ======================= */
type Tone = 'core' | 'shell' | 'actual' | 'infra';

interface Raw {
  label: string; sub: string; tone: Tone; kind: string; detail: string;
  ports: string[]; deps: string[]; tests: string; artifact: string;
}
/* React Flow requires data to satisfy Record<string, unknown> */
type BpData = Raw & Record<string, unknown>;
type GrpData = { label: string; w: number; h: number } & Record<string, unknown>;
type AnyData = BpData | GrpData;

const TONE_COLOR: Record<Tone, string> = {
  core: '#38d6ff', shell: '#ff6a2b', actual: '#ff3d8b', infra: '#46e39b',
};

const NODES: Node<AnyData, 'bp' | 'grp'>[] = [
  /* group containers */
  { id: 'g-shells', type: 'grp', position: { x: 0, y: 24 }, data: { label: 'Platform shells', w: 172, h: 512 }, draggable: false, selectable: false, zIndex: 0, style: { width: 172, height: 512 } },
  { id: 'g-core', type: 'grp', position: { x: 206, y: 24 }, data: { label: 'Shared core · commonMain', w: 528, h: 512 }, draggable: false, selectable: false, zIndex: 0, style: { width: 528, height: 512 } },
  { id: 'g-actual', type: 'grp', position: { x: 766, y: 24 }, data: { label: 'actual · per target', w: 190, h: 512 }, draggable: false, selectable: false, zIndex: 0, style: { width: 190, height: 512 } },
  { id: 'g-infra', type: 'grp', position: { x: 988, y: 24 }, data: { label: 'Build & guardrails', w: 180, h: 512 }, draggable: false, selectable: false, zIndex: 0, style: { width: 180, height: 512 } },

  /* shells */
  { id: 's-and', type: 'bp', position: { x: 14, y: 66 }, zIndex: 2, style: { width: 144 }, data: {
    label: 'Android', sub: 'Compose · 1.9.2', tone: 'shell', kind: 'shell',
    detail: 'Thin shell: Activity + ComposeView only. Process death is survived because every screen state is a serialisable snapshot on the presenter, not a ViewModel field. Baseline profile generated on merge to main.',
    ports: ['MainActivity → ComposeView', 'Widget/Glance receivers', 'FGS + WorkManager bridges'],
    deps: [':core:presentation', ':core:designsystem'], tests: 'Roborazzi + Molecule + Instrumented', artifact: 'app-release.aab → Play staged 1→5→20→100%',
  } },
  { id: 's-ios', type: 'bp', position: { x: 14, y: 186 }, zIndex: 2, style: { width: 144 }, data: {
    label: 'iOS', sub: 'SwiftUI interop', tone: 'shell', kind: 'shell',
    detail: 'SwiftUI hosts shared presenters through the generated ObjC framework. A tiny `FlowPublisher` bridge converts Kotlin Flow into AsyncSequence so SwiftUI observes state without Combine glue sprinkled in views.',
    ports: ['UIViewControllerRepresentable host', 'SwiftUI ⇄ AsyncSequence bridge', 'APNS registration'],
    deps: [':core:presentation (xcframework)'], tests: 'Xcode snapshot + unit', artifact: 'xcframework + ipa → TestFlight nightly',
  } },
  { id: 's-dsk', type: 'bp', position: { x: 14, y: 306 }, zIndex: 2, style: { width: 144 }, data: {
    label: 'Desktop', sub: 'Compose · JVM', tone: 'shell', kind: 'shell',
    detail: 'Reuses the same presentation module; only window chrome, shortcuts and tray integration are target-specific. Window size class drives list-detail vs pane layouts identical to Android.',
    ports: ['application { Window(...) }', 'menubar + accelerators', 'tray'],
    deps: [':core:presentation'], tests: 'Paparazzi + JVM unit', artifact: 'jpackage dmg / msi / AppImage',
  } },
  { id: 's-web', type: 'bp', position: { x: 14, y: 426 }, zIndex: 2, style: { width: 144 }, data: {
    label: 'Web', sub: 'Compose · Wasm', tone: 'shell', kind: 'shell',
    detail: 'wasmJs target with Compose for Web. Networking swaps Ktor CIO for the Js client; persistence targets IndexedDB through the same cache contract, so the offline model is identical to mobile.',
    ports: ['main.wasm + index.html', 'service worker shell', 'deep-link router'],
    deps: [':core:presentation'], tests: 'Karma/Chromium headless', artifact: 'static bundle → CDN + immutable cache',
  } },

  /* shared core */
  { id: 'c-pres-1', type: 'bp', position: { x: 222, y: 66 }, zIndex: 2, style: { width: 232 }, data: {
    label: 'Presentation layer', sub: 'Molecule presenter · StateFlow', tone: 'core', kind: 'shared',
    detail: 'Presenters are `@Composable`-free coroutine functions built with Cash App Molecule: they fold intents into immutable State and are testable on the JVM in milliseconds — the same code drives all four shells.',
    ports: ['fun state(): StateFlow<ScreenUi>', 'fun dispatch(intent: ScreenIntent)'],
    deps: [':core:domain', ':core:designsystem:tokens'], tests: 'Molecule + Turbine (JVM, all targets)', artifact: 'klib + jar + wasm',
  } },
  { id: 'c-pres-2', type: 'bp', position: { x: 470, y: 66 }, zIndex: 2, style: { width: 248 }, data: {
    label: 'Navigation & scenes', sub: 'Navigation 3 · SceneGraph', tone: 'core', kind: 'shared',
    detail: 'A serialisable `List<Scene>` back stack owned by a NavModel in the core. Because the stack is data, posture changes, process death and deep links restore identically on every platform.',
    ports: ['NavModel.backStack: List<Scene>', 'predictive back progress → 0..1f'],
    deps: [':core:domain:model'], tests: 'back-stack snapshot round-trip', artifact: 'shared module',
  } },
  { id: 'c-dom-1', type: 'bp', position: { x: 222, y: 190 }, zIndex: 2, style: { width: 232 }, data: {
    label: 'Domain core', sub: 'UseCase · Model · Rules', tone: 'core', kind: 'shared',
    detail: 'Zero platform imports — enforced by a build-rules test, not by convention. Business rules, invariants and validation live here, which is why a change to Compose or Firebase never touches them.',
    ports: ['class StabiliseLoop @Inject constructor(repo)', 'sealed interface Containment'],
    deps: ['kotlinx-coroutines, kotlinx-datetime, kotlin-test only'], tests: '1 204 JVM tests · 380 ms', artifact: 'pure klib',
  } },
  { id: 'c-dom-2', type: 'bp', position: { x: 470, y: 190 }, zIndex: 2, style: { width: 248 }, data: {
    label: 'Repository contracts', sub: 'interfaces only', tone: 'core', kind: 'shared',
    detail: 'Domain declares what it needs; data satisfies it. Dependency inversion is the whole reason the core can stay platform-free while still supporting offline sync and remote relays.',
    ports: ['interface SampleRepository { fun flow(id): Flow<…> }', 'interface Clock, IdGen, SecureStore(expect)'],
    deps: ['none — dependsOn nothing'], tests: 'contract fakes shared across targets', artifact: 'api dump + binary compat gate',
  } },
  { id: 'c-data-1', type: 'bp', position: { x: 222, y: 314 }, zIndex: 2, style: { width: 232 }, data: {
    label: 'Data + sync engine', sub: 'RepositoryImpl · change-log', tone: 'core', kind: 'shared',
    detail: 'Local DB is the source of truth; the relay is a sync mechanism. Mutations queue as idempotent ops with client UUIDs and monotonic sequence numbers, so retry is safe and conflict merge is deterministic.',
    ports: ['override fun flow(id) = cache.dao().flow(id)', 'enqueue(op: Mutation): Result<Unit>'],
    deps: [':core:domain (contracts)', ':core:platform'], tests: 'SQLDelight migrations fwd/back · sqlite-driver tests',
    artifact: 'klib per target · generated interfaces',
  } },
  { id: 'c-data-2', type: 'bp', position: { x: 470, y: 314 }, zIndex: 2, style: { width: 248 }, data: {
    label: 'Cache & storage', sub: 'SQLDelight 2.1 · Driver per target', tone: 'core', kind: 'shared',
    detail: 'One schema, four drivers: AndroidxSqlite (Android), NativeSqliteDriver (iOS/Desktop), WebSqlDatabase/IndexedDB (Wasm). Encryption at rest comes from the platform contract, never from the module.',
    ports: ['schema/*.sq migrations', 'expect fun driverFactory(): SqlDriver'],
    deps: [':core:platform:secure'], tests: 'migration + query plan assertions', artifact: 'generated Kotlin query API',
  } },
  { id: 'c-data-3', type: 'bp', position: { x: 222, y: 430 }, zIndex: 2, style: { width: 232 }, data: {
    label: 'Network relay', sub: 'Ktor 3.2 · kotlinx-serialization', tone: 'core', kind: 'shared',
    detail: 'Engine is injected per target (CIO/OkHttp/Darwin/Js). Requests are de-duplicated by key — four screens asking for one feed cost one round trip, which bought more perceived speed than a month of visual tuning.',
    ports: ['expect val httpEngine: HttpClientEngine', 'certificate pinning + retry policy'],
    deps: [':core:domain', ':core:platform'], tests: 'OkHttp MockWebServer / contract tests', artifact: 'shared client + DTOs',
  } },
  { id: 'c-plat', type: 'bp', position: { x: 470, y: 430 }, zIndex: 2, style: { width: 248 }, data: {
    label: 'expect · contracts', sub: 'expect declarations', tone: 'core', kind: 'expect',
    detail: 'The expect side declares four capabilities. Every actual must compile for all four targets or CI fails — the `expect/actual` ledger test enumerates declarations against registered actuals.',
    ports: ['expect class SecureStore', 'expect fun biometric(): BiometricGate', 'expect val httpEngine', 'expect fun telemetry(): TelemetrySink'],
    deps: ['implemented by the actuals group →'], tests: 'ledger test: expect count == actual count', artifact: 'commonMain only',
  } },

  /* actuals */
  { id: 'a-and', type: 'bp', position: { x: 780, y: 66 }, zIndex: 2, style: { width: 162 }, data: {
    label: 'Android actual', sub: 'Keystore 4 · Credential Mgr', tone: 'actual', kind: 'actual',
    detail: 'EncryptedSharedPreferences replaced by Keystore-bound AES-GCM with a strong-auth gate; passkeys issued via Credential Manager for the zero-trust flow.',
    ports: ['actual class SecureStore(ctx)', 'actual fun biometric(): BiometricGate'],
    deps: ['androidx.security-crypto? no — custom keystore', 'androidx.credentials'], tests: 'instrumented, API 26→36', artifact: 'aar inside app',
  } },
  { id: 'a-ios', type: 'bp', position: { x: 780, y: 186 }, zIndex: 2, style: { width: 162 }, data: {
    label: 'iOS actual', sub: 'Keychain · ASAuthorization', tone: 'actual', kind: 'actual',
    detail: 'cinterop against Security and Authentication frameworks. Accessible-after-first-unlock with BIOMETRY_CURRENT_SET, plus secure enclave attestation for the passkey ceremony.',
    ports: ['actual class SecureStore (cinterop)', 'ASAuthorizationPlatformPublicKeyProvider'],
    deps: ['cinterop def security.def'], tests: 'XCTest on simulator + device', artifact: 'xcframework slice',
  } },
  { id: 'a-dsk', type: 'bp', position: { x: 780, y: 306 }, zIndex: 2, style: { width: 162 }, data: {
    label: 'Desktop actual', sub: 'libsecret / DPAPI', tone: 'actual', kind: 'actual',
    detail: 'Per-OS secret store chosen at runtime: libsecret on GNOME, Keychain on macOS, DPAPI on Windows. Fallback is an encrypted file with an OS-derived key, never plaintext.',
    ports: ['actual class SecureStore (JNA)', 'os.detect() strategy'],
    deps: ['JNA, keyring-jvm'], tests: 'Paparazzi + linux ci runner', artifact: 'jar in jpackage image',
  } },
  { id: 'a-web', type: 'bp', position: { x: 780, y: 426 }, zIndex: 2, style: { width: 162 }, data: {
    label: 'Web actual', sub: 'WebCrypto · IndexedDB', tone: 'actual', kind: 'actual',
    detail: 'WebAuthn discoverable credentials, AES-GCM keys non-extractable via WebCrypto, and a cache in IndexedDB. If the browser refuses persistence, the app degrades to memory-only with an explicit banner.',
    ports: ['actual class SecureStore (wasm)', 'navigator.credentials.create()'],
    deps: ['kotlinx-browser, kotlin-wrappers'], tests: 'Chromium headless', artifact: 'part of wasm bundle',
  } },

  /* infra */
  { id: 'i-di', type: 'bp', position: { x: 1002, y: 66 }, zIndex: 2, style: { width: 152 }, data: {
    label: 'DI graph', sub: 'kotlin-inject · compile-time', tone: 'infra', kind: 'infra',
    detail: 'Compile-time injection keeps the common module reflection-free and cheap on iOS, where runtime reflection is unavailable. No service locator escapes into domain.',
    ports: ['@Component interface AppGraph', 'per-scope modules by layer'],
    deps: ['processOnly KSP2 plugin'], tests: 'graph completeness test at build', artifact: 'generated Kotlin sources',
  } },
  { id: 'i-corr', type: 'bp', position: { x: 1002, y: 186 }, zIndex: 2, style: { width: 152 }, data: {
    label: 'Dispatcher provider', sub: 'expect · test seam', tone: 'infra', kind: 'infra',
    detail: 'One expect gives the domain its execution context: default for compute, io for relay, main for render. Tests swap in forTest() with virtual time, so latency logic stays deterministic.',
    ports: ['expect fun dispatcherFor(kind): CoroutineDispatcher'],
    deps: ['kotlinx-coroutines-test'], tests: 'virtual-time determinism', artifact: 'common + actuals',
  } },
  { id: 'i-guard', type: 'bp', position: { x: 1002, y: 306 }, zIndex: 2, style: { width: 152 }, data: {
    label: 'Dependency guard', sub: 'arch rule · CI gate', tone: 'infra', kind: 'infra',
    detail: 'A Gradle rule parses :domain compile classpath and fails the build if anything outside the allowlist appears. Architecture survives because it is enforced, not documented.',
    ports: ['forbid: android.*, platform.*', 'allow: kotlin.*, kotlinx-coroutines, kotlinx-datetime'],
    deps: ['source-set metadata'], tests: 'negative fixture proves it fails', artifact: 'build convention plugin',
  } },
  { id: 'i-api', type: 'bp', position: { x: 1002, y: 426 }, zIndex: 2, style: { width: 152 }, data: {
    label: 'API surface gate', sub: 'binary-compat validator', tone: 'infra', kind: 'infra',
    detail: 'Every shared module dumps its public API. A PR that changes the contract for the iOS framework or the web bundle fails until the dump is reviewed, so nobody breaks four shells quietly.',
    ports: ['apiDump per module', 'klib ABI check'],
    deps: ['gradle plugin'], tests: 'diff must be empty or approved', artifact: 'api/*.api files',
  } },
];

const mkEdge = (source: string, target: string, label: string, dashed = false): Edge => ({
  id: `${source}-${target}`, source, target, label,
  sourceHandle: null, targetHandle: null,
  type: 'smoothstep',
  animated: true,
  style: { stroke: dashed ? 'rgba(255,61,139,0.6)' : 'rgba(56,214,255,0.55)', strokeWidth: 1.3, strokeDasharray: dashed ? '4 5' : undefined },
  labelStyle: { fill: 'var(--faint)', fontSize: 8, fontFamily: 'IBM Plex Mono, monospace' },
  labelBgStyle: { fill: 'var(--bg)', fillOpacity: 0.9 },
  markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14, color: dashed ? '#ff3d8b' : '#38d6ff' },
});

const EDGES: Edge[] = [
  mkEdge('s-and', 'c-pres-1', 'compose view'),
  mkEdge('s-ios', 'c-pres-1', 'observe flow'),
  mkEdge('s-dsk', 'c-pres-1', 'compose view'),
  mkEdge('s-web', 'c-pres-1', 'compose dom'),
  mkEdge('s-and', 'c-pres-2', 'host scenes'),
  mkEdge('s-dsk', 'c-pres-2', 'host scenes'),
  mkEdge('c-pres-1', 'c-dom-1', 'invoke'),
  mkEdge('c-pres-1', 'c-pres-2', 'routes'),
  mkEdge('c-data-1', 'c-dom-2', 'implements'),
  mkEdge('c-dom-1', 'c-dom-2', 'depends on', true),
  mkEdge('c-pres-1', 'c-data-1', 'never'),
  mkEdge('c-data-1', 'c-data-2', 'cache first'),
  mkEdge('c-data-1', 'c-data-3', 'relay'),
  mkEdge('c-data-1', 'c-plat', 'uses'),
  mkEdge('c-data-2', 'c-plat', 'driver'),
  mkEdge('c-data-3', 'c-plat', 'engine'),
  mkEdge('c-plat', 'a-and', 'actual', true),
  mkEdge('c-plat', 'a-ios', 'actual', true),
  mkEdge('c-plat', 'a-dsk', 'actual', true),
  mkEdge('c-plat', 'a-web', 'actual', true),
  mkEdge('i-di', 'c-pres-1', 'generates', true),
  mkEdge('i-corr', 'c-data-1', 'io pool', true),
  mkEdge('i-guard', 'c-dom-1', 'enforces', true),
  mkEdge('i-api', 'c-dom-2', 'api dump', true),
];

const EXPECT_CODE = `// :core:platform — commonMain (expect side, no platform imports)
expect class SecureStore {
    fun put(key: StoreKey, value: ByteArray): Result<Unit>
    fun get(key: StoreKey): ByteArray?
    val isHardwareBacked: Boolean
}

expect val httpEngine: HttpClientEngine          // CIO / Darwin / Js
expect fun dispatcherFor(kind: DispatchKind): CoroutineDispatcher

// :core:platform — androidMain
actual class SecureStore(context: Context) {
    private val master = KeyGen.masterKey("mka.store")   // Keystore 4, strong auth bound
    private val aes = Cipher.getInstance("AES/GCM/NoPadding").apply { init(ENCRYPT_MODE, master) }
    actual fun put(key: StoreKey, value: ByteArray) = runCatching { disk.write(key, aes.doFinal(value)) }
    actual val isHardwareBacked: Boolean get() = KeyStore.isKeyEntry(master) && biometric().canAuth()
}`;

const SRCSET_CODE = `kotlin {                                       // :core:domain/build.gradle.kts
    explicitApi()
    applyDefaultHierarchyTemplate()            // commonMain → *Main → platform

    androidTarget()
    listOf(iosArm64(), iosSimulatorArm64(), macosArm64()).forEach(::listOf)
    jvm("desktop")
    wasmJs()

    sourceSets {
        commonMain.dependencies {
            implementation(libs.kotlinx.coroutines.core)
            implementation(libs.kotlinx.datetime)
        }
        commonTest.dependencies {              // ONE test suite runs on all four targets
            implementation(kotlin("test"))
            implementation(libs.turbine)
            implementation(libs.molecule.runtime)
        }
    }
}`;

/* ---------- CI/CD matrix ---------- */
const STAGES = ['compile', 'test', 'screenshot', 'package', 'sign', 'rollout'];
const PIPELINE: { target: string; runner: string; cache: string; steps: string[] }[] = [
  { target: 'android', runner: 'ubuntu-24.04 · 8core', cache: 'gradle remote cache + config cache',
    steps: ['assembleRelease (klib warm)', 'unit · lint · dependency guard', 'Roborazzi on AOSP 2GB profile', 'bundleRelease + baseline profile', 'Play App Signing (HW-backed)', 'staged 1→5→20→100% + auto-halt'] },
  { target: 'ios', runner: 'macos-15-xlarge', cache: 'derived data + konan cache',
    steps: ['linkDebugFrameworkIosArm64 · release', 'XCTest on simulator', 'snapshot tests, 3 device classes', 'xcodebuild archive', 'secure enclave attestation', 'TestFlight nightly → Phased release'] },
  { target: 'desktop', runner: 'ubuntu + windows-11 matrix', cache: 'kotlinc jvm incremental',
    steps: ['compileKotlinDesktop (jvm)', 'JVM unit + Molecule time tests', 'Paparazzi 4 window classes', 'jpackage dmg · msi · AppImage', 'notarise + Authenticode', 'auto-update feed, delta patch'] },
  { target: 'web (wasm)', runner: 'ubuntu-24.04', cache: 'wasm binary cache',
    steps: ['wasmJsBrowserDistribution', 'Chromium headless contract tests', 'visual regression 1280/768/390', 'immutable bundle + service worker', 'subresource integrity', 'CDN canary 5% → 100%'] },
];

function BpNodeView({ data, selected }: NodeProps) {
  const d = data as unknown as Raw;
  return (
    <div className="bp-node" data-tone={d.tone} data-pinned={selected ? '1' : '0'}>
      <Handle type="target" position={Position.Left} className="bp-handle" />
      <div className="flex items-center justify-between gap-2">
        <span className="bp-node-title text-[var(--txt)]">{d.label}</span>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: TONE_COLOR[d.tone], boxShadow: `0 0 8px ${TONE_COLOR[d.tone]}` }} />
      </div>
      <div className="bp-node-meta mt-1">{d.sub}</div>
      <Handle type="source" position={Position.Right} className="bp-handle" />
    </div>
  );
}

function GrpNodeView({ data }: NodeProps) {
  const d = data as unknown as { label: string };
  return (
    <div className="bp-group h-full w-full">
      <span className="bp-group-label">{d.label}</span>
    </div>
  );
}

function FlowInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(EDGES);
  const [pinned, setPinned] = useState<string | null>('c-dom-1');
  const [flows, setFlows] = useState(true);
  const [showActual, setShowActual] = useState(true);
  const [showGuard, setShowGuard] = useState(true);
  const { fitView } = useReactFlow();

  const nodeTypes = useMemo(() => ({ bp: BpNodeView, grp: GrpNodeView }), []);

  /* layer toggles: hide nodes, then prune edges that reference them */
  useEffect(() => {
    const hidden = (kind: string) => (!showActual && kind === 'actual') || (!showGuard && kind === 'infra');
    const live = new Set(NODES.filter((n) => n.type !== 'grp').filter((n) => !hidden((n.data as BpData).kind)).map((n) => n.id));

    setNodes((ns) =>
      ns.map((n) => {
        if (n.type === 'grp') {
          // a containment box with no contents hides too, so the frame never floats empty
          const emptied = (n.id === 'g-actual' && !showActual) || (n.id === 'g-infra' && !showGuard);
          return { ...n, hidden: emptied };
        }
        return { ...n, hidden: !live.has(n.id) };
      }),
    );

    setEdges((es) =>
      es
        .filter((e) => live.has(e.source) && live.has(e.target))
        .map((e) => ({ ...e, animated: flows })),
    );
  }, [flows, showActual, showGuard, setNodes, setEdges]);

  const active = nodes.find((n) => n.id === pinned);
  const d = active?.data as BpData | undefined;

  const [liveCell, setLiveCell] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setAuto(false); return; }
    const id = setInterval(() => setLiveCell((c) => (c + 1) % (PIPELINE.length * STAGES.length)), 900);
    return () => clearInterval(id);
  }, [auto]);

  const onNodeClick = useCallback((_: unknown, n: Node) => setPinned(n.id), []);

  return (
    <div className="space-y-5">
      {/* toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono2 text-[9px] uppercase tracking-[0.24em] text-[var(--fainter)]">layers</span>
        {[
          { on: flows, set: setFlows, label: 'animate current' },
          { on: showActual, set: setShowActual, label: 'expect → actual' },
          { on: showGuard, set: setShowGuard, label: 'guardrails' },
        ].map((t) => (
          <button key={t.label} onClick={() => t.set(!t.on)} aria-pressed={t.on}
            className={`px-3 py-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.16em] border transition-colors ${
              t.on ? 'border-[var(--ion)] bg-[rgba(56,214,255,0.1)] text-[var(--ion)]' : 'border-[var(--line-faint)] text-[var(--fainter)] hover:text-[var(--dim)]'
            }`}>
            {t.label}
          </button>
        ))}
        <button onClick={() => fitView({ duration: 620, padding: 0.14 })}
          className="ml-auto flex items-center gap-1.5 border border-[var(--line)] px-3 py-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--dim)] transition-colors hover:border-[var(--amber)] hover:text-[var(--amber)]">
          <Maximize2 size={11} /> fit
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_330px]">
        {/* diagram */}
        <div className="bp-canvas relative overflow-hidden border border-[var(--line)] bg-[rgba(4,6,10,0.6)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px">
            <span className="bp-marquee block h-px w-1/3 bg-gradient-to-r from-transparent via-[var(--ion)] to-transparent" />
          </div>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onNodeMouseEnter={(_, n) => setPinned(n.id)}
            fitView
            fitViewOptions={{ padding: 0.1 }}
            minZoom={0.36}
            maxZoom={1.7}
            proOptions={{ hideAttribution: false }}
          >
            <Background variant={BackgroundVariant.Dots} gap={26} size={1} color="rgba(56,214,255,0.16)" />
            <MiniMap pannable zoomable maskColor="rgba(4,6,10,0.72)" nodeColor={(n) => TONE_COLOR[(n.data as BpData)?.tone ?? 'core']} />
          </ReactFlow>
          <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-3 font-mono2 text-[8.5px] uppercase tracking-[0.16em]">
            {(['core', 'shell', 'actual', 'infra'] as Tone[]).map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-[var(--faint)]">
                <span className="h-1.5 w-1.5" style={{ background: TONE_COLOR[t] }} /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* detail drawer */}
        <aside className="bp-card self-start overflow-hidden">
          <div className="hud-strip">
            <span className="flex items-center gap-2"><Led /> hover · click a node</span>
            <span className="text-[var(--fainter)]">inspector</span>
          </div>
          {d ? (
            <div className="space-y-4 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2" style={{ background: TONE_COLOR[d.tone] }} />
                  <h4 className="font-display text-[15px] uppercase leading-tight text-[var(--txt)]">{d.label}</h4>
                </div>
                <div className="mt-1 font-mono2 text-[9.5px] uppercase tracking-[0.18em] text-[var(--faint)]">{d.sub}</div>
              </div>
              <p className="text-[12.5px] leading-[1.7] text-[var(--dim)]">{d.detail}</p>
              <div>
                <SubHead note="exposed">Public surface</SubHead>
                <ul className="space-y-1.5">
                  {d.ports.map((p) => (
                    <li key={p} className="font-mono2 text-[10.5px] leading-snug text-[var(--txt-soft)] break-words">· {p}</li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-3 border-t border-[var(--line-faint)] pt-3 text-[11.5px]">
                <div>
                  <span className="font-mono2 text-[9px] uppercase tracking-[0.18em] text-[var(--faint)]">depends on</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">{d.deps.map((x) => <Chip key={x}>{x}</Chip>)}</div>
                </div>
                <div>
                  <span className="font-mono2 text-[9px] uppercase tracking-[0.18em] text-[var(--faint)]">verification</span>
                  <div className="mt-1 text-[var(--txt-soft)]">{d.tests}</div>
                </div>
                <div>
                  <span className="font-mono2 text-[9px] uppercase tracking-[0.18em] text-[var(--faint)]">artifact</span>
                  <div className="mt-1 text-[var(--txt-soft)]">{d.artifact}</div>
                </div>
              </div>
            </div>
          ) : (
            <p className="p-5 text-[12.5px] text-[var(--faint)]">Point at any module to read its contract, tests and artifact.</p>
          )}
        </aside>
      </div>

      {/* source set + expect/actual code */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Source-set topology" note="dependsOn direction" right={<span className="flex items-center gap-2"><Boxes size={12} /> 1 core · 4 shells</span>}>
          <div className="mb-4 flex flex-wrap items-center gap-2 font-mono2 text-[10px] uppercase tracking-[0.14em]">
            <span className="border border-[var(--ion)] px-2 py-1 text-[var(--ion)]">commonMain</span>
            <span className="text-[var(--fainter)]">↓ dependsOn</span>
            {['androidMain', 'iosMain', 'jvmMain(desktop)', 'wasmJsMain'].map((s) => (
              <span key={s} className="border border-[var(--ember)] px-2 py-1 text-[var(--ember)]">{s}</span>
            ))}
            <span className="text-[var(--fainter)]">·</span>
            <span className="border border-[var(--stable)] px-2 py-1 text-[var(--stable)]">commonTest → all four</span>
          </div>
          <CodePanel code={SRCSET_CODE} file=":core:domain/build.gradle.kts" maxH={280} />
        </Panel>

        <Panel title="expect / actual pattern" note="compile or fail" right={<span className="flex items-center gap-2"><ShieldCheck size={12} /> ledger test</span>}>
          <CodePanel code={EXPECT_CODE} file="SecureStore.kt · commonMain + androidMain" maxH={280} />
          <p className="mt-3 text-[12px] leading-[1.7] text-[var(--dim)]">
            The rule I hold to: an <span className="font-mono2 text-[var(--ion)]">expect</span> exists only for capabilities that genuinely differ — crypto,
            biometrics, engine, dispatchers. Anything else belongs in commonMain. Four actuals per release keeps the temptation honest.
          </p>
        </Panel>
      </div>

      {/* CI matrix */}
      <Panel
        title="CI/CD matrix"
        note="4 targets × 6 stages · per-PR"
        right={
          <button onClick={() => setAuto((a) => !a)} className="flex items-center gap-1.5 font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--dim)] hover:text-[var(--amber)]">
            {auto ? <Pause size={11} /> : <Play size={11} />} {auto ? 'trace running' : 'trace paused'}
          </button>
        }
      >
        <div className="overflow-x-auto">
          <div className="matrix min-w-[860px]" style={{ gridTemplateColumns: '150px repeat(6, 1fr)' }}>
            <div data-head="1">target / stage</div>
            {STAGES.map((s) => <div key={s} data-head="1">{s}</div>)}
            {PIPELINE.map((row, r) =>
              row.steps.map((step, c) => {
                const idx = r * STAGES.length + c;
                const isCell = idx === liveCell;
                return (
                  <div key={`${row.target}-${c}`} data-active={isCell ? '1' : '0'}
                    className={c === 0 ? 'font-orbit text-[11.5px] uppercase tracking-wide text-[var(--txt)]' : 'text-[11px] leading-[1.5] text-[var(--dim)]'}>
                    {c === 0 ? (
                      <span className="flex items-center gap-2">
                        <GitBranch size={11} className="text-[var(--ion)]" /> {row.target}
                        <span className="ml-auto font-mono2 text-[8px] tracking-normal normal-case text-[var(--fainter)]">{row.cache.split(' ')[0]}</span>
                      </span>
                    ) : (
                      <span className={isCell ? 'text-[var(--txt)]' : ''}>{step}</span>
                    )}
                  </div>
                );
              }),
            )}
          </div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          {PIPELINE.map((p) => (
            <div key={p.target} className="border border-[var(--line-faint)] bg-[var(--panel-soft)] p-3">
              <div className="font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--faint)]">runner</div>
              <div className="mt-1 text-[11.5px] text-[var(--txt-soft)]">{p.runner}</div>
              <div className="mt-2 font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--faint)]">cache</div>
              <div className="mt-1 text-[11.5px] text-[var(--dim)]">{p.cache}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 border-t border-[var(--line-faint)] pt-3 text-[12px] leading-[1.7] text-[var(--dim)]">
          Median PR cycle: <span className="font-mono2 text-[var(--ion)]">4 m 12 s</span> with configuration cache, Gradle remote cache and per-target
          fan-out. The dependency-guard and API-dump gates run first, so an architecture violation costs 8 seconds to discover, not a review round-trip.
        </p>
      </Panel>
    </div>
  );
}

export default function KmpFlow() {
  return (
    <ReactFlowProvider>
      <FlowInner />
    </ReactFlowProvider>
  );
}
