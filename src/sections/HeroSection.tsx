import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Award, BookOpen, CheckCircle2 } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { useAppStore } from '../store/AppContext';
import { Mascot } from '../components/Mascot';
import { SpeakButton } from '../components/SpeakButton';

export const HeroSection: React.FC = () => {
  const { t } = useLang();
  const { state } = useAppStore();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950"
    >
      {/* Subtle animated gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-28 -right-24 w-96 h-96 rounded-full bg-indigo-400/15 dark:bg-indigo-500/15 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 22, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-sky-400/15 dark:bg-sky-500/10 blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7"
          >
            <p className="text-xs sm:text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-3">
              {t.hero.kicker}
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight [text-wrap:balance] mb-4">
              {t.hero.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-8">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-10">
              <button
                type="button"
                onClick={() => scrollTo('theory')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 whitespace-nowrap shrink-0"
              >
                {t.hero.startBtn}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollTo('test')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-sm sm:text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 whitespace-nowrap shrink-0"
              >
                <Award className="w-4 h-4 text-amber-500" />
                {t.hero.testBtn}
              </button>
            </div>

            {/* 3-Column Metrics Strip */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-slate-200 dark:border-slate-800 max-w-xl">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {t.hero.stats.lessons}
                </div>
                <div className="font-display text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {t.hero.stats.lessonsVal}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {t.hero.stats.exercises}
                </div>
                <div className="font-display text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {t.hero.stats.exercisesVal}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {t.hero.stats.xp}
                </div>
                <div className="font-display text-lg sm:text-2xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {state.progress.xp} XP
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Interactive Preview + Mascot Card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-5">
                <Mascot mood="idle" size={84} />
                <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5 text-sm text-slate-700 dark:text-slate-200 leading-snug">
                  {t.hero.mascotGreeting}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-3.5">
                  <div>
                    <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-0.5">
                      {t.theory.formsSection.affirmative}
                    </div>
                    <div className="font-mono text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100">
                      She <span className="text-indigo-600 dark:text-indigo-400 font-bold underline decoration-2 underline-offset-4">studies</span> English every day.
                    </div>
                  </div>
                  <SpeakButton text="She studies English every day." />
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-3.5">
                  <div>
                    <div className="text-xs font-medium text-rose-600 dark:text-rose-400 mb-0.5">
                      {t.theory.formsSection.negative}
                    </div>
                    <div className="font-mono text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100">
                      He <span className="text-rose-600 dark:text-rose-400 font-bold">doesn&apos;t</span> work on Sundays.
                    </div>
                  </div>
                  <SpeakButton text="He doesn't work on Sundays." />
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 p-3.5">
                  <div>
                    <div className="text-xs font-medium text-sky-600 dark:text-sky-400 mb-0.5">
                      {t.theory.formsSection.question}
                    </div>
                    <div className="font-mono text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100">
                      <span className="text-sky-600 dark:text-sky-400 font-bold">Does</span> the train leave at 8:00?
                    </div>
                  </div>
                  <SpeakButton text="Does the train leave at 8:00?" />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  A1–A2 Grammar
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  UZ · RU · EN
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
