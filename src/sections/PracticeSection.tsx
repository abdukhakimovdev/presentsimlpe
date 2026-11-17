import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Flame,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { useAppStore } from '../store/AppContext';
import { Difficulty, PracticeQuestion, QUESTIONS } from '../data/questions';
import { isAnswerCorrect, shuffleArray } from '../utils/textCheck';
import { Mascot, MascotMood } from '../components/Mascot';
import { SpeakButton } from '../components/SpeakButton';

type LevelFilter = Difficulty | 'all';

interface SessionQuestion {
  question: PracticeQuestion;
  shuffledOptions: string[];
  shuffledWords: string[];
  shuffledPairVerbs: string[];
}

interface MistakeRecord {
  question: PracticeQuestion;
  userAnswer: string;
}

function prepareQuestion(q: PracticeQuestion): SessionQuestion {
  return {
    question: q,
    shuffledOptions: q.options ? shuffleArray(q.options) : [],
    shuffledWords: q.words ? shuffleArray(q.words) : [],
    shuffledPairVerbs: q.pairs ? shuffleArray(q.pairs.map((p) => p.verb)) : [],
  };
}

export const PracticeSection: React.FC = () => {
  const { t, pick } = useLang();
  const { awardXp, unlockBadge, recordPracticeSolved, fireCelebration } = useAppStore();

  const [levelFilter, setLevelFilter] = useState<LevelFilter>('easy');
  const [sessionList, setSessionList] = useState<SessionQuestion[]>(() =>
    shuffleArray(QUESTIONS.filter((q) => q.level === 'easy')).slice(0, 12).map(prepareQuestion)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [finished, setFinished] = useState(false);

  // Per-question answer states
  const [selectedOption, setSelectedOption] = useState('');
  const [typedAnswer, setTypedAnswer] = useState('');
  const [builtWords, setBuiltWords] = useState<number[]>([]);
  const [matchingSelections, setMatchingSelections] = useState<Record<string, string>>({});

  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [emptyWarn, setEmptyWarn] = useState(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>('thinking');

  const currentItem = sessionList[currentIndex];

  const resetInputs = () => {
    setSelectedOption('');
    setTypedAnswer('');
    setBuiltWords([]);
    setMatchingSelections({});
    setChecked(false);
    setIsCorrect(false);
    setEmptyWarn(false);
    setMascotMood('thinking');
  };

  const startNewSession = (lvl: LevelFilter, customQuestions?: PracticeQuestion[]) => {
    const pool =
      customQuestions ??
      (lvl === 'all' ? QUESTIONS : QUESTIONS.filter((q) => q.level === lvl));
    const count = customQuestions ? customQuestions.length : lvl === 'all' ? 18 : 12;
    const prepared = shuffleArray(pool).slice(0, count).map(prepareQuestion);
    setLevelFilter(lvl);
    setSessionList(prepared);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSessionXp(0);
    setMistakes([]);
    setFinished(false);
    resetInputs();
  };

  const availableWordIndices = useMemo(() => {
    if (!currentItem) return [];
    return currentItem.shuffledWords.map((_, idx) => idx).filter((idx) => !builtWords.includes(idx));
  }, [currentItem, builtWords]);

  const handleCheck = () => {
    if (!currentItem || checked) return;
    const q = currentItem.question;
    let userVal = '';
    let correct = false;

    if (q.type === 'multiple-choice' || q.type === 'do-does' || q.type === 'true-false') {
      if (!selectedOption) {
        setEmptyWarn(true);
        return;
      }
      userVal = selectedOption;
      correct = selectedOption === q.answer;
    } else if (q.type === 'fill-blank' || q.type === 'fix-mistake') {
      if (!typedAnswer.trim()) {
        setEmptyWarn(true);
        return;
      }
      userVal = typedAnswer.trim();
      correct = isAnswerCorrect(userVal, q.acceptedAnswers ?? [q.answer]);
    } else if (q.type === 'sentence-builder') {
      if (builtWords.length !== currentItem.shuffledWords.length) {
        setEmptyWarn(true);
        return;
      }
      userVal = builtWords.map((i) => currentItem.shuffledWords[i]).join(' ');
      correct = isAnswerCorrect(userVal, [q.answer]);
    } else if (q.type === 'matching' && q.pairs) {
      const allChosen = q.pairs.every((pair) => Boolean(matchingSelections[pair.subject]));
      if (!allChosen) {
        setEmptyWarn(true);
        return;
      }
      userVal = q.pairs.map((p) => `${p.subject}→${matchingSelections[p.subject]}`).join(', ');
      correct = q.pairs.every((p) => matchingSelections[p.subject] === p.verb);
    }

    setEmptyWarn(false);
    setChecked(true);
    setIsCorrect(correct);

    if (correct) {
      const nextStreak = streak + 1;
      const bonus = nextStreak >= 3 ? 15 : 10;
      setScore((s) => s + 1);
      setStreak(nextStreak);
      setSessionXp((x) => x + bonus);
      setMascotMood('happy');
      awardXp(bonus, false);
      recordPracticeSolved([q.id]);
      if (nextStreak === 5) {
        fireCelebration();
      }
    } else {
      setStreak(0);
      setMascotMood('sad');
      setMistakes((prev) => [...prev, { question: q, userAnswer: userVal }]);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < sessionList.length) {
      setCurrentIndex((i) => i + 1);
      resetInputs();
    } else {
      setFinished(true);
      if (mistakes.length === 0 && sessionList.length >= 10) {
        unlockBadge('perfectScore');
        fireCelebration();
      }
    }
  };

  const accuracy = sessionList.length > 0 ? Math.round((score / sessionList.length) * 100) : 0;

  return (
    <section id="practice" className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {t.practice.heading}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {t.practice.subheading}
            </p>
          </div>

          {/* Level Selector */}
          <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 self-start md:self-auto">
            {(['easy', 'medium', 'hard', 'all'] as LevelFilter[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => startNewSession(lvl)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  levelFilter === lvl
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t.practice.levels[lvl]}
              </button>
            ))}
          </div>
        </div>

        {/* Main Quiz Card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-8 shadow-sm">
          {!finished && currentItem ? (
            <div>
              {/* Top Stats & Progress Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs sm:text-sm">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium tabular-nums">
                  <span>
                    {t.practice.questionProgress} {currentIndex + 1} / {sessionList.length}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                    {t.practice.typeLabels[currentItem.question.type]}
                  </span>
                </div>

                <div className="flex items-center gap-4 tabular-nums font-semibold">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {t.practice.scoreLabel}: {score}
                  </span>
                  <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Flame className="w-4 h-4" />
                    {streak}
                  </span>
                  <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                    +{sessionXp} XP
                  </span>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-6">
                <motion.div
                  animate={{ width: `${((currentIndex + (checked ? 1 : 0)) / sessionList.length) * 100}%` }}
                  transition={{ duration: 0.25 }}
                  className="h-full rounded-full bg-indigo-600"
                />
              </div>

              {/* Question Body */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentItem.question.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={
                    checked && !isCorrect
                      ? { opacity: 1, x: [0, -8, 8, -5, 5, 0] }
                      : { opacity: 1, x: 0 }
                  }
                  transition={{ duration: 0.28 }}
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">
                        {pick(currentItem.question.prompt)}
                      </p>
                      {currentItem.question.type !== 'sentence-builder' &&
                        currentItem.question.type !== 'matching' && (
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg sm:text-2xl font-semibold text-slate-900 dark:text-white leading-snug">
                              {currentItem.question.sentence}
                            </h3>
                            <SpeakButton
                              text={currentItem.question.sentence.replace('___', currentItem.question.answer)}
                            />
                          </div>
                        )}
                    </div>
                    <Mascot mood={mascotMood} size={64} className="hidden sm:inline-flex shrink-0" />
                  </div>

                  {/* Type: Multiple Choice / Do-Does */}
                  {(currentItem.question.type === 'multiple-choice' ||
                    currentItem.question.type === 'do-does') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {currentItem.shuffledOptions.map((opt) => {
                        const isSelected = selectedOption === opt;
                        const isRightOpt = opt === currentItem.question.answer;
                        let style =
                          'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 hover:border-indigo-400 text-slate-900 dark:text-slate-100';
                        if (checked) {
                          if (isRightOpt) {
                            style =
                              'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                          } else if (isSelected) {
                            style =
                              'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                          }
                        } else if (isSelected) {
                          style =
                            'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500/30';
                        }

                        return (
                          <button
                            key={opt}
                            type="button"
                            disabled={checked}
                            onClick={() => {
                              setSelectedOption(opt);
                              setEmptyWarn(false);
                            }}
                            className={`text-left px-4 py-3.5 rounded-xl border text-sm sm:text-base font-medium transition-all ${style}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Type: True / False */}
                  {currentItem.question.type === 'true-false' && (
                    <div className="grid grid-cols-2 gap-3 mb-6 max-w-md">
                      {[
                        { val: 'true', label: t.practice.trueBtn },
                        { val: 'false', label: t.practice.falseBtn },
                      ].map((item) => {
                        const isSelected = selectedOption === item.val;
                        const isRightOpt = item.val === currentItem.question.answer;
                        let style =
                          'border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 hover:border-indigo-400 text-slate-900 dark:text-slate-100';
                        if (checked) {
                          if (isRightOpt) {
                            style =
                              'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
                          } else if (isSelected) {
                            style =
                              'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                          }
                        } else if (isSelected) {
                          style =
                            'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-100 ring-2 ring-indigo-500/30';
                        }

                        return (
                          <button
                            key={item.val}
                            type="button"
                            disabled={checked}
                            onClick={() => {
                              setSelectedOption(item.val);
                              setEmptyWarn(false);
                            }}
                            className={`px-4 py-3.5 rounded-xl border text-sm sm:text-base font-semibold transition-all ${style}`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Type: Fill-Blank / Fix-Mistake */}
                  {(currentItem.question.type === 'fill-blank' ||
                    currentItem.question.type === 'fix-mistake') && (
                    <div className="mb-6 max-w-md">
                      <input
                        type="text"
                        disabled={checked}
                        value={typedAnswer}
                        onChange={(e) => {
                          setTypedAnswer(e.target.value);
                          setEmptyWarn(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !checked) {
                            e.preventDefault();
                            handleCheck();
                          }
                        }}
                        placeholder={t.practice.typeAnswerPlaceholder}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-base font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70"
                      />
                    </div>
                  )}

                  {/* Type: Sentence Builder */}
                  {currentItem.question.type === 'sentence-builder' && (
                    <div className="mb-6 space-y-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t.practice.tapWordsHint}
                      </p>
                      <div className="min-h-14 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3 flex flex-wrap items-center gap-2">
                        {builtWords.map((wordIdx) => (
                          <button
                            key={`built-${wordIdx}`}
                            type="button"
                            disabled={checked}
                            onClick={() =>
                              setBuiltWords((prev) => prev.filter((idx) => idx !== wordIdx))
                            }
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium shadow-xs hover:bg-indigo-700 transition-colors"
                          >
                            {currentItem.shuffledWords[wordIdx]}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {availableWordIndices.map((wordIdx) => (
                          <button
                            key={`avail-${wordIdx}`}
                            type="button"
                            disabled={checked}
                            onClick={() => {
                              setBuiltWords((prev) => [...prev, wordIdx]);
                              setEmptyWarn(false);
                            }}
                            className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium hover:border-indigo-400 transition-colors"
                          >
                            {currentItem.shuffledWords[wordIdx]}
                          </button>
                        ))}
                        {builtWords.length > 0 && !checked && (
                          <button
                            type="button"
                            onClick={() => setBuiltWords([])}
                            className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                          >
                            {t.practice.clearBtn}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Type: Matching Pairs */}
                  {currentItem.question.type === 'matching' && currentItem.question.pairs && (
                    <div className="mb-6 space-y-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t.practice.matchHint}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentItem.question.pairs.map((pair) => {
                          const chosen = matchingSelections[pair.subject] ?? '';
                          const pairCorrect = chosen === pair.verb;
                          return (
                            <div
                              key={pair.subject}
                              className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${
                                checked
                                  ? pairCorrect
                                    ? 'border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30'
                                    : 'border-rose-400 bg-rose-50/60 dark:bg-rose-950/30'
                                  : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/50'
                              }`}
                            >
                              <span className="font-semibold text-sm text-slate-900 dark:text-white">
                                {pair.subject}
                              </span>
                              <select
                                disabled={checked}
                                value={chosen}
                                onChange={(e) => {
                                  setMatchingSelections((prev) => ({
                                    ...prev,
                                    [pair.subject]: e.target.value,
                                  }));
                                  setEmptyWarn(false);
                                }}
                                className="rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              >
                                <option value="">—</option>
                                {currentItem.shuffledPairVerbs.map((v) => (
                                  <option key={v} value={v}>
                                    {v}
                                  </option>
                                ))}
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Validation warning */}
                  {emptyWarn && (
                    <div className="mb-4 flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{t.practice.emptyAnswerWarn}</span>
                    </div>
                  )}

                  {/* Instant Feedback Box */}
                  {checked && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mb-6 rounded-xl border p-4 ${
                        isCorrect
                          ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100'
                          : 'border-rose-200 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm sm:text-base mb-1.5">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                        )}
                        <span>
                          {isCorrect ? t.practice.correctFeedback : t.practice.wrongFeedback}
                        </span>
                      </div>

                      {!isCorrect && currentItem.question.type !== 'matching' && (
                        <p className="text-xs sm:text-sm font-mono mb-1.5">
                          {t.practice.correctAnswerLabel}{' '}
                          <strong>{currentItem.question.answer}</strong>
                        </p>
                      )}

                      <p className="text-xs sm:text-sm opacity-90">
                        <strong>{t.practice.explanationLabel}</strong>{' '}
                        {pick(currentItem.question.explanation)}
                      </p>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-3">
                    {!checked ? (
                      <button
                        type="button"
                        onClick={handleCheck}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
                      >
                        {t.practice.checkBtn}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors"
                      >
                        {currentIndex + 1 < sessionList.length
                          ? t.practice.nextBtn
                          : t.practice.finishBtn}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => startNewSession(levelFilter)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      {t.practice.tryAgainBtn}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            /* Results Summary */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                      {t.practice.resultsTitle}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t.practice.levels[levelFilter]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 tabular-nums">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {t.practice.accuracyLabel}
                    </div>
                    <div className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {accuracy}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {t.practice.earnedXpLabel}
                    </div>
                    <div className="font-display text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      +{sessionXp} XP
                    </div>
                  </div>
                </div>
              </div>

              {mistakes.length === 0 ? (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 p-5 text-emerald-800 dark:text-emerald-200 font-semibold flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{t.practice.noMistakesMsg}</span>
                </div>
              ) : (
                <div>
                  <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-3">
                    {t.practice.reviewMistakesTitle} ({mistakes.length})
                  </h4>
                  <div className="space-y-3">
                    {mistakes.map((m, idx) => (
                      <div
                        key={`${m.question.id}-${idx}`}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 text-sm"
                      >
                        <p className="font-semibold text-slate-900 dark:text-white mb-1">
                          {m.question.sentence}
                        </p>
                        <p className="text-rose-600 dark:text-rose-400 text-xs sm:text-sm">
                          {t.practice.yourAnswerLabel} <strong>{m.userAnswer}</strong>
                        </p>
                        <p className="text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm">
                          {t.practice.correctAnswerLabel} <strong>{m.question.answer}</strong>
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">
                          {pick(m.question.explanation)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {mistakes.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      startNewSession(
                        levelFilter,
                        mistakes.map((m) => m.question)
                      )
                    }
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors"
                  >
                    {t.practice.retryMistakesBtn} ({mistakes.length})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => startNewSession(levelFilter)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
                >
                  {t.practice.tryAgainBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
