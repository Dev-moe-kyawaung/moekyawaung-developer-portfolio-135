import { useEffect, useMemo, useState } from 'react';
import { Cpu, MemoryStick, Download, ShieldQuestion, Timer, CloudOff, Gauge, Lock } from 'lucide-react';
import { Chip, CodePanel, Led, Meter, Panel, Spec, SubHead } from './shared';
import { ReactorChart } from '../ReactorChart';

/* ======================= A3 · ON-DEVICE GENAI ======================= */
const STATES = [
  { id: 'absent', name: 'ABSENT', ram: 0, disk: '—', detail: 'No weights on device. First launch offers a download only over unmetered network; the app stays fully usable in text-only mode meanwhile.', tone: 'var(--fainter)' },
  { id: 'fetch', name: 'DOWNLOADING', ram: 12, disk: '0 → 1.8 GB', detail: 'Play Asset Delivery / background transfer with resumable chunks. Progress is a stream, so the UI never polls. Checksum + model card signature verified before the file is renamed into place.', tone: 'var(--ion)' },
  { id: 'verify', name: 'VERIFYING', ram: 24, disk: '1.8 GB', detail: 'SHA-256 + signature check, tokenizer/grammar compatibility probe, and a one-token smoke generation. A corrupt shard is deleted, never silently retried.', tone: 'var(--amber)' },
  { id: 'mmap', name: 'MMAPPED', ram: 68, disk: '1.8 GB', detail: 'LiteRT-LM memory-maps weights read-only. Pages stay in the page cache, so a second launch pays almost no load cost and the process RSS starts small.', tone: 'var(--ion)' },
  { id: 'warm', name: 'WARMED', ram: 96, disk: '1.8 GB', detail: 'Prefill a 32-token priming prompt on a background thread while the previous screen is still on screen. This is what removes the cold first-token cliff.', tone: 'var(--stable)' },
  { id: 'resident', name: 'RESIDENT', ram: 128, disk: '1.8 GB', detail: 'Active inference window. KV cache pre-sized to 2k tokens to avoid realloc mid-decode; sampler runs on the big-core cluster with a thermal headroom check each 200 tokens.', tone: 'var(--stable)' },
  { id: 'throttle', name: 'THROTTLED', ram: 122, disk: '1.8 GB', detail: 'Thermal status 2+ → shorter max tokens, speculative decoding off, and generation resumes from the cached prefix when the device cools.', tone: 'var(--amber)' },
  { id: 'evict', name: 'EVICTING', ram: 34, disk: '1.8 GB', detail: 'On TRIM / low-memory warning: release KV cache, unmap everything but the first 64 MB shard so a re-warm costs ~180 ms instead of a full reload.', tone: 'var(--magenta)' },
];

const PIPELINE = [
  { k: 'prompt guard', v: 'length cap 3k, PII mask, no free-form file paths' },
  { k: 'tokenizer', v: 'sentencepiece, cached for repeated system prefix' },
  { k: 'prefill', v: 'chunked 512 tokens, mmap weights' },
  { k: 'decode', v: 'speculative draft 4 tokens, big-core pinned' },
  { k: 'sampler', v: 'top-k 40 · temp 0.4 · seed logged' },
  { k: 'grammar out', v: 'JSON schema-constrained for tool calls' },
  { k: 'render', v: 'streamed into StateFlow, cancel-safe on scroll' },
];

const PRIVACY = [
  ['Prompt text', 'On-device only', 'No', 'Session', 'Never'],
  ['Document text (summarise)', 'On-device only', 'No', 'Cleared on screen exit', 'Never'],
  ['Image pixels (captioning)', 'On-device only', 'No', 'Inferred then dropped', 'Never'],
  ['Model version + build hash', 'Telemetry', 'Yes, aggregated', '90 days', 'Anonymised'],
  ['Latency / tokens-per-second', 'Telemetry', 'Yes, aggregated', '90 days', 'Anonymised'],
  ['Crash stack', 'Telemetry', 'Yes, on opt-in', '30 days', 'PII scrubbed'],
  ['Fallback cloud request', 'Provider relay', 'Yes, explicit consent', 'Provider policy, shown in-app', 'Opt-in per session'],
] as const;

