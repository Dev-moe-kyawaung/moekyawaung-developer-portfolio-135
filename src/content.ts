/* ============================================================
   DEEP PAGE CONTENT — powers the 30-page site structure
   ============================================================ */
import { IMAGES } from './data';

/* ---------- NAVIGATION MAP (site IA) ---------- */
export interface NavGroup { group: string; items: { label: string; to: string; mm?: string }[]; }
export const NAV_GROUPS: NavGroup[] = [
  {
    group: 'Core',
    items: [
      { label: 'Home', to: '', mm: 'ပင်မ' },
      { label: 'About', to: 'about', mm: 'အကြောင်း' },
      { label: 'Resume', to: 'resume', mm: 'ရီဇျူမေ' },
      { label: 'Experience', to: 'experience', mm: 'အတွေ့အကြုံ' },
      { label: 'Contact', to: 'contact', mm: 'ဆက်သွယ်' },
    ],
  },
  {
    group: 'Craft',
    items: [
      { label: 'Skills', to: 'skills', mm: 'ကျွမ်းကျင်မှု' },
      { label: 'Tech Stack', to: 'tech-stack', mm: 'နည်းပညာ' },
      { label: 'Flutter Architecture', to: 'flutter-architecture' },
      { label: 'Cross-Platform', to: 'architecture' },
      { label: 'Performance', to: 'performance' },
      { label: 'Blueprints', to: 'blueprints', mm: 'အင်ဂျင်နီယာချပ်' },
    ],
  },
  {
    group: 'Work',
    items: [
      { label: 'Projects', to: 'projects', mm: 'ပရောဂျက်' },
      { label: 'Case Studies', to: 'case-studies' },
      { label: 'Certificates', to: 'certificates', mm: 'လက်မှတ်' },
      { label: 'Collections', to: 'collections', mm: 'စုစည်းမှု' },
      { label: 'Labs', to: 'labs' },
    ],
  },
  {
    group: 'Community',
    items: [
      { label: 'Open Source', to: 'open-source' },
      { label: 'GitHub Activity', to: 'github' },
      { label: 'Writing', to: 'writing' },
      { label: 'Talks', to: 'talks' },
      { label: 'Mentorship', to: 'mentorship' },
    ],
  },
  {
    group: 'Engage',
    items: [
      { label: 'Services', to: 'services' },
      { label: 'Pricing', to: 'pricing', mm: 'ဈေးနှုန်း' },
      { label: 'Testimonials', to: 'testimonials' },
      { label: 'Awards', to: 'awards' },
      { label: 'FAQ', to: 'faq', mm: 'မေးခွန်း' },
    ],
  },
  {
    group: 'System',
    items: [
      { label: 'Design System', to: 'design-system' },
      { label: 'Accessibility', to: 'accessibility' },
      { label: 'Localization', to: 'localization' },
      { label: 'Legal', to: 'legal' },
    ],
  },
];

