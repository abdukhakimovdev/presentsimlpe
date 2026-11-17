import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
} from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { useAppStore } from '../store/AppContext';
import { VERBS, VerbItem } from '../data/verbs';
import { shuffleArray } from '../utils/textCheck';
import { SpeakButton } from '../components/SpeakButton';

type CardFilter = 'all' | 'review' | 'known';

export const FlashcardsSection: React.FC = () => {
  const { t, pick } = useLang();
  const { state, setFlashcardKnown, resetFlashcards, awardXp } = useAppStore();

  const [filter, setFilter] = useState<CardFilter>('all');
  const [deckOrder, setDeckOrder] = useState<VerbItem[]>(() => VERBS);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const knownSet = useMemo(
    () => new Set(state.progress.flashcardsKnown),
    [state.progress.flashcardsKnown]
  );

  const filteredDeck = useMemo(() => {
    if (filter === 'known') return deckOrder.filter((v) => knownSet.has(v.id));
    if (filter === 'review') return deckOrder.filter((v) => !knownSet.has(v.id));
    return deckOrder;
  }, [deckOrder, filter, knownSet]);

  const safeIndex = filteredDeck.length > 0 ? Math.min(index, filteredDeck.length - 1) : 0;
  const currentCard = filteredDeck[safeIndex];

  const handleFilterChange = (next: CardFilter) => {
    setFilter(next);
    setIndex(0);
    setFlipped(false);
  };

  const handleShuffle = () => {
    setDeckOrder(shuffleArray(VERBS));
    setIndex(0);
    setFlipped(false);
  };

  const handleNext = () => {
    if (filteredDeck.length === 0) return;
    setFlipped(false);
    setIndex((prev) => (prev + 1) % filteredDeck.length);
  };

  const handlePrev = () => {
    if (filteredDeck.length === 0) return;
    setFlipped(false);
    setIndex((prev) => (prev - 1 + filteredDeck.length) % filteredDeck.length);
  };

  const handleMark = (know: boolean) => {
    if (!currentCard) return;
    const wasKnown = knownSet.has(currentCard.id);
    setFlashcardKnown(currentCard.id, know);
    if (know && !wasKnown) {
      awardXp(5, false);
    }
    setFlipped(false);
    if (filteredDeck.length > 1) {
      setIndex((prev) => (prev + 1) % filteredDeck.length);
    }
  };

  return (
    <section id="flashcards" className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {t.flashcards.heading}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              {t.flashcards.subheading}
            </p>
          </div>

          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 tabular-nums shrink-0">
            {t.flashcards.masteredCount}{' '}
            <span className="text-emerald-600 dark:text-emerald-400">
              {state.progress.flashcardsKnown.length} / {VERBS.length}
            </span>
          </div>
        </div>

        {/* Filter & Shuffle Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1">
            {(['all', 'review', 'known'] as CardFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => handleFilterChange(f)}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  filter === f
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t.flashcards.filters[f]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShuffle}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              {t.flashcards.shuffleBtn}
            </button>
            {state.progress.flashcardsKnown.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  resetFlashcards();
                  setIndex(0);
                  setFlipped(false);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t.flashcards.resetCardsBtn}
              </button>
            )}
          </div>
        </div>

        {/* Flashcard Stage */}
        {currentCard ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
              <span>
                {t.flashcards.cardCount} {safeIndex + 1} / {filteredDeck.length}
              </span>
              {knownSet.has(currentCard.id) && (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  {t.flashcards.filters.known}
                </span>
              )}
            </div>

            <div
              onClick={() => setFlipped((prev) => !prev)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setFlipped((prev) => !prev);
                }
              }}
              aria-label={t.flashcards.flipPrompt}
              className="perspective-1000 h-72 sm:h-80 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                  flipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {currentCard.rule}
                    </span>
                    <SpeakButton text={`${currentCard.v1}. ${currentCard.v3s}`} size="md" />
                  </div>

                  <div className="text-center my-auto">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {t.flashcards.baseForm} → {t.flashcards.thirdPerson}
                    </div>
                    <div className="font-display text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white">
                      {currentCard.v1}{' '}
                      <span className="text-indigo-600 dark:text-indigo-400">→ {currentCard.v3s}</span>
                    </div>
                  </div>

                  <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                    {t.flashcards.flipPrompt}
                  </p>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/70 dark:bg-slate-900 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-indigo-700 dark:text-indigo-300">
                      {currentCard.v1} / {currentCard.v3s}
                    </span>
                    <SpeakButton text={currentCard.example} size="md" />
                  </div>

                  <div className="text-center my-auto space-y-3">
                    <div className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                      {pick(currentCard.translation)}
                    </div>
                    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-3.5 max-w-lg mx-auto">
                      <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        {t.flashcards.exampleLabel}
                      </div>
                      <p className="font-medium text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                        {currentCard.example}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {pick(currentCard.exampleTranslation)}
                      </p>
                    </div>
                  </div>

                  <div className="h-2" />
                </div>
              </div>
            </div>

            {/* Card Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t.flashcards.prevBtn}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.flashcards.nextBtn}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMark(false)}
                  className="px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-sm font-semibold hover:bg-amber-100 dark:hover:bg-amber-950/70 transition-colors"
                >
                  {t.flashcards.reviewBtn}
                </button>
                <button
                  type="button"
                  onClick={() => handleMark(true)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {t.flashcards.knowBtn}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-4">
            <p className="text-slate-600 dark:text-slate-400">{t.flashcards.emptyFilter}</p>
            <button
              type="button"
              onClick={() => handleFilterChange('all')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold"
            >
              {t.flashcards.filters.all}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
