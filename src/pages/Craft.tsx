import { Download, GraduationCap, Briefcase, Award, GitBranch, Star, GitFork,
  BookOpen, Clapperboard, Lightbulb, TrendingUp, Timer, Cpu, Gauge,
  Smartphone, Rows3, Palette, Ruler, Wifi, Battery } from 'lucide-react';
import { TIMELINE, PROFILE } from '../data';
import {
  RESUME_SUMMARY, RESUME_SKILLS, RESUME_EDUCATION, STACK_LAYERS, PERF_AREAS,
  XP_ARCH, FLUTTER_ARCH, OSS, GH_EVENTS, GH_PINNED, ARTICLES, TALKS,
  MENTOR_TRACKS, AWARDS, LABS, COLOR_TOKENS, TYPE_SCALE, MOTION_TOKENS,
  A11Y_CHECKS, LOCALE_MATRIX, L10N_NOTES, LEGAL_SECTIONS,
} from '../content';
import { Reveal } from '../components/ui';
import { PageShell, BlockTitle, NumberedRow, DefCard, PageCta } from '../components/pageshell';
import { Tilt } from '../components/fx';
import { ContainmentStack } from '../components/PlasmaField';

/* ============ RESUME ============ */
export function ResumePage() {
  const download = () => {
    const txt = [
      'MOE KYAW AUNG — Senior Android / Flutter Developer',
      `${PROFILE.location} | ${PROFILE.phones[0]} | ${PROFILE.primaryEmail}`,
      `GitHub: ${PROFILE.githubMain}`,
      '', 'PROFESSIONAL SUMMARY', RESUME_SUMMARY, '', 'CORE SKILLS',
      ...RESUME_SKILLS.map((s) => `${s.group}: ${s.items.join(', ')}`),
      '', 'EXPERIENCE',
      ...TIMELINE.map((t) => `${t.year} — ${t.title}, ${t.org}\n  ${t.desc}\n  Impact: ${t.impact}`),
      '', 'EDUCATION & PROGRAMS',
      ...RESUME_EDUCATION.map((e) => `${e.year} — ${e.title}, ${e.org}`),
      '', 'CERTIFICATIONS', PROFILE.certificationsNote,
    ].join('\n');
    const url = URL.createObjectURL(new Blob([txt], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'Moe-Kyaw-Aung-Resume-2026.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageShell route="resume">
      <Reveal>
        <div className="cyber-card clip-cy p-7 sm:p-9 mb-12 corner-frame">
          <p className="text-[var(--dim)] leading-relaxed">{RESUME_SUMMARY}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={download} className="btn btn-primary clip-cy-sm text-xs"><Download size={14} /> Download CV</button>
            <a href={`mailto:${PROFILE.primaryEmail}`} className="btn btn-ghost clip-cy-sm text-xs">Email me</a>
          </div>
        </div>
      </Reveal>

      <BlockTitle note="ATS FRIENDLY">Key Skills</BlockTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 -mt-4">
        {RESUME_SKILLS.map((s, i) => (
          <Reveal key={s.group} delay={i * 60}>
            <div className="cyber-card clip-cy-sm p-5 h-full">
              <h3 className="font-head font-bold tracking-widest uppercase text-sm text-[var(--cyan)]">{s.group}</h3>
              <p className="mt-2.5 text-[13px] text-[var(--dim)] leading-relaxed">{s.items.join(' · ')}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <BlockTitle note="2014 — 2026">Experience</BlockTitle>
      <div className="relative -mt-4">
        <div className="tl-line left-4" />
        <div className="space-y-8">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year} delay={i * 70}>
              <div className="relative pl-14">
                <span className="tl-dot left-4 top-2" />
                <div className="cyber-card clip-cy sweep p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-display font-bold grad-text text-lg">{t.year}</span>
                    <span className="px-2.5 py-0.5 clip-tag font-mono2 text-[9px] tracking-[0.15em] border border-[var(--line-strong)] text-[var(--green)]">{t.impact}</span>
                  </div>
                  <h3 className="mt-2 font-head font-bold text-lg">{t.title}</h3>
                  <div className="font-mono2 text-[10px] tracking-[0.2em] text-[var(--pink)]">{t.org.toUpperCase()}</div>
                  <p className="mt-2.5 text-sm text-[var(--dim)] leading-relaxed">{t.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <BlockTitle note="FORMAL + PROGRAMS">Education</BlockTitle>
      <div className="grid sm:grid-cols-2 gap-4 -mt-4">
        {RESUME_EDUCATION.map((e, i) => (
          <Reveal key={e.title} delay={i * 70}>
            <div className="cyber-card clip-cy-sm p-5 border-l-2 !border-l-[var(--violet)]">
              <div className="flex items-center gap-2.5 font-mono2 text-[10px] tracking-[0.2em] text-[var(--violet)]">
                <GraduationCap size={13} /> {e.year}
              </div>
              <h3 className="mt-2 font-head font-bold text-base">{e.title}</h3>
              <div className="font-mono2 text-[10px] text-[var(--faint)] mt-0.5">{e.org}</div>
              <p className="mt-2 text-[13px] text-[var(--dim)]">{e.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <PageCta title="Want the full PDF version?" label="Request resume" />
    </PageShell>
  );
}

/* ============ EXPERIENCE ============ */
export function ExperiencePage() {
  return (
    <PageShell route="experience">
      <div className="relative">
        <div className="tl-line left-4 md:left-1/2 md:-translate-x-1/2" />
        <div className="space-y-10">
          {TIMELINE.map((t, i) => (
            <Reveal key={t.year} delay={i * 80} variant={i % 2 ? 'right' : 'left'}>
              <div className="relative pl-14 md:pl-0 md:grid md:grid-cols-2 md:gap-12 items-center">
                <span className="tl-dot left-4 md:left-1/2 md:-translate-x-1/2 top-2 md:top-1/2 md:-translate-y-1/2 z-10" />
                <div className={i % 2 === 0 ? 'md:col-start-1' : 'md:col-start-2'}>
                  <div className="cyber-card clip-cy sweep p-6">
                    <span className="font-display font-black text-3xl grad-text">{t.year}</span>
                    <h3 className="mt-2.5 font-head font-bold text-xl">{t.title}</h3>
                    <div className="flex items-center gap-2 font-mono2 text-[10px] tracking-[0.2em] text-[var(--pink)] mt-1">
                      <Briefcase size={11} /> {t.org.toUpperCase()}
                    </div>
                    <p className="mt-3 text-sm text-[var(--dim)] leading-relaxed">{t.desc}</p>
                    <div className="mt-4">
                      <span className="px-3 py-1 clip-tag font-mono2 text-[10px] tracking-widest text-[var(--green)] border border-[var(--green)]">▲ {t.impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <PageCta />
    </PageShell>
  );
}

/* ============ TECH STACK ============ */
export function TechStackPage() {
  return (
    <PageShell route="tech-stack">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start mb-16">
        <div className="lg:sticky lg:top-24">
          <BlockTitle note="Containment vessel">Stacked plates, isolated by design</BlockTitle>
          <p className="text-[14px] leading-[1.7] text-[var(--dim)] max-w-[50ch] -mt-4">
            Each plate talks outward through contracts only — never to an implementation. The domain core is pure Kotlin with no Android imports, data owns sources behind repository membranes, and the UI plate renders state without mutating it. Hover a plate to lift it out of the vessel and read its load.
          </p>
          <div className="mt-8 space-y-3">
            <div className="rounded-[14px] border border-[var(--line)] bg-[var(--panel)] p-4">
              <div className="font-mono2 text-[10px] tracking-[0.16em] uppercase text-[var(--faint)]">Principle</div>
              <div className="mt-1.5 text-[13px] leading-[1.6] text-[var(--txt-soft)]">Dependencies point inward. Outer layers know inner contracts, inner layers know nothing of outer.</div>
            </div>
            <div className="rounded-[14px] border border-[var(--line)] bg-[var(--panel)] p-4">
              <div className="font-mono2 text-[10px] tracking-[0.16em] uppercase text-[var(--faint)]">Result</div>
              <div className="mt-1.5 text-[13px] leading-[1.6] text-[var(--txt-soft)]">New engineers ship in week two. Tests run without emulator. Refactors stay local.</div>
            </div>
          </div>
        </div>

        <Reveal delay={80}>
          <ContainmentStack layers={STACK_LAYERS} />
        </Reveal>
      </div>
      <PageCta title="Want this stack reviewed for your team?" label="Book an architecture review" to="pricing" />
    </PageShell>
  );
}

/* ============ ARCHITECTURE (cross-platform) ============ */
export function ArchitecturePage() {
  return (
    <PageShell route="architecture">
      <Reveal>
        <p className="text-lg text-[var(--dim)] leading-relaxed max-w-3xl">
          Cross-platform is not about sharing everything — it is about drawing a hard line between
          what can be written once and what must respect the platform. These are the rules I apply
          to every shared codebase.
        </p>
      </Reveal>
      <BlockTitle note="SIX RULES">How I Structure Shared Code</BlockTitle>
      <div className="space-y-4 -mt-4">
        {XP_ARCH.map((x, i) => <NumberedRow key={x.title} n={i + 1} title={x.title} detail={x.detail} />)}
      </div>
      <PageCta title="Planning a cross-platform build?" />
    </PageShell>
  );
}

/* ============ FLUTTER ARCHITECTURE ============ */
export function FlutterArchPage() {
  return (
    <PageShell route="flutter-architecture">
      <Reveal>
        <p className="text-lg text-[var(--dim)] leading-relaxed max-w-3xl">
          A Flutter codebase stays maintainable when every widget has one job, every rebuild is
          intentional, and every layer can be tested without the framework. This is the shape I build to.
        </p>
      </Reveal>
      <BlockTitle note="SIX PILLARS">Flutter System Design</BlockTitle>
      <div className="grid sm:grid-cols-2 gap-4 -mt-4">
        {FLUTTER_ARCH.map((x, i) => (
          <DefCard key={x.title} title={x.title} detail={x.detail}
            color={['var(--cyan)', 'var(--pink)', 'var(--yellow)', 'var(--violet)', 'var(--green)', 'var(--cyan)'][i]} />
        ))}
      </div>
      <PageCta title="Need a Flutter architecture review?" to="pricing" label="See audit pricing" />
    </PageShell>
  );
}

/* ============ PERFORMANCE ============ */
const PERF_ICONS: Record<string, React.ComponentType<{ size?: number | string }>> = {
  Gauge, Timer, Cpu, Battery, Rows3, Smartphone,
};

export function PerformancePage() {
  return (
    <PageShell route="performance">
      <Reveal>
        <p className="text-lg text-[var(--dim)] leading-relaxed max-w-3xl">
          Performance work is only credible when it is measured on real hardware. Every figure below
          comes from a mid-range device in the release build — not a profiler attached to a flagship.
        </p>
      </Reveal>

      <BlockTitle note="BEFORE → AFTER">Measured Results</BlockTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 -mt-4">
        {[
          { l: 'Cold start', b: '3.1s', a: '1.4s', d: '-55%' },
          { l: 'Dropped frames / scroll', b: '41', a: '3', d: '-93%' },
          { l: 'APK size', b: '38 MB', a: '17 MB', d: '-55%' },
          { l: 'Crash-free sessions', b: '97.2%', a: '99.9%', d: '+2.7pt' },
          { l: 'Battery / hour', b: '11%', a: '4%', d: '-64%' },
          { l: 'Median approval time', b: '4h 20m', a: '38s', d: '-99%' },
        ].map((m, i) => (
          <Reveal key={m.l} delay={i * 60}>
            <div className="cyber-card clip-cy-sm p-5 sweep">
              <div className="font-mono2 text-[9px] tracking-[0.2em] text-[var(--faint)] uppercase">{m.l}</div>
              <div className="mt-3 flex items-center gap-2.5 font-display font-bold">
                <span className="text-sm text-[var(--faint)] line-through">{m.b}</span>
                <TrendingUp size={13} className="text-[var(--faint)]" />
                <span className="text-2xl text-[var(--cyan)]">{m.a}</span>
              </div>
              <span className="mt-3 inline-block px-2.5 py-1 clip-tag font-mono2 text-[10px] text-[var(--green)] border border-[var(--green)]">{m.d}</span>
            </div>
          </Reveal>
        ))}
      </div>

      <BlockTitle note="SIX DISCIPLINES">Where the Gains Come From</BlockTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 -mt-4">
        {PERF_AREAS.map((a, i) => {
          const Icon = PERF_ICONS[a.icon] ?? Gauge;
          return (
            <Reveal key={a.title} delay={i * 60}>
              <div className="cyber-card clip-cy sweep p-5 h-full flex flex-col gap-3">
                <span className="w-11 h-11 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--cyan)]"><Icon size={19} /></span>
                <h3 className="font-head font-bold text-base">{a.title}</h3>
                <p className="text-[13px] text-[var(--dim)] leading-relaxed flex-1">{a.detail}</p>
                <div className="pt-2 border-t border-[var(--line)] space-y-1.5">
                  <div className="font-display font-bold text-[var(--yellow)] text-sm">{a.metric}</div>
                  <div className="font-mono2 text-[9px] tracking-[0.15em] text-[var(--faint)]">{a.tool}</div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
      <PageCta title="Is your app slower than it should be?" to="pricing" label="Book a performance audit" />
    </PageShell>
  );
}

/* ============ OPEN SOURCE ============ */
export function OpenSourcePage() {
  return (
    <PageShell route="open-source">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {OSS.map((r, i) => (
          <Reveal key={r.name} delay={i * 70}>
            <Tilt max={6}>
              <div className="cyber-card clip-cy sweep p-6 h-full flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-head font-bold text-base leading-tight">{r.name}</h3>
                  <span className="px-2 py-0.5 clip-tag font-mono2 text-[9px] tracking-widest border border-[var(--line)] text-[var(--cyan)] shrink-0">{r.lang}</span>
                </div>
                <p className="text-[13px] text-[var(--dim)] leading-relaxed">{r.desc}</p>
                <div className="mt-auto pt-3 border-t border-[var(--line)]">
                  <div className="font-mono2 text-[9px] tracking-[0.15em] text-[var(--faint)] mb-1.5">WHY IT MATTERS</div>
                  <p className="text-xs text-[var(--txt)] leading-relaxed">{r.why}</p>
                  {r.stars > 0 && (
                    <div className="flex items-center gap-3 mt-3 font-mono2 text-[10px] text-[var(--faint)]">
                      <span className="flex items-center gap-1"><Star size={11} className="text-[var(--yellow)]" />{r.stars}</span>
                      <span className="flex items-center gap-1"><GitFork size={11} className="text-[var(--pink)]" />{Math.round(r.stars / 5)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
      <PageCta title="Collaborating on something useful?" label="Reach out" />
    </PageShell>
  );
}

/* ============ GITHUB ACTIVITY ============ */
const KIND_COLOR: Record<string, string> = {
  push: 'var(--cyan)', pr: 'var(--pink)', issue: 'var(--yellow)',
  release: 'var(--green)', review: 'var(--violet)',
};

export function GitHubPage() {
  return (
    <PageShell route="github">
      <BlockTitle note="PINNED">Pinned Repositories</BlockTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 -mt-4">
        {GH_PINNED.map((r, i) => (
          <Reveal key={r.name} delay={i * 70}>
            <a href="https://github.com/Dev-moe-kyawaung/" target="_blank" rel="noreferrer" className="cyber-card clip-cy sweep p-5 block h-full group">
              <div className="flex items-start gap-3">
                <GitBranch size={16} className="text-[var(--cyan)] shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h3 className="font-head font-bold text-[15px] truncate group-hover:text-[var(--cyan)] transition-colors">{r.name}</h3>
                  <p className="mt-1.5 text-xs text-[var(--dim)] leading-relaxed">{r.desc}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 font-mono2 text-[10px] text-[var(--faint)]">
                <span className="flex items-center gap-1"><Star size={11} className="text-[var(--yellow)]" />{r.stars}</span>
                <span className="flex items-center gap-1"><GitFork size={11} className="text-[var(--pink)]" />{r.forks}</span>
                <span className="ml-auto text-[var(--cyan)]">{r.lang}</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <BlockTitle note="LIVE FEED">Recent Activity</BlockTitle>
      <div className="cyber-card clip-cy divide-y divide-[var(--line)] -mt-4">
        {GH_EVENTS.map((e, i) => (
          <Reveal key={e.t + i} delay={i * 45}>
            <div className="flex flex-wrap items-center gap-3 px-5 py-4">
              <span className="w-2 h-2 rotate-45 shrink-0" style={{ background: KIND_COLOR[e.kind] }} />
              <span className="font-head font-semibold text-sm">{e.t}</span>
              <span className="font-mono2 text-[11px] text-[var(--cyan)] truncate">{e.repo}</span>
              <span className="ml-auto font-mono2 text-[10px] text-[var(--faint)] shrink-0">{e.when}</span>
            </div>
          </Reveal>
        ))}
      </div>

      <BlockTitle note="1,847 CONTRIBUTIONS · PAST YEAR">Contribution Pattern</BlockTitle>
      <Reveal>
        <div className="cyber-card clip-cy p-6 -mt-4 overflow-x-auto">
          <div className="flex gap-[3px] min-w-[640px]">
            {Array.from({ length: 52 }).map((_, w) => (
              <div key={w} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, d) => {
                  const seed = (w * 7 + d) * 2654435761 % 97;
                  const lvl = seed > 88 ? 4 : seed > 70 ? 3 : seed > 45 ? 2 : seed > 22 ? 1 : 0;
                  const bg = ['', 'rgba(0,240,255,0.22)', 'rgba(0,240,255,0.45)', 'rgba(0,240,255,0.72)', 'var(--cyan)'][lvl];
                  return <span key={d} className="w-2.5 h-2.5 rounded-[1px]" style={{ background: lvl === 0 ? 'var(--line)' : bg }} />;
                })}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 font-mono2 text-[9px] tracking-widest text-[var(--faint)]">
            LESS <span className="w-2.5 h-2.5" style={{ background: 'var(--line)' }} />
            {[0.22, 0.45, 0.72, 1].map((o) => <span key={o} className="w-2.5 h-2.5" style={{ background: `rgba(0,240,255,${o})` }} />)}
            MORE
          </div>
        </div>
      </Reveal>
      <PageCta title="Explore the full archive" to="collections" label="Browse collections" />
    </PageShell>
  );
}

/* ============ WRITING ============ */
export function WritingPage() {
  return (
    <PageShell route="writing">
      <div className="grid md:grid-cols-2 gap-5">
        {ARTICLES.map((a, i) => (
          <Reveal key={a.title} delay={i * 70}>
            <article className="cyber-card clip-cy sweep p-6 h-full flex flex-col gap-3.5 group cursor-pointer">
              <div className="flex items-center gap-3 font-mono2 text-[10px] tracking-[0.18em]">
                <span className="px-2 py-0.5 clip-tag border border-[var(--line-strong)] text-[var(--pink)] uppercase">{a.tag}</span>
                <span className="text-[var(--faint)]">{a.date}</span>
                <span className="text-[var(--faint)] ml-auto">{a.read}</span>
              </div>
              <h2 className="font-head font-bold text-lg leading-snug group-hover:text-[var(--cyan)] transition-colors">{a.title}</h2>
              <p className="text-[13px] text-[var(--dim)] leading-relaxed flex-1">{a.excerpt}</p>
              <span className="flex items-center gap-2 font-head font-bold tracking-[0.15em] uppercase text-[11px] text-[var(--cyan)] mt-1">
                <BookOpen size={13} /> Read article
              </span>
            </article>
          </Reveal>
        ))}
      </div>
      <PageCta title="Want these in your inbox?" to="contact" label="Subscribe to notes" />
    </PageShell>
  );
}

/* ============ TALKS ============ */
export function TalksPage() {
  return (
    <PageShell route="talks">
      <div className="space-y-4">
        {TALKS.map((t, i) => (
          <Reveal key={t.title} delay={i * 70}>
            <div className="cyber-card clip-cy sweep p-6 grid md:grid-cols-[190px_1fr] gap-6 items-start">
              <div className="flex flex-col gap-2">
                <span className="px-3 py-1 clip-tag font-mono2 text-[9px] tracking-[0.18em] uppercase text-[var(--cyan)] border border-[var(--line-strong)] w-fit">{t.type}</span>
                <span className="font-display font-black text-2xl grad-text">{t.year}</span>
              </div>
              <div>
                <h2 className="font-head font-bold text-lg leading-snug">{t.title}</h2>
                <div className="flex items-center gap-2 font-mono2 text-[10px] tracking-[0.18em] text-[var(--pink)] mt-1.5">
                  <Clapperboard size={11} /> {t.event.toUpperCase()}
                </div>
                <p className="mt-2.5 text-sm text-[var(--dim)] leading-relaxed">{t.note}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <PageCta title="Looking for a speaker?" label="Invite me" />
    </PageShell>
  );
}

/* ============ MENTORSHIP ============ */
export function MentorshipPage() {
  return (
    <PageShell route="mentorship">
      <Reveal>
        <p className="text-lg text-[var(--dim)] leading-relaxed max-w-3xl">
          Mentoring is the part of senior work with the longest half-life. I keep a small number of
          ongoing mentees so sessions stay practical — we work on your real code, not toy examples.
        </p>
      </Reveal>
      <BlockTitle note="SIX TRACKS">How We Can Work Together</BlockTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 -mt-4">
        {MENTOR_TRACKS.map((m, i) => (
          <Reveal key={m.title} delay={i * 70}>
            <div className="cyber-card clip-cy sweep p-6 h-full flex flex-col gap-3.5">
              <span className="w-11 h-11 clip-cy-sm border border-[var(--line)] flex items-center justify-center text-[var(--pink)]"><Lightbulb size={18} /></span>
              <h3 className="font-head font-bold text-base">{m.title}</h3>
              <p className="text-[13px] text-[var(--dim)] leading-relaxed flex-1">{m.detail}</p>
              <div className="pt-3 border-t border-[var(--line)] flex items-center justify-between font-mono2 text-[9px] tracking-[0.15em]">
                <span className="text-[var(--faint)] uppercase">{m.for}</span>
                <span className="text-[var(--cyan)]">{m.dur}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <PageCta title="Ready to level up?" label="Apply for mentorship" />
    </PageShell>
  );
}

/* ============ AWARDS ============ */
export function AwardsPage() {
  return (
    <PageShell route="awards">
      <div className="grid sm:grid-cols-2 gap-5">
        {AWARDS.map((a, i) => (
          <Reveal key={a.title} delay={i * 70}>
            <div className="cyber-card clip-cy sweep p-6 flex gap-5 items-start">
              <span className="w-12 h-12 clip-cy-sm bg-gradient-to-br from-[var(--yellow)] to-[var(--pink)] p-[1.5px] shrink-0">
                <span className="w-full h-full clip-cy-sm bg-[var(--bg-2)] flex items-center justify-center text-[var(--yellow)]"><Award size={20} /></span>
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-head font-bold text-base">{a.title}</h3>
                  <span className="font-mono2 text-[10px] text-[var(--cyan)]">{a.year}</span>
                </div>
                <div className="font-mono2 text-[10px] tracking-[0.18em] text-[var(--pink)] mt-1 uppercase">{a.org}</div>
                <p className="mt-2 text-[13px] text-[var(--dim)] leading-relaxed">{a.note}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <PageCta title="Recognised work you can verify" to="certificates" label="View certificates" />
    </PageShell>
  );
}

/* ============ LABS ============ */
export function LabsPage() {
  return (
    <PageShell route="labs">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {LABS.map((l, i) => (
          <Reveal key={l.title} delay={i * 70}>
            <Tilt max={6}>
              <div className="cyber-card clip-cy overflow-hidden h-full group">
                <div className="relative h-44 overflow-hidden">
                  <img src={l.img} alt={l.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 clip-tag font-mono2 text-[9px] tracking-[0.2em] border border-[var(--yellow)] text-[var(--yellow)]">{l.tag}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-head font-bold text-base">{l.title}</h3>
                  <p className="mt-2 text-[13px] text-[var(--dim)] leading-relaxed">{l.desc}</p>
                </div>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
      <PageCta title="Curious about an experiment?" label="Ask about it" />
    </PageShell>
  );
}

/* ============ DESIGN SYSTEM ============ */
export function DesignSystemPage() {
  return (
    <PageShell route="design-system">
      <BlockTitle note="TOKENS">Colour</BlockTitle>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 -mt-4">
        {COLOR_TOKENS.map((c, i) => (
          <Reveal key={c.name} delay={i * 50}>
            <div className="cyber-card clip-cy-sm overflow-hidden">
              <div className="h-20" style={{ background: c.hex, boxShadow: `0 0 26px ${c.hex}55` }} />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono2 text-[11px] text-[var(--cyan)]">{c.name}</span>
                  <span className="font-mono2 text-[10px] text-[var(--faint)]">{c.hex}</span>
                </div>
                <p className="mt-1.5 text-xs text-[var(--dim)]">{c.role}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <BlockTitle note="SCALE">Typography</BlockTitle>
      <div className="cyber-card clip-cy divide-y divide-[var(--line)] -mt-4">
        {TYPE_SCALE.map((t) => (
          <div key={t.token} className="grid sm:grid-cols-[140px_1fr_1fr] gap-3 px-5 py-4 items-baseline">
            <span className="font-display font-bold text-sm text-[var(--pink)]">{t.token}</span>
            <span className="font-mono2 text-[11px] text-[var(--cyan)]">{t.font}<span className="block text-[10px] text-[var(--faint)] mt-1">{t.size}</span></span>
            <span className="text-xs text-[var(--dim)]">{t.use}</span>
          </div>
        ))}
      </div>

      <BlockTitle note="RHYTHM">Spacing & Elevation</BlockTitle>
      <div className="grid sm:grid-cols-2 gap-5 -mt-4">
        <div className="cyber-card clip-cy p-6">
          <div className="flex items-center gap-2 font-mono2 text-[10px] tracking-[0.2em] text-[var(--cyan)] mb-5"><Ruler size={12} /> SPACING SCALE</div>
          <div className="space-y-3">
            {[
              ['4', '0.25rem'], ['8', '0.5rem'], ['12', '0.75rem'], ['16', '1rem'], ['24', '1.5rem'], ['40', '2.5rem'], ['64', '4rem'],
            ].map(([n, v]) => (
              <div key={n} className="flex items-center gap-4">
                <span className="font-mono2 text-[10px] text-[var(--faint)] w-8">{n}</span>
                <span className="h-3 bg-gradient-to-r from-[var(--cyan)] to-[var(--pink)]" style={{ width: v }} />
                <span className="font-mono2 text-[10px] text-[var(--dim)]">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="cyber-card clip-cy p-6">
          <div className="flex items-center gap-2 font-mono2 text-[10px] tracking-[0.2em] text-[var(--pink)] mb-5"><Palette size={12} /> ELEVATION & BORDERS</div>
          <div className="space-y-4">
            {[
              { l: 'Rest', s: 'none', b: '1px var(--line)' },
              { l: 'Hover', s: '0 18px 50px -18px cyan', b: '1px var(--line-strong)' },
              { l: 'Lifted', s: '0 0 22px cyan-soft', b: '1.5px cyan' },
              { l: 'Modal', s: '0 30px 80px -20px black', b: '2px line-strong' },
            ].map((e) => (
              <div key={e.l} className="flex items-center justify-between gap-4">
                <span className="font-head font-bold text-sm w-16">{e.l}</span>
                <span className="font-mono2 text-[9px] text-[var(--faint)] flex-1">{e.s}</span>
                <span className="font-mono2 text-[9px] text-[var(--dim)]">{e.b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BlockTitle note="MOTION">Interaction States</BlockTitle>
      <div className="cyber-card clip-cy divide-y divide-[var(--line)] -mt-4">
        {MOTION_TOKENS.map((m) => (
          <div key={m.token} className="grid sm:grid-cols-[160px_240px_1fr] gap-3 px-5 py-3.5 items-baseline">
            <span className="font-mono2 text-[11px] text-[var(--cyan)]">{m.token}</span>
            <span className="font-mono2 text-[10px] text-[var(--pink)]">{m.value}</span>
            <span className="text-xs text-[var(--dim)]">{m.use}</span>
          </div>
        ))}
      </div>
      <PageCta title="Want this system applied to your product?" label="Discuss a design system" />
    </PageShell>
  );
}

/* ============ ACCESSIBILITY ============ */
export function AccessibilityPage() {
  return (
    <PageShell route="accessibility">
      <Reveal>
        <p className="text-lg text-[var(--dim)] leading-relaxed max-w-3xl">
          Accessibility is not a phase at the end. This site is built so keyboard users, screen reader
          users and people who prefer reduced motion get an equivalent experience from the start.
        </p>
      </Reveal>
      <BlockTitle note="WCAG 2.1 AA">Audit Results</BlockTitle>
      <div className="grid sm:grid-cols-2 gap-4 -mt-4">
        {A11Y_CHECKS.map((c, i) => (
          <Reveal key={c.title} delay={i * 60}>
            <div className="cyber-card clip-cy-sm p-5 h-full border-l-2 !border-l-[var(--green)]">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-head font-bold text-[15px]">{c.title}</h3>
                <span className="px-2.5 py-0.5 clip-tag font-mono2 text-[9px] tracking-widest text-[var(--green)] border border-[var(--green)]">{c.status}</span>
              </div>
              <p className="mt-2.5 text-[13px] text-[var(--dim)] leading-relaxed">{c.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <BlockTitle note="TRY IT">Keyboard Shortcuts</BlockTitle>
      <div className="cyber-card clip-cy divide-y divide-[var(--line)] -mt-4">
        {[
          { k: 'Tab / Shift+Tab', d: 'Move between interactive elements in DOM order' },
          { k: '⌘K / Ctrl+K', d: 'Open the command palette to jump to any page' },
          { k: '↑ ↓ then ⏎', d: 'Navigate and open results inside the palette' },
          { k: 'Esc', d: 'Close the drawer, palette or lightbox viewer' },
          { k: '← →', d: 'Previous and next image inside the lightbox' },
        ].map((s) => (
          <div key={s.k} className="flex flex-wrap items-center gap-4 px-5 py-3.5">
            <kbd className="px-2.5 py-1 clip-tag border border-[var(--line-strong)] font-mono2 text-[10px] text-[var(--cyan)]">{s.k}</kbd>
            <span className="text-sm text-[var(--dim)]">{s.d}</span>
          </div>
        ))}
      </div>
      <PageCta title="Need an accessibility review of your app?" label="Book a review" to="pricing" />
    </PageShell>
  );
}

/* ============ LOCALIZATION ============ */
export function LocalizationPage() {
  return (
    <PageShell route="localization">
      <Reveal>
        <p className="text-lg text-[var(--dim)] leading-relaxed max-w-3xl">
          I work across Burmese, English and Thai. Localization is treated as an architectural
          concern — not a spreadsheet bolted on before release.
        </p>
      </Reveal>

      <BlockTitle note="COVERAGE">Supported Locales</BlockTitle>
      <div className="cyber-card clip-cy overflow-x-auto -mt-4">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-[var(--line)]">
              {['Locale', 'Native', 'Script', 'Coverage', 'Dir', 'Fallback'].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left font-mono2 text-[9px] tracking-[0.2em] text-[var(--faint)] uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {LOCALE_MATRIX.map((l) => (
              <tr key={l.code}>
                <td className="px-5 py-3.5 font-head font-bold text-[var(--cyan)]">{l.code}</td>
                <td className={`px-5 py-3.5 ${l.code === 'my' ? 'font-mm' : ''}`}>{l.native}</td>
                <td className="px-5 py-3.5 text-[var(--dim)]">{l.script}</td>
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-2">
                    <span className="w-16 h-1.5 bg-[var(--line)]"><span className="block h-full bg-[var(--green)]" style={{ width: l.coverage }} /></span>
                    <span className="font-mono2 text-[10px] text-[var(--green)]">{l.coverage}</span>
                  </span>
                </td>
                <td className="px-5 py-3.5 font-mono2 text-[11px] text-[var(--dim)]">{l.dir}</td>
                <td className="px-5 py-3.5 font-mono2 text-[11px] text-[var(--dim)]">{l.fallback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BlockTitle note="IMPLEMENTATION">How It Is Handled</BlockTitle>
      <div className="grid sm:grid-cols-2 gap-4 -mt-4">
        {L10N_NOTES.map((n, i) => <DefCard key={n.title} title={n.title} detail={n.detail} color={['var(--cyan)', 'var(--pink)', 'var(--yellow)', 'var(--violet)', 'var(--green)', 'var(--cyan)'][i]} />)}
      </div>
      <PageCta title="Shipping to Myanmar or Thailand?" label="Talk localization" />
    </PageShell>
  );
}

/* ============ LEGAL ============ */
export function LegalPage() {
  return (
    <PageShell route="legal">
      <div className="max-w-3xl space-y-12">
        {LEGAL_SECTIONS.map((s, i) => (
          <section key={s.title}>
            <Reveal>
              <h2 className="font-display font-bold text-xl uppercase tracking-wide flex items-center gap-4">
                <span className="font-mono2 text-[11px] text-[var(--pink)]">{String(i + 1).padStart(2, '0')}</span>
                <span className="kicker-line" />{s.title}
              </h2>
            </Reveal>
            <div className="mt-5 space-y-3.5">
              {s.body.map((b, j) => (
                <Reveal key={b} delay={j * 50}>
                  <p className="text-sm text-[var(--dim)] leading-relaxed pl-8">{b}</p>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="max-w-3xl mt-14">
        <Reveal>
          <div className="cyber-card clip-cy-sm p-5 flex items-center gap-4">
            <Wifi size={18} className="text-[var(--green)] shrink-0" />
            <p className="text-sm text-[var(--dim)]">Last updated February 2026 · Questions about any of this? Just ask.</p>
          </div>
        </Reveal>
      </div>
    </PageShell>
  );
}
