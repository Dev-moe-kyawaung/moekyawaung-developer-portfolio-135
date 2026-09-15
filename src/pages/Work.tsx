import { ArrowUpRight, GitBranch } from 'lucide-react';
import { PROJECTS } from '../data';
import { CASE_STUDIES as CS, CASE_STUDIES } from '../content';
import { Reveal } from '../components/ui';
import { PageShell, BlockTitle, MetricCard, NumberedRow, TagRow, PageCta } from '../components/pageshell';
import { Lightbox } from '../components/premium';
import { Tilt } from '../components/fx';

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function ProjectPage({ slug }: { slug: string }) {
  const p = PROJECTS.find((x) => slugify(x.title) === slug);
  if (!p) return <PageShell route="projects"><p className="text-[var(--dim)]">Project not found.</p></PageShell>;
  const related = PROJECTS.filter((x) => x.cat === p.cat && x.title !== p.title).slice(0, 3);

  return (
    <PageShell route="projects">
      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-10">
        <div>
          <Reveal><div className="rounded-[20px] overflow-hidden border border-[var(--line)] bg-[var(--bg-2)]"><img src={p.img} alt={p.title} className="w-full h-[320px] sm:h-[440px] object-cover" /></div></Reveal>
          <Reveal delay={80}><p className="mt-8 font-news text-[18px] leading-[1.7] italic text-[var(--dim)]">{p.desc}</p></Reveal>
          <BlockTitle note="Implementation">Build notes</BlockTitle>
          <div className="space-y-3 -mt-4">
            {[
              { t: 'Architecture', d: `Multi-module ${p.cat} project — feature modules own UI, domain, data slices, depend only on contracts.` },
              { t: 'State & Data', d: 'Unidirectional flow, immutable state. Repositories expose streams backed by local cache.' },
              { t: 'Performance', d: 'Deferred init, stable models, granular rebuild scopes. Measured on 2019 mid-range device.' },
              { t: 'Delivery', d: 'CI runs lint, tests, signed build on every PR, staged rollout on merge.' },
            ].map((x, i) => <NumberedRow key={x.t} n={i + 1} title={x.t} detail={x.d} />)}
          </div>
          <PageCta title="Need something like this built?" label="Discuss your project" />
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 h-fit">
          <Reveal>
            <div className="rounded-[16px] border border-[var(--line)] bg-[var(--panel)] p-6 space-y-4">
              <div><div className="font-mono2 text-[10px] tracking-[0.16em] uppercase text-[var(--faint)]">Paper</div><h2 className="font-head text-[18px] mt-1">{p.title}</h2></div>
              <TagRow items={p.tags} />
              <div className="flex flex-col gap-2 pt-2">
                <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-primary justify-center h-10"><GitBranch size={14} /> View source</a>
                <a href="https://github.com/moekyawaung-tech/" target="_blank" rel="noreferrer" className="btn btn-ghost justify-center h-10">More repos</a>
              </div>
            </div>
          </Reveal>
        </aside>
      </div>
      {related.length > 0 && (
        <>
          <BlockTitle note="Same stack">Related papers</BlockTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((r) => (
              <Reveal key={r.title}>
                <Tilt>
                  <a href={`#/project/${slugify(r.title)}`} className="rounded-[16px] border border-[var(--line)] bg-[var(--panel)] overflow-hidden block group">
                    <img src={r.img} alt={r.title} className="w-full h-40 object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                    <div className="p-5"><h3 className="font-head text-[15px] flex items-center justify-between">{r.title}<ArrowUpRight size={14} className="text-[var(--faint)]" /></h3><p className="mt-2 text-[12px] leading-[1.6] text-[var(--dim)] line-clamp-2">{r.desc}</p></div>
                  </a>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}

export function CaseStudiesPage() {
  return (
    <PageShell route="case-studies">
      <div className="space-y-4">
        {CS.map((cs, i) => (
          <Reveal key={cs.slug} delay={i * 60}>
            <a href={`#/case-study/${cs.slug}`} className="rounded-[20px] border border-[var(--line)] bg-[var(--panel)] overflow-hidden grid md:grid-cols-[0.9fr_1.1fr] group hover:border-[var(--line-strong)] transition-colors">
              <div className="h-56 md:h-full overflow-hidden bg-[var(--bg-2)]"><img src={cs.hero} alt={cs.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" /></div>
              <div className="p-7 sm:p-8 flex flex-col gap-3">
                <div className="font-mono2 text-[10px] tracking-[0.16em] uppercase text-[var(--faint)]">{cs.year} · {cs.role} · {cs.duration}</div>
                <h2 className="font-display text-[24px] leading-[1.05] tracking-[-0.02em]">{cs.title}</h2>
                <p className="text-[13.5px] leading-[1.6] text-[var(--dim)]">{cs.sub}</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {cs.metrics.slice(0, 2).map((m) => <div key={m.label} className="rounded-[10px] border border-[var(--line-faint)] bg-[var(--panel-soft)] px-3 py-2"><div className="font-mono2 text-[9px] uppercase text-[var(--faint)]">{m.label}</div><div className="font-display text-[14px] mt-1">{m.delta}</div></div>)}
                </div>
                <span className="mt-auto inline-flex items-center gap-2 text-[12px] font-medium">Read paper <ArrowUpRight size={14} /></span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
      <PageCta title="Have a problem worth a paper?" />
    </PageShell>
  );
}

export function CaseStudyPage({ slug }: { slug: string }) {
  const cs = CASE_STUDIES.find((x) => x.slug === slug);
  if (!cs) return <PageShell route="case-studies"><p className="text-[var(--dim)]">Case study not found.</p></PageShell>;

  return (
    <PageShell route="case-studies">
      <Reveal><div className="rounded-[20px] overflow-hidden border border-[var(--line)] bg-[var(--bg-2)]"><img src={cs.hero} alt={cs.title} className="w-full h-[280px] sm:h-[420px] object-cover" /></div></Reveal>
      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-10 mt-10">
        <div>
          <BlockTitle note="Challenge">Problem</BlockTitle>
          <Reveal><p className="text-[14px] leading-[1.7] text-[var(--dim)] -mt-4 max-w-[60ch]">{cs.problem}</p></Reveal>
          <BlockTitle note="Method">Approach</BlockTitle>
          <div className="space-y-3 -mt-4">{cs.approach.map((a, i) => <NumberedRow key={a} n={i + 1} title={`Step ${i + 1}`} detail={a} />)}</div>
          <BlockTitle note="Architecture">System design</BlockTitle>
          <div className="grid sm:grid-cols-2 gap-3 -mt-4">
            {cs.architecture.map((a) => <div key={a.layer} className="rounded-[14px] border border-[var(--line)] bg-[var(--panel)] p-5"><h3 className="font-head text-[13px]">{a.layer}</h3><p className="mt-2 text-[12.5px] leading-[1.6] text-[var(--dim)]">{a.detail}</p></div>)}
          </div>
          <BlockTitle note="Measured">Metrics</BlockTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 -mt-4">{cs.metrics.map((m) => <MetricCard key={m.label} {...m} />)}</div>
          <BlockTitle note="Gallery">Screens</BlockTitle>
          <Reveal><Lightbox images={cs.gallery} /></Reveal>
          <BlockTitle note="Reflection">Lessons</BlockTitle>
          <ul className="space-y-3 -mt-4">
            {cs.lessons.map((l, i) => (
              <Reveal key={l} delay={i * 50}><li className="rounded-[12px] border border-[var(--line)] bg-[var(--panel)] p-4 flex gap-3"><span className="font-mono2 text-[11px] text-[var(--faint)]">{String(i + 1).padStart(2, '0')}</span><p className="text-[13px] leading-[1.6] text-[var(--dim)]">{l}</p></li></Reveal>
            ))}
          </ul>
          <PageCta title="Want this level of rigour on your app?" />
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 h-fit">
          <div className="rounded-[16px] border border-[var(--line)] bg-[var(--panel)] p-6 space-y-4">
            <div><div className="font-mono2 text-[10px] uppercase tracking-[0.16em] text-[var(--faint)]">Case study</div><h2 className="font-head text-[16px] mt-1 leading-tight">{cs.title}</h2><p className="mt-2 text-[12.5px] leading-[1.6] text-[var(--dim)]">{cs.sub}</p></div>
            <div className="border-t border-[var(--line-faint)] pt-4 space-y-2">
              <div className="flex justify-between text-[12px]"><span className="font-mono2 text-[10px] uppercase text-[var(--faint)]">Role</span><span>{cs.role}</span></div>
              <div className="flex justify-between text-[12px]"><span className="font-mono2 text-[10px] uppercase text-[var(--faint)]">Duration</span><span>{cs.duration}</span></div>
              <div className="flex justify-between text-[12px]"><span className="font-mono2 text-[10px] uppercase text-[var(--faint)]">Year</span><span>{cs.year}</span></div>
            </div>
            <div className="border-t border-[var(--line-faint)] pt-4"><div className="font-mono2 text-[10px] uppercase tracking-[0.14em] text-[var(--faint)] mb-2">Stack</div><TagRow items={cs.stack} /></div>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
