import { useEffect, useRef, useState } from 'react';
import { X, Send, Zap, CircuitBoard, Radio, Terminal, Copy, Check } from 'lucide-react';
import { PROFILE, PROJECTS } from '../data';
import { CircuitSchematic } from './Projects';
import { useCopy } from '../hooks';

interface Msg { id: string; role: 'ai' | 'cmd'; text: string; code?: string; }

/* per-layer trace: what the current looks like inside each subsystem */
const LAYERS: Record<string, { title: string; load: string; brief: string; code: string }> = {
  ui: {
    title: 'UI SHELL — Compose / Flutter',
    load: 'draw 1.8 MW · 60 fps held',
    brief: 'This layer is a pure function of state. No imperative view mutation, so nothing drifts when the bus updates. Stable models and keyed lists keep the recomposition scope microscopic — only the changed cell redraws, which is why 3000-row logs stay smooth on 2 GB hardware.',
    code: `@Composable
fun FluxReadout(cell: ReactorCell, vm: CellViewModel = viewModel()) {
    val state by vm.uiState.collectAsSafeState()   // safe across config change
    LazyColumn(state.stateRestorationKey = cell.id) {
        items(state.samples, key = { it.stamp }) { s ->
            FluxRow(s, modifier = Modifier.drawWithCache { drawTrace(s) })
        }
    }
}`,
  },
  vm: {
    title: 'STATE BUS — ViewModel / Flow',
    load: 'throughput 6.4 MW · 0 dropped intents',
    brief: 'The bus owns intent intake and emits immutable snapshots through StateFlow. Conflation prevents queue pile-ups under burst load, and the reducer is pure, so every state is replayable in tests. Survives process death because critical transactional cells are journalled.',
    code: `class CellViewModel @Inject constructor(private val bus: FluxBus) : ViewModel() {

    private val _state = MutableStateFlow<CellUiState>(CellUiState.Idle)
    val state: StateFlow<CellUiState> = _state.asStateFlow()

    fun onIntent(i: CellIntent) = viewModelScope.launch(Dispatchers.Default) {
        val next = bus.reduce(_state.value, i)          // pure, replayable
        _state.value = next
        if (next.requiresSync) bus.journal(i)           // survives process death
    }
}`,
  },
  'use': {
    title: 'CORE LOGIC — pure domain',
    load: 'thermal 0 MW · no framework heat',
    brief: 'The domain core holds business rules with zero Android imports and no framework coupling. That is what makes it cheap to test — 1 200 unit tests run in under 400 ms on a laptop, no emulator. When Firebase or Compose major-version, nothing here burns.',
    code: `class StabilizePlasmaLoop @Inject constructor(private val repo: ReactorRepository) {

    operator fun invoke(cellId: String, budget: Duration): Flow<Containment> =
        repo.stream(cellId)
            .map { sample -> sample.toContainment(budget) }     // pure mapping
            .retryWhen { err, attempt -> err is BusTransient && attempt < 3 }
}`,
  },
  db: {
    title: 'LOCAL CELL — Room / SQLite',
    load: 'write amp 2.1 MW · offline capable',
    brief: 'Local storage is the source of truth, not a cache bolted on. Reads always resolve from the device instantly; the network is a sync mechanism. Mutations are queued as idempotent operations with client UUIDs, so a retry can never double-apply — that is the whole reason field crews stopped losing work.',
    code: `@Dao
interface CellDao {
    @Query("SELECT * FROM samples WHERE cellId = :id ORDER BY stamp DESC LIMIT 200")
    fun flow(id: String): Flow<List<SampleEntity>>

    @Upsert
    suspend fun put(entities: List<SampleEntity>)   // idempotent replay
}`,
  },
  net: {
    title: 'RELAY — Retrofit / Firebase',
    load: 'uplink 0.9 MW · backoff active',
    brief: 'The relay deserializes at the edge and never leaks DTOs inward. Requests are de-duplicated, so four screens asking for the same feed cost one round trip — that single change bought more perceived speed than a month of visual tuning. Offline mutations replay on reconnect under WorkManager constraints.',
    code: `class RelayClient(
    private val api: ReactorApi,
    private val inflight: ConcurrentHashMap<String, Job>(),
) {
    fun requestCell(key: String) = inflight.getOrPut(key) {
        CoroutineScope(SupervisorJob()).launch { api.cell(key) }
    }   // burst-safe de-duplication
}`,
  },
};

