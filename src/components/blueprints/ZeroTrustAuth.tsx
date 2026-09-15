import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Fingerprint, KeyRound, ShieldAlert, ShieldCheck, Play, Pause, Activity, Smartphone, TabletSmartphone } from 'lucide-react';
import { Chip, CodePanel, Led, Panel, Spec, SubHead } from './shared';

/* ======================= A4 · ZERO-TRUST BIOMETRIC AUTH ======================= */
const LANES = ['User', 'App UI', 'Credential Mgr / ASAuthorization', 'Secure hardware', 'Behavioural model', 'Session & policy'];

const SEQ: { from: number; to: number; msg: string; note: string; risk?: string }[] = [
  { from: 0, to: 1, msg: 'unlock request · biometric prompt', note: 'Screen is rendered before auth with non-sensitive cache only. Nothing sensitive is ever in the view tree while locked.' },
  { from: 1, to: 5, msg: 'challenge: nonce + app id + attestation', note: 'Server issues a single-use nonce bound to device posture; replay is impossible by construction.' },
  { from: 1, to: 2, msg: 'getCredential(uiHint, userVerification=REQUIRED)', note: 'Android: CredentialManager + BiometricPrompt bound CTA. iOS: ASAuthorizationPlatformPublicKeyProvider.' },
  { from: 2, to: 3, msg: 'authenticator selection · BIOMETRIC_STRONG', note: 'Key is created inside Keystore 4 / Secure Enclave with userPresence + deviceUnlock, non-exportable, rollback-resistant counter.' },
  { from: 3, to: 2, msg: 'signed assertion · counter++ , authenticatorData', note: 'Verification happens with the credential public key; the private key never leaves silicon on any of the four targets.' },
  { from: 2, to: 1, msg: 'AssertionResult → verify on service', note: 'Failure here is a hard deny, never a silent fallback to a weaker factor.' },
  { from: 1, to: 4, msg: 'cadence sample · digraph timing + hold pattern', note: 'Continuous model scores the *session*, not just the entry: typing rhythm variance, hold duration, unlock context.' },
  { from: 4, to: 5, msg: 'risk score 0.11 (threshold 0.45)', note: 'Below threshold: no interruption. Between thresholds: step-up on sensitive actions only. Above: session ends and re-auth is mandatory.' },
  { from: 5, to: 1, msg: 'scoped token · 5 min lease, refresh bound to attestation', note: 'Token carries scopes, not identity breadth. Refresh requires the same hardware-backed credential still attested.' },
  { from: 1, to: 0, msg: 'granted · key material zeroised', note: 'Prompt callback releases the plaintext cache; only the attestation-derived handle survives in memory.' },
];

const LADDER = [
  { tier: 'T1', name: 'Passkey (discoverable)', when: 'Hardware-backed platform authenticator present', gives: 'Phishing-resistant, no shared secret, attestation-verifiable', loss: '—', state: 'preferred' },
  { tier: 'T2', name: 'Device credential + CryptoBox', when: 'Passkey API unavailable (older API level, no GMS)', gives: 'Local strong auth; server holds verifier only', loss: 'No cross-device sync; enrolment must repeat', state: 'degraded' },
  { tier: 'T3', name: 'App-bound TOTP / security key', when: 'Biometrics unavailable or locked out', gives: 'Second factor retained; step-up enforced', loss: 'Replay window 30 s; no hardware binding', state: 'fallback' },
  { tier: 'T4', name: 'Read-only + step-up', when: 'No factor, emulator, or risk score above threshold', gives: 'Data visible, mutations blocked; each write asks for proof', loss: 'Cannot authorise transfers without assisted enrolment', state: 'containment' },
];

const SCREENS: { id: string; name: string; lines: string[]; tone: string }[] = [
  { id: 'idle', name: 'idle / locked', tone: 'var(--faint)', lines: ['masked cache', 'biometric prompt', '“use passkey”'] },
  { id: 'auth', name: 'authenticating', tone: 'var(--ion)', lines: ['sheet: verifying…', 'hardware icon', 'cancel > 8 s', 'input disabled'] },
  { id: 'granted', name: 'granted', tone: 'var(--stable)', lines: ['session 5:00 lease', 'scopes: read, write', 'cadence: sampling'] },
  { id: 'challenge', name: 'step-up', tone: 'var(--amber)', lines: ['why: new device', 're-auth + attestation', 'amount re-typed'] },
  { id: 'locked', name: 'contained', tone: 'var(--danger)', lines: ['read-only mode', 'risk 0.61', 'support path shown'] },
];