/* ---------- CASE STUDIES (deep dives) ---------- */
export interface Metric { label: string; before: string; after: string; delta: string; }
export interface CaseStudy {
  slug: string; title: string; sub: string; hero: string; year: string;
  role: string; duration: string; stack: string[];
  problem: string; approach: string[]; architecture: { layer: string; detail: string }[];
  metrics: Metric[]; outcome: string[]; lessons: string[];
  gallery: { src: string; caption: string }[];
}
export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'mobile-commerce',
    title: 'Mobile Commerce Redesign',
    sub: 'Rebuilt a cluttered shopping experience into a faster, clearer, higher-converting cross-platform flow.',
    hero: IMAGES.copilot1, year: '2025', role: 'Lead Mobile Engineer', duration: '14 weeks',
    stack: ['Dart', 'Flutter', 'Riverpod', 'Modular Architecture', 'Firebase', 'REST'],
    problem: 'The legacy app had grown organically for three years. Checkout required seven taps, product lists janked on mid-range devices, and 34% of carts were abandoned before payment. Two teams were shipping conflicting UI patterns because there was no shared design layer.',
    approach: [
      'Audited every screen against funnel analytics to find the four flows that drove 80% of revenue.',
      'Extracted a shared design-system package so both Android and iOS render from one widget contract.',
      'Rebuilt checkout as a single resumable state machine — survives process death and app restarts.',
      'Moved product feeds to a cached repository layer with request de-duplication and optimistic UI.',
    ],
    architecture: [
      { layer: 'Presentation', detail: 'Feature-first widget modules; zero business logic in widgets; adaptive layouts for tablet and foldables.' },
      { layer: 'Domain', detail: 'Pure Dart use-cases for cart, pricing and checkout — unit tested with no framework imports.' },
      { layer: 'Data', detail: 'Repository pattern over REST + Firestore; TTL cache, de-duplicated streams, offline queue for mutations.' },
      { layer: 'Platform', detail: 'Platform channels for native payment sheets, biometric prompt and camera.' },
    ],
    metrics: [
      { label: 'Checkout taps', before: '7', after: '3', delta: '-57%' },
      { label: 'Cold start', before: '3.1s', after: '1.4s', delta: '-55%' },
      { label: 'Cart abandonment', before: '34%', after: '19%', delta: '-15pt' },
      { label: 'Frame drops / scroll', before: '41', after: '3', delta: '-93%' },
    ],
    outcome: [
      'Conversion up 23% within the first release month across both platforms.',
      'One codebase now serves Android and iOS — release cadence moved from monthly to weekly.',
      'New engineers ship a production feature in week two instead of week six.',
    ],
    lessons: [
      'A shared widget contract is worth more than a shared theme — patterns diverge faster than colors.',
      'Resumable checkout state removed an entire class of support tickets overnight.',
      'De-duplicating feed requests did more for perceived speed than any UI optimisation.',
    ],
    gallery: [
      { src: IMAGES.copilot1, caption: 'Adaptive product grid — tablet and foldable layouts' },
      { src: IMAGES.copilot4, caption: 'Resumable checkout state machine' },
      { src: IMAGES.copilot2, caption: 'Cached repository layer with offline queue' },
      { src: IMAGES.mka22, caption: 'Design-system widget library' },
    ],
  },
  {
    slug: 'offline-first',
    title: 'Offline-First Field App',
    sub: 'A resilient Flutter workflow for teams operating in low-connectivity environments.',
    hero: IMAGES.copilot3, year: '2024', role: 'Mobile Architect', duration: '20 weeks',
    stack: ['Flutter', 'Drift / SQLite', 'Sync Engine', 'Conflict Resolution', 'Background Tasks'],
    problem: 'Field technicians worked in basements, rural sites and ships with no reliable signal. The existing app showed a spinner or silently failed, so crews reverted to paper. Data entered offline was lost on crash, and two technicians editing the same job produced contradictory records.',
    approach: [
      'Designed a local-first data layer where the SQLite database is the single source of truth — the network is a sync mechanism, not a requirement.',
      'Built a change-log with monotonic sequence numbers and last-write-wins-registrable field merging.',
      'Queued every mutation as an idempotent operation with a client-generated UUID to make retries safe.',
      'Added a visible sync status surface so crews always know what is saved locally versus uploaded.',
    ],
    architecture: [
      { layer: 'Sync Engine', detail: 'Change-log + sequence numbers; exponential backoff; idempotent replay on reconnect.' },
      { layer: 'Conflict Resolution', detail: 'Field-level LWW with server arbitration; auditable merge history retained 90 days.' },
      { layer: 'Storage', detail: 'Drift over SQLite; schema migrations tested forward and backward; encrypted at rest.' },
      { layer: 'Background', detail: 'OS-aware background scheduling — WorkManager on Android, BGTaskScheduler on iOS.' },
    ],
    metrics: [
      { label: 'Offline task completion', before: '48%', after: '97%', delta: '+49pt' },
      { label: 'Data loss incidents', before: 'daily', after: 'zero', delta: 'eliminated' },
      { label: 'Sync conflicts / week', before: '310', after: '6', delta: '-98%' },
      { label: 'Battery drain / hour', before: '11%', after: '4%', delta: '-64%' },
    ],
    outcome: [
      'Field crews completed 97% of jobs fully offline — paper fallback retired entirely.',
      'Support calls about "lost work" dropped from daily to effectively zero.',
      'The sync engine became a reusable internal package adopted by two other products.',
    ],
    lessons: [
      'Local-first is a product decision, not a technical one — the UI must assume offline is normal.',
      'Idempotent operations are non-negotiable; the network will retry when you least expect it.',
      'Showing sync truthfully builds more trust than hiding failure behind a spinner.',
    ],
    gallery: [
      { src: IMAGES.copilot3, caption: 'Sync status surface — local truth vs server truth' },
      { src: IMAGES.copilot5, caption: 'Change-log inspector used in QA' },
      { src: IMAGES.copilot7, caption: 'Conflict resolution flow' },
      { src: IMAGES.mka3, caption: 'Field-mode UI — large targets, high contrast' },
    ],
  },
  {
    slug: 'operations-companion',
    title: 'Internal Operations Companion',
    sub: 'A mobile tool for fast approvals, alerts and operational task handling on the go.',
    hero: IMAGES.copilot6, year: '2025', role: 'Senior Android Developer', duration: '10 weeks',
    stack: ['Kotlin', 'Jetpack Compose', 'Material 3', 'Hilt', 'Firebase FCM', 'Room'],
    problem: 'Approvals that took minutes on desktop were taking hours because managers were away from their desks. Alerts arrived by email and were buried. The operations team needed sub-30-second decisions from a phone, with an audit trail that satisfied compliance.',
    approach: [
      'Reduced every approval to a single card: context, risk, amount, and two actions.',
      'Used FCM high-priority channels with proper notification categorisation and quiet-hours respect.',
      'Built an immutable audit log — every decision recorded with actor, timestamp and device context.',
      'Shipped an analytics surface so leadership could see where approvals were actually bottlenecked.',
    ],
    architecture: [
      { layer: 'UI', detail: 'Compose + Material 3; unidirectional data flow; state hoisted to ViewModels.' },
      { layer: 'State', detail: 'MVI-inspired intents; single AppState per screen; time-travel friendly.' },
      { layer: 'Data', detail: 'Room cache + Retrofit; paging for long approval histories.' },
      { layer: 'Delivery', detail: 'GitHub Actions → internal app distribution channel with staged rollout.' },
    ],
    metrics: [
      { label: 'Median approval time', before: '4h 20m', after: '38s', delta: '-99%' },
      { label: 'Push opt-in', before: '61%', after: '94%', delta: '+33pt' },
      { label: 'APK size', before: '38 MB', after: '17 MB', delta: '-55%' },
      { label: 'Crash-free sessions', before: '97.2%', after: '99.9%', delta: '+2.7pt' },
    ],
    outcome: [
      'Median decision time fell from over four hours to under one minute.',
      'Operations unblocked 3× more work per week with the same headcount.',
      'The audit log passed compliance review on first submission.',
    ],
    lessons: [
      'Reducing a decision to one card is the hardest design work — and the highest leverage.',
      'Notification respect (channels, quiet hours) directly drives opt-in rates.',
      'An immutable audit log is cheap to build early and impossible to retrofit honestly.',
    ],
    gallery: [
      { src: IMAGES.copilot6, caption: 'Single-card approval surface' },
      { src: IMAGES.copilot2, caption: 'Alert categorisation and quiet hours' },
      { src: IMAGES.copilot4, caption: 'Immutable audit trail view' },
      { src: IMAGES.preview1, caption: 'Bottleneck analytics for leadership' },
    ],
  },
];