const QUICK = [
  'Why Clean Architecture here?',
  'Explain the offline-first protocol',
  'How did you hit 1.4s cold start?',
  'Flutter or native Android?',
  'Sample a shipped module',
  'How do I hire you?',
];

export function ReactorAssistant() {
  const [open, setOpen] = useState(false);
  const [heat, setHeat] = useState('vm');
  const [tab, setTab] = useState<'circuit' | 'log'>('circuit');
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{
    id: 'boot', role: 'ai',
    text: `Good evening. I am the concierge for Moe Kyaw Aung (${PROFILE.mmName}) — 12 years of production work, 3,000+ deployments, 600+ repositories at 99.9% crash-free.\n\nI can walk you through his engineering the way a sommelier walks a cellar — tap any node above to trace the data flow, or ask about a decision.`,
  }]);
  const endRef = useRef<HTMLDivElement>(null);
  const { copied, copy } = useCopy();

  useEffect(() => { if (endRef.current) endRef.current.scrollTop = endRef.current.scrollHeight; }, [msgs, tab]);

  /* idle: the console keeps sweeping the bus so it never looks frozen */
  useEffect(() => {
    if (!open) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      setHeat((h) => {
        const order = ['ui', 'vm', 'use', 'db', 'net'];
        return order[(order.indexOf(h) + 1) % order.length];
      });
    }, 3400);
    return () => clearInterval(id);
  }, [open]);

  const layer = LAYERS[heat];

  const answer = (q: string): Msg => {
    const l = q.toLowerCase();
    const kb = (text: string, code?: string): Msg => ({ id: String(Date.now()), role: 'ai', text, code });
    if (l.includes('clean') || l.includes('architect')) return kb(LAYERS['use'].brief, LAYERS['use'].code);
    if (l.includes('offline') || l.includes('sync') || l.includes('room') || l.includes('db')) return kb(LAYERS.db.brief, LAYERS.db.code);
    if (l.includes('cold start') || l.includes('performance') || l.includes('speed') || l.includes('fps') || l.includes('1.4')) {
      return kb(`Measured on a 2019-class mid-ranger, release build, three consecutive boots averaged.\n\n· Baseline Profiles removed JIT compilation heat → 3.10 s to 1.40 s.\n· Deferred initialisation: relay + analytics spin up after first frame.\n· Composition scoping on the UI shell took scroll drops from 41 to 3.\n· LeakCanary is wired into every debug build; production leaks: zero.\n\nStartup is a feature. It sits on the roadmap next to product work, not in a backlog.`);
    }
    if (l.includes('flutter') || l.includes('dart') || l.includes('native') || l.includes('kmm')) return kb(`${LAYERS.ui.brief}\n\nOn the Flutter question: 85–92% code sharing is the honest number. Anything touching payments, biometrics, camera or OS policy stays a native escort behind one typed platform channel per feature. Flutter for product flows and forms; native where the platform owns the contract.`);
    if (l.includes('state') || l.includes('mvi') || l.includes('viewmodel')) return kb(LAYERS.vm.brief, LAYERS.vm.code);
    if (l.includes('network') || l.includes('firebase') || l.includes('api') || l.includes('relay')) return kb(LAYERS.net.brief, LAYERS.net.code);
    if (l.includes('module') || l.includes('project') || l.includes('sample') || l.includes('ship')) {
      const p = PROJECTS[Math.floor(Math.random() * PROJECTS.length)];
      return kb(`Module sampled — ${p.title.toUpperCase()} (${p.cat})\n\n${p.desc}\nBound systems: ${p.tags.join(' · ')}.\n\nCurrent path: ${p.repo}\nOpen it from the Reactor Modules deck for the full schematic and before/after telemetry.`);
    }
    if (l.includes('hire') || l.includes('contact') || l.includes('availab') || l.includes('reach') || l.includes('rate')) {
      return kb(`Comms open.\n\nDirect line ${PROFILE.phones[0]} · ${PROFILE.phones[1]}\nMail ${PROFILE.primaryEmail}\nPlant location ${PROFILE.location} · GMT+6:30, overlaps Bangkok, Singapore and EU mornings.\n\nEngagements: quick audit, architecture review, monthly advisory, implementation rescue. Response inside 24 h on business days — faster on Telegram for production fires.`);
    }
    return kb(`Node "${heat}" is highlighted on the bus. I explain this codebase as energy flow — where current enters (UI shell), how it is regulated (state bus), where the rules live (pure domain core), what stores it (local cell) and how it exchanges (relay). Ask about a decision, a layer, or a shipped module and I will trace it.`);
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { id: String(Date.now()), role: 'cmd', text }]);
    setInput('');
    setBusy(true);
    setTimeout(() => {
      setMsgs((m) => [...m, answer(text)]);
      setBusy(false);
    }, 460);
  };

  return (
    <>
      {/* summon */}
      <button onClick={() => setOpen((v) => !v)} aria-label="Open the concierge"
        className="group fixed bottom-6 right-20 z-40 flex items-center gap-2.5 border border-[var(--ion)] bg-[rgba(10,13,19,0.9)] py-2 pl-2 pr-3 backdrop-blur-md transition-all hover:border-[var(--amber)] hover:shadow-[var(--glow-amber)]"
        style={{ clipPath: 'var(--cut-sm)' }}>
        <span className="relative flex h-8 w-8 items-center justify-center border border-[var(--ion)] bg-[var(--bg)]">
          <Zap size={15} className="text-[var(--ion)]" />
          <span className="absolute inset-0 border border-dashed border-[var(--ion)]/50 reactor-spin-cw" />
        </span>
        <span className="flex flex-col items-start leading-none">
          <span className="font-head text-[11px] uppercase tracking-[0.16em] text-[var(--txt)]">Concierge</span>
          <span className="mt-1 font-mono2 text-[8px] uppercase tracking-[0.2em] text-[var(--stable)]">ask about the craft</span>
        </span>
        <span className="micro-cluster mb-0.5"><span /><span /><span /></span>
      </button>

      {/* console */}
      {open && (
        <div className="fixed bottom-[92px] right-3 z-50 flex h-[min(600px,84vh)] w-[min(560px,94vw)] flex-col overflow-hidden border border-[var(--line-strong)] bg-[var(--panel-solid)] shadow-[0_0_60px_rgba(56,214,255,0.2),0_30px_80px_rgba(0,0,0,0.8)] sm:right-6"
          role="dialog" aria-label="Concierge panel">
          {/* header */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--bg-2)] px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-7 w-7 items-center justify-center border border-[var(--amber)]">
                <CircuitBoard size={13} className="text-[var(--amber)]" />
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[var(--stable)]" />
              </span>
              <div className="leading-tight">
                <h3 className="font-display text-[11px] uppercase tracking-[0.18em] text-[var(--txt)]">NEURAL AI · CONCIERGE</h3>
                <span className="font-mono2 text-[8.5px] uppercase tracking-[0.2em] text-[var(--faint)]">network idle · 5 subsystems traced</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close console"
              className="flex h-7 w-7 items-center justify-center border border-[var(--line)] text-[var(--faint)] transition-colors hover:border-[var(--danger)] hover:text-[var(--danger)]">
              <X size={14} />
            </button>
          </div>

          {/* tabs */}
          <div className="flex shrink-0 border-b border-[var(--line-faint)] bg-[var(--bg)]">
            {(['circuit', 'log'] as const).map((k) => (
              <button key={k} onClick={() => setTab(k)} aria-pressed={tab === k}
                className={`flex items-center gap-1.5 px-4 py-2 font-mono2 text-[9.5px] uppercase tracking-[0.2em] transition-colors ${
                  tab === k ? 'border-b-2 border-[var(--ion)] text-[var(--ion)]' : 'text-[var(--faint)] hover:text-[var(--dim)]'
                }`}>
                {k === 'circuit' ? <CircuitBoard size={11} /> : <Terminal size={11} />}
                {k === 'circuit' ? 'circuit view' : 'command log'}
              </button>
            ))}
            <span className="ml-auto flex items-center gap-1.5 px-3 font-mono2 text-[9px] uppercase tracking-[0.18em] text-[var(--faint)]">
              <Radio size={10} className="text-[var(--stable)] animate-pulse" /> live
            </span>
          </div>

          {tab === 'circuit' ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="heat-shimmer relative shrink-0 border-b border-[var(--line-faint)] bg-[rgba(4,6,10,0.8)] p-3">
                <CircuitSchematic heat={heat} onPick={setHeat} />
                <span className="absolute left-4 top-3 font-mono2 text-[8px] uppercase tracking-[0.24em] text-[var(--faint)]">tap a node to trace the flow</span>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-display text-[13px] uppercase tracking-tight text-[var(--amber)]">{layer.title}</h4>
                  <span className="font-mono2 text-[9px] uppercase tracking-[0.14em] text-[var(--stable)]">{layer.load}</span>
                </div>
                <p className="mt-3 text-[13px] leading-[1.75] text-[var(--dim)]">{layer.brief}</p>

                <div className="group relative mt-4 border border-[var(--line)] bg-[rgba(4,6,10,0.9)]">
                  <div className="flex items-center justify-between border-b border-[var(--line-faint)] px-3 py-1.5">
                    <span className="font-mono2 text-[8.5px] uppercase tracking-[0.2em] text-[var(--faint)]">energy trace · kotlin</span>
                    <button onClick={() => copy(layer.code)} aria-label="Copy trace"
                      className="flex items-center gap-1 font-mono2 text-[8.5px] uppercase tracking-[0.16em] text-[var(--dim)] hover:text-[var(--ion)]">
                      {copied ? <><Check size={11} className="text-[var(--stable)]" /> copied</> : <><Copy size={11} /> copy</>}
                    </button>
                  </div>
                  <pre className="overflow-x-auto p-3 font-mono2 text-[10.5px] leading-[1.65] text-[var(--txt-soft)]">{layer.code}</pre>
                </div>

                <button onClick={() => setTab('log')}
                  className="mt-4 font-mono2 text-[10px] uppercase tracking-[0.18em] text-[var(--ion)] hover:text-[var(--amber)]">
                  → ask the console instead
                </button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
                {msgs.map((m) => (
                  <div key={m.id} className={`flex ${m.role === 'cmd' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[88%] border px-3.5 py-2.5 text-[12.5px] leading-[1.65] ${
                      m.role === 'cmd'
                        ? 'border-transparent bg-gradient-to-r from-[var(--ion)] to-[var(--amber)] text-[#04141c] font-medium'
                        : 'border-[var(--line)] bg-[rgba(4,6,10,0.6)] text-[var(--txt-soft)]'
                    }`} style={m.role === 'cmd' ? { clipPath: 'var(--cut-sm)' } : undefined}>
                      <p className="whitespace-pre-line">{m.text}</p>
                      {m.code && (
                        <pre className="mt-3 overflow-x-auto border-t border-[var(--line-faint)] pt-2 font-mono2 text-[10px] leading-[1.6] text-[var(--ion)]">{m.code}</pre>
                      )}
                    </div>
                  </div>
                ))}
                {busy && (
                  <div className="flex items-center gap-2 pl-1 font-mono2 text-[9.5px] uppercase tracking-[0.18em] text-[var(--amber)]">
                    <Zap size={11} className="animate-pulse" /> composing an answer…
                  </div>
                )}
              </div>

              <div className="shrink-0 border-t border-[var(--line-faint)] bg-[var(--bg)] px-3 py-2">
                <div className="flex gap-1.5 overflow-x-auto">
                  {QUICK.map((q) => (
                    <button key={q} onClick={() => send(q)}
                      className="shrink-0 border border-[var(--line)] px-2.5 py-1 font-mono2 text-[9px] uppercase tracking-[0.12em] text-[var(--dim)] transition-colors hover:border-[var(--ion)] hover:text-[var(--ion)]">
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 border-t border-[var(--line)] bg-[var(--bg-2)] p-3">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send(input)}
                  placeholder="Ask about the architecture…" aria-label="Ask the concierge"
                  className="h-9 flex-1 border border-[var(--line)] bg-[var(--bg)] px-3 font-mono2 text-[12px] text-[var(--txt)] placeholder:text-[var(--faint)] focus:border-[var(--ion)] focus:outline-none" />
                <button onClick={() => send(input)} disabled={!input.trim()} aria-label="Transmit query"
                  className="flex h-9 w-9 items-center justify-center bg-[var(--ion)] text-[#04141c] transition-opacity hover:bg-[var(--amber)] disabled:opacity-35">
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}