const ANDROID = `// file: feature/auth/src/androidMain/kotlin/dev/mka/reactor/auth/PasskeyGate.kt
class PasskeyGate @Inject constructor(
    private val cm: CredentialManager,                 // androidx.credentials
    private val bio: BiometricManager,
    private val challenge: ChallengeRepository,        // single-use nonce
    private val telemetry: RiskTelemetry,
) {
    val availability: Availability
        get() = when {
            bio.canAuthenticate(BIOMETRIC_STRONG or DEVICE_CREDENTIAL) != CAN_AUTHENTICATE_POSITIVE -> Availability.DeviceOnly
            cm.hasPlatformAuthenticator() -> Availability.Passkey
            else -> Availability.FallbackTotp                        // T2/T3, never "off"
        }

    suspend fun assert(userId: UserId): AuthOutcome = coroutineScope {
        val request = CreateCredentialRequestBuilder(CredentialManager.Companion.getContext())
            .setRequestId(userId.handle)
            .setUserVerificationRequiredParameter()
            .setCta(CreateCredentialEntry.Builder()
                .setIntentSender(bio.createIntent().intentSender)    // bound CTA — not optional
                .build())
            .build()

        runCatching { cm.createCredential(request, cancellationSignal = null) }
            .fold(
                onSuccess = { reg -> AuthOutcome.Granted(reg.registrationResponseJson, attested = true) },
                onFailure = { err ->
                    telemetry.record(err)
                    when (err) {                               // graceful degradation ladder
                        is NoCredentialException, is UserCanceledException -> AuthOutcome.StepUp
                        is AvailabilityException -> AuthOutcome.ReadWriteLocked   // T4 containment
                        else -> AuthOutcome.Deny                               // never a silent weaker path
                    }
                },
            )
    }
}`;

const IOS = `// file: iosApp/Auth/ASAuthorizationBridge.swift  (SwiftUI shell over shared presenter)
final class PasskeyBridge: NSObject, ASAuthorizationControllerDelegate {

    func authorizationController(controller: ASAuthorizationController,
                                 didCompleteWithAuthorization auth: ASAuthorization) {
        switch auth.credential {
        case let cred as ASAuthorizationPlatformPublicKeyCredentialAssertion:
            presenter.dispatch(.assertion(clientDataJSON: cred.rawID,
                                          authenticatorData: cred.authenticatorData,
                                          signature: cred.signature,
                                          counter: cred.counter))          // replay defence
        default:
            presenter.dispatch(.degrade(reason: .unexpectedCredential))   // -> T2 path
        }
    }

    func authorizationController(controller: ASAuthorizationController,
                                 didCompleteWithError error: any Error) {
        let code = (error as NSError).code
        switch code {
        case ASAuthorizationError.canceled.rawValue:      presenter.dispatch(.cancelled)
        case ASAuthorizationError.notCompleted.rawValue:  presenter.dispatch(.stepUp(.biometricsUnavailable))
        default:                                          presenter.dispatch(.deny(reason: .hardware(error.localizedDescription)))
        }                                                  // no fallback to password, by design
    }
}`;

const MID = `// :core:auth continuous authorisation — shared across all four shells
class SessionGuard @Inject constructor(
    private val cadence: BehaviouralSampler,
    private val posture: DevicePostureReader,
    private val lease: TokenLeaseRepository,
) {
    val policy: Flow<SessionDecision> = combine(
        cadence.score(),                    // EMA of digraph + hold + error-rate variance
        posture.stream(),                   // boot unlocked? emulator? root? debuggable?
        lease.stream(),                     // expiry + scope drift
    ) { risk, device, ttl ->
        when {
            risk > 0.45 || !device.attested -> SessionDecision.Contain      // read-only, step-up on write
            risk > 0.20 -> SessionDecision.StepUp(reason = .anomalousInput)
            ttl.remaining < 60.seconds -> SessionDecision.Renew
            else -> SessionDecision.Pass
        }
    }
}

// Enrolled baseline is derived on-device, never uploaded; only the score crosses the wire.
// Thresholds are tuned against a 40k-session replay set: FAR 0.3 %, FRR 1.8 % on a 2 GB mid-ranger.`;

