import React, { Suspense, lazy, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { LanguageProvider, useLang } from './i18n/LanguageContext';
import { AppProvider } from './store/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { HeroSection } from './sections/HeroSection';
import { RoadmapSection } from './sections/RoadmapSection';
import { useActiveSection } from './hooks/useActiveSection';

const TheorySection = lazy(() =>
  import('./sections/TheorySection').then((m) => ({ default: m.TheorySection }))
);
const PracticeSection = lazy(() =>
  import('./sections/PracticeSection').then((m) => ({ default: m.PracticeSection }))
);
const GamesSection = lazy(() =>
  import('./sections/GamesSection').then((m) => ({ default: m.GamesSection }))
);
const FlashcardsSection = lazy(() =>
  import('./sections/FlashcardsSection').then((m) => ({ default: m.FlashcardsSection }))
);
const TasksSection = lazy(() =>
  import('./sections/TasksSection').then((m) => ({ default: m.TasksSection }))
);
const HomeworkSection = lazy(() =>
  import('./sections/HomeworkSection').then((m) => ({ default: m.HomeworkSection }))
);
const FinalTestSection = lazy(() =>
  import('./sections/FinalTestSection').then((m) => ({ default: m.FinalTestSection }))
);
const ProgressSection = lazy(() =>
  import('./sections/ProgressSection').then((m) => ({ default: m.ProgressSection }))
);

const SECTION_IDS = [
  'hero',
  'roadmap',
  'theory',
  'practice',
  'games',
  'flashcards',
  'tasks',
  'homework',
  'test',
  'progress',
];

const SectionFallback: React.FC = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
    <div className="h-48 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 animate-pulse" />
  </div>
);

const NotFoundFallback: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
  const { t } = useLang();
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
        <div className="font-display text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">
          404
        </div>
        <h1 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">
          {t.errors.notFoundTitle}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          {t.errors.notFoundDesc}
        </p>
        <button
          type="button"
          onClick={onGoHome}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
        >
          {t.errors.goHomeBtn}
        </button>
      </div>
    </div>
  );
};

const MainShell: React.FC = () => {
  const [isNotFound, setIsNotFound] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const p = window.location.pathname;
    return p !== '/' && p !== '/index.html';
  });
  const activeSection = useActiveSection(SECTION_IDS, isNotFound);

  const handleReturnHome = () => {
    window.history.replaceState(null, '', '/');
    setIsNotFound(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar activeSection={activeSection} />
      <main className="flex-1">
        {isNotFound ? (
          <NotFoundFallback onGoHome={handleReturnHome} />
        ) : (
          <>
            <HeroSection />
            <RoadmapSection />
            <Suspense fallback={<SectionFallback />}>
              <TheorySection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <PracticeSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <GamesSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <FlashcardsSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <TasksSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <HomeworkSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <FinalTestSection />
            </Suspense>
            <Suspense fallback={<SectionFallback />}>
              <ProgressSection />
            </Suspense>
          </>
        )}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <ErrorBoundary>
          <AppProvider>
            <MainShell />
          </AppProvider>
        </ErrorBoundary>
      </LanguageProvider>
    </MotionConfig>
  );
}