/* ---------- RESUME ---------- */
export const RESUME_SUMMARY =
  'Senior Android / Flutter Developer with nearly 12 years building production mobile products. Strong in Kotlin, Jetpack Compose, MVVM/MVI and Clean Architecture, with deep Firebase and REST integration experience. I improve performance measurably, set up CI/CD that teams trust, and support engineers through architecture decisions and long-term maintenance.';

export const RESUME_SKILLS = [
  { group: 'Android', items: ['Kotlin', 'Jetpack Compose', 'ViewModel', 'Room', 'Paging 3', 'Navigation', 'WorkManager', 'Material 3'] },
  { group: 'Architecture', items: ['Clean Architecture', 'MVVM', 'MVI', 'Multi-module', 'SOLID', 'Feature modules'] },
  { group: 'Cross-Platform', items: ['Flutter', 'Dart', 'Riverpod', 'BLoC', 'KMM', 'Platform Channels'] },
  { group: 'Backend & Cloud', items: ['Firebase Auth', 'Firestore', 'FCM', 'Crashlytics', 'REST', 'Retrofit', 'OkHttp'] },
  { group: 'Quality', items: ['JUnit', 'Espresso', 'MockK', 'Turbine', 'Dependency Injection', 'Code Review'] },
  { group: 'Delivery', items: ['GitHub Actions', 'Fastlane', 'Azure DevOps', 'Gradle', 'R8', 'Staged Rollout'] },
];

export const RESUME_EDUCATION = [
  { year: '2013', title: 'B.Sc. Computer Science', org: 'University of Mandalay', note: 'Final year project — first Android app shipped to Play Store.' },
  { year: '2020', title: 'Google Developers Launchpad', org: 'Google — Android', note: 'Advanced Jetpack, Kotlin coroutines and architecture tracks.' },
];

/* ---------- TECH STACK LAYERS ---------- */
export const STACK_LAYERS = [
  {
    layer: 'Presentation',
    color: 'var(--cyan)',
    items: ['Jetpack Compose', 'Material 3', 'Navigation Compose', 'Flutter Widgets', 'Adaptive Layouts', 'Motion & Transitions'],
  },
  {
    layer: 'State & Domain',
    color: 'var(--pink)',
    items: ['ViewModel', 'StateFlow', 'MVI Intents', 'Use-Cases', 'Riverpod', 'Coroutines & Flow'],
  },
  {
    layer: 'Data',
    color: 'var(--yellow)',
    items: ['Room / SQLite', 'Retrofit + OkHttp', 'Paging 3', 'Firestore', 'DataStore', 'Sync Engine'],
  },
  {
    layer: 'Platform & Native',
    color: 'var(--violet)',
    items: ['Platform Channels', 'CameraX', 'ML Kit', 'Biometric', 'FCM', 'Background Tasks'],
  },
  {
    layer: 'Quality & Delivery',
    color: 'var(--green)',
    items: ['JUnit 5', 'Espresso', 'MockK', 'GitHub Actions', 'Fastlane', 'R8 / ProGuard'],
  },
  {
    layer: 'Collaboration',
    color: 'var(--cyan)',
    items: ['Figma', 'Design Tokens', 'ADR Records', 'Code Review', 'Mentoring', 'Agile / Scrum'],
  },
];