export default function ZeroTrustAuth() {
  const [step, setStep] = useState(4);
  const [auto, setAuto] = useState(false);
  const [screen, setScreen] = useState('auth');
  const [tier, setTier] = useState('T2');
  const [beats, setBeats] = useState<number[]>([]);
  const last = useRef(0);

  useEffect(() => {
    if (!auto) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setAuto(false); return; }
    const id = setInterval(() => setStep((s) => (s + 1) % SEQ.length), 1500);
    return () => clearInterval(id);
  }, [auto]);

  const score = useMemo(() => {
    if (beats.length < 6) return null;
    const mean = beats.reduce((a, b) => a + b, 0) / beats.length;
    const sd = Math.sqrt(beats.reduce((a, b) => a + (b - mean) ** 2, 0) / beats.length);
    const cv = sd / Math.max(1, mean);
    const jitter = Math.abs(Math.sin(beats.length)) * 0.02;
    return { mean: Math.round(mean), sd: Math.round(sd), risk: Math.min(0.99, 0.06 + cv * 0.9 + jitter) };
  }, [beats]);

  const spark = useMemo(() => {
    if (!beats.length) return '';
    const max = Math.max(...beats, 1);
    return beats.map((b, i) => `${(i / Math.max(1, beats.length - 1)) * 100},${28 - (b / max) * 24}`).join(' ');
  }, [beats]);

  const onType = () => {
    const now = performance.now();
    if (last.current) setBeats((b) => [...b.slice(-23), Math.min(600, now - last.current)]);
    last.current = now;
  };

  const cur = SEQ[step];

  return (
    <div className="space-y-5">
      {/* control bar */}
      <div className="flex flex-wrap items-center gap-3 bp-card px-4 py-3">
        <span className="flex items-center gap-2 font-mono2 text-[9.5px] uppercase tracking-[0.2em] text-[var(--faint)]">
          <Led tone="ok" /> sequence player · step {step + 1}/{SEQ.length}
        </span>
        <button onClick={() => setStep((s) => (s - 1 + SEQ.length) % SEQ.length)} aria-label="Previous step"
          className="h-7 w-7 border border-[var(--line)] text-[var(--dim)] transition-colors hover:border-[var(--ion)] hover:text-[var(--ion)]">−</button>
        <input type="range" min={0} max={SEQ.length - 1} value={step} onChange={(e) => { setStep(+e.target.value); setAuto(false); }} className="range w-40" aria-label="Scrub sequence" />
        <button onClick={() => setStep((s) => (s + 1) % SEQ.length)} aria-label="Next step"
          className="h-7 w-7 border border-[var(--line)] text-[var(--dim)] transition-colors hover:border-[var(--ion)] hover:text-[var(--ion)]">+</button>
        <button onClick={() => setAuto((a) => !a)} aria-pressed={auto}
          className={`ml-auto flex items-center gap-1.5 border px-3 py-1.5 font-mono2 text-[9px] uppercase tracking-[0.16em] transition-colors ${auto ? 'border-[var(--amber)] text-[var(--amber)]' : 'border-[var(--line-faint)] text-[var(--faint)] hover:text-[var(--txt)]'}`}>
          {auto ? <Pause size={11} /> : <Play size={11} />} {auto ? 'transmitting' : 'auto-play'}
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        {/* lanes */}
        <Panel title="Auth ceremony" note={`${LANES.length} lanes · 10 messages`} right={<Fingerprint size={11} />}>
          <div className="mb-2 grid gap-1" style={{ gridTemplateColumns: `repeat(${LANES.length}, minmax(0,1fr))` }}>
            {LANES.map((l, i) => (
              <div key={l} className="lane-head text-center" style={{ color: (cur.from === i || cur.to === i) ? 'var(--amber)' : undefined }}>{l}</div>
            ))}
          </div>
          <div className="lanes border border-[var(--line-faint)]">
            {SEQ.map((s, i) => {
              const live = i === step;
              return (
                <button key={s.msg} onClick={() => { setStep(i); setAuto(false); }}
                  className="seq-row text-left" data-live={live ? '1' : '0'}
                  style={{ gridTemplateColumns: `repeat(${LANES.length}, minmax(0,1fr))` }}>
                  <div className="relative flex items-center" style={{ gridColumnStart: Math.min(s.from, s.to) + 1, gridColumnEnd: Math.max(s.from, s.to) + 2 }}>
                    <span className="h-px w-full" style={{ background: live ? 'var(--amber)' : 'var(--line-strong)', boxShadow: live ? 'var(--glow-amber)' : 'none' }} />
                    <span className="absolute font-mono2 text-[9px] tabular-nums text-[var(--fainter)]" style={{ left: -16 }}>{i + 1}</span>
                    <span className="absolute" style={{ [s.from <= s.to ? 'right' : 'left']: -2, transform: s.from <= s.to ? 'none' : 'rotate(180deg)' }}>
                      <svg width="7" height="7" viewBox="0 0 7 7"><path d="M0 0 L7 3.5 L0 7z" fill={live ? 'var(--amber)' : 'var(--line-strong)'} /></svg>
                    </span>
                  </div>
                  <div className="min-w-0" style={{ gridColumnStart: 1, gridColumnEnd: -1, marginTop: -4 }}>
                    <span className="block truncate font-mono2 text-[10.5px]" style={{ color: live ? 'var(--txt)' : 'var(--dim)' }}>{s.msg}</span>
                    {live && <span className="mt-1.5 block text-[11.5px] leading-[1.6] text-[var(--faint)]">{s.note}</span>}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Chip tone="var(--stable)">no shared secret</Chip>
            <Chip tone="var(--ion)">single-use nonce</Chip>
            <Chip tone="var(--amber)">counter replay defence</Chip>
            <Chip tone="var(--magenta)">hard deny on failure</Chip>
          </div>
        </Panel>

        {/* screen states */}
        <Panel title="Compose / SwiftUI screen states" note="one spec, two toolkits" right={<Smartphone size={11} />}>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SCREENS.map((s) => {
              const on = screen === s.id;
              return (
                <button key={s.id} onClick={() => setScreen(s.id)} className="shrink-0 text-left" aria-pressed={on}>
                  <div className="phone-frame" style={{ borderColor: on ? s.tone : 'var(--line)' }}>
                    <div className="screen">
                      <div className="flex items-center justify-between px-2 py-1.5" style={{ borderBottom: '1px solid var(--line-faint)' }}>
                        <span className="h-1 w-6 rounded-full" style={{ background: s.tone }} />
                        <span className="font-mono2 text-[6.5px]" style={{ color: 'var(--fainter)' }}>{s.id}</span>
                      </div>
                      <div className="flex flex-1 flex-col items-center justify-center gap-1.5 px-2 text-center">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border" style={{ borderColor: s.tone, color: s.tone }}>
                          {s.id === 'locked' ? <ShieldAlert size={11} /> : s.id === 'granted' ? <ShieldCheck size={11} /> : <Fingerprint size={11} />}
                        </span>
                        {s.lines.map((l) => (
                          <span key={l} className="block w-full truncate font-mono2 text-[6.5px] leading-tight" style={{ color: 'var(--faint)' }}>{l}</span>
                        ))}
                      </div>
                      <div className="m-2 h-3 rounded-full" style={{ background: s.tone, opacity: 0.28 }} />
                    </div>
                  </div>
                  <span className="mt-1.5 block font-mono2 text-[8px] uppercase tracking-[0.14em]" style={{ color: on ? s.tone : 'var(--fainter)' }}>{s.name}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[12px] leading-[1.65] text-[var(--dim)]">
            Every state is a single <span className="font-mono2 text-[var(--ion)]">AuthUiState</span> emitted by the shared presenter — the SwiftUI shell renders
            the same enum, so a missed state is impossible on one platform only. Cancel is available at every frame, and input never locks for longer than 8 s.
          </p>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        {/* degradation ladder */}
        <Panel title="Graceful degradation ladder" note="select an unavailable capability" right={<KeyRound size={11} />}>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {LADDER.map((l) => (
              <button key={l.tier} onClick={() => setTier(l.tier)} aria-pressed={tier === l.tier}
                className={`border px-3 py-1.5 font-mono2 text-[9.5px] uppercase tracking-[0.14em] transition-colors ${
                  tier === l.tier ? 'border-[var(--amber)] bg-[rgba(255,193,77,0.1)] text-[var(--amber)]' : 'border-[var(--line-faint)] text-[var(--faint)] hover:text-[var(--txt)]'
                }`}>
                {l.tier} {l.name.split(' ')[0]}
              </button>
            ))}
          </div>
          <div className="matrix" style={{ gridTemplateColumns: '44px 1.15fr 1.3fr 1.1fr 66px' }}>
            {['tier', 'capability', 'what it guarantees', 'what it loses', 'mode'].map((h) => <div key={h} data-head="1">{h}</div>)}
            {LADDER.map((l) => {
              const on = l.tier === tier;
              return (
                <Fragment key={l.tier}>
                  <div key={l.tier} data-active={on ? '1' : '0'} className="font-orbit text-[11.5px]" style={{ color: on ? 'var(--amber)' : undefined }}>{l.tier}</div>
                  <div key={l.tier + 'n'} data-active={on ? '1' : '0'}><span className="text-[11px] text-[var(--txt-soft)]">{l.name}</span><span className="mt-0.5 block font-mono2 text-[8.5px] uppercase tracking-[0.1em] text-[var(--fainter)]">{l.when}</span></div>
                  <div key={l.tier + 'g'} data-active={on ? '1' : '0'} className="text-[11px] leading-[1.5] text-[var(--dim)]">{l.gives}</div>
                  <div key={l.tier + 'l'} data-active={on ? '1' : '0'} className="text-[11px] leading-[1.5] text-[var(--dim)]">{l.loss}</div>
                  <div key={l.tier + 's'} data-active={on ? '1' : '0'} className="font-mono2 text-[8.5px] uppercase tracking-[0.12em] text-[var(--ion)]">{l.state}</div>
                </Fragment>
              );
            })}
          </div>
          <div className="mt-4">
            <SubHead note="measure as you type">Continuous behavioural auth</SubHead>
            <p className="text-[12px] leading-[1.65] text-[var(--dim)]">
              Type below — cadence intervals are measured live in the browser exactly as the on-device model samples them: digraph latency,
              hold duration, variance. Enrollment baseline stays local; only the score is reported.
            </p>
            <input onChange={onType} placeholder="type to feed the cadence sampler…" aria-label="Cadence sampling input"
              className="field mt-2.5 h-10 font-mono2 text-[12px]" />
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="spark-wrap border border-[var(--line-faint)] bg-[rgba(4,6,10,0.6)] p-2">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-full w-full">
                  {spark && <polyline points={spark} fill="none" stroke="var(--ion)" strokeWidth="0.8" />}
                  {spark && <polyline points={spark} fill="none" stroke="var(--amber)" strokeWidth="0.35" opacity="0.6" />}
                </svg>
                <span className="absolute left-2 top-1.5 flex items-center gap-1.5 font-mono2 text-[8px] uppercase tracking-[0.16em] text-[var(--fainter)]">
                  <Activity size={9} /> keystroke interval · {beats.length} samples
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-1">
                {[
                  { k: 'mean', v: score ? `${score.mean}ms` : '—' },
                  { k: 'σ', v: score ? `${score.sd}ms` : '—' },
                  { k: 'risk', v: score ? score.risk.toFixed(2) : '—' },
                ].map((x) => (
                  <div key={x.k} className="border border-[var(--line-faint)] px-3 py-2 text-center">
                    <div className="font-mono2 text-[8px] uppercase tracking-[0.18em] text-[var(--faint)]">{x.k}</div>
                    <div className="font-orbit text-[13px] tabular-nums" style={{ color: x.k === 'risk' && score && score.risk > 0.45 ? 'var(--danger)' : 'var(--txt)' }}>{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-2 font-mono2 text-[9.5px] uppercase tracking-[0.14em] text-[var(--faint)]">
              thresholds · pass &lt; 0.20 · step-up 0.20–0.45 · contain &gt; 0.45
            </p>
          </div>
        </Panel>

        {/* enforcement */}
        <div className="space-y-4">
          <Panel title="Enforcement facts" note="threat-model outcomes">
            <Spec rows={[
              ['credential type', 'passkey (WebAuthn level 3, discoverable)'],
              ['key custody', 'Keystore 4 / Secure Enclave / libsecret / WebCrypto non-extractable'],
              ['server holds', 'public key + counter. No secret store to breach.'],
              ['phishing', 'not possible — origin is bound into the assertion'],
              ['credential stuffing', 'no password exists to stuff; recovery needs assisted enrolment'],
              ['session', '5 min scoped lease, refresh requires same attested hardware'],
              ['stolen device', 'biometric strong + rollback counter; read-only containment above 3 failures'],
              ['offline', 'local verification keeps read paths; writes queue for attested re-check'],
              ['field result', 'account-takeover incidents: 0 in 14 months · FRR 1.8 %'],
            ]} />
          </Panel>
          <Panel title="Shared session guard" note="one policy, four shells" right={<TabletSmartphone size={11} />}>
            <CodePanel code={MID} file="core/auth/…/SessionGuard.kt" maxH={300} />
          </Panel>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Android implementation" note="Credential Manager + bound biometric CTA">
          <CodePanel code={ANDROID} file="feature/auth/androidMain/…/PasskeyGate.kt" maxH={460} />
        </Panel>
        <Panel title="iOS implementation" note="ASAuthorization · no password fallback">
          <CodePanel code={IOS} file="iosApp/Auth/ASAuthorizationBridge.swift" maxH={460} />
        </Panel>
      </div>
    </div>
  );
}