const MODEL_MANAGER = `// file: core/ai/src/commonMain/kotlin/dev/mka/reactor/ai/ModelManager.kt
sealed interface ModelState {
    data object Absent : ModelState
    data class Fetching(val pct: Int, val metered: Boolean) : ModelState
    data class Failed(val cause: ModelFailure) : ModelState
    data object Ready : ModelState
    data class Degraded(val reason: DegradeReason) : ModelState   // thermal, RAM, truncation
}

class ModelManager @Inject constructor(
    private val store: ModelStore,          // checksum + signature verified
    private val lm: LiteRtLmEngine,        // mmap'd weights, expect/actual binding
    private val memory: MemoryPressureBus, // onTrim / NSMemoryWarning
    private val thermal: ThermalReader,
    private val clock: Clock,
) {
    private val _state = MutableStateFlow<ModelState>(ModelState.Absent)
    val state: StateFlow<ModelState> = _state.asStateFlow()

    /** Called from a background coroutine at app start; never blocks first frame. */
    suspend fun prepare() = withContext(Dispatchers.Default) {
        when (val m = store.locate()) {
            null -> if (!net.isMetered) download() else _state.value = ModelState.Absent
            else -> {
                _state.value = lm.map(m)                        // read-only mmap, ~68 MB RSS
                lm.warm(priming = PRIMING_32_TOK)                // kills the cold first-token cliff
                _state.value = ModelState.Ready
            }
        }
    }

    fun summarise(prompt: Prompt): Flow<GenToken> = channelFlow {
        if (_state.value !is ModelState.Ready) { sendFallback(prompt); return@channelFlow }
        val budget = Budgets.of(thermal.now(), memory.now())    // tokens, sample depth, cores
        lm.generate(prompt.tokens, budget)
          .catch { cause -> if (cause is OomRisk) sendAll(cloud.fallback(prompt)) else throw cause }
          .collect { send(it) }
    }

    init {
        // eviction is a policy, not a hope: keep one shard mapped so re-warm is ~180 ms
        memory.pressure.collect { p -> if (p >= TRIM_COMPLETE) lm.release(keepFirstMib = 64) }
    }
}`;

const CAPTION = `// ML Kit GenAI captioning + privacy-preserving gate
class ImageCaptioner(private val captioner: GenAiCaptioner?, private val store: SecureStore) {

    suspend fun caption(img: InputImage): Result<Caption> = runCatching {
        require(img.isLocalOnly()) { "no egress without consent" }
        val out = captioner?.generate(img, GenAiCaptionerOptions.builder()
            .setLanguageTag(langTag())              // Burmese / English / Thai
            .setMaxResults(1)
            .build())
            ?.await()
            ?: throw NoModelOnDevice
        Caption(out.primary, confidence = out.scores.first())
    }
}

// Budgets are asserted in CI on a reference mid-ranger, not aspirationally.
object Budgets {
    val firstToken = 200.milliseconds
    val totalRam = 150L * 1024 * 1024      // process RSS ceiling incl. weights
    val perImage = 180.milliseconds
    fun of(t: Thermal, m: Pressure) = DecodeBudget(
        maxTokens = if (t >= MODERATE) 128 else 512,
        speculative = t < MODERATE && m < WARN,
    )
}`;