/* ---------- PERFORMANCE PAGE ---------- */
export const PERF_AREAS = [
  { icon: 'Gauge', title: 'Frame Smoothness', detail: 'Baseline profiles, lazy list keys, deferred reads and stable models keep scroll at 60fps on 2GB devices.', metric: '3 dropped frames / scroll', tool: 'Macrobenchmark · Perfetto' },
  { icon: 'Timer', title: 'Startup Time', detail: 'App Startup Profile, deferred initialisation and baseline profiles cut cold start by more than half.', metric: '1.4s cold start', tool: 'Baseline Profile · Traceview' },
  { icon: 'Cpu', title: 'Memory', detail: 'LeakCanary in every build, weak references for listeners, bitmap pooling and lifecycle-aware caching.', metric: 'Zero production leaks', tool: 'LeakCanary · Memory Profiler' },
  { icon: 'Battery', title: 'Battery Impact', detail: 'Batched sync windows, WorkManager constraints and alarm-free scheduling reduce wakeups dramatically.', metric: '4% / hour drain', tool: 'Battery Historian' },
  { icon: 'Rows3', title: 'List Rendering', detail: 'Paging 3, contentType hints, stable keys and fixed-size item contracts for large data sets.', metric: '10k items, no jank', tool: 'Paging 3 · Composition Tracing' },
  { icon: 'Smartphone', title: 'Real Device Behaviour', detail: 'Every release tested on a 2019 mid-ranger before rollout — not just the flagship on the desk.', metric: '6-device test matrix', tool: 'Firebase Test Lab' },
];

/* ---------- OPEN SOURCE ---------- */
export const OSS = [
  { name: 'Compose Neon Kit', desc: 'A themed set of Compose components with neon gradient tokens and motion presets.', why: 'Cuts two days of styling work from every new project kickoff.', stars: 842, lang: 'Kotlin' },
  { name: 'SyncLog', desc: 'A debug surface that visualises offline change-logs and conflict resolution in real time.', why: 'Turns invisible sync behaviour into something QA can actually verify.', stars: 415, lang: 'Kotlin' },
  { name: 'Ktor Mock Rail', desc: 'Retrofit-compatible mock server for deterministic integration tests without a backend.', why: 'Made flaky network tests disappear across three teams.', stars: 268, lang: 'Kotlin' },
  { name: 'MM Locale Tools', desc: 'Burmese/Thai string linting — catches missing translations and script-direction issues at build time.', why: 'Prevents shipping half-translated releases to real users.', stars: 193, lang: 'Python' },
  { name: 'Baseline Profiler Action', desc: 'A GitHub Action that generates and commits baseline profiles on every release branch.', why: 'Removes a manual, frequently-forgotten performance step.', stars: 156, lang: 'YAML' },
  { name: 'Docs · Flutter Architecture Guide', desc: 'Long-form contribution to a community architecture guide with worked examples.', why: 'Documentation improvements compound — this is referenced weekly.', stars: 0, lang: 'Markdown' },
];

/* ---------- GITHUB ACTIVITY ---------- */
export const GH_EVENTS = [
  { t: 'Pushed 6 commits', repo: 'moekyawaung-tech/POS-Ultimate-Pro-Max', when: '2h ago', kind: 'push' },
  { t: 'Merged PR #148 — modular :feature:checkout', repo: 'moekyawaung-tech/social-dashboard', when: '6h ago', kind: 'pr' },
  { t: 'Opened issue — Paging 3 contentType regression', repo: 'moekyawaung-tech/Job-Portal-App', when: '1d ago', kind: 'issue' },
  { t: 'Released v3.2.0', repo: 'moekyawaung-tech/video-player', when: '2d ago', kind: 'release' },
  { t: 'Pushed 11 commits', repo: 'moekyawaung-tech/pwa-app', when: '3d ago', kind: 'push' },
  { t: 'Reviewed PR #146', repo: 'moekyawaung-tech/Weather-app', when: '4d ago', kind: 'review' },
  { t: 'Released v1.9.4 — crash fix', repo: 'moekyawaung-tech/Lens-lite', when: '5d ago', kind: 'release' },
  { t: 'Merged PR #141 — Compose migration phase 2', repo: 'moekyawaung-tech/game-collection', when: '1w ago', kind: 'pr' },
];

