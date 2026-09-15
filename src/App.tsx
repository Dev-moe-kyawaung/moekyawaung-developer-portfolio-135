import { useEffect, useState } from 'react';
import { LangCtx } from './hooks';
import type { Lang } from './data';
import { useRoute, Link } from './lib/router';
import { Preloader, Cursor, Background, BackToTop, StickyCta } from './components/fx';
import { CommandPalette, ScrollRail } from './components/premium';
import { ReactorAssistant } from './components/ReactorAssistant';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Services from './components/Services';
import Projects from './components/Projects';
import { Certificates, Collections } from './components/Collections';
import { Pricing, Testimonials, Faq } from './components/Engage';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { PageShell } from './components/pageshell';
import { ProjectPage, CaseStudiesPage, CaseStudyPage } from './pages/Work';
import BlueprintsPage, { BlueprintsTeaser } from './pages/Blueprints';
import {
  ResumePage, ExperiencePage, TechStackPage, ArchitecturePage, FlutterArchPage,
  PerformancePage, OpenSourcePage, GitHubPage, WritingPage, TalksPage,
  MentorshipPage, AwardsPage, LabsPage, DesignSystemPage, AccessibilityPage,
  LocalizationPage, LegalPage,
} from './pages/Craft';

type Theme = 'dark' | 'light';

/* Section rail ids used on the home landing page */
const HOME_RAIL = ['home', 'about', 'skills', 'services', 'projects', 'blueprints', 'certificates', 'collections', 'pricing', 'testimonials', 'faq', 'contact'];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<Theme>('dark');
  const [lang, setLang] = useState<Lang>('en');
  const route = useRoute();

  /* apply theme to <html data-theme> so the CSS variable system reacts */
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  /* lock scroll while the boot preloader is on screen */
  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [loading]);

  /* scroll to top on every route change */
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [route]);

  /* keep the document title in sync with the active page */
  useEffect(() => {
    const pretty = route ? route.replace(/[-/]/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()) : 'Neural Interface · Senior Android Engineer';
    document.title = `Moe Kyaw Aung — ${pretty}`;
  }, [route]);

  /* ---------------- route resolver ---------------- */
  const renderRoute = () => {
    /* nested detail routes */
    if (route.startsWith('project/')) return <ProjectPage slug={route.slice('project/'.length)} />;
    if (route.startsWith('case-study/')) return <CaseStudyPage slug={route.slice('case-study/'.length)} />;

    switch (route) {
      /* ---------- landing page ---------- */
      case '':
        return (
          <>
            <Hero />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <About />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <Skills />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <Services />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <Projects />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <BlueprintsTeaser />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <Certificates />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <Collections />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <Pricing />
            <div className="section-sep mx-auto max-w-[1440px]" />
            <Testimonials />
            <Faq />
            <Contact />
          </>
        );

      /* ---------- pages that reuse landing sections ---------- */
      case 'about':
        return <PageShell route="about" wide><About /></PageShell>;
      case 'skills':
        return <PageShell route="skills" wide><Skills /></PageShell>;
      case 'services':
        return <PageShell route="services" wide><Services /></PageShell>;
      case 'projects':
        return <PageShell route="projects" wide><Projects /></PageShell>;
      case 'certificates':
        return <PageShell route="certificates" wide><Certificates /></PageShell>;
      case 'collections':
        return <PageShell route="collections" wide><Collections /></PageShell>;
      case 'pricing':
        return <PageShell route="pricing" wide><Pricing /></PageShell>;
      case 'testimonials':
        return <PageShell route="testimonials" wide><Testimonials /></PageShell>;
      case 'faq':
        return <PageShell route="faq" wide><Faq /></PageShell>;
      case 'contact':
        return <PageShell route="contact" wide><Contact /></PageShell>;

      /* ---------- deep pages ---------- */
      case 'blueprints': return <BlueprintsPage />;
      case 'case-studies': return <CaseStudiesPage />;
      case 'resume': return <ResumePage />;
      case 'experience': return <ExperiencePage />;
      case 'tech-stack': return <TechStackPage />;
      case 'architecture': return <ArchitecturePage />;
      case 'flutter-architecture': return <FlutterArchPage />;
      case 'performance': return <PerformancePage />;
      case 'open-source': return <OpenSourcePage />;
      case 'github': return <GitHubPage />;
      case 'writing': return <WritingPage />;
      case 'talks': return <TalksPage />;
      case 'mentorship': return <MentorshipPage />;
      case 'awards': return <AwardsPage />;
      case 'labs': return <LabsPage />;
      case 'design-system': return <DesignSystemPage />;
      case 'accessibility': return <AccessibilityPage />;
      case 'localization': return <LocalizationPage />;
      case 'legal': return <LegalPage />;

      /* ---------- 404 ---------- */
      default:
        return (
          <PageShell route="about">
            <div className="py-16 text-center">
              <p className="font-display font-black text-7xl grad-text">404</p>
              <p className="mt-4 text-[var(--dim)]">This route does not exist in the system.</p>
              <Link to="" className="btn btn-primary clip-cy mt-8 inline-flex">Return home</Link>
            </div>
          </PageShell>
        );
    }
  };

  const isHome = route === '';

  return (
    <LangCtx.Provider value={lang}>
      {loading && <Preloader onDone={() => setLoading(false)} />}
      <Cursor />
      <Background />
      <CommandPalette />
      <Navbar theme={theme} setTheme={setTheme} setLang={setLang} />

      <main className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-700'}>
        {renderRoute()}
      </main>

      <Footer />
      {isHome && <ScrollRail ids={HOME_RAIL} />}
      <ReactorAssistant />
      <BackToTop />
      {!isHome && <StickyCta />}
    </LangCtx.Provider>
  );
}