export default function OnDeviceGenAi() {
  const [i, setI] = useState(5);
  const [auto, setAuto] = useState(true);
  const [fallback, setFallback] = useState<'no' | 'thermal' | 'oom'>('no');

  useEffect(() => {
    if (!auto || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % STATES.length), 2100);
    return () => clearInterval(id);
  }, [auto]);

  const st = STATES[i];

  /* latency trace: measured decode vs 200 ms budget line */
  const chart = useMemo(() => {
    const labels = Array.from({ length: 12 }, (_, k) => `${k * 5}s`);
    const measured = labels.map((_, k) => Math.round(142 + Math.sin(k * 0.85 + (fallback === 'no' ? 0 : 1.4)) * 22 + (fallback === 'thermal' ? 34 : 0) + (fallback === 'oom' ? 62 : 0)));
    return {
      labels,
      series: [
        { label: 'p50 per-token latency', data: measured, color: '#38d6ff', fill: true },
        { label: 'budget ceiling', data: labels.map(() => 200), color: '#ff6a2b', dashed: true },
      ],
    };
  }, [fallback]);

  const ramNow = st.ram + (fallback === 'oom' ? 41 : 0);

  return (
    <div className="space-y-5">
      {/* budget strip */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {([
          { i: <Timer size={13} />, label: 'first token', v: fallback === 'no' ? 96 : fallback === 'thermal' ? 148 : 214, max: 200, unit: 'ms' },
          { i: <Cpu size={13} />, label: 'decode rate', v: fallback === 'no' ? 38 : 26, max: 60, unit: 'tok/s', floor: 20 },
          { i: <MemoryStick size={13} />, label: 'process RSS', v: ramNow, max: 150, unit: 'MB' },
          { i: <Gauge size={13} />, label: 'energy / summary', v: fallback === 'thermal' ? 3.4 : 1.6, max: 2.4, unit: 'J' },
        ] as { i: React.ReactNode; label: string; v: number; max: number; unit: string; floor?: number }[]).map((m) => (
          <div key={m.label} className="bp-card group p-4">
            <span className="mb-3 flex items-center gap-2 font-mono2 text-[9px] uppercase tracking-[0.18em] text-[var(--faint)]">
              <span className="text-[var(--ion)] transition-transform duration-300 group-hover:scale-110">{m.i}</span>{m.label}
            </span>
            <Meter label="measured" value={m.v} max={m.max} unit={m.unit} />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {(m.floor ? m.v >= m.floor : m.v <= m.max)
                ? <Chip tone="var(--stable)">budget met</Chip>
                : <Chip tone="var(--danger)">over budget</Chip>}
              <span className="font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--fainter)]">
                {m.floor ? `floor ${m.floor}${m.unit}` : `limit ${m.max}${m.unit}`}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        {/* lifecycle */}
        <Panel
          title="ModelManager lifecycle"
          note={`${i + 1}/${STATES.length} · auto-stepping`}
          right={
            <button onClick={() => setAuto((a) => !a)} className="font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--dim)] hover:text-[var(--amber)]">
              {auto ? 'pause' : 'play'}
            </button>
          }
        >
          <ol className="space-y-1">
            {STATES.map((s, k) => {
              const live = k === i;
              const passed = k < i;
              return (
                <li key={s.id} onClick={() => { setI(k); setAuto(false); }}
                  className="seq-row cursor-pointer grid-cols-[auto_1fr_auto]" data-live={live ? '1' : '0'}>
                  <span className="flex h-5 w-5 items-center justify-center border font-mono2 text-[9px]"
                    style={{ borderColor: live ? s.tone : passed ? 'var(--line)' : 'var(--line-faint)', color: live ? s.tone : 'var(--fainter)' }}>
                    {k + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="font-orbit text-[12px] uppercase tracking-[0.08em]" style={{ color: live ? s.tone : 'var(--txt-soft)' }}>{s.name}</span>
                      {live && <Led tone="warn" />}
                    </span>
                    <span className={`block text-[11.5px] leading-[1.6] transition-all duration-300 ${live ? 'mt-1 max-h-40 opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}>
                      <span className="text-[var(--dim)]">{s.detail}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-right font-mono2 text-[9.5px] uppercase tracking-[0.12em]" style={{ color: live ? s.tone : 'var(--fainter)' }}>
                    {s.ram} MB RSS<span className="block text-[var(--fainter)]">{s.disk}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </Panel>

        {/* pipeline + trace */}
        <div className="space-y-4">
          <Panel title="Inference pipeline" note="summarisation path" right={<span className="flex items-center gap-1.5"><CloudOff size={11} /> zero egress</span>}>
            <div className="space-y-2">
              {PIPELINE.map((p, k) => (
                <div key={p.k} className="flex items-center gap-3">
                  <span className="font-mono2 text-[9px] text-[var(--fainter)]">{String(k).padStart(2, '0')}</span>
                  <span className="w-[104px] shrink-0 border-l-2 pl-2 font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--ion)]">{p.k}</span>
                  <span className="min-w-0 flex-1 text-[12px] leading-[1.5] text-[var(--dim)]">{p.v}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {['LiteRT-LM 1.4', 'Gemma-3n-E2B int4', 'grammar-constrained JSON', 'speculative x4', 'ML Kit GenAI captioner'].map((t) => <Chip key={t}>{t}</Chip>)}
            </div>
          </Panel>

          <Panel title="Fallback policy" note="simulate pressure" right={<Lock size={11} />}>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {([['no', 'nominal'], ['thermal', 'thermal throttle'], ['oom', 'memory pressure']] as const).map(([v, l]) => (
                <button key={v} onClick={() => setFallback(v)} aria-pressed={fallback === v}
                  className={`border px-3 py-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.14em] transition-colors ${
                    fallback === v ? 'border-[var(--amber)] bg-[rgba(255,193,77,0.1)] text-[var(--amber)]' : 'border-[var(--line-faint)] text-[var(--faint)] hover:text-[var(--txt)]'
                  }`}>
                  {l}
                </button>
              ))}
            </div>
            <ReactorChart labels={chart.labels} series={chart.series} unit="ms" height={170} />
            <p className="mt-3 text-[12px] leading-[1.7] text-[var(--dim)]">
              {fallback === 'no'
                ? 'On the reference mid-ranger p50 sits inside the 200 ms ceiling with headroom, so decode continues to the requested length.'
                : fallback === 'thermal'
                  ? 'Thermal MODERATE: speculative drafting off, max tokens 128, latency climbs but stays under ceiling. The generation resumes from cached prefix on cool-down.'
                  : 'Memory pressure: process RSS approaches the ceiling, weights unmap down to one shard, and the request escalates to the relay — only after an explicit consent sheet.'}
            </p>
          </Panel>
        </div>
      </div>

      {/* privacy + specs */}
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Privacy manifest" note="shipped in-app, not buried">
          <div className="matrix" style={{ gridTemplateColumns: '1.25fr 0.9fr 0.85fr 0.95fr 0.8fr' }}>
            {['data', 'processing', 'egress', 'retention', 'export'].map((h) => <div key={h} data-head="1">{h}</div>)}
            {PRIVACY.flatMap((row) => row.map((cell, k) => (
              <div key={`${row[0]}-${k}`} className="text-[11px] leading-[1.5]"
                style={{ color: k === 2 ? (String(cell).startsWith('Yes') ? 'var(--amber)' : 'var(--stable)') : k === 0 ? 'var(--txt-soft)' : 'var(--dim)' }}>
                {String(cell).startsWith('On-device only') ? <span className="text-[var(--stable)]">{cell}</span> : cell}
              </div>
            )))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="border border-[var(--line-faint)] p-3">
              <SubHead note="consent">Cloud fallback</SubHead>
              <p className="text-[12px] leading-[1.65] text-[var(--dim)]">
                Every escalation shows the exact prompt text that will leave the device, the provider, and the retention line — one tap to allow once, one to allow for the session. No silent upgrade, ever.
              </p>
            </div>
            <div className="border border-[var(--line-faint)] p-3">
              <SubHead note="storage">SecureStore</SubHead>
              <p className="text-[12px] leading-[1.65] text-[var(--dim)]">
                Consent state, seeds and cached prefixes sit behind a hardware key (Keystore 4 / Secure Enclave / WebCrypto non-extractable), and are wiped with the app data on sign-out.
              </p>
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Runtime envelope" note="reference: Pixel 6a class">
            <Spec rows={[
              ['weights on disk', '1.8 GB (int4, on-demand feature)'],
              ['mapped, resident', '68 → 128 MB RSS'],
              ['prefill', 'chunked 512 tok · 34 ms/chunk'],
              ['decode', '38 tok/s steady, 4-way speculative'],
              ['summary p50 / p95', '142 ms / 188 ms'],
              ['caption p50', '176 ms'],
              ['battery per 1k tokens', '0.9 % of a 4 000 mAh cell'],
              ['fallback rate in field', '0.7 % of generations'],
            ]} />
          </Panel>
          <Panel title="Guardrails" note="enforced, not documented" right={<ShieldQuestion size={12} />}>
            <ul className="space-y-2 text-[12px] leading-[1.6] text-[var(--dim)]">
              {[
                'Schema-constrained output for tool calls — malformed JSON cannot reach the reducer.',
                'Generation is cancel-safe: scrolling away aborts decode within one token batch.',
                'Numeric claims from the model render as untrusted spans until a source is attached.',
                'A nightly eval suite scores 240 prompts; a regression over 3 % blocks the release train.',
              ].map((g) => (
                <li key={g} className="flex gap-2.5"><span className="mt-1.5 h-1 w-1 shrink-0 bg-[var(--ion)]" />{g}</li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      {/* code */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="ModelManager" note="lifecycle · mmap · eviction policy" right={<Download size={11} />}>
          <CodePanel code={MODEL_MANAGER} file="core/ai/…/ModelManager.kt" maxH={470} />
        </Panel>
        <Panel title="Captioning + budgets" note="ML Kit GenAI · on-device gate">
          <CodePanel code={CAPTION} file="core/ai/…/ImageCaptioner.kt" maxH={470} />
        </Panel>
      </div>
    </div>
  );
}