export const GH_PINNED = [
  { name: 'POS-Ultimate-Pro-Max', desc: 'Full point-of-sale suite — inventory, receipts, thermal printing.', stars: '1.2k', forks: '214', lang: 'Kotlin' },
  { name: 'social-dashboard', desc: 'Real-time social analytics with Compose and Firebase streams.', stars: '864', forks: '112', lang: 'Kotlin' },
  { name: 'video-player', desc: 'ExoPlayer media app with PiP and background playback service.', stars: '742', forks: '98', lang: 'Kotlin' },
  { name: 'Job-Portal-App', desc: 'Cross-platform job board built in Flutter with recruiter messaging.', stars: '591', forks: '87', lang: 'Dart' },
  { name: 'pwa-app', desc: 'Installable PWA with offline support and push notifications.', stars: '438', forks: '64', lang: 'TypeScript' },
  { name: 'Weather-app', desc: 'Forecast app with Retrofit and animated Compose weather scenes.', stars: '402', forks: '51', lang: 'Kotlin' },
];

/* ---------- WRITING ---------- */
export const ARTICLES = [
  { title: 'Resumable Checkout: A State Machine That Survives Anything', date: 'Feb 2026', read: '9 min', tag: 'Architecture', excerpt: 'Process death, low memory and user multitasking should never cost a sale. Here is the state machine I use for every checkout flow.' },
  { title: 'Local-First Is a Product Decision', date: 'Jan 2026', read: '7 min', tag: 'Offline', excerpt: 'The hardest part of offline-first is not sync — it is convincing the UI to treat offline as the normal case.' },
  { title: 'What Actually Moved Our Cold Start from 3.1s to 1.4s', date: 'Dec 2025', read: '11 min', tag: 'Performance', excerpt: 'Baseline profiles, deferred init and one embarrassing mistake. A measured breakdown with traces.' },
  { title: 'One Codebase, Two Platforms, Zero Excuses', date: 'Nov 2025', read: '8 min', tag: 'Cross-Platform', excerpt: 'Where Flutter shared code genuinely wins, and where native remains non-negotiable.' },
  { title: 'The Architecture Decision Record Habit', date: 'Oct 2025', read: '6 min', tag: 'Delivery', excerpt: 'One page per decision has saved more onboarding hours than any tooling we have bought.' },
  { title: 'De-Duplicating Streams: The Optimisation Nobody Talks About', date: 'Sep 2025', read: '5 min', tag: 'Performance', excerpt: 'A single request de-duplicator did more for perceived speed than a month of UI tuning.' },
];

/* ---------- TALKS ---------- */
export const TALKS = [
  { title: 'Compose at Scale — Migrating Without Stopping', event: 'Android Dev Summit MM · Yangon', year: '2025', type: 'Conference', note: 'How we migrated a 400-screen app to Compose screen by screen, with no feature freeze.' },
  { title: 'Offline-First Flutter in the Real World', event: 'Flutter Bangkok Meetup', year: '2025', type: 'Meetup', note: 'The sync engine behind a field app used in basements and ships.' },
  { title: 'Performance Is a Feature', event: 'DevFest Mandalay', year: '2024', type: 'Conference', note: 'Why startup time belongs on the roadmap next to features, not in a backlog.' },
  { title: 'Clean Architecture Without Ceremony', event: 'Workshop · Remote', year: '2024', type: 'Workshop', note: 'A hands-on three-hour session building a multi-module app from scratch.' },
];

/* ---------- MENTORSHIP ---------- */
export const MENTOR_TRACKS = [
  { title: 'Code Review Support', detail: 'Async reviews of your PRs with explanations, not just directions. Typical cadence — twice weekly.', for: 'Junior → Mid developers', dur: 'Ongoing' },
  { title: 'Pair Programming', detail: 'Live sessions on your actual codebase — architecture, refactoring and debugging techniques in context.', for: 'Any level', dur: '1–2h / week' },
  { title: 'Refactoring Rescue', detail: 'We take one painful module and rebuild it together, so the pattern transfers to the rest of the app.', for: 'Mid developers', dur: '2–4 weeks' },
  { title: 'Career Growth', detail: 'Portfolio review, interview preparation for senior roles, and salary negotiation grounded in the regional market.', for: 'Mid → Senior', dur: 'Monthly' },
  { title: 'Flutter Fundamentals', detail: 'Structured eight-week curriculum — widgets, state, routing, async data and testing, with weekly assignments.', for: 'Beginners', dur: '8 weeks' },
  { title: 'Android Architecture', detail: 'Multi-module design, dependency boundaries and migration strategy from MVP or God-ViewModels.', for: 'Mid → Senior', dur: '4 weeks' },
];

