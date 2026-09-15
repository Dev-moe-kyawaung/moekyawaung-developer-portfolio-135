/* ============================================================
   CENTRAL DATA — Moe Kyaw Aung Portfolio
   ============================================================ */

export const PROFILE = {
  name: 'MOE KYAW AUNG',
  mmName: 'မိုးကျော်အောင်',
  role: 'Senior Android Developer',
  tagline: 'Kotlin · Jetpack Compose · MVVM · Clean Architecture · Flutter · Firebase · CI/CD',
  location: 'Tachileik, Myanmar — Bangkok, Thailand',
  phones: ['+95 9 889 000 889', '+95 9 666 000 050'],
  primaryEmail: 'moekyawaung@engineer.com',
  availability: 'Open to Work — Q3 2026',
  philosophy: 'Code with culture. Build with purpose.',
  currentlyBuilding: 'MoekyawTranslator — AI Translation App',
  certificationsNote: '40+ certs · Google Developers Launchpad',
  githubMain: 'https://github.com/Dev-moe-kyawaung/',
  gravatar: 'https://gravatar.com/moekyawaung13721',
};

export const IMAGES = {
  avatar: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778527878/IMG_20260430_053105_uef0yr.png',
  about: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763535/MKA_25_lbx6fb.webp',
  aboutAlt: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763531/MKA_12_iv8kpm.webp',
  heroVideo: 'https://res.cloudinary.com/dye5qpwii/video/upload/v1779031596/Javier_Pardina_10_wttux4.mp4',
  heroPoster: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1779052645/2153-fireworks-composer_gm3e0h.jpg',
  mka3: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763531/MKA_3_zqrhhr.webp',
  mka11: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763532/MKA_11_jbijtv.webp',
  mka13: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763532/MKA_13_i4bao3.webp',
  mka22: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795801/MKA_22_felevo.webp',
  preview1: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795822/preview_dzhqvv.webp',
  preview2: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763536/preview_ls5ptn.webp',
  copilot1: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795856/copilot_image_1778795675037_heh9xk.png',
  copilot2: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795856/copilot_image_1778794626112_ega7kk.png',
  copilot3: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795859/copilot_image_1778794430377_n7xlmz.png',
  copilot4: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795856/copilot_image_1778795000722_eo96gj.png',
  copilot5: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795829/copilot_image_1778795000722_okryxj.png',
  copilot6: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795847/copilot_image_1778795115579_acfm5j.png',
  copilot7: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795853/copilot_image_1778794781671_kytvkc.png',
  cloudPoster: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795825/cloud-icon-poster-1_2_opl7sy.png',
  content65: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1779031816/Content_65_oayzj3.jpg',
  img1a: 'https://res.cloudinary.com/dye5qqwii/image/upload/v1778747384/image-1_f6zlmk.jpg',
};

/* Typing rotator roles (tech-heavy categories) */
export const ROLES = [
  'Android Developer | Kotlin | Jetpack Compose | MVVM',
  'Android Engineer | Coroutines · Room · Retrofit · Hilt',
  'Android Developer | Material 3 · Firebase · CI/CD',
  'Cross-Platform | Flutter · Dart · KMM · Clean Arch',
];

export const MARQUEE_ITEMS = [
  'KOTLIN', 'JETPACK COMPOSE', 'FLUTTER', 'DART', 'MVVM', 'CLEAN ARCHITECTURE',
  'FIREBASE', 'COROUTINES', 'FLOW', 'ROOM DB', 'RETROFIT', 'DAGGER / HILT',
  'KMM', 'REST APIs', 'GIT / GITHUB ACTIONS', 'MATERIAL 3', 'TFLITE', 'SECURITY',
];

export interface Stat { n: number; suffix: string; label: string; mm: string; }
export const STATS: Stat[] = [
  { n: 12, suffix: '+', label: 'Years Experience', mm: 'နှစ်အတွေ့အကြုံ' },
  { n: 3, suffix: 'K+', label: 'Apps & Downloads', mm: 'အက်ပ်များ' },
  { n: 600, suffix: '+', label: 'Repositories', mm: 'ရီပိုစီတိုရီ' },
  { n: 100, suffix: '%', label: 'Satisfaction', mm: 'ကျေနပ်မှု' },
];

