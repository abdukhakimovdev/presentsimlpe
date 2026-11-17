import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Award,
  CheckCircle2,
  Clock,
  Printer,
  RotateCcw,
} from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { useAppStore } from '../store/AppContext';
import { PracticeQuestion, QUESTIONS } from '../data/questions';
import { isAnswerCorrect, shuffleArray } from '../utils/textCheck';
import { Modal } from '../components/Modal';

const TEST_DURATION_SECONDS = 15 * 60;
const TEST_QUESTION_COUNT = 25;

interface PreparedTestQ {
  question: PracticeQuestion;
  options: string[];
  words: string[];
}

function buildTestSet(): PreparedTestQ[] {
  const pool = QUESTIONS.filter((q) => q.type !== 'matching');
  return shuffleArray(pool)
    .slice(0, TEST_QUESTION_COUNT)
    .map((q) => ({
      question: q,
      options: q.options ? shuffleArray(q.options) : [],
      words: q.words ? shuffleArray(q.words) : [],
    }));
}

function computeGrade(pct: number): 'A' | 'B' | 'C' | 'D' {
  if (pct >= 90) return 'A';
  if (pct >= 75) return 'B';
  if (pct >= 60) return 'C';
  return 'D';
}

function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const FinalTestSection: React.FC = () => {
  const { t, pick } = useLang();
  const {
    state,
    setStudentName,
    recordTestResult,
    awardXp,
    unlockBadge,
    fireCelebration,
  } = useAppStore();

  const [phase, setPhase] = useState<'intro' | 'running' | 'results'>('intro');
  const [nameError, setNameError] = useState(false);
  const [testQuestions, setTestQuestions] = useState<PreparedTestQ[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [builderSelections, setBuilderSelections] = useState<Record<string, number[]>>({});
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [finalScore, setFinalScore] = useState(0);
  const [finalPercent, setFinalPercent] = useState(0);
  const [finalGrade, setFinalGrade] = useState<'A' | 'B' | 'C' | 'D'>('D');
  const [timeUsed, setTimeUsed] = useState(0);

  const finishExam = useCallback(() => {
    setConfirmOpen(false);
    let correct = 0;
    for (const item of testQuestions) {
      const q = item.question;
      const ans = answers[q.id] ?? '';
      if (q.type === 'multiple-choice' || q.type === 'do-does' || q.type === 'true-false') {
        if (ans === q.answer) correct += 1;
      } else if (q.type === 'fill-blank' || q.type === 'fix-mistake') {
        if (isAnswerCorrect(ans, q.acceptedAnswers ?? [q.answer])) correct += 1;
      } else if (q.type === 'sentence-builder') {
        const idxList = builderSelections[q.id] ?? [];
        const sentence = idxList.map((i) => item.words[i]).join(' ');
        if (isAnswerCorrect(sentence, [q.answer])) correct += 1;
      }
    }

    const pct = testQuestions.length > 0 ? Math.round((correct / testQuestions.length) * 100) : 0;
    const grade = computeGrade(pct);

    setFinalScore(correct);
    setFinalPercent(pct);
    setFinalGrade(grade);
    setTimeUsed(TEST_DURATION_SECONDS - timeLeft);
    setPhase('results');

    recordTestResult(pct, grade);
    awardXp(Math.max(20, correct * 4), true);

    if (grade === 'A' || grade === 'B') {
      unlockBadge('grammarMaster');
      fireCelebration();
    }
  }, [
    testQuestions,
    answers,
    builderSelections,
    timeLeft,
    recordTestResult,
    awardXp,
    unlockBadge,
    fireCelebration,
  ]);

  useEffect(() => {
    if (phase !== 'running') return;
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'running' && timeLeft === 0) {
      finishExam();
    }
  }, [phase, timeLeft, finishExam]);

  const handleStartTest = () => {
    if (!state.progress.studentName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    setTestQuestions(buildTestSet());
    setCurrentIdx(0);
    setAnswers({});
    setBuilderSelections({});
    setTimeLeft(TEST_DURATION_SECONDS);
    setPhase('running');
  };

  const currentItem = testQuestions[currentIdx];
  const todayFormatted = new Date().toLocaleDateString();

  return (
    <section
      id="test"
      className="py-12 sm:py-16 bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="no-print mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {t.test.heading}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {t.test.subheading}
          </p>
        </div>

        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-3">
                {t.test.rulesTitle}
              </h3>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {t.test.rulesList.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="max-w-md space-y-2">
              <label
                htmlFor="test-student-name"
                className="block text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                {t.test.studentNameLabel}
              </label>
              <input
                id="test-student-name"
                type="text"
                value={state.progress.studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (nameError) setNameError(false);
                }}
                placeholder={t.test.studentNamePlaceholder}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {nameError && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {t.test.nameRequired}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleStartTest}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base transition-colors"
            >
              <Award className="w-4 h-4" />
              {t.test.startBtn}
            </button>
          </div>
        )}

        {/* RUNNING PHASE */}
        {phase === 'running' && currentItem && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                {t.test.questionOf} {currentIdx + 1} / {testQuestions.length}
              </div>

              <div
                className={`inline-flex items-center gap-1.5 text-sm font-mono font-bold tabular-nums ${
                  timeLeft <= 60
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-indigo-600 dark:text-indigo-400'
                }`}
              >
                <Clock className="w-4 h-4" />
                {t.test.timeRemaining}: {formatSeconds(timeLeft)}
              </div>
            </div>

            {/* Question Navigator Dots */}
            <div className="flex flex-wrap gap-1.5">
              {testQuestions.map((tq, idx) => {
                const answered =
                  tq.question.type === 'sentence-builder'
                    ? (builderSelections[tq.question.id]?.length ?? 0) > 0
                    : Boolean(answers[tq.question.id]?.trim());
                const active = idx === currentIdx;
                return (
                  <button
                    key={tq.question.id}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold tabular-nums transition-colors ${
                      active
                        ? 'bg-indigo-600 text-white'
                        : answered
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Current Question */}
            <div className="space-y-4">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {pick(currentItem.question.prompt)}
              </p>

              {currentItem.question.type !== 'sentence-builder' && (
                <h3 className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white">
                  {currentItem.question.sentence}
                </h3>
              )}

              {(currentItem.question.type === 'multiple-choice' ||
                currentItem.question.type === 'do-does') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentItem.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentItem.question.id]: opt,
                        }))
                      }
                      className={`text-left px-4 py-3 rounded-xl border text-sm sm:text-base font-medium transition-colors ${
                        answers[currentItem.question.id] === opt
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-100 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {currentItem.question.type === 'true-false' && (
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  {[
                    { val: 'true', label: t.practice.trueBtn },
                    { val: 'false', label: t.practice.falseBtn },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [currentItem.question.id]: item.val,
                        }))
                      }
                      className={`px-4 py-3 rounded-xl border text-sm font-semibold transition-colors ${
                        answers[currentItem.question.id] === item.val
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-100'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              {(currentItem.question.type === 'fill-blank' ||
                currentItem.question.type === 'fix-mistake') && (
                <input
                  type="text"
                  value={answers[currentItem.question.id] ?? ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({
                      ...prev,
                      [currentItem.question.id]: e.target.value,
                    }))
                  }
                  placeholder={t.practice.typeAnswerPlaceholder}
                  className="w-full max-w-md rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-base font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              )}

              {currentItem.question.type === 'sentence-builder' && (
                <div className="space-y-3">
                  <div className="min-h-12 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 flex flex-wrap gap-2">
                    {(builderSelections[currentItem.question.id] ?? []).map((wIdx) => (
                      <button
                        key={`tb-${wIdx}`}
                        type="button"
                        onClick={() =>
                          setBuilderSelections((prev) => ({
                            ...prev,
                            [currentItem.question.id]: (
                              prev[currentItem.question.id] ?? []
                            ).filter((x) => x !== wIdx),
                          }))
                        }
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium"
                      >
                        {currentItem.words[wIdx]}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentItem.words
                      .map((_, idx) => idx)
                      .filter(
                        (idx) =>
                          !(builderSelections[currentItem.question.id] ?? []).includes(idx)
                      )
                      .map((wIdx) => (
                        <button
                          key={`ta-${wIdx}`}
                          type="button"
                          onClick={() =>
                            setBuilderSelections((prev) => ({
                              ...prev,
                              [currentItem.question.id]: [
                                ...(prev[currentItem.question.id] ?? []),
                                wIdx,
                              ],
                            }))
                          }
                          className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                        >
                          {currentItem.words[wIdx]}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-40"
                >
                  {t.test.prevBtn}
                </button>
                <button
                  type="button"
                  disabled={currentIdx === testQuestions.length - 1}
                  onClick={() =>
                    setCurrentIdx((i) => Math.min(testQuestions.length - 1, i + 1))
                  }
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-40"
                >
                  {t.test.nextBtn}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
              >
                {t.test.submitTestBtn}
              </button>
            </div>
          </div>
        )}

        {/* RESULTS & CERTIFICATE PHASE */}
        {phase === 'results' && (
          <div className="space-y-6">
            <div className="no-print rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                  {t.test.resultsHeading}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 tabular-nums">
                  {t.test.scoreLabel}: <strong>{finalScore}/{testQuestions.length} ({finalPercent}%)</strong> ·{' '}
                  {t.test.timeUsedLabel}: <strong>{formatSeconds(timeUsed)}</strong>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center px-4 py-2 rounded-xl bg-indigo-600 text-white">
                  <div className="text-[11px] opacity-80">{t.test.gradeLabel}</div>
                  <div className="font-display text-2xl font-bold">{finalGrade}</div>
                </div>
              </div>
            </div>

            {/* Animated Printable Certificate */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="print-surface rounded-2xl border-4 border-double border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-900 p-8 sm:p-12 text-center shadow-md space-y-5"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <div className="font-display text-xs sm:text-sm font-bold tracking-widest text-indigo-600 dark:text-indigo-400">
                  {t.test.certSubtitle}
                </div>
                <h3 className="font-display text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
                  {t.test.certTitle}
                </h3>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t.test.certAwardedTo}
              </p>

              <div className="font-display text-3xl sm:text-4xl font-bold text-indigo-700 dark:text-indigo-300 border-b-2 border-slate-200 dark:border-slate-700 pb-3 max-w-md mx-auto">
                {state.progress.studentName}
              </div>

              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
                {t.test.certBody}
              </p>

              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-4 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
                <div>
                  <div className="text-slate-500 dark:text-slate-400">{t.test.certScoreLabel}</div>
                  <div className="font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                    {finalPercent}% ({finalScore}/{testQuestions.length})
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">{t.test.certGradeLabel}</div>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {finalGrade}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400">{t.test.certDateLabel}</div>
                  <div className="font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                    {todayFormatted}
                  </div>
                </div>
              </div>

              <div className="pt-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
                {t.test.certSignature}
              </div>
            </motion.div>

            <div className="no-print flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
              >
                <Printer className="w-4 h-4" />
                {t.test.printCertBtn}
              </button>
              <button
                type="button"
                onClick={() => setPhase('intro')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <RotateCcw className="w-4 h-4" />
                {t.test.retakeBtn}
              </button>
            </div>
          </div>
        )}

        {/* Confirm Submit Modal */}
        <Modal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title={t.test.confirmSubmitTitle}
        >
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            {t.test.confirmSubmitBody}
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              {t.test.cancelBtn}
            </button>
            <button
              type="button"
              onClick={finishExam}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
            >
              {t.test.confirmBtn}
            </button>
          </div>
        </Modal>
      </div>
    </section>
  );
};