/* ---------- AWARDS ---------- */
export const AWARDS = [
  { title: 'Google Developers Launchpad — Advanced Android', org: 'Google', year: '2020', note: 'Completed the full advanced Jetpack and architecture curriculum.' },
  { title: 'Featured Project — POS Ultimate Pro Max', org: 'GitHub Trending · Kotlin', year: '2025', note: 'Trended in the Kotlin category for nine consecutive days.' },
  { title: 'Best Mobile App — Regional FinTech Awards', org: 'Industry Panel', year: '2022', note: 'Recognised for the biometric security and offline deposit flow.' },
  { title: 'Community Speaker of the Year', org: 'DevFest Mandalay', year: '2024', note: 'Awarded for volunteer talks and free workshops across four cities.' },
  { title: '40+ Verified Certifications', org: 'Programming Hub & partners', year: '2024–2026', note: 'Across programming, mobile, AI/ML, security, blockchain and business.' },
  { title: 'Open Source Steward', org: 'Community', year: '2026', note: 'Maintaining six public packages used by 2,800+ developers.' },
];

/* ---------- LABS ---------- */
export const LABS = [
  { title: 'Neon Particles', desc: 'A canvas particle network with cursor gravity — now the background layer of this site.', tag: 'Motion', img: IMAGES.copilot1 },
  { title: 'Compose Shader Study', desc: 'Runtime shaders in Compose replicating CRT scanlines and glow trails.', tag: 'Experiment', img: IMAGES.copilot2 },
  { title: 'MoekyawTranslator', desc: 'On-device AI translation for Burmese ↔ English ↔ Thai using TFLite.', tag: 'AI / ML', img: IMAGES.copilot5 },
  { title: 'Gesture Orchestra', desc: 'Multi-touch gesture experiments mapped to haptics and sound.', tag: 'Interaction', img: IMAGES.copilot7 },
  { title: 'Tiny Tools Pack', desc: 'Six micro-utilities — JSON formatter, colour contrast checker, cron parser.', tag: 'Tools', img: IMAGES.preview2 },
  { title: 'Foldable Layouts', desc: 'Adaptive layout studies for foldables and dual-screen devices.', tag: 'UI', img: IMAGES.mka13 },
];

/* ---------- DESIGN SYSTEM TOKENS ---------- */
export const COLOR_TOKENS = [
  { name: '--cyan', hex: '#00f0ff', role: 'Primary action · links · focus ring' },
  { name: '--pink', hex: '#ff2d78', role: 'Accent · secondary CTA · alerts' },
  { name: '--yellow', hex: '#ffe14d', role: 'Highlight · certificates · warnings' },
  { name: '--violet', hex: '#8b5cf6', role: 'Gradient bridge · tertiary' },
  { name: '--green', hex: '#3ef2a0', role: 'Success · availability · online' },
  { name: '--bg', hex: '#04060c', role: 'Canvas · obsidian base' },
];

export const TYPE_SCALE = [
  { token: 'Display', font: 'Orbitron 900', size: 'clamp(2.6rem → 5.4rem)', use: 'Hero name, page titles' },
  { token: 'Heading', font: 'Rajdhani 700', size: '1.125rem → 2rem', use: 'Section + card headings' },
  { token: 'Body', font: 'Space Grotesk 400', size: '0.875rem → 1.125rem', use: 'Paragraphs, descriptions' },
  { token: 'Mono', font: 'JetBrains Mono 400', size: '0.625rem → 0.875rem', use: 'Labels, metrics, code' },
  { token: 'Myanmar', font: 'Noto Sans Myanmar 400', size: '0.75rem → 1rem', use: 'Burmese copy, nav sub-labels' },
];

export const MOTION_TOKENS = [
  { token: '--ease-out', value: 'cubic-bezier(0.22, 1, 0.36, 1)', use: 'Entrances, hover lifts' },
  { token: '--dur-fast', value: '250ms', use: 'Button and icon feedback' },
  { token: '--dur-mid', value: '450ms', use: 'Card lifts, drawer slides' },
  { token: '--dur-slow', value: '900ms', use: 'Section reveals' },
  { token: '--stagger', value: '70–130ms', use: 'Grid reveal delays' },
];

/* ---------- ACCESSIBILITY ---------- */
export const A11Y_CHECKS = [
  { title: 'Keyboard Support', status: 'Pass', detail: 'Every interactive element is reachable in DOM order. Escape closes the drawer, modal and command palette. Focus returns to the trigger on close.' },
  { title: 'Visible Focus States', status: 'Pass', detail: 'A 2px cyan outline with 3px offset is applied on :focus-visible across all controls — never removed.' },
  { title: 'Colour Contrast', status: 'AA', detail: 'Body text on obsidian measures 12.4:1. Neon accents are used for decoration and large text only, never for small critical copy.' },
  { title: 'Reduced Motion', status: 'Pass', detail: 'A prefers-reduced-motion media query disables all animation, parallax and autoplay looping background motion.' },
  { title: 'Semantic Markup', status: 'Pass', detail: 'Landmark regions, a single h1 per page, ordered headings, native buttons and real form labels throughout.' },
  { title: 'Screen Reader Support', status: 'Pass', detail: 'aria-labels on icon-only buttons, aria-expanded on disclosure widgets, role=alert on validation, and polite status regions.' },
];