export interface SkillBar { label: string; val: number; color: string; note: string; }
export const SKILL_BARS: SkillBar[] = [
  { label: 'Kotlin', val: 95, color: 'var(--cyan)', note: 'Coroutines · Flow · DSLs' },
  { label: 'Jetpack Compose', val: 92, color: 'var(--pink)', note: 'Material 3 · Navigation' },
  { label: 'MVVM / Clean Architecture', val: 94, color: 'var(--yellow)', note: 'Multi-module · SOLID' },
  { label: 'Firebase Suite', val: 90, color: 'var(--violet)', note: 'Auth · Firestore · FCM' },
  { label: 'Flutter / Dart', val: 88, color: 'var(--green)', note: 'BLoC · Shared codebase' },
  { label: 'CI/CD — GitHub Actions', val: 86, color: 'var(--cyan)', note: 'Fastlane · Automation' },
];

export interface Ring { label: string; val: number; color: string; }
export const RINGS: Ring[] = [
  { label: 'Kotlin', val: 95, color: '#00f0ff' },
  { label: 'Compose', val: 92, color: '#ff2d78' },
  { label: 'Firebase', val: 90, color: '#8b5cf6' },
  { label: 'CI/CD', val: 86, color: '#ffe14d' },
];

export const CHIP_CLOUD = [
  'Python', 'Java', 'JavaScript', 'TypeScript', 'Dart', 'Kotlin', 'Flutter',
  'Jetpack Compose', 'React', 'Next.js', 'Angular', 'Vue.js', 'Node.js',
  'PostgreSQL', 'MongoDB', 'Redis', 'Room DB', 'Retrofit', 'Dagger Hilt',
  'TensorFlow Lite', 'Machine Learning', 'Cyber Security', 'Ethical Hacking',
  'Docker', 'AWS', 'Firebase', 'REST APIs', 'GraphQL', 'Git', 'Figma', 'Linux',
];

export interface Service { icon: string; title: string; desc: string; tags: string[]; }
export const SERVICES: Service[] = [
  {
    icon: 'Smartphone', title: 'Native Android Development',
    desc: 'Production-grade Android apps in Kotlin with Jetpack Compose, Material 3 motion, and release-ready builds shipped to Play Store.',
    tags: ['Kotlin', 'Compose', 'Material 3'],
  },
  {
    icon: 'Layers', title: 'Architecture Design',
    desc: 'Multi-module Clean Architecture with MVVM/MVI boundaries, testable data flow, and codebases teams can extend for years.',
    tags: ['MVVM', 'MVI', 'Multi-module'],
  },
  {
    icon: 'Smartphone', title: 'Flutter Cross-Platform',
    desc: 'One Dart codebase, native-quality output on Android and iOS — shared architecture, platform channels, and store delivery.',
    tags: ['Flutter', 'Dart', 'KMM'],
  },
  {
    icon: 'Cloud', title: 'Firebase & Backend Integration',
    desc: 'Auth, Firestore, Cloud Messaging, Crashlytics and REST APIs wired with offline-first caching and resilient sync logic.',
    tags: ['Firebase', 'REST', 'Room'],
  },
  {
    icon: 'Gauge', title: 'Performance Optimization',
    desc: 'Startup-time cuts, jank-free 60fps lists, memory-leak hunts, and battery-aware profiling on real devices.',
    tags: ['Profiling', '60fps', 'R8'],
  },
  {
    icon: 'ShieldCheck', title: 'Security & Code Audit',
    desc: 'Practical security reviews — secure storage, network hardening, obfuscation, and dependency risk assessment.',
    tags: ['Ethical Hacking', 'Secure Storage'],
  },
];

