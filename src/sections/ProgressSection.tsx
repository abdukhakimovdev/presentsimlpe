import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Flame,
  Lock,
  RotateCcw,
  Search,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import {
  BadgeId,
  computeLevel,
  getNextLevelThreshold,
  useAppStore,
} from '../store/AppContext';
import { Modal } from '../components/Modal';

interface CompletionRingProps {
  label: string;
  percent: number;
  detail: string;
}

const CompletionRing: React.FC<CompletionRingProps> = ({ label, percent, detail }) => {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center gap-4">
      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            className="text-slate-100 dark:text-slate-800"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-indigo-600 dark:text-indigo-400 transition-all duration-500"
          />
        </svg>
        <span className="absolute text-xs font-bold font-mono text-slate-900 dark:text-white tabular-nums">
          {clamped}%
        </span>
      </div>
      <div className="min-w-0">
        <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">
          {label}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums mt-0.5">
          {detail}
        </div>
      </div>
    </div>
  );
};

export const ProgressSection: React.FC = () => {
  const { t } = useLang();
  const { state, resetAllProgress } = useAppStore();
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const p = state.progress;
  const levelKey = computeLevel(p.xp);
  const nextThreshold = getNextLevelThreshold(p.xp);
  const xpBarPercent = nextThreshold
    ? Math.min(100, Math.round((p.xp / nextThreshold) * 100))
    : 100;

  const rings = [
    {
      label: t.progress.sections.theory,
      percent: Math.round((Math.min(p.theoryTabsVisited.length, 6) / 6) * 100),
      detail: `${Math.min(p.theoryTabsVisited.length, 6)} / 6`,
    },
    {
      label: t.progress.sections.practice,
      percent: Math.round((Math.min(p.practiceSolvedIds.length, 66) / 66) * 100),
      detail: `${p.practiceSolvedIds.length} / 66`,
    },
    {
      label: t.progress.sections.games,
      percent: Math.round((Math.min(p.gamesPlayed.length, 4) / 4) * 100),
      detail: `${p.gamesPlayed.length} / 4`,
    },
    {
      label: t.progress.sections.flashcards,
      percent: Math.round((Math.min(p.flashcardsKnown.length, 45) / 45) * 100),
      detail: `${p.flashcardsKnown.length} / 45`,
    },
    {
      label: t.progress.sections.tasks,
      percent: Math.round((Math.min(p.tasksCompleted.length, 5) / 5) * 100),
      detail: `${p.tasksCompleted.length} / 5`,
    },
    {
      label: t.progress.sections.homework,
      percent: Math.round((Math.min(p.homeworkCompleted.length, 3) / 3) * 100),
      detail: `${p.homeworkCompleted.length} / 3`,
    },
    {
      label: t.progress.sections.test,
      percent: p.testBestScore ?? 0,
      detail: p.testBestGrade ? `${p.testBestScore}% (${p.testBestGrade})` : '0%',
    },
  ];

  const badgeDefs: Array<{
    id: BadgeId;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'firstSteps', icon: Sparkles },
    { id: 'perfectScore', icon: Trophy },
    { id: 'speedster', icon: Zap },
    { id: 'weekStreak', icon: Flame },
    { id: 'mistakeHunter', icon: Search },
    { id: 'grammarMaster', icon: Award },
  ];

  return (
    <section id="progress" className="no-print py-12 sm:py-16 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {t.progress.heading}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {t.progress.subheading}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900/70 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4" />
            {t.progress.resetBtn}
          </button>
        </div>

        {/* Top 3 KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {t.progress.totalXp}
            </div>
            <div className="font-display text-3xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {p.xp} XP
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t.progress.currentLevel}
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                {nextThreshold ? `${t.progress.nextLevelXp} ${nextThreshold - p.xp} XP` : t.progress.maxLevelReached}
              </span>
            </div>
            <div className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-3">
              {t.progress.levels[levelKey]}
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <motion.div
                animate={{ width: `${xpBarPercent}%` }}
                className="h-full rounded-full bg-indigo-600"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {t.progress.dailyStreak}
            </div>
            <div className="font-display text-3xl font-bold text-amber-600 dark:text-amber-400 tabular-nums flex items-center gap-2">
              <Flame className="w-7 h-7" />
              {p.dailyStreak} {t.progress.daysUnit}
            </div>
          </div>
        </div>

        {/* Section Completion Rings */}
        <div>
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-4">
            {t.progress.completionTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rings.map((ring) => (
              <CompletionRing
                key={ring.label}
                label={ring.label}
                percent={ring.percent}
                detail={ring.detail}
              />
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div>
          <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-4">
            {t.progress.badgesTitle}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badgeDefs.map((b) => {
              const unlocked = p.badges.includes(b.id);
              const Icon = b.icon;
              const info = t.progress.badges[b.id];

              return (
                <div
                  key={b.id}
                  className={`rounded-2xl border p-5 flex items-start gap-4 transition-colors ${
                    unlocked
                      ? 'border-amber-200 dark:border-amber-900/70 bg-white dark:bg-slate-900'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/50 opacity-75'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      unlocked
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {unlocked ? <Icon className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-display font-bold text-slate-900 dark:text-white text-base">
                        {info.title}
                      </h4>
                      <span
                        className={`text-xs font-semibold ${
                          unlocked
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {unlocked ? t.progress.unlockedLabel : t.progress.lockedLabel}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      {info.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset Confirmation Modal */}
        <Modal
          open={resetModalOpen}
          onClose={() => setResetModalOpen(false)}
          title={t.progress.resetModalTitle}
        >
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            {t.progress.resetModalBody}
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setResetModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              {t.progress.resetCancelBtn}
            </button>
            <button
              type="button"
              onClick={() => {
                resetAllProgress();
                setResetModalOpen(false);
              }}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold"
            >
              {t.progress.resetConfirmBtn}
            </button>
          </div>
        </Modal>
      </div>
    </section>
  );
};