/* ---------- LOCALIZATION ---------- */
export const LOCALE_MATRIX = [
  { code: 'my', name: 'Burmese', native: 'မြန်မာ', script: 'Myanmar', coverage: '100%', dir: 'LTR', fallback: 'en' },
  { code: 'en', name: 'English', native: 'English', script: 'Latin', coverage: '100%', dir: 'LTR', fallback: '—' },
  { code: 'th', name: 'Thai', native: 'ไทย', script: 'Thai', coverage: '92%', dir: 'LTR', fallback: 'en' },
];

export const L10N_NOTES = [
  { title: 'Locale-Aware Content Structure', detail: 'All copy lives in a keyed dictionary — no string literals in markup. Adding a language means adding one object.' },
  { title: 'Fallback Behaviour', detail: 'Missing keys resolve to English rather than rendering empty. Gaps are logged at build time, never discovered by users.' },
  { title: 'Typography per Script', detail: 'Noto Sans Myanmar is loaded for Burmese because Latin display faces do not cover the Myanmar block. Line-height is raised for stacked diacritics.' },
  { title: 'Formatting', detail: 'Dates, numbers and currency use the Intl API — MMK / THB / USD amounts are grouped per locale convention.' },
  { title: 'Layout Stability', detail: 'Burmese strings run ~30% longer than English. Containers use min-height and word-break instead of fixed heights.' },
  { title: 'Translation Workflow', detail: 'A lint step flags new English strings without a Burmese or Thai counterpart before merge.' },
];

/* ---------- LEGAL ---------- */
export const LEGAL_SECTIONS = [
  { title: 'Privacy Policy', body: ['This site does not run third-party advertising trackers or sell personal data.', 'The contact form submits directly to my inbox. Message content is stored only as long as needed to respond, then deleted.', 'Newsletter email addresses are kept solely for sending release notes and are never shared.', 'Cloudinary hosts the images used across this site. Standard CDN logs may record your IP address as part of request delivery.'] },
  { title: 'Terms of Use', body: ['All code shown in public repositories is provided under the licence stated in each repository.', 'Case study metrics are drawn from real engagements with commercially sensitive details removed or aggregated.', 'Nothing on this site constitutes a warranty of results for your specific project.'] },
  { title: 'Cookie Notice', body: ['This site sets no tracking or advertising cookies.', 'Your theme and language preferences are held in component state only and are not persisted or transmitted.', 'If you contact me, I keep a record of our correspondence for as long as our conversation is active.'] },
  { title: 'Attribution', body: ['Icons — Lucide (ISC License).', 'Typography — Orbitron, Rajdhani, Space Grotesk and JetBrains Mono by Google Fonts; Noto Sans Myanmar by Google.', 'Media — hosted on Cloudinary. Case study imagery is illustrative of the described work.', 'Built with React, Vite and Tailwind CSS.'] },
];

/* ---------- ARCHITECTURE PAGE CONTENT ---------- */
export const XP_ARCH = [
  { title: 'Shared Code Strategy', detail: 'Roughly 85–92% of code is shared. The rule is simple — anything that touches pixels, sensors or platform policy stays native. Everything else lives in the shared layer where it is written once and tested once.' },
  { title: 'Platform Channels', detail: 'A single typed channel contract per feature, versioned and documented. Native sides are thin — they translate and delegate, never hold business logic.' },
  { title: 'Native Integration Boundaries', detail: 'Payments, biometrics, camera, notifications and crash reporting are always native. Each boundary is wrapped in an interface so the shared layer stays testable and platform-agnostic.' },
  { title: 'Feature Module Design', detail: 'Each feature owns its UI, domain and data slice. Features cannot import each other — they communicate through contracts exposed by a thin core.' },
  { title: 'Testing Layers', detail: 'Pure Dart unit tests for domain, fakes for repositories, contract tests for channel implementations, and a thin golden/UI suite on both platforms.' },
  { title: 'Release Strategy', detail: 'One branch per release, tagged builds, staged rollout percentages, and a documented rollback path that has actually been rehearsed.' },
];

export const FLUTTER_ARCH = [
  { title: 'Widget Composition', detail: 'Small, single-purpose widgets composed upward. No god-widgets. Every widget fits on one screen of code and has one reason to rebuild.' },
  { title: 'State Management', detail: 'Riverpod with provider families for scoped state. Nothing global that is not genuinely global. State is immutable and copyWith-driven.' },
  { title: 'Routing', detail: 'Type-safe declarative routing with deep-link support and guarded routes. Every route is testable in isolation and preserves state across navigation.' },
  { title: 'Asynchronous Data Flow', detail: 'Repositories expose streams, not futures. Views receive resolved UI models, never raw DTOs. Errors are modelled as values, not thrown across layers.' },
  { title: 'Platform-Aware UI', detail: 'Adaptive widgets resolve per platform — scaffold transitions, haptics, text selection handles and scroll physics all feel native rather than uniform.' },
  { title: 'Performance-Aware Rebuilds', detail: 'const constructors, granular selectors, and deferred reads keep rebuild scopes tight. Measured with the composition tracing tools before and after every change.' },
];