export type ProjCat = 'android' | 'flutter' | 'web' | 'game';
export interface Project {
  title: string; cat: ProjCat; desc: string; img: string;
  repo: string; tags: string[]; featured?: boolean;
}
export const PROJECTS: Project[] = [
  { title: 'Social Dashboard', cat: 'android', featured: true, img: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795856/copilot_image_1778795675037_heh9xk.png', repo: 'https://github.com/moekyawaung-tech/social-dashboard', desc: 'Real-time social analytics dashboard with Compose UI, Firebase streams, and offline caching.', tags: ['Compose', 'Firebase', 'MVVM'] },
  { title: 'Video Player', cat: 'android', featured: true, img: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795856/copilot_image_1778794626112_ega7kk.png', repo: 'https://github.com/moekyawaung-tech/video-player', desc: 'ExoPlayer-based media app with playlist sync, PiP mode, and background playback service.', tags: ['ExoPlayer', 'Media3', 'Service'] },
  { title: 'POS Ultimate Pro Max', cat: 'android', featured: true, img: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795859/copilot_image_1778794430377_n7xlmz.png', repo: 'https://github.com/moekyawaung-tech/POS-Ultimate-Pro-Max', desc: 'Full point-of-sale suite — inventory, receipts, thermal printing, and multi-tenant Room DB.', tags: ['Room', 'PDF', 'Inventory'] },
  { title: 'PWA App', cat: 'web', img: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795856/copilot_image_1778795000722_eo96gj.png', repo: 'https://github.com/moekyawaung-tech/pwa-app', desc: 'Installable Progressive Web App with offline support, push notifications, and app-shell caching.', tags: ['PWA', 'Service Worker'] },
  { title: 'Job Portal App', cat: 'flutter', img: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795829/copilot_image_1778795000722_okryxj.png', repo: 'https://github.com/moekyawaung-tech/Job-Portal-App', desc: 'Cross-platform job board with search, saved applications, and recruiter messaging in Flutter.', tags: ['Flutter', 'Dart', 'API'] },
  { title: 'Game Collection', cat: 'game', img: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795847/copilot_image_1778795115579_acfm5j.png', repo: 'https://github.com/moekyawaung-tech/game-collection', desc: 'Arcade classics rebuilt with clean game-loop architecture, save states, and Compose Canvas.', tags: ['Canvas', 'Game Loop'] },
  { title: 'Advance POS Version', cat: 'android', img: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795853/copilot_image_1778794781671_kytvkc.png', repo: 'https://github.com/moekyawaung-tech/Advance-POS-Version', desc: 'Modular POS with barcode workflows, daily reports, and cloud backup via REST sync.', tags: ['Modular', 'Reports'] },
  { title: 'Weather App', cat: 'android', img: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795822/preview_dzhqvv.webp', repo: 'https://github.com/moekyawaung-tech/Weather-app', desc: 'Forecast app with Retrofit, location-aware updates, and animated weather scenes in Compose.', tags: ['Retrofit', 'Location'] },
  { title: 'Thailand Travel', cat: 'flutter', img: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763536/preview_ls5ptn.webp', repo: 'https://github.com/moekyawaung-tech/thailand-travel', desc: 'Travel companion with offline maps, itinerary planner, and bilingual EN/TH content.', tags: ['Maps', 'i18n'] },
  { title: 'Daily Planner', cat: 'android', img: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763532/MKA_11_jbijtv.webp', repo: 'https://github.com/moekyawaung-tech/Daily-planner-app', desc: 'Habit + task planner with reminders via WorkManager and Material 3 adaptive layouts.', tags: ['WorkManager', 'M3'] },
  { title: 'Lens Lite', cat: 'android', img: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763532/MKA_13_i4bao3.webp', repo: 'https://github.com/moekyawaung-tech/Lens-lite', desc: 'Lightweight camera utility with ML Kit scanning, gallery, and EXIF-aware viewer.', tags: ['ML Kit', 'CameraX'] },
  { title: 'Snake Game App', cat: 'game', img: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778763531/MKA_3_zqrhhr.webp', repo: 'https://github.com/moekyawaung-tech/Snake-Game-App', desc: 'Neon-styled snake with swipe controls, leaderboards, and haptic feedback loops.', tags: ['Arcade', 'Haptics'] },
  { title: 'My Postcode Web', cat: 'web', img: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795801/MKA_22_felevo.webp', repo: 'https://github.com/Moekyawaung-cyber/My_postcode-My-web_project', desc: 'Myanmar postcode lookup directory with fast search and region filtering.', tags: ['Directory', 'Search'] },
  { title: 'Hospital Lists', cat: 'web', img: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778795799/2024119_20_b94fen.jpg', repo: 'https://github.com/Moekyawaung-cyber/Hospital-Lists', desc: 'Curated hospital directory with contact data, departments, and township filters.', tags: ['Data', 'UI'] },
  { title: 'Crypto & Money Tracker', cat: 'android', img: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778747388/image-1_1_khsx9s.png', repo: 'https://github.com/moekyawaung-tech/social-dashboard', desc: 'Portfolio tracker with live rates, spending insights, and biometric-locked vault.', tags: ['Charts', 'Security'] },
  { title: 'E-commerce Shop', cat: 'flutter', img: 'https://res.cloudinary.com/dye5qpwii/image/upload/v1778747384/image_1_buwgls.png', repo: 'https://github.com/moekyawaung-tech/pwa-app', desc: 'Storefront with cart, payments flow, order history, and push re-order reminders.', tags: ['Cart', 'Payments'] },
];

export const PROJ_FILTERS: { id: ProjCat | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'android', label: 'Android' },
  { id: 'flutter', label: 'Flutter' },
  { id: 'web', label: 'Web / PWA' },
  { id: 'game', label: 'Games' },
];

/* ---------------- CERTIFICATES ---------------- */
export const CERT_CATS = [
  'All', 'Programming Languages', 'Web Development', 'Mobile & App Dev',
  'Databases', 'AI & Data Science', 'Security & DevOps', 'Blockchain',
  'Software Engineering', 'Business',
] as const;

export interface Cert { name: string; cat: string; date: string; id: string; }
const c = (name: string, cat: string, date: string, id: string): Cert => ({ name, cat, date, id });
export const CERTS: Cert[] = [
  c('C Programming', 'Programming Languages', 'Jul 2024', '1720080366600'),
  c('C++ Programming', 'Programming Languages', 'Jul 2024', '1720080412831'),
  c('Java Programming', 'Programming Languages', 'Aug 2024', '1720080522914'),
  c('Kotlin Programming', 'Programming Languages', 'Sep 2024', '1720080618942'),
  c('Python 3 Programming', 'Programming Languages', 'Oct 2024', '1720080731500'),
  c('JavaScript', 'Web Development', 'Aug 2024', '1720080844718'),
  c('HTML Fundamentals', 'Web Development', 'Jun 2024', '1720080933266'),
  c('CSS Masterclass', 'Web Development', 'Jun 2024', '1720081027554'),
  c('React Development', 'Web Development', 'Nov 2024', '1720081140237'),
  c('Angular Framework', 'Web Development', 'Dec 2024', '1720081256610'),
  c('Android Development', 'Mobile & App Dev', 'Sep 2024', '1720081367482'),
  c('Flutter Development', 'Mobile & App Dev', 'Oct 2024', '1720081478350'),
  c('Dart Programming', 'Mobile & App Dev', 'Oct 2024', '1720081589218'),
  c('Swift Fundamentals', 'Mobile & App Dev', 'Jan 2025', '1720081690086'),
  c('SQL & Databases', 'Databases', 'Jul 2024', '1720081781954'),
  c('MongoDB Basics', 'Databases', 'Nov 2024', '1720081872822'),
  c('Firebase Cloud', 'Databases', 'Dec 2024', '1720081963690'),
  c('Machine Learning', 'AI & Data Science', 'Jan 2025', '1720082054558'),
  c('Deep Learning', 'AI & Data Science', 'Feb 2025', '1720082145426'),
  c('Data Science', 'AI & Data Science', 'Feb 2025', '1720082236294'),
  c('Cyber Security', 'Security & DevOps', 'Mar 2025', '1720082327162'),
  c('Ethical Hacking', 'Security & DevOps', 'Mar 2025', '1720082418030'),
  c('Network Security', 'Security & DevOps', 'Apr 2025', '1720082508898'),
  c('DevOps Essentials', 'Security & DevOps', 'Apr 2025', '1720082599766'),
  c('Blockchain Basics', 'Blockchain', 'May 2025', '1720082690634'),
  c('Solidity Smart Contracts', 'Blockchain', 'May 2025', '1720082781502'),
  c('Git Version Control', 'Software Engineering', 'Jun 2024', '1720082872370'),
  c('Agile & Scrum', 'Software Engineering', 'Aug 2024', '1720082963238'),
  c('Digital Marketing', 'Business', 'Sep 2024', '1720083054106'),
  c('Project Management', 'Business', 'Oct 2024', '1720083144974'),
];

/* ---------------- COLLECTIONS ---------------- */
export const GITHUB_ACCOUNTS: string[] = [
  'https://moekyaw-aung-china.github.io/', 'https://moekyawaung-developer.github.io/',
  'https://moekyawaungvivov30pro-design.github.io/', 'https://moekyaw-aung-mm.github.io/',
  'https://moekyawaung-mk.github.io/', 'https://moekyawaung-microsoft.github.io/',
  'https://moekyawaung-cyber.github.io/', 'https://moekyawaung-bangkok.github.io/',
  'https://moekyawaung-micro.github.io/', 'https://moekyawaungmka2032-boop.github.io/',
  'https://moekyawaung-dev-mm.github.io/', 'https://moekyaw-developer.github.io/',
  'https://moekyawaung.github.io/', 'https://moekyaw-aung-mm.github.io/',
  'https://moekyawaung-tech.github.io/', 'https://moekyawaung-hack.github.io/',
  'https://moekyawaung-graduate.github.io/', 'https://moekyawaung-linux.github.io/',
  'https://moekyawaung-coder.github.io/', 'https://moekyawaung-designer.github.io/',
  'https://moekyawaung2026.github.io/', 'https://moekyawaungmka2034-coder.github.io/',
  'https://moekyawaung-web.github.io/', 'https://moekyawaung-code.github.io/',
  'https://moekyawaung-creator.github.io/', 'https://moekyawaung-webdeveloper.github.io/',
  'https://moekyawaung-co.github.io/', 'https://moekyawaung-edu.github.io/',
  'https://moekyawaung-senior.github.io/', 'https://moekyawaung-development.github.io/',
  'https://moekyawaung-google.github.io/', 'https://moe-kyawaung.github.io/',
];

export const LOVABLE_APPS: string[] = [
  'https://happy-cv-creator.lovable.app', 'https://moekyawaung.lovable.app',
  'https://moekyawaungmybio.lovable.app/', 'https://the-cv-palette.lovable.app',
  'https://moekyaw-url.lovable.app', 'https://moekyawaung-dev.lovable.app',
  'https://moe-kyaw-aung.lovable.app', 'https://moekyawaungmka.lovable.app',
  'https://moekyaw.lovable.app', 'https://m-moekyaw.lovable.app',
  'https://dev-moekyawaung.lovable.app', 'https://dev-moekyaw.lovable.app',
  'https://cv-beacon.lovable.app', 'https://preview--moekyawaungmkamka.lovable.app/',
  'https://moekyawaungmkamka.lovable.app', 'https://pixel-perfect-snap-39.lovable.app',
  'https://devmoekyaw.lovable.app', 'https://profile-persuasion-hub.lovable.app',
  'https://friendly-haven-io.lovable.app', 'https://moekyawaung-github.lovable.app',
  'https://moekyawgithub.lovable.app', 'https://joy-codify-life.lovable.app/',
  'https://mmoekyaw.lovable.app', 'https://color-code-chronicles.lovable.app',
  'https://moekyawaung-free.lovable.app', 'https://app-skill-gallery.lovable.app',
  'https://spark-coach-create.lovable.app', 'https://moekyaw-mk.lovable.app',
  'https://moekyawaung-myanmar.lovable.app', 'https://mmoe.lovable.app',
  'https://moekyaw-dev.lovable.app',
];

export const EMAILS: string[] = [
  'moekyawaung@programmer.net', 'moekyawaung@collector.org',
  'moekyawaung@technologist.com', 'moekyawaung@techie.com',
  'moekyawaung@graphic-designer.com', 'moekyawaung@cybergal.com',
  'moekyawaung@webname.com', 'moekyawaung@hackermail.com',
  'moekyawaung@graduate.org', 'moekyawaung@engineer.com',
  'moekyawaung@asia.com', 'moekyawaung@contractor.net',
  'moekyawaung@linuxmail.org', 'moekyawaung@usa.com',
  'moekyawaung@europe.com', 'moekyawaung@mail.com',
  'moekyawaung@iname.com', 'moekyawaung@socialogist.com',
  'moekyawaung@secretary.net', 'moekyawaung@publicist.com',
];

export interface Social { key: string; label: string; handle: string; href: string; }
export const SOCIALS: Social[] = [
  { key: 'github', label: 'GitHub', handle: 'Dev-moe-kyawaung', href: 'https://github.com/Dev-moe-kyawaung/' },
  { key: 'gravatar', label: 'Gravatar', handle: 'moekyawaung13721', href: 'https://gravatar.com/moekyawaung13721' },
  { key: 'linkedin', label: 'LinkedIn', handle: 'moe-kyaw-aung', href: 'https://www.linkedin.com/in/moe-kyaw-aung-2653093a1' },
  { key: 'youtube', label: 'YouTube', handle: 'Dev Channel', href: 'https://www.youtube.com/channel/UCuTXUguZb4xjeL2nX8WJG' },
  { key: 'telegram', label: 'Telegram', handle: '@moekyawaung', href: 'https://t.me/moekyawaung' },
  { key: 'instagram', label: 'Instagram', handle: '@moekyawaung', href: 'https://instagram.com/moekyawaung' },
  { key: 'playstore', label: 'Play Store', handle: 'Developer Page', href: 'https://play.google.com/store/apps' },
  { key: 'phone', label: 'Phone', handle: '+95 9 889 000 889', href: 'tel:+959889000889' },
  { key: 'email', label: 'Email', handle: 'engineer.com', href: 'mailto:moekyawaung@engineer.com' },
  { key: 'bluesky', label: 'Bluesky', handle: 'moekyawaung96', href: 'https://bsky.app/profile/moekyawaung96.bsky.social' },
  { key: 'tumblr', label: 'Tumblr', handle: 'moekyawaung', href: 'https://www.tumblr.com/moekyawaung' },
  { key: 'flickr', label: 'Flickr', handle: '204037451@N06', href: 'https://www.flickr.com/people/204037451@N06' },
  { key: 'vimeo', label: 'Vimeo', handle: 'user252414232', href: 'https://vimeo.com/user252414232' },
  { key: 'twitch', label: 'Twitch', handle: 'moekyawaung', href: 'https://twitch.tv/moekyawaung' },
  { key: 'slack', label: 'Slack', handle: 'moekyawaung.slack', href: 'https://moekyawaung.slack.com/' },
  { key: 'paypal', label: 'PayPal', handle: 'paypalme', href: 'https://www.paypal.com/paypalme/my/profile' },
  { key: 'strikingly', label: 'Strikingly', handle: 'moekyawaung2026', href: 'http://moekyawaung2026.strikingly.com' },
  { key: 'reddit', label: 'Reddit', handle: 'u/moekyawaung', href: 'https://reddit.com/u/moekyawaung' },
  { key: 'pinterest', label: 'Pinterest', handle: '@moekyawaung', href: 'https://pinterest.com/moekyawaung' },
  { key: 'wordpress', label: 'WordPress', handle: 'moekyawaung', href: 'https://moekyawaung.wordpress.com' },
];

/* ---------------- TIMELINE ---------------- */
export interface TimelineItem { year: string; title: string; org: string; desc: string; impact: string; }
export const TIMELINE: TimelineItem[] = [
  { year: '2014', title: 'Junior Android Developer', org: 'Mandalay Tech Studio', desc: 'Started with Java and Eclipse. Shipped first Play Store apps and learned debugging the hard way.', impact: '3 apps published' },
  { year: '2017', title: 'Android Developer', org: 'Yangon Digital Agency', desc: 'Led Kotlin migration across 6 client apps. Introduced Retrofit, RxJava, and MVP patterns.', impact: '6 apps migrated to Kotlin' },
  { year: '2019', title: 'Senior Android Developer', org: 'Bangkok Startup Collective', desc: 'Owned MVVM + Coroutines stack, mentored juniors, and set up first CI pipeline with Fastlane.', impact: '8 apps · 1M+ installs' },
  { year: '2021', title: 'Lead Mobile Engineer', org: 'Regional FinTech', desc: 'Dual-track Kotlin + Flutter delivery. Biometric security, offline-first sync, and 99.9% crash-free.', impact: '99.9% crash-free sessions' },
  { year: '2023', title: 'Mobile Architect', org: 'Multi-Product Platform', desc: 'Designed multi-module Clean Architecture serving 3M+ users. Paging 3, Compose migration, KMM pilot.', impact: '3M+ active users' },
  { year: '2026', title: 'Independent Senior Consultant', org: 'Remote — GMT+6:30', desc: 'Architecture reviews, performance audits, and building MoekyawTranslator with on-device AI.', impact: '40+ certifications' },
];

/* ---------------- TESTIMONIALS ---------------- */
export interface Testimonial { quote: string; name: string; role: string; }
export const TESTIMONIALS: Testimonial[] = [
  { quote: 'Thoughtful, steady, and excellent at turning messy mobile problems into clean solutions. His architecture review changed how our team ships Android.', name: 'Aye Chan Thiri', role: 'Product Manager · Yangon' },
  { quote: 'Strong Flutter judgment, clear communication, and reliable delivery under pressure. He shipped our offline-first field app ahead of schedule.', name: 'Somchai P.', role: 'Engineering Manager · Bangkok' },
  { quote: 'A rare combination of design fidelity and engineering discipline. Our Compose UI finally feels native — and fast on low-end devices.', name: 'Lin Htet Aung', role: 'Product Designer · Remote' },
  { quote: 'His mentorship took me from junior to mid-level in one year. Tough, kind, and always educational code reviews.', name: 'Thiri Y.', role: 'Android Developer · Mentee' },
  { quote: 'The performance audit paid for itself — startup time dropped 41% and crash-free sessions hit 99.8% within two sprints.', name: 'David M.', role: 'CTO · FinTech Startup' },
];

/* ---------------- PRICING ---------------- */
export type Currency = 'USD' | 'MMK' | 'THB';
export interface Plan {
  name: string; blurb: string; featured?: boolean; custom?: boolean;
  usd?: number; mmk?: number; thb?: number; unit: string; features: string[];
}
export const PLANS: Plan[] = [
  {
    name: 'Quick Audit', unit: 'per app',
    usd: 149, mmk: 315000, thb: 4900,
    blurb: 'A fast health check for one app — startup, frames, dependencies.',
    features: ['Performance & startup review', 'Dependency & build health check', 'Top 5 fixes with estimates', '45-min walkthrough call', 'Written report in 3 days'],
  },
  {
    name: 'Architecture Review', unit: 'per codebase', featured: true,
    usd: 449, mmk: 950000, thb: 14900,
    blurb: 'Deep MVVM / Clean Architecture audit with a refactoring roadmap.',
    features: ['Full MVVM / MVI audit', 'Module & dependency graph map', 'State management assessment', 'Refactoring roadmap', '2 follow-up sessions', 'Team presentation included'],
  },
  {
    name: 'Monthly Advisory', unit: 'per month',
    usd: 1200, mmk: 2500000, thb: 39900,
    blurb: 'Ongoing senior guidance for your mobile team, on your schedule.',
    features: ['Weekly 1:1 advisory calls', 'Priority code review queue', 'Architecture decision support', 'Hiring & interview help', 'Async chat support'],
  },
  {
    name: 'Implementation Support', unit: 'custom', custom: true,
    blurb: 'Feature rescue missions and end-to-end delivery with senior hands.',
    features: ['Feature rescue missions', 'End-to-end delivery', 'Team enablement sessions', 'CI/CD pipeline setup', 'Dedicated weekly bandwidth'],
  },
];

/* ---------------- FAQ ---------------- */
export interface Faq { q: string; a: string; }
export const FAQS: Faq[] = [
  { q: 'What roles are you looking for?', a: 'Senior Android Engineer and senior Flutter roles — ideally product teams shipping real users, where architecture decisions and performance work actually matter. I am also open to mobile architect positions.' },
  { q: 'Are you available for remote work?', a: 'Yes. I am based in GMT+6:30 (Myanmar / Thailand) and regularly overlap with Bangkok, Singapore, and European morning teams. Core hours are flexible on agreement.' },
  { q: 'What is your core stack?', a: 'Kotlin, Jetpack Compose, MVVM / MVI, Clean Architecture, Coroutines & Flow, Room, Retrofit, Hilt, Firebase suite, and Flutter / Dart for cross-platform work — plus GitHub Actions for CI/CD.' },
  { q: 'Do you take consulting projects?', a: 'Yes — quick audits, architecture reviews, performance tuning, and monthly advisory. Implementation support is scoped per mission. See the pricing section for MMK / THB / USD rates.' },
  { q: 'How fast do you respond?', a: 'Within 24 hours on business days, usually much faster. For urgent production incidents, ping me on Telegram for the fastest route.' },
  { q: 'Which languages do you work in?', a: 'Burmese (native), English (fluent), and conversational Thai. All documentation and code comments are delivered in clear English.' },
  { q: 'Can you sign an NDA?', a: 'Of course. I am happy to sign your NDA before any detailed discussion, and I keep client code strictly confidential.' },
];

/* ---------------- I18N (EN / MM) ---------------- */
export type Lang = 'en' | 'mm';
export const I18N = {
  en: {
    available: 'Available for projects — 2026',
    hello: 'Hello, I am',
    heroDesc: 'Senior Android Developer with 12 years of hands-on experience building secure, scalable, user-friendly mobile apps — Kotlin, Jetpack Compose, Firebase, and clean architecture from UI to release-ready builds.',
    viewProjects: 'View Projects', resume: 'Download Resume', contactMe: 'Contact Me',
    scroll: 'SCROLL TO EXPLORE',
  },
  mm: {
    available: 'ပရောဂျက် လက်ခံနေသည် — ၂၀၂၆',
    hello: 'မင်္ဂလာပါ၊ ကျွန်တော်က',
    heroDesc: 'လုံခြုံစိတ်ချရ၊ တိုးတက်နိုင်စွမ်းရှိပြီး အသုံးပြုရလွယ်ကူသော မိုဘိုင်းအက်ပ်များ တည်ဆောက်ရာတွင် နှစ် ၁၂ ကျော် အတွေ့အကြုံရှိသည့် Senior Android Developer ဖြစ်ပါသည်။',
    viewProjects: 'ပရောဂျက်များ ကြည့်ရန်', resume: 'ရီဇျူမေ ဒေါင်းလုဒ်', contactMe: 'ဆက်သွယ်ရန်',
    scroll: 'အောက်သို့ ဆcroll လုပ်ကြည့်ပါ',
  },
};

export const NAV_LINKS = [
  { id: 'home', en: 'Home', mm: 'ပင်မ' },
  { id: 'about', en: 'About', mm: 'အကြောင်း' },
  { id: 'skills', en: 'Skills', mm: 'ကျွမ်းကျင်မှု' },
  { id: 'projects', en: 'Projects', mm: 'ပရောဂျက်' },
  { id: 'blueprints', en: 'Blueprints', mm: 'အင်ဂျင်နီယာချပ်' },
  { id: 'certificates', en: 'Certificates', mm: 'လက်မှတ်များ' },
  { id: 'collections', en: 'Collections', mm: 'စုစည်းမှု' },
  { id: 'pricing', en: 'Pricing', mm: 'ဈေးနှုန်း' },
  { id: 'contact', en: 'Contact', mm: 'ဆက်သွယ်' },
];
