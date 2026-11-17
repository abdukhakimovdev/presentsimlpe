import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock,
  Flame,
  Gamepad2,
  RotateCcw,
  Search,
  Trophy,
  XCircle,
} from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { useAppStore } from '../store/AppContext';
import {
  DETECTIVE_ROUNDS,
  MEMORY_PAIRS,
  ROUTINE_STEPS,
  RoutineStepItem,
  SPEED_QUESTIONS,
} from '../data/tasksHomework';
import { shuffleArray } from '../utils/textCheck';

type GameTab = 'speed' | 'memory' | 'detective' | 'routine';

interface MemoryCard {
  uid: string;
  pairId: string;
  text: string;
  kind: 'v1' | 'v3s';
}

function buildMemoryDeck(): MemoryCard[] {
  const cards: MemoryCard[] = [];
  for (const pair of MEMORY_PAIRS) {
    cards.push({ uid: `${pair.id}-a`, pairId: pair.id, text: pair.v1, kind: 'v1' });
    cards.push({ uid: `${pair.id}-b`, pairId: pair.id, text: pair.v3s, kind: 'v3s' });
  }
  return shuffleArray(cards);
}

export const GamesSection: React.FC = () => {
  const { t, pick } = useLang();
  const {
    state,
    awardXp,
    unlockBadge,
    recordGamePlayed,
    updateSpeedHigh,
    updateMemoryBest,
    fireCelebration,
  } = useAppStore();

  const [activeGame, setActiveGame] = useState<GameTab>('speed');

  // ================= SPEED ROUND =================
  const [speedRunning, setSpeedRunning] = useState(false);
  const [speedFinished, setSpeedFinished] = useState(false);
  const [speedTimeLeft, setSpeedTimeLeft] = useState(60);
  const [speedScore, setSpeedScore] = useState(0);
  const [speedCombo, setSpeedCombo] = useState(0);
  const [speedDeck, setSpeedDeck] = useState(() => shuffleArray(SPEED_QUESTIONS));
  const [speedIdx, setSpeedIdx] = useState(0);
  const [speedFlash, setSpeedFlash] = useState<'none' | 'hit' | 'miss'>('none');
  const [isNewRecord, setIsNewRecord] = useState(false);

  useEffect(() => {
    if (!speedRunning) return;
    const timer = window.setInterval(() => {
      setSpeedTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setSpeedRunning(false);
          setSpeedFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [speedRunning]);

  const speedScoreRef = useRef(0);
  speedScoreRef.current = speedScore;

  useEffect(() => {
    if (speedFinished) {
      const finalScore = speedScoreRef.current;
      recordGamePlayed('speed');
      if (finalScore > state.progress.speedHighScore) {
        setIsNewRecord(true);
        updateSpeedHigh(finalScore);
      }
      if (finalScore >= 80) {
        unlockBadge('speedster');
      }
      if (finalScore > 0) {
        awardXp(Math.min(50, Math.round(finalScore / 4)), false);
      }
    }
  }, [speedFinished]);

  const startSpeedGame = () => {
    setSpeedDeck(shuffleArray(SPEED_QUESTIONS));
    setSpeedIdx(0);
    setSpeedScore(0);
    setSpeedCombo(0);
    setSpeedTimeLeft(60);
    setSpeedFinished(false);
    setIsNewRecord(false);
    setSpeedRunning(true);
  };

  const handleSpeedAnswer = (opt: string) => {
    if (!speedRunning) return;
    const current = speedDeck[speedIdx % speedDeck.length];
    if (opt === current.answer) {
      const nextCombo = speedCombo + 1;
      const mult = Math.min(4, 1 + Math.floor(nextCombo / 3));
      setSpeedCombo(nextCombo);
      setSpeedScore((s) => s + 10 * mult);
      setSpeedFlash('hit');
    } else {
      setSpeedCombo(0);
      setSpeedFlash('miss');
    }
    window.setTimeout(() => setSpeedFlash('none'), 180);
    setSpeedIdx((i) => i + 1);
  };

  // ================= MEMORY MATCH =================
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>(() => buildMemoryDeck());
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryLocked, setMemoryLocked] = useState(false);

  const resetMemory = () => {
    setMemoryCards(buildMemoryDeck());
    setFlippedIndices([]);
    setMatchedPairIds([]);
    setMemoryMoves(0);
    setMemoryLocked(false);
  };

  const handleFlipMemory = (idx: number) => {
    if (memoryLocked) return;
    if (flippedIndices.includes(idx)) return;
    const card = memoryCards[idx];
    if (matchedPairIds.includes(card.pairId)) return;

    const nextFlipped = [...flippedIndices, idx];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      const first = memoryCards[nextFlipped[0]];
      const second = memoryCards[nextFlipped[1]];
      if (first.pairId === second.pairId) {
        const nextMatched = [...matchedPairIds, first.pairId];
        setMatchedPairIds(nextMatched);
        setFlippedIndices([]);
        if (nextMatched.length === MEMORY_PAIRS.length) {
          recordGamePlayed('memory');
          updateMemoryBest(memoryMoves + 1);
          awardXp(25, true);
          fireCelebration();
        }
      } else {
        setMemoryLocked(true);
        window.setTimeout(() => {
          setFlippedIndices([]);
          setMemoryLocked(false);
        }, 700);
      }
    }
  };

  // ================= SENTENCE DETECTIVE =================
  const [detRounds, setDetRounds] = useState(() => shuffleArray(DETECTIVE_ROUNDS));
  const [detIdx, setDetIdx] = useState(0);
  const [detPicked, setDetPicked] = useState<number | null>(null);
  const [detScore, setDetScore] = useState(0);
  const [detDone, setDetDone] = useState(false);

  const currentDet = detRounds[detIdx];

  const handleDetectivePick = (idx: number) => {
    if (detPicked !== null) return;
    setDetPicked(idx);
    if (idx === currentDet.wrongIndex) {
      setDetScore((s) => s + 1);
      awardXp(10, false);
    }
  };

  const handleDetectiveNext = () => {
    if (detIdx + 1 < detRounds.length) {
      setDetIdx((i) => i + 1);
      setDetPicked(null);
    } else {
      setDetDone(true);
      recordGamePlayed('detective');
      if (detScore === detRounds.length) {
        unlockBadge('mistakeHunter');
      } else if (detScore >= 6) {
        unlockBadge('mistakeHunter');
      }
      fireCelebration();
    }
  };

  const resetDetective = () => {
    setDetRounds(shuffleArray(DETECTIVE_ROUNDS));
    setDetIdx(0);
    setDetPicked(null);
    setDetScore(0);
    setDetDone(false);
  };

  // ================= DAILY ROUTINE BUILDER =================
  const [routineItems, setRoutineItems] = useState<RoutineStepItem[]>(() =>
    shuffleArray(ROUTINE_STEPS)
  );
  const [routineVerbs, setRoutineVerbs] = useState<Record<string, string>>({});
  const [routineChecked, setRoutineChecked] = useState(false);

  const moveRoutineItem = (index: number, delta: -1 | 1) => {
    const target = index + delta;
    if (target < 0 || target >= routineItems.length) return;
    const copy = [...routineItems];
    const tmp = copy[index];
    copy[index] = copy[target];
    copy[target] = tmp;
    setRoutineItems(copy);
    setRoutineChecked(false);
  };

  const isRoutinePerfect = routineItems.every(
    (item, idx) => item.orderIndex === idx && routineVerbs[item.id] === item.correctVerb
  );

  const handleCheckRoutine = () => {
    setRoutineChecked(true);
    if (isRoutinePerfect) {
      recordGamePlayed('routine');
      awardXp(30, true);
      fireCelebration();
    }
  };

  const resetRoutine = () => {
    setRoutineItems(shuffleArray(ROUTINE_STEPS));
    setRoutineVerbs({});
    setRoutineChecked(false);
  };

  const tabs: Array<{ id: GameTab; label: string }> = [
    { id: 'speed', label: t.games.tabs.speed },
    { id: 'memory', label: t.games.tabs.memory },
    { id: 'detective', label: t.games.tabs.detective },
    { id: 'routine', label: t.games.tabs.routine },
  ];

  const currentSpeedQ = speedDeck[speedIdx % speedDeck.length];

  return (
    <section
      id="games"
      className="py-12 sm:py-16 bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {t.games.heading}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {t.games.subheading}
          </p>
        </div>

        {/* Game Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveGame(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
                activeGame === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Game Stage */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 p-5 sm:p-8 shadow-sm">
          {/* 1. SPEED ROUND */}
          {activeGame === 'speed' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    {t.games.speed.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {t.games.speed.desc}
                  </p>
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums shrink-0">
                  {t.games.speed.highScore}:{' '}
                  <strong className="text-indigo-600 dark:text-indigo-400 text-sm">
                    {state.progress.speedHighScore}
                  </strong>
                </div>
              </div>

              {!speedRunning && !speedFinished && (
                <div className="text-center py-8">
                  <Gamepad2 className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                  <button
                    type="button"
                    onClick={startSpeedGame}
                    className="px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-base transition-colors shadow-sm"
                  >
                    {t.games.speed.startBtn}
                  </button>
                </div>
              )}

              {speedRunning && (
                <div>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {t.games.speed.timeLeft}
                      </div>
                      <div
                        className={`font-display text-2xl font-bold tabular-nums mt-0.5 ${
                          speedTimeLeft <= 10
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {speedTimeLeft}s
                      </div>
                    </div>

                    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {t.games.speed.score}
                      </div>
                      <div className="font-display text-2xl font-bold tabular-nums text-indigo-600 dark:text-indigo-400 mt-0.5">
                        {speedScore}
                      </div>
                    </div>

                    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-center">
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        {t.games.speed.combo}
                      </div>
                      <div className="font-display text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400 mt-0.5">
                        x{Math.min(4, 1 + Math.floor(speedCombo / 3))}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`rounded-2xl border p-6 text-center transition-colors ${
                      speedFlash === 'hit'
                        ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
                        : speedFlash === 'miss'
                          ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/30'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
                      {currentSpeedQ.sentence}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
                      {currentSpeedQ.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSpeedAnswer(opt)}
                          className="px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 font-semibold text-base text-slate-900 dark:text-white transition-all"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {speedFinished && (
                <div className="text-center py-6 space-y-4">
                  <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
                  <h4 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    {t.games.speed.gameOver}
                  </h4>
                  <p className="font-display text-3xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {speedScore}
                  </p>
                  {isNewRecord && (
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {t.games.speed.newRecord}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={startSpeedGame}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors"
                  >
                    {t.games.speed.playAgainBtn}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 2. MEMORY MATCH */}
          {activeGame === 'memory' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    {t.games.memory.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {t.games.memory.desc}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold tabular-nums shrink-0">
                  <span>
                    {t.games.memory.moves}: <strong>{memoryMoves}</strong>
                  </span>
                  <span>
                    {t.games.memory.pairsFound}:{' '}
                    <strong>
                      {matchedPairIds.length}/{MEMORY_PAIRS.length}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={resetMemory}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {t.games.memory.restartBtn}
                  </button>
                </div>
              </div>

              {matchedPairIds.length === MEMORY_PAIRS.length ? (
                <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/80 dark:bg-emerald-950/30 p-8 text-center space-y-3">
                  <Trophy className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h4 className="font-display text-xl font-bold text-emerald-950 dark:text-emerald-100">
                    {t.games.memory.wonTitle}
                  </h4>
                  <p className="text-sm text-emerald-800 dark:text-emerald-300">
                    {t.games.memory.wonDesc} ({t.games.memory.moves}: {memoryMoves})
                  </p>
                  <button
                    type="button"
                    onClick={resetMemory}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
                  >
                    {t.games.memory.restartBtn}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {memoryCards.map((card, idx) => {
                    const isMatched = matchedPairIds.includes(card.pairId);
                    const isFlipped = isMatched || flippedIndices.includes(idx);

                    return (
                      <motion.button
                        key={card.uid}
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleFlipMemory(idx)}
                        className={`h-24 sm:h-28 rounded-xl border font-mono text-sm sm:text-base font-bold transition-all flex items-center justify-center p-2 ${
                          isMatched
                            ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                            : isFlipped
                              ? 'border-indigo-500 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-sm'
                              : 'border-slate-200 dark:border-slate-700 bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {isFlipped ? (
                          <span>{card.text}</span>
                        ) : (
                          <span className="text-indigo-200 text-lg font-display">?</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. SENTENCE DETECTIVE */}
          {activeGame === 'detective' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Search className="w-5 h-5 text-indigo-500" />
                    {t.games.detective.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {t.games.detective.desc}
                  </p>
                </div>
                {!detDone && (
                  <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 tabular-nums shrink-0">
                    {t.games.detective.roundLabel} {detIdx + 1}/{detRounds.length} ·{' '}
                    {t.games.detective.scoreLabel}: {detScore}
                  </div>
                )}
              </div>

              {!detDone && currentDet ? (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {t.games.detective.instruction}
                  </p>

                  <div className="space-y-2.5">
                    {currentDet.sentences.map((sent, idx) => {
                      const isWrongTarget = idx === currentDet.wrongIndex;
                      const isPicked = detPicked === idx;
                      let style =
                        'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 text-slate-900 dark:text-slate-100';

                      if (detPicked !== null) {
                        if (isWrongTarget) {
                          style =
                            'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100';
                        } else if (isPicked) {
                          style =
                            'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100';
                        }
                      }

                      return (
                        <button
                          key={sent}
                          type="button"
                          disabled={detPicked !== null}
                          onClick={() => handleDetectivePick(idx)}
                          className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm sm:text-base font-medium transition-all flex items-center justify-between gap-3 ${style}`}
                        >
                          <span>{sent}</span>
                          {detPicked !== null && isWrongTarget && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          )}
                          {detPicked !== null && isPicked && !isWrongTarget && (
                            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {detPicked !== null && (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-1.5 text-sm">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {detPicked === currentDet.wrongIndex
                          ? t.games.detective.foundBug
                          : t.games.detective.wrongChoice}{' '}
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                          {currentDet.correction}
                        </span>
                      </p>
                      <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                        {pick(currentDet.explanation)}
                      </p>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleDetectiveNext}
                          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm"
                        >
                          {t.games.detective.nextRound}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
                  <h4 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                    {t.games.detective.finishTitle}
                  </h4>
                  <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {detScore} / {detRounds.length}
                  </p>
                  <button
                    type="button"
                    onClick={resetDetective}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm"
                  >
                    {t.games.detective.restartBtn}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 4. DAILY ROUTINE BUILDER */}
          {activeGame === 'routine' && (
            <div>
              <div className="mb-5">
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  {t.games.routine.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {t.games.routine.desc}
                </p>
              </div>

              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
                {t.games.routine.instruction}
              </p>

              <div className="space-y-2.5 mb-5">
                {routineItems.map((item, idx) => {
                  const chosenVerb = routineVerbs[item.id] ?? '';
                  const orderOk = item.orderIndex === idx;
                  const verbOk = chosenVerb === item.correctVerb;
                  const rowOk = orderOk && verbOk;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        routineChecked
                          ? rowOk
                            ? 'border-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30'
                            : 'border-rose-400 bg-rose-50/70 dark:bg-rose-950/30'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-wrap text-sm sm:text-base">
                        <span className="font-mono text-xs font-bold px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 tabular-nums">
                          {item.time}
                        </span>
                        <span className="text-slate-900 dark:text-white font-medium">
                          {item.beforeBlank}
                        </span>
                        <select
                          value={chosenVerb}
                          onChange={(e) => {
                            setRoutineVerbs((prev) => ({
                              ...prev,
                              [item.id]: e.target.value,
                            }));
                            setRoutineChecked(false);
                          }}
                          className="rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 text-sm font-mono font-semibold text-indigo-700 dark:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">___</option>
                          {item.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <span className="text-slate-800 dark:text-slate-200">
                          {item.afterBlank}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveRoutineItem(idx, -1)}
                          aria-label={t.games.routine.moveUp}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-35"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === routineItems.length - 1}
                          onClick={() => moveRoutineItem(idx, 1)}
                          aria-label={t.games.routine.moveDown}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-35"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {routineChecked && (
                <div
                  className={`mb-4 rounded-xl border p-3.5 text-sm font-semibold flex items-center gap-2 ${
                    isRoutinePerfect
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200'
                      : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200'
                  }`}
                >
                  {isRoutinePerfect ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 shrink-0" />
                  )}
                  <span>
                    {isRoutinePerfect ? t.games.routine.perfectMsg : t.games.routine.partialMsg}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCheckRoutine}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
                >
                  {t.games.routine.checkBtn}
                </button>
                <button
                  type="button"
                  onClick={resetRoutine}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t.games.routine.resetBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
