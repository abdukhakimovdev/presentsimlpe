import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Dumbbell,
  Gamepad2,
  Layers,
  Lock,
  Unlock,
} from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { useAppStore } from '../store/AppContext';

export const RoadmapSection: React.FC = () => {
  const { t } = useLang();
  const { state } = useAppStore();
  const p = state.progress;

  const steps = [
    {
      key: 'learn' as const,
      target: 'theory',
      icon: BookOpen,
      completed: p.theoryTabsVisited.length >= 4,
      unlocked: true,
      progressText: `${Math.min(p.theoryTabsVisited.length, 6)} / 6`,
    },
    {
      key: 'examples' as const,
      target: 'flashcards',
      icon: Layers,
      completed: p.flashcardsKnown.length >= 10,
      unlocked: true,
      progressText: `${p.flashcardsKnown.length} / 45`,
    },
    {
      key: 'practice' as const,
      target: 'practice',
      icon: Dumbbell,
      completed: p.practiceSolvedIds.length >= 15,
      unlocked: p.theoryTabsVisited.length >= 1,
      progressText: `${p.practiceSolvedIds.length} / 66`,
    },
    {
      key: 'games' as const,
      target: 'games',
      icon: Gamepad2,
      completed: p.gamesPlayed.length >= 2,
      unlocked: p.practiceSolvedIds.length >= 3 || p.xp >= 20,
      progressText: `${p.gamesPlayed.length} / 4`,
    },
    {
      key: 'homework' as const,
      target: 'homework',
      icon: ClipboardCheck,
      completed: p.homeworkCompleted.length >= 1 && p.tasksCompleted.length >= 1,
      unlocked: p.gamesPlayed.length >= 1 || p.practiceSolvedIds.length >= 5,
      progressText: `${p.homeworkCompleted.length} / 3`,
    },
    {
      key: 'test' as const,
      target: 'test',
      icon: Award,
      completed: p.testBestScore !== null && p.testBestScore >= 60,
      unlocked: p.xp >= 50 || p.homeworkCompleted.length >= 1 || p.practiceSolvedIds.length >= 10,
      progressText: p.testBestScore !== null ? `${p.testBestScore}%` : '0 / 25',
    },
  ];

  const handleOpen = (target: string) => {
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `#${target}`);
    }
  };

  return (
    <section id="roadmap" className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {t.roadmap.heading}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            {t.roadmap.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const info = t.roadmap.steps[step.key];

            return (
              <motion.button
                key={step.key}
                type="button"
                onClick={() => handleOpen(step.target)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                className="text-left group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        step.completed
                          ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400'
                          : step.unlocked
                            ? 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium tabular-nums">
                      {step.completed ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t.roadmap.completed}
                        </span>
                      ) : step.unlocked ? (
                        <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                          <Unlock className="w-3.5 h-3.5" />
                          {t.roadmap.unlocked}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                          <Lock className="w-3.5 h-3.5" />
                          {step.progressText}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {info.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {info.desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
                  <span className="text-slate-500 dark:text-slate-400 tabular-nums">
                    {step.progressText}
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                    {t.roadmap.openStep} →
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
