import { PROFILE, TIMELINE } from '../data';
import { Reveal, SectionHead } from './ui';

const INFO = [
  { k: 'Full Name', v: 'Moe Kyaw Aung · မိုးကျော်အောင်' },
  { k: 'Role', v: 'Senior Android Architect' },
  { k: 'Location', v: 'Tachileik, MM ↔ Bangkok, TH' },
  { k: 'Languages', v: 'Burmese · English · Kotlin' },
  { k: 'Focus', v: 'Architecture · Performance · Delivery' },
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-[1440px] px-6 lg:px-10 py-24 md:py-32">
      <SectionHead
        index="01"
        kicker="About · profile"
        title={<>Twelve years, one<br /><span className="grad-text">clear architecture</span></>}
        desc="Senior Android engineer across Kotlin, Jetpack Compose and Flutter — building systems that stay legible to the team that inherits them, measured on hardware people actually own."
      />

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-start">
        <div className="space-y-6">
          <Reveal>
            <p className="font-news text-[19px] leading-[1.7] text-[var(--txt-soft)]">
              I’m a Senior Android Developer who builds apps with strong architecture, careful performance tuning, and practical collaboration.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-[15px] leading-[1.8] text-[var(--dim)] max-w-[60ch]">
              With nearly 12 years of hands-on experience, I focus on codebases that teams can understand, test, and extend. Clear boundaries, reliable data flow, stable releases. I prefer building systems that behave well on real devices — not just in demos.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="mt-8 p-6 rounded-[16px] bg-[var(--panel-soft)] border border-[var(--line)]">
              <p className="font-display text-[22px] leading-[1.3] tracking-[-0.02em]">“Code with culture. Build with purpose.”</p>
              <p className="mt-3 font-mono2 text-[10px] tracking-[0.18em] uppercase text-[var(--faint)]">— Personal philosophy</p>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="grid sm:grid-cols-2 gap-3 pt-4">
              {[
                { l: 'Mobile', v: 'Kotlin · Compose · MVVM · Clean Arch' },
                { l: 'Backend', v: 'Firebase · REST APIs · Python' },
                { l: 'Security', v: 'Ethical Hacking · Cybersecurity' },
                { l: 'AI / ML', v: 'Claude API · TFLite · On-Device ML' },
              ].map((f) => (
                <div key={f.l} className="rounded-[12px] border border-[var(--line)] p-4 bg-[var(--panel)]">
                  <div className="font-mono2 text-[10px] tracking-[0.16em] uppercase text-[var(--faint)]">{f.l}</div>
                  <div className="mt-1.5 text-[13px] text-[var(--txt-soft)] leading-[1.5]">{f.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="space-y-5 lg:sticky lg:top-24">
          <Reveal variant="right">
            <div className="rounded-[20px] overflow-hidden border border-[var(--line)] bg-[var(--bg-2)]">
              <img src="https://res.cloudinary.com/dye5qpwii/image/upload/v1778763535/MKA_25_lbx6fb.webp" alt="Moe Kyaw Aung" className="w-full h-[380px] object-cover" loading="lazy" />
              <div className="p-5 flex items-center justify-between">
                <div>
                  <div className="font-head text-[14px]">{PROFILE.name}</div>
                  <div className="font-mono2 text-[10px] tracking-[0.16em] text-[var(--faint)] mt-1 uppercase">Senior Android Architect · Est. 2014</div>
                </div>
                <div className="font-mono2 text-[10px] px-2.5 py-1 rounded-full border border-[var(--line)] text-[var(--faint)]">{PROFILE.currentlyBuilding}</div>
              </div>
            </div>
          </Reveal>

          <Reveal variant="right" delay={120}>
            <div className="rounded-[16px] border border-[var(--line)] divide-y divide-[var(--line-faint)] overflow-hidden bg-[var(--panel)]">
              {INFO.map((i) => (
                <div key={i.k} className="flex items-center justify-between px-5 py-3.5">
                  <span className="font-mono2 text-[10px] tracking-[0.14em] uppercase text-[var(--faint)]">{i.k}</span>
                  <span className="text-[13px] text-[var(--txt-soft)] text-right">{i.v}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* timeline — minimal */}
      <div className="mt-24">
        <Reveal>
          <h3 className="font-display text-[26px] tracking-[-0.02em] mb-10">Chronicle — 2014 → 2026</h3>
        </Reveal>
        <div className="relative">
          <div className="tl-line left-[5px] md:left-1/2" />
          <div className="space-y-8">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 60}>
                <div className={`relative pl-10 md:pl-0 md:grid md:grid-cols-2 md:gap-16 ${i % 2 === 0 ? '' : ''}`}>
                  <span className="tl-dot left-0 md:left-1/2 md:-translate-x-1/2 top-2" />
                  <div className={`${i % 2 === 0 ? 'md:col-start-1 md:text-right' : 'md:col-start-2'}`}>
                    <div className="inline-block text-left rounded-[14px] border border-[var(--line)] bg-[var(--panel)] p-5 max-w-[520px]">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-display text-[20px] tracking-tight">{t.year}</span>
                        <span className="font-mono2 text-[10px] px-2 py-0.5 rounded-full border border-[var(--line)] text-[var(--faint)]">{t.impact}</span>
                      </div>
                      <div className="mt-2 font-head text-[15px]">{t.title}</div>
                      <div className="font-mono2 text-[10px] tracking-[0.14em] uppercase text-[var(--faint)] mt-1">{t.org}</div>
                      <p className="mt-2 text-[13px] leading-[1.6] text-[var(--dim)]">{t.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