/* ---------- LABS / PAGE REGISTRY for command palette ---------- */
export const PAGE_META: Record<string, { title: string; kicker: string; desc: string }> = {
  about: { title: 'About', kicker: 'WHO I AM', desc: 'Developer by passion, learner by nature — twelve years of shipping mobile products.' },
  resume: { title: 'Resume', kicker: 'CAREER DOCUMENT', desc: 'Summary, experience timeline, key skills and certifications. Downloadable and ATS-friendly.' },
  experience: { title: 'Experience', kicker: 'TRACK RECORD', desc: 'Every role, the responsibilities held and the measurable impact delivered.' },
  skills: { title: 'Skills', kicker: 'CAPABILITY', desc: 'Grouped by category — development, architecture, delivery, quality, tools and collaboration.' },
  'tech-stack': { title: 'Tech Stack', kicker: 'LAYERED VIEW', desc: 'Presentation, domain, data, platform, delivery and collaboration layers.' },
  architecture: { title: 'Cross-Platform Architecture', kicker: 'SHARED CODE', desc: 'Shared code strategy, platform channels, boundaries, modules, testing and release.' },
  'flutter-architecture': { title: 'Flutter Architecture', kicker: 'DART SYSTEMS', desc: 'Widget composition, state, routing, async flow, adaptive UI and rebuild discipline.' },
  performance: { title: 'Performance', kicker: 'MEASURED WORK', desc: 'Frame smoothness, startup, memory, battery and real-device behaviour with numbers.' },
  projects: { title: 'Projects', kicker: 'SELECTED BUILDS', desc: 'A curated grid of production apps across Android, Flutter, web and games.' },
  'case-studies': { title: 'Case Studies', kicker: 'DEEP DIVES', desc: 'Problem, role, architecture, outcome and lessons learned — with real metrics.' },
  certificates: { title: 'Certificates', kicker: 'CREDENTIAL VAULT', desc: 'Verified certifications across nine technical domains.' },
  collections: { title: 'Collections', kicker: 'THE ARCHIVE', desc: 'GitHub namespaces, Lovable builds, email identities and the social network.' },
  labs: { title: 'Labs', kicker: 'EXPERIMENTS', desc: 'Prototypes, motion studies, UI experiments and small tools.' },
  'open-source': { title: 'Open Source', kicker: 'GIVING BACK', desc: 'Repositories, contributions, tools, libraries and documentation work.' },
  github: { title: 'GitHub Activity', kicker: 'LIVE SIGNAL', desc: 'Pinned repositories, recent commits, pull requests and contribution patterns.' },
  writing: { title: 'Writing', kicker: 'NOTES', desc: 'Technical articles on architecture, performance and delivery discipline.' },
  talks: { title: 'Talks', kicker: 'ON STAGE', desc: 'Conference sessions, meetups, workshops and slide decks.' },
  mentorship: { title: 'Mentorship', kicker: 'TEACHING', desc: 'Code review, pairing, refactoring, career growth and structured curricula.' },
  awards: { title: 'Awards', kicker: 'RECOGNITION', desc: 'Certifications, recognition, featured work and community mentions.' },
  services: { title: 'Services', kicker: 'ENGAGEMENTS', desc: 'Architecture review, performance audit, mentorship and feature rescue.' },
  pricing: { title: 'Pricing', kicker: 'TRANSPARENT RATES', desc: 'Quick audit, architecture review, monthly advisory and implementation support.' },
  testimonials: { title: 'Testimonials', kicker: 'TRUST', desc: 'What managers, designers and engineers say about working together.' },
  faq: { title: 'FAQ', kicker: 'ANSWERS', desc: 'Roles, availability, stack, consulting and response times.' },
  contact: { title: 'Contact', kicker: 'GET IN TOUCH', desc: 'Let us build something reliable, polished and useful.' },
  blueprints: { title: 'Blueprint Deck', kicker: 'ENGINEERING SHEETS', desc: 'Five production systems drawn as built — KMP topology, design tokens, on-device GenAI, zero-trust auth and adaptive navigation.' },
  'design-system': { title: 'Design System', kicker: 'TOKENS', desc: 'Colour, typography, spacing, elevation, motion and interaction states.' },
  accessibility: { title: 'Accessibility', kicker: 'INCLUSIVE BY DEFAULT', desc: 'Keyboard, focus, contrast, reduced motion, semantics and screen readers.' },
  localization: { title: 'Localization', kicker: 'THREE LANGUAGES', desc: 'Myanmar, English and Thai — locale-aware structure, fallbacks and workflow.' },
  legal: { title: 'Legal', kicker: 'THE FINE PRINT', desc: 'Privacy policy, terms of use, cookie notice and attribution.' },
};
