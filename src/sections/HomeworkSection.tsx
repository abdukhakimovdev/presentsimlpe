import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Printer,
  RotateCcw,
  Save,
  XCircle,
} from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { useAppStore } from '../store/AppContext';
import { HOMEWORK_SETS } from '../data/tasksHomework';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { isAnswerCorrect } from '../utils/textCheck';

type HomeworkLevel = 'easy' | 'medium' | 'hard';

const HW_DRAFT_KEY = 'ps_academy_hw_drafts_v1';

interface HomeworkDrafts {
  answers: Record<string, string>;
  writing: string;
}

export const HomeworkSection: React.FC = () => {
  const { t, pick } = useLang();
  const {
    state,
    setStudentName,
    completeHomework,
    awardXp,
    unlockBadge,
    notifySaved,
  } = useAppStore();

  const [level, setLevel] = useState<HomeworkLevel>('easy');
  const [drafts, setDrafts] = useState<HomeworkDrafts>(() =>
    getStorageItem<HomeworkDrafts>(HW_DRAFT_KEY, { answers: {}, writing: '' })
  );
  const [submitted, setSubmitted] = useState<Record<HomeworkLevel, boolean>>({
    easy: false,
    medium: false,
    hard: false,
  });
  const [rubricChecked, setRubricChecked] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  const exercises = HOMEWORK_SETS[level];
  const isSubmitted = submitted[level];

  const correctCount = exercises.filter((ex) =>
    isAnswerCorrect(drafts.answers[ex.id] ?? '', ex.accepted)
  ).length;
  const percent = Math.round((correctCount / exercises.length) * 100);

  const writingWordCount = drafts.writing.trim()
    ? drafts.writing.trim().split(/\s+/).length
    : 0;

  const handleAnswerChange = (id: string, val: string) => {
    setDrafts((prev) => ({
      ...prev,
      answers: { ...prev.answers, [id]: val },
    }));
    if (isSubmitted) {
      setSubmitted((prev) => ({ ...prev, [level]: false }));
    }
  };

  const handleSaveProgress = () => {
    setStorageItem(HW_DRAFT_KEY, drafts);
    notifySaved();
  };

  const handleSubmit = () => {
    setStorageItem(HW_DRAFT_KEY, drafts);
    setSubmitted((prev) => ({ ...prev, [level]: true }));
    if (!state.progress.homeworkCompleted.includes(level)) {
      completeHomework(level);
      awardXp(Math.max(15, correctCount * 3), true);
    }
    if (correctCount === exercises.length) {
      unlockBadge('perfectScore');
    }
  };

  const handleResetSet = () => {
    const nextAnswers = { ...drafts.answers };
    for (const ex of exercises) {
      delete nextAnswers[ex.id];
    }
    const updated = { ...drafts, answers: nextAnswers };
    setDrafts(updated);
    setStorageItem(HW_DRAFT_KEY, updated);
    setSubmitted((prev) => ({ ...prev, [level]: false }));
  };

  const handleCopySummary = async () => {
    const student = state.progress.studentName || 'Student';
    const summary = [
      `Present Simple Academy — ${t.homework.heading}`,
      `${t.homework.studentNameLabel} ${student}`,
      `Level: ${level.toUpperCase()}`,
      `Score: ${correctCount}/${exercises.length} (${percent}%)`,
      `Writing words: ${writingWordCount}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard API fallback ignored if restricted
    }
  };

  return (
    <section id="homework" className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {t.homework.heading}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {t.homework.subheading}
          </p>
        </div>

        {/* Student Name & Set Selector */}
        <div className="print-surface rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="w-full md:max-w-xs">
              <label
                htmlFor="hw-student-name"
                className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
              >
                {t.homework.studentNameLabel}
              </label>
              <input
                id="hw-student-name"
                type="text"
                value={state.progress.studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder={t.homework.studentNamePlaceholder}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="no-print flex flex-wrap gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/60 p-1">
              {(
                [
                  { id: 'easy', label: t.homework.setEasy },
                  { id: 'medium', label: t.homework.setMedium },
                  { id: 'hard', label: t.homework.setHard },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLevel(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                    level === item.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 10 Mixed Exercises */}
          <div className="space-y-4">
            {exercises.map((ex, idx) => {
              const userVal = drafts.answers[ex.id] ?? '';
              const isOk = isAnswerCorrect(userVal, ex.accepted);

              return (
                <div
                  key={ex.id}
                  className={`rounded-xl border p-4 transition-colors ${
                    isSubmitted
                      ? isOk
                        ? 'border-emerald-300 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20'
                        : 'border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {idx + 1}. {pick(ex.prompt)}
                    </span>
                    {isSubmitted &&
                      (isOk ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      ))}
                  </div>

                  <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white mb-3">
                    {ex.sentence}
                  </p>

                  {ex.type === 'choice' && ex.options ? (
                    <div className="flex flex-wrap gap-2">
                      {ex.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleAnswerChange(ex.id, opt)}
                          className={`px-3.5 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${
                            userVal === opt
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={userVal}
                      onChange={(e) => handleAnswerChange(ex.id, e.target.value)}
                      placeholder="..."
                      className="w-full max-w-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  )}

                  {isSubmitted && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-700/70 text-xs space-y-1">
                      {!isOk && (
                        <p className="font-mono text-emerald-700 dark:text-emerald-400">
                          {t.practice.correctAnswerLabel} <strong>{ex.accepted[0]}</strong>
                        </p>
                      )}
                      <p className="text-slate-600 dark:text-slate-300">
                        <strong>{t.homework.explanationTitle}</strong> {pick(ex.explanation)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Score Banner when submitted */}
          {isSubmitted && (
            <div className="rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/70 dark:bg-indigo-950/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {t.homework.scoreTitle}
                </div>
                <div className="font-display text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {correctCount} / {exercises.length} ({percent}%)
                </div>
              </div>

              <div className="no-print flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? t.homework.copiedNotice : t.homework.copySummaryBtn}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-semibold"
                >
                  <Printer className="w-4 h-4" />
                  {t.homework.printBtn}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="no-print flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
            >
              {t.homework.submitBtn}
            </button>
            <button
              type="button"
              onClick={handleSaveProgress}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Save className="w-4 h-4" />
              {t.homework.saveProgressBtn}
            </button>
            <button
              type="button"
              onClick={handleResetSet}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RotateCcw className="w-4 h-4" />
              {t.homework.resetBtn}
            </button>
          </div>

          {/* Writing Prompt + Word Counter + Rubric */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                {t.homework.writingSectionTitle}
              </h3>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                {t.homework.wordsLabel} <strong>{writingWordCount}</strong>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t.homework.writingPrompt}
            </p>
            <textarea
              rows={4}
              value={drafts.writing}
              onChange={(e) =>
                setDrafts((prev) => ({ ...prev, writing: e.target.value }))
              }
              placeholder={t.homework.writingPlaceholder}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-2">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {t.homework.rubricTitle}
              </div>
              {t.homework.rubricItems.map((item, idx) => (
                <label
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(rubricChecked[idx])}
                    onChange={(e) =>
                      setRubricChecked((prev) => ({
                        ...prev,
                        [idx]: e.target.checked,
                      }))
                    }
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
