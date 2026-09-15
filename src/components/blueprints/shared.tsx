import type { ReactNode } from 'react';
import { Copy, Check } from 'lucide-react';
import { useCopy } from '../../hooks';

/* ---------- tiny Kotlin/JSON highlighter (no dep, escaped) ---------- */
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const KEYWORDS = new Set([
  'fun', 'val', 'var', 'class', 'object', 'interface', 'expect', 'actual', 'suspend', 'private',
  'internal', 'public', 'override', 'return', 'if', 'else', 'when', 'is', 'in', 'import', 'package',
  'sealed', 'data', 'companion', 'by', 'throw', 'try', 'catch', 'finally', 'null', 'true', 'false',
  'operator', 'init', 'const', 'enum', 'typealias', 'open', 'abstract', 'inline', 'reified',
  'crossinline', 'vararg', 'external', 'annotation', 'repeatable', 'fun interface', 'this', 'it',
]);

const RE = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|\b([a-zA-Z_][\w.]*)(?=\s*\()|\b([a-zA-Z_][\w]*)\b/g;

export function highlight(src: string): string {
  return esc(src).replace(RE, (m, comment, dq, sq, fn, word) => {
    if (comment) return `<span class="k-cm">${comment}</span>`;
    if (dq) return `<span class="k-str">${dq}</span>`;
    if (sq) return `<span class="k-str">${sq}</span>`;
    if (fn) return KEYWORDS.has(fn) ? `<span class="k-kw">${fn}</span>` : `<span class="k-fn">${fn}</span>`;
    if (word) {
      if (KEYWORDS.has(word)) return `<span class="k-kw">${word}</span>`;
      if (/^[A-Z]/.test(word)) return `<span class="k-ty">${word}</span>`;
      if (/^\d+$/.test(word)) return `<span class="k-ty">${word}</span>`;
    }
    return m;
  });
}

/* ---------- code panel with line numbers + copy ---------- */
export function CodePanel({ code, file, maxH = 320 }: { code: string; file?: string; maxH?: number }) {
  const { copied, copy } = useCopy();
  const lines = code.replace(/\s+$/, '').split('\n');
  return (
    <div className="relative border border-[var(--line-faint)] bg-[rgba(4,6,10,0.86)]">
      {file && (
        <div className="flex items-center justify-between gap-3 border-b border-[var(--line-faint)] px-3 py-1.5">
          <span className="truncate font-mono2 text-[9px] uppercase tracking-[0.18em] text-[var(--faint)]">{file}</span>
          <button onClick={() => copy(code)} className="flex shrink-0 items-center gap-1 font-mono2 text-[9px] uppercase tracking-[0.16em] text-[var(--dim)] transition-colors hover:text-[var(--ion)]">
            {copied ? <><Check size={11} className="text-[var(--stable)]" /> copied</> : <><Copy size={11} /> copy</>}
          </button>
        </div>
      )}
      <div className="bp-code overflow-auto p-3" style={{ maxHeight: maxH }}>
        {lines.map((l, i) => (
          <span key={i} className="ln" dangerouslySetInnerHTML={{ __html: highlight(l) || '&nbsp;' }} />
        ))}
      </div>
    </div>
  );
}

/* ---------- labelled panel ---------- */
export function Panel({ title, note, right, children, className = '' }: {
  title: string; note?: string; right?: ReactNode; children: ReactNode; className?: string;
}) {
  return (
    <section className={`bp-card overflow-hidden ${className}`}>
      <div className="hud-strip">
        <span className="flex items-center gap-2">
          <Led /> {title}
        </span>
        {right ?? (note ? <span className="truncate text-right">{note}</span> : null)}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function Led({ tone = 'ok' }: { tone?: 'ok' | 'warn' | 'hot' | 'idle' }) {
  const map = {
    ok: 'var(--stable)', warn: 'var(--amber)', hot: 'var(--ember)', idle: 'var(--fainter)',
  } as const;
  return (
    <span
      className="inline-block h-[7px] w-[7px] shrink-0 rounded-full"
      style={{ background: map[tone], boxShadow: tone === 'idle' ? 'none' : `0 0 9px ${map[tone]}` }}
    />
  );
}

export function Chip({ children, tone }: { children: ReactNode; tone?: string }) {
  return (
    <span
      className="px-2 py-0.5 font-mono2 text-[9px] uppercase tracking-[0.14em]"
      style={{
        color: tone ?? 'var(--dim)',
        border: `1px solid ${tone ? `color-mix(in srgb, ${tone} 42%, transparent)` : 'var(--line-faint)'}`,
      }}
    >
      {children}
    </span>
  );
}

/* ---------- spec key/value rows ---------- */
export function Spec({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="divide-y divide-[var(--line-faint)] border-y border-[var(--line-faint)]">
      {rows.map(([k, v]) => (
        <div key={k} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2">
          <dt className="font-mono2 text-[9.5px] uppercase tracking-[0.18em] text-[var(--faint)]">{k}</dt>
          <dd className="text-right text-[12.5px] text-[var(--txt-soft)]">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------- sub heading inside a panel ---------- */
export function SubHead({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
      <h4 className="font-display text-[13px] uppercase tracking-[0.06em] text-[var(--txt)]">{children}</h4>
      {note && <span className="font-mono2 text-[9px] uppercase tracking-[0.18em] text-[var(--faint)]">{note}</span>}
    </div>
  );
}

/* ---------- tab strip ---------- */
export function TabStrip<T extends string>({ value, onChange, items }: {
  value: T; onChange: (v: T) => void; items: { id: T; label: string }[];
}) {
  return (
    <div className="bp-tabs" role="tablist">
      {items.map((it) => (
        <button key={it.id} role="tab" aria-selected={value === it.id} onClick={() => onChange(it.id)} className="bp-tab">
          {it.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- animated progress meter ---------- */
export function Meter({ label, value, max, unit, tone = 'var(--ion)', hint }: {
  label: string; value: number; max: number; unit: string; tone?: string; hint?: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const within = value <= max;
  return (
    <div className="group">
      <div className="flex items-end justify-between gap-2">
        <span className="font-mono2 text-[9.5px] uppercase tracking-[0.16em] text-[var(--faint)]">{label}</span>
        <span className="flex items-baseline gap-1">
          <span className="font-orbit text-[13px] tabular-nums" style={{ color: within ? tone : 'var(--danger)' }}>{value}</span>
          <span className="font-mono2 text-[9px] text-[var(--faint)]">{unit}</span>
        </span>
      </div>
      <div className="gauge-track mt-1.5">
        <div className="gauge-fill" style={{ width: `${pct}%`, background: within ? tone : 'var(--danger)' }} />
      </div>
      <div className="mt-1 flex justify-between font-mono2 text-[8.5px] uppercase tracking-[0.16em]" style={{ color: within ? 'var(--fainter)' : 'var(--danger)' }}>
        <span>{within ? 'inside budget' : 'budget breached'}</span>
        <span>{hint ?? `max ${max}${unit}`}</span>
      </div>
    </div>
  );
}
