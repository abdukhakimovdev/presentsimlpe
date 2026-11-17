import React, { useState } from 'react';
import { CheckCircle2, Eye, EyeOff, RotateCcw, XCircle } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { useAppStore } from '../store/AppContext';
import {
  READING_PASSAGE,
  TASK_1_TABLE,
  TASK_2_CHECKLIST,
  TASK_2_MODEL,
  TASK_3_QUESTIONS,
  TASK_4_TRANSFORMS,
} from '../data/tasksHomework';
import { isAnswerCorrect } from '../utils/textCheck';
import { SpeakButton } from '../components/SpeakButton';

export const TasksSection: React.FC = () => {
  const { t, pick } = useLang();
  const { state, completeTask, awardXp } = useAppStore();

  const [activeTask, setActiveTask] = useState<number>(1);

  // Task 1: Table
  const [t1Inputs, setT1Inputs] = useState<Record<string, string>>({});
  const [t1Checked, setT1Checked] = useState(false);

  // Task 2: Free writing
  const [t2Text, setT2Text] = useState('');
  const [t2Checklist, setT2Checklist] = useState<Record<number, boolean>>({});
  const [t2ShowModel, setT2ShowModel] = useState(false);

  // Task 3: Make questions
  const [t3Inputs, setT3Inputs] = useState<Record<string, string>>({});
  const [t3Checked, setT3Checked] = useState(false);

  // Task 4: Transform Aff -> Neg & Q
  const [t4Neg, setT4Neg] = useState<Record<string, string>>({});
  const [t4Q, setT4Q] = useState<Record<string, string>>({});
  const [t4Checked, setT4Checked] = useState(false);

  // Task 5: Reading
  const [t5Answers, setT5Answers] = useState<Record<string, string>>({});
  const [t5Checked, setT5Checked] = useState(false);
  const [t5ShowTr, setT5ShowTr] = useState(false);

  const taskDone = (num: number) => state.progress.tasksCompleted.includes(num);

  // Calculations
  const t1Score = TASK_1_TABLE.filter((r) =>
    isAnswerCorrect(t1Inputs[r.id] ?? '', [r.expected])
  ).length;

  const t2Words = t2Text.trim() ? t2Text.trim().split(/\s+/).length : 0;
  const t2Sentences = t2Text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean).length;

  const t3Score = TASK_3_QUESTIONS.filter((q) =>
    isAnswerCorrect(t3Inputs[q.id] ?? '', q.accepted)
  ).length;

  const t4Total = TASK_4_TRANSFORMS.length * 2;
  const t4Score = TASK_4_TRANSFORMS.reduce((acc, item) => {
    const negOk = isAnswerCorrect(t4Neg[item.id] ?? '', item.negativeAccepted) ? 1 : 0;
    const qOk = isAnswerCorrect(t4Q[item.id] ?? '', item.questionAccepted) ? 1 : 0;
    return acc + negOk + qOk;
  }, 0);

  const t5Score = READING_PASSAGE.questions.filter(
    (q) => t5Answers[q.id] === q.answer
  ).length;

  const markComplete = (num: number, earnedScore: number, total: number) => {
    if (!taskDone(num) && earnedScore >= Math.ceil(total * 0.6)) {
      completeTask(num);
      awardXp(20, true);
    }
  };

  return (
    <section
      id="tasks"
      className="py-12 sm:py-16 bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {t.tasks.heading}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {t.tasks.subheading}
          </p>
        </div>

        {/* 5 Task Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
          {[1, 2, 3, 4, 5].map((num) => {
            const active = activeTask === num;
            const done = taskDone(num);
            return (
              <button
                key={num}
                type="button"
                onClick={() => setActiveTask(num)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>
                  {t.tasks.taskTab} {num}
                </span>
                {done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Active Task Container */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 p-5 sm:p-7 shadow-sm">
          {/* TASK 1: Table */}
          {activeTask === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  {t.tasks.taskTitles.t1}
                </h3>
                {t1Checked && (
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {t.tasks.scoreResult} {t1Score}/{TASK_1_TABLE.length}
                  </span>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                      <th className="py-2 pr-4">{t.tasks.tableCols.subject}</th>
                      <th className="py-2 pr-4">{t.tasks.tableCols.baseVerb}</th>
                      <th className="py-2">{t.tasks.tableCols.presentForm}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                    {TASK_1_TABLE.map((row) => {
                      const ok = isAnswerCorrect(t1Inputs[row.id] ?? '', [row.expected]);
                      return (
                        <tr key={row.id}>
                          <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">
                            {row.pronoun}
                          </td>
                          <td className="py-3 pr-4 font-mono text-slate-600 dark:text-slate-300">
                            ({row.verbBase})
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={t1Inputs[row.id] ?? ''}
                                onChange={(e) => {
                                  setT1Inputs((prev) => ({ ...prev, [row.id]: e.target.value }));
                                  setT1Checked(false);
                                }}
                                placeholder="..."
                                className="w-36 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                              {t1Checked &&
                                (ok ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs font-mono text-rose-600 dark:text-rose-400">
                                    <XCircle className="w-4 h-4 shrink-0" />
                                    {row.expected}
                                  </span>
                                ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setT1Checked(true);
                    markComplete(1, t1Score, TASK_1_TABLE.length);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
                >
                  {t.tasks.checkTaskBtn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setT1Inputs({});
                    setT1Checked(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t.tasks.resetTaskBtn}
                </button>
              </div>
            </div>
          )}

          {/* TASK 2: Free Writing */}
          {activeTask === 2 && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  {t.tasks.taskTitles.t2}
                </h3>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                  {t.tasks.sentenceCount} <strong>{t2Sentences}</strong> · {t.tasks.wordCount}{' '}
                  <strong>{t2Words}</strong>
                </div>
              </div>

              <textarea
                rows={5}
                value={t2Text}
                onChange={(e) => setT2Text(e.target.value)}
                placeholder="I wake up at 6:30 a.m. I wash my face..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-2.5">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t.tasks.selfCheckTitle}
                </div>
                {TASK_2_CHECKLIST.map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(t2Checklist[idx])}
                      onChange={(e) => {
                        const next = { ...t2Checklist, [idx]: e.target.checked };
                        setT2Checklist(next);
                        const allChecked = TASK_2_CHECKLIST.every((_, i) => next[i]);
                        if (allChecked && t2Words >= 20) {
                          markComplete(2, 1, 1);
                        }
                      }}
                      className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{pick(item)}</span>
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setT2ShowModel((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-sm font-semibold"
                >
                  {t2ShowModel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {t2ShowModel ? t.tasks.hideModelBtn : t.tasks.showModelBtn}
                </button>
                {t2Words >= 25 && !taskDone(2) && (
                  <button
                    type="button"
                    onClick={() => markComplete(2, 1, 1)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
                  >
                    {t.tasks.completedBadge} (+20 XP)
                  </button>
                )}
              </div>

              {t2ShowModel && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 flex items-start justify-between gap-3">
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    {TASK_2_MODEL}
                  </p>
                  <SpeakButton text={TASK_2_MODEL} />
                </div>
              )}
            </div>
          )}

          {/* TASK 3: Make Questions */}
          {activeTask === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  {t.tasks.taskTitles.t3}
                </h3>
                {t3Checked && (
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {t.tasks.scoreResult} {t3Score}/{TASK_3_QUESTIONS.length}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {TASK_3_QUESTIONS.map((q) => {
                  const ok = isAnswerCorrect(t3Inputs[q.id] ?? '', q.accepted);
                  return (
                    <div
                      key={q.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-2"
                    >
                      <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {pick(q.prompt)}
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        A: {q.givenAnswer}
                      </p>
                      <input
                        type="text"
                        value={t3Inputs[q.id] ?? ''}
                        onChange={(e) => {
                          setT3Inputs((prev) => ({ ...prev, [q.id]: e.target.value }));
                          setT3Checked(false);
                        }}
                        placeholder="Q: ..."
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {t3Checked && (
                        <div className="text-xs font-medium flex items-center gap-1.5">
                          {ok ? (
                            <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              {q.accepted[1] ?? q.accepted[0]}
                            </span>
                          ) : (
                            <span className="text-rose-600 dark:text-rose-400 inline-flex items-center gap-1">
                              <XCircle className="w-4 h-4" />
                              {q.accepted[1] ?? q.accepted[0]}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setT3Checked(true);
                    markComplete(3, t3Score, TASK_3_QUESTIONS.length);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
                >
                  {t.tasks.checkTaskBtn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setT3Inputs({});
                    setT3Checked(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t.tasks.resetTaskBtn}
                </button>
              </div>
            </div>
          )}

          {/* TASK 4: Convert Aff -> Neg -> Q */}
          {activeTask === 4 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  {t.tasks.taskTitles.t4}
                </h3>
                {t4Checked && (
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {t.tasks.scoreResult} {t4Score}/{t4Total}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {TASK_4_TRANSFORMS.map((item) => {
                  const negOk = isAnswerCorrect(t4Neg[item.id] ?? '', item.negativeAccepted);
                  const qOk = isAnswerCorrect(t4Q[item.id] ?? '', item.questionAccepted);
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3"
                    >
                      <div className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                        (+) {item.affirmative}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-rose-600 dark:text-rose-400 font-semibold mb-1">
                            {t.tasks.negativeLabel}
                          </label>
                          <input
                            type="text"
                            value={t4Neg[item.id] ?? ''}
                            onChange={(e) => {
                              setT4Neg((prev) => ({ ...prev, [item.id]: e.target.value }));
                              setT4Checked(false);
                            }}
                            placeholder="She doesn't..."
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          {t4Checked && (
                            <p
                              className={`text-xs mt-1 font-mono ${
                                negOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {negOk ? '✓' : item.negativeAccepted[0]}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs text-sky-600 dark:text-sky-400 font-semibold mb-1">
                            {t.tasks.questionLabel}
                          </label>
                          <input
                            type="text"
                            value={t4Q[item.id] ?? ''}
                            onChange={(e) => {
                              setT4Q((prev) => ({ ...prev, [item.id]: e.target.value }));
                              setT4Checked(false);
                            }}
                            placeholder="Does she...?"
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          {t4Checked && (
                            <p
                              className={`text-xs mt-1 font-mono ${
                                qOk ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {qOk ? '✓' : item.questionAccepted[1] ?? item.questionAccepted[0]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setT4Checked(true);
                    markComplete(4, t4Score, t4Total);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
                >
                  {t.tasks.checkTaskBtn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setT4Neg({});
                    setT4Q({});
                    setT4Checked(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t.tasks.resetTaskBtn}
                </button>
              </div>
            </div>
          )}

          {/* TASK 5: Reading Comprehension */}
          {activeTask === 5 && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  5. {t.tasks.readingTextTitle}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setT5ShowTr((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200"
                  >
                    {t5ShowTr ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {t5ShowTr ? t.theory.hideTranslation : t.theory.showTranslation}
                  </button>
                  <SpeakButton text={READING_PASSAGE.en} />
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed space-y-3">
                <p>{READING_PASSAGE.en}</p>
                {t5ShowTr && (
                  <p className="pt-3 border-t border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {pick(READING_PASSAGE.tr)}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {READING_PASSAGE.questions.map((q, idx) => {
                  const selected = t5Answers[q.id] ?? '';
                  return (
                    <div
                      key={q.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4"
                    >
                      <p className="font-semibold text-sm text-slate-900 dark:text-white mb-2.5">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const isChosen = selected === opt;
                          const isCorrectOpt = opt === q.answer;
                          let cls =
                            'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-indigo-400 text-slate-800 dark:text-slate-200';
                          if (t5Checked) {
                            if (isCorrectOpt) {
                              cls =
                                'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                            } else if (isChosen) {
                              cls =
                                'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                            }
                          } else if (isChosen) {
                            cls =
                              'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-100';
                          }
                          return (
                            <button
                              key={opt}
                              type="button"
                              disabled={t5Checked}
                              onClick={() =>
                                setT5Answers((prev) => ({ ...prev, [q.id]: opt }))
                              }
                              className={`text-left px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm transition-colors ${cls}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setT5Checked(true);
                      markComplete(5, t5Score, READING_PASSAGE.questions.length);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
                  >
                    {t.tasks.checkTaskBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setT5Answers({});
                      setT5Checked(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t.tasks.resetTaskBtn}
                  </button>
                </div>

                {t5Checked && (
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {t.tasks.scoreResult} {t5Score}/{READING_PASSAGE.questions.length}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
