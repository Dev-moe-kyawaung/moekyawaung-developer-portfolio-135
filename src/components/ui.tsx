import type { ReactNode } from 'react';
import { GitBranch, Briefcase, Clapperboard, Camera, Film, AtSign, BookOpen, Hash, MessageCircle, CreditCard, Pin, Rss, Link2, Mail, Phone, Send, Globe, Play } from 'lucide-react';
import { useInView, useCounter } from '../hooks';
import type { Stat } from '../data';

/* ---------- Reveal ---------- */
export function Reveal({ children, delay = 0, className = '', variant: _variant = '' }: {
  children: ReactNode; delay?: number; className?: string; variant?: 'left' | 'right' | '';
}) {
  const { ref, inView } = useInView(0.12);
  return (
    <div ref={ref} className={`reveal ${inView ? 'in' : ''} ${className}`} style={{ ['--rd' as string]: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------- SectionHead — ultra-minimal, powerful typography ---------- */
export function SectionHead({ index, kicker, title, desc, mm: _mm }: {
  index: string; kicker: string; title: ReactNode; desc?: string; mm?: string;
}) {
  return (
    <div className="mb-14 md:mb-20 max-w-3xl">
      <Reveal>
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono2 text-[10px] tracking-[0.2em] text-[var(--faint)]">{index}</span>
          <span className="h-px w-8 bg-[var(--line)]" />
          <span className="kicker">{kicker}</span>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="font-display text-[32px] sm:text-[44px] lg:text-[52px] leading-[0.95] tracking-[-0.03em] text-[var(--txt)]">
          {title}
        </h2>
      </Reveal>
      {desc && (
        <Reveal delay={160}>
          <p className="mt-6 text-[15px] leading-[1.7] text-[var(--dim)] max-w-[60ch]">{desc}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ---------- StatCounter — minimal, large serif numbers ---------- */
export function StatCounter({ stat }: { stat: Stat }) {
  const { ref, inView } = useInView(0.4);
  const v = useCounter(stat.n, inView);
  return (
    <div ref={ref} className="group relative px-5 py-7">
      <span className="absolute left-0 top-1/2 hidden h-10 w-px -translate-y-1/2 bg-[var(--line)] transition-all duration-500 group-hover:bg-[var(--ion)] md:block" />
      <div className="flex items-baseline gap-2">
        <span className="font-display text-[38px] leading-none tracking-tight text-[var(--txt)] tabular-nums transition-colors group-hover:text-[var(--ion)] sm:text-[44px]">
          {v}{stat.suffix}
        </span>
        <span className="font-mono2 text-[9px] uppercase tracking-[0.2em] text-[var(--fainter)]">{inView ? '· live' : '· …'}</span>
      </div>
      <div className="mt-3 font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--faint)]">{stat.label}</div>
      <div className="mt-2.5">
        <div className="gauge-track">
          <div className="gauge-fill" style={{ width: inView ? `${Math.min(100, 42 + (stat.n % 7) * 9)}%` : '0%' }} />
        </div>
      </div>
    </div>
  );
}

/* ---------- ProgressBar — quiet 2px line ---------- */
export function ProgressBar({ label, val, color: _color, note, delay = 0 }: {
  label: string; val: number; color: string; note: string; delay?: number;
}) {
  const { ref, inView } = useInView(0.4);
  return (
    <div ref={ref} className="group">
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-baseline gap-3">
          <span className="font-head text-[14px] tracking-[-0.01em]">{label}</span>
          <span className="font-mono2 text-[10px] text-[var(--faint)] hidden sm:inline">{note}</span>
        </div>
        <span className="font-mono2 text-[11px] text-[var(--faint)]">{val}%</span>
      </div>
      <div className="prog-track">
        <div className="prog-fill" style={{ width: inView ? `${val}%` : '0%', transitionDelay: `${delay}ms` }} />
      </div>
    </div>
  );
}

/* ---------- ProgressRing — minimal, thin stroke ---------- */
export function ProgressRing({ label, val, color: _color, size = 120 }: {
  label: string; val: number; color: string; size?: number;
}) {
  const { ref, inView } = useInView(0.4);
  const r = 44;
  const circ = 2 * Math.PI * r;
  return (
    <div ref={ref} className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--line)" strokeWidth="1" />
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--txt)" strokeWidth="1.2" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={inView ? circ - (circ * val) / 100 : circ}
            style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.2,0.8,0.2,1) 0.15s' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-[18px]">{val}%</span>
        </div>
      </div>
      <span className="font-mono2 text-[10px] tracking-[0.16em] uppercase text-[var(--faint)]">{label}</span>
    </div>
  );
}

/* ---------- Marquee ---------- */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee py-3">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-6 px-6 font-mono2 text-[11px] tracking-[0.18em] text-[var(--faint)] whitespace-nowrap">
            {t} <span className="w-px h-3 bg-[var(--line)]" />
          </span>
        ))}
      </div>
    </div>
  );
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  github: GitBranch, linkedin: Briefcase, youtube: Clapperboard, instagram: Camera,
  mail: Mail, email: Mail, phone: Phone, telegram: Send, gravatar: Globe,
  playstore: Play, bluesky: AtSign, tumblr: BookOpen, flickr: Camera, vimeo: Film,
  twitch: Clapperboard, slack: Hash, paypal: CreditCard, strikingly: Link2,
  reddit: MessageCircle, pinterest: Pin, wordpress: Rss,
};

export function SocialIcon({ name, size = 16, className = '' }: { name: string; size?: number; className?: string }) {
  const Cmp = ICON_MAP[name] ?? Globe;
  return <Cmp size={size} className={className} />;
}
