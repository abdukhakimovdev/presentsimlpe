import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Printer,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { useAppStore } from '../store/AppContext';
import {
  COMMON_MISTAKES,
  FREQUENCY_ADVERBS,
  SPELLING_RULES,
  TIME_EXPRESSIONS,
  USAGE_CATEGORIES,
} from '../data/lessons';
import { VERBS } from '../data/verbs';
import { SpeakButton } from '../components/SpeakButton';
import { normalizeAnswer } from '../utils/textCheck';

type TheoryTab = 'uses' | 'forms' | 'machine' | 'spelling' | 'frequency' | 'mistakes';

const SUBJECTS = ['I', 'You', 'We', 'They', 'He', 'She', 'It'] as const;
type SubjectOption = (typeof SUBJECTS)[number];

const SPELLING_QUIZ_VERBS = VERBS.filter((v) => !v.v1.includes(' ')).slice(0, 18);

export const TheorySection: React.FC = () => {
  const { t, pick } = useLang();
  const { visitTheoryTab, awardXp } = useAppStore();

  const [activeTab, setActiveTab] = useState<TheoryTab>('uses');
  const [showTranslations, setShowTranslations] = useState(true);

  // Conjugation Machine state
  const [selectedSubject, setSelectedSubject] = useState<SubjectOption>('She');
  const [selectedVerbId, setSelectedVerbId] = useState<string>('study');

  // Spelling Live Checker state
  const [checkerIdx, setCheckerIdx] = useState(0);
  const [checkerInput, setCheckerInput] = useState('');
  const [checkerResult, setCheckerResult] = useState<'idle' | 'correct' | 'wrong' | 'empty'>('idle');

  // Frequency meter state
  const [selectedFreqIdx, setSelectedFreqIdx] = useState(0);

  // Mistakes flip state
  const [flippedMistakes, setFlippedMistakes] = useState<Record<string, boolean>>({});

  const handleTabChange = (tab: TheoryTab) => {
    setActiveTab(tab);
    visitTheoryTab(tab);
  };

  const tabs: Array<{ id: TheoryTab; label: string }> = [
    { id: 'uses', label: t.theory.tabs.uses },
    { id: 'forms', label: t.theory.tabs.forms },
    { id: 'machine', label: t.theory.tabs.machine },
    { id: 'spelling', label: t.theory.tabs.spelling },
    { id: 'frequency', label: t.theory.tabs.frequency },
    { id: 'mistakes', label: t.theory.tabs.mistakes },
  ];

  const chosenVerb = VERBS.find((v) => v.id === selectedVerbId) ?? VERBS[0];
  const isThirdPerson = selectedSubject === 'He' || selectedSubject === 'She' || selectedSubject === 'It';

  const affVerb = isThirdPerson ? chosenVerb.v3s : chosenVerb.v1;
  const negAux = isThirdPerson ? "doesn't" : "don't";
  const qAux = isThirdPerson ? 'Does' : 'Do';
  const qSubj = selectedSubject === 'I' ? 'I' : selectedSubject.toLowerCase();

  const affSentence = `${selectedSubject} ${affVerb} ${chosenVerb.objectPhrase}.`;
  const negSentence = `${selectedSubject} ${negAux} ${chosenVerb.v1} ${chosenVerb.objectPhrase}.`;
  const qSentence = `${qAux} ${qSubj} ${chosenVerb.v1} ${chosenVerb.objectPhrase}?`;

  const currentSpellingVerb = SPELLING_QUIZ_VERBS[checkerIdx % SPELLING_QUIZ_VERBS.length];

  const handleCheckSpelling = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = normalizeAnswer(checkerInput);
    if (!cleaned) {
      setCheckerResult('empty');
      return;
    }
    if (cleaned === normalizeAnswer(currentSpellingVerb.v3s)) {
      setCheckerResult('correct');
      awardXp(5, false);
    } else {
      setCheckerResult('wrong');
    }
  };

  const nextSpellingVerb = () => {
    setCheckerIdx((prev) => (prev + 1) % SPELLING_QUIZ_VERBS.length);
    setCheckerInput('');
    setCheckerResult('idle');
  };

  const activeFreq = FREQUENCY_ADVERBS[selectedFreqIdx];

  const toggleMistakeFlip = (id: string) => {
    setFlippedMistakes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section
      id="theory"
      className="py-12 sm:py-16 bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="no-print flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {t.theory.heading}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
              {t.theory.subheading}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowTranslations((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto"
          >
            {showTranslations ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showTranslations ? t.theory.hideTranslation : t.theory.showTranslation}
          </button>
        </div>

        {/* Interactive Tabs */}
        <div
          role="tablist"
          aria-label={t.theory.heading}
          className="no-print flex items-center gap-1.5 overflow-x-auto pb-2 mb-6"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  active
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="no-print min-h-[340px]">
          <AnimatePresence mode="wait">
            {activeTab === 'uses' && (
              <motion.div
                key="uses"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1.5">
                    {t.theory.usesSection.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                    {t.theory.usesSection.intro}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {USAGE_CATEGORIES.map((cat) => {
                    const accentBadge =
                      cat.accent === 'indigo'
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : cat.accent === 'emerald'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : cat.accent === 'sky'
                            ? 'text-sky-600 dark:text-sky-400'
                            : 'text-amber-600 dark:text-amber-400';

                    return (
                      <div
                        key={cat.id}
                        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 p-5"
                      >
                        <h4 className={`font-display text-lg font-bold mb-1 ${accentBadge}`}>
                          {pick(cat.title)}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                          {pick(cat.description)}
                        </p>

                        <div className="space-y-2.5">
                          {cat.examples.map((ex, i) => {
                            const parts = ex.en.split(ex.highlight);
                            return (
                              <div
                                key={i}
                                className="flex items-start justify-between gap-3 rounded-xl bg-white dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/70 p-3"
                              >
                                <div className="min-w-0">
                                  <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100">
                                    {parts.length > 1 ? (
                                      <>
                                        {parts[0]}
                                        <span className={`font-bold underline decoration-2 underline-offset-4 ${accentBadge}`}>
                                          {ex.highlight}
                                        </span>
                                        {parts.slice(1).join(ex.highlight)}
                                      </>
                                    ) : (
                                      ex.en
                                    )}
                                  </p>
                                  {showTranslations && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                      {pick(ex.tr)}
                                    </p>
                                  )}
                                </div>
                                <SpeakButton text={ex.en} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'forms' && (
              <motion.div
                key="forms"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  {t.theory.formsSection.title}
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Affirmative */}
                  <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/70 bg-emerald-50/40 dark:bg-emerald-950/20 p-5">
                    <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-3">
                      {t.theory.formsSection.affirmative}
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3">
                        <div className="font-mono text-xs text-slate-500 dark:text-slate-400 mb-1">
                          I / You / We / They + <span className="font-bold text-emerald-600 dark:text-emerald-400">V1</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            They <strong>work</strong> every day.
                          </span>
                          <SpeakButton text="They work every day." />
                        </div>
                      </div>
                      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3">
                        <div className="font-mono text-xs text-slate-500 dark:text-slate-400 mb-1">
                          He / She / It + <span className="font-bold text-emerald-600 dark:text-emerald-400">V(s/es)</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            She <strong>works</strong> every day.
                          </span>
                          <SpeakButton text="She works every day." />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Negative */}
                  <div className="rounded-2xl border border-rose-200 dark:border-rose-900/70 bg-rose-50/40 dark:bg-rose-950/20 p-5">
                    <div className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-3">
                      {t.theory.formsSection.negative}
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3">
                        <div className="font-mono text-xs text-slate-500 dark:text-slate-400 mb-1">
                          I / You / We / They + <span className="font-bold text-rose-600 dark:text-rose-400">don&apos;t + V1</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            We <strong>don&apos;t play</strong> on Monday.
                          </span>
                          <SpeakButton text="We don't play on Monday." />
                        </div>
                      </div>
                      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3">
                        <div className="font-mono text-xs text-slate-500 dark:text-slate-400 mb-1">
                          He / She / It + <span className="font-bold text-rose-600 dark:text-rose-400">doesn&apos;t + V1</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            He <strong>doesn&apos;t play</strong> on Monday.
                          </span>
                          <SpeakButton text="He doesn't play on Monday." />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question */}
                  <div className="rounded-2xl border border-sky-200 dark:border-sky-900/70 bg-sky-50/40 dark:bg-sky-950/20 p-5">
                    <div className="text-sm font-bold text-sky-700 dark:text-sky-400 mb-3">
                      {t.theory.formsSection.question}
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3">
                        <div className="font-mono text-xs text-slate-500 dark:text-slate-400 mb-1">
                          <span className="font-bold text-sky-600 dark:text-sky-400">Do</span> + I/you/we/they + V1?
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            <strong>Do</strong> you like tea?
                          </span>
                          <SpeakButton text="Do you like tea?" />
                        </div>
                      </div>
                      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3">
                        <div className="font-mono text-xs text-slate-500 dark:text-slate-400 mb-1">
                          <span className="font-bold text-sky-600 dark:text-sky-400">Does</span> + he/she/it + V1?
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            <strong>Does</strong> she like tea?
                          </span>
                          <SpeakButton text="Does she like tea?" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Short Answers + Note */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5">
                    <h4 className="font-display font-bold text-slate-900 dark:text-white mb-3">
                      {t.theory.formsSection.shortAnswers}
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-white dark:bg-slate-800/80 p-3 border border-slate-200/70 dark:border-slate-700/70">
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                          Yes, I / we / they do.
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Yes, he / she / it does.
                        </div>
                      </div>
                      <div className="rounded-xl bg-white dark:bg-slate-800/80 p-3 border border-slate-200/70 dark:border-slate-700/70">
                        <div className="text-rose-600 dark:text-rose-400 font-semibold mb-1">
                          No, I / we / they don&apos;t.
                        </div>
                        <div className="text-rose-600 dark:text-rose-400 font-semibold">
                          No, he / she / it doesn&apos;t.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/25 p-5 flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
                    <p className="text-sm font-medium text-amber-950 dark:text-amber-200 leading-relaxed">
                      {t.theory.formsSection.note}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'machine' && (
              <motion.div
                key="machine"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 p-5 sm:p-6"
              >
                <div className="mb-6">
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {t.theory.machineSection.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t.theory.machineSection.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Controls */}
                  <div className="lg:col-span-5 space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                        {t.theory.machineSection.pickSubject}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {SUBJECTS.map((subj) => {
                          const active = selectedSubject === subj;
                          return (
                            <button
                              key={subj}
                              type="button"
                              onClick={() => setSelectedSubject(subj)}
                              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                                active
                                  ? 'bg-indigo-600 text-white shadow-xs'
                                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-300'
                              }`}
                            >
                              {subj}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="machine-verb-select"
                        className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2"
                      >
                        {t.theory.machineSection.pickVerb}
                      </label>
                      <select
                        id="machine-verb-select"
                        value={selectedVerbId}
                        onChange={(e) => setSelectedVerbId(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {VERBS.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.v1} → {v.v3s} ({pick(v.translation)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="rounded-xl border border-indigo-200/80 dark:border-indigo-900/70 bg-indigo-50/60 dark:bg-indigo-950/30 p-4 text-xs sm:text-sm text-indigo-950 dark:text-indigo-200">
                      <span className="font-semibold block mb-1">
                        {t.theory.machineSection.ruleHighlight}
                      </span>
                      {isThirdPerson
                        ? t.theory.machineSection.thirdPersonNote
                        : t.theory.machineSection.baseFormNote}
                    </div>
                  </div>

                  {/* Live Output Cards */}
                  <div className="lg:col-span-7 space-y-3.5">
                    <motion.div
                      key={`aff-${affSentence}`}
                      initial={{ opacity: 0.5, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 dark:border-emerald-900/70 bg-white dark:bg-slate-800 p-4"
                    >
                      <div>
                        <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                          {t.theory.machineSection.affirmativeLabel}
                        </div>
                        <div className="font-mono text-base sm:text-lg font-medium text-slate-900 dark:text-white">
                          <span className="text-indigo-600 dark:text-indigo-400">{selectedSubject}</span>{' '}
                          <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                            {affVerb}
                          </span>{' '}
                          {chosenVerb.objectPhrase}.
                        </div>
                      </div>
                      <SpeakButton text={affSentence} size="md" />
                    </motion.div>

                    <motion.div
                      key={`neg-${negSentence}`}
                      initial={{ opacity: 0.5, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 dark:border-rose-900/70 bg-white dark:bg-slate-800 p-4"
                    >
                      <div>
                        <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
                          {t.theory.machineSection.negativeLabel}
                        </div>
                        <div className="font-mono text-base sm:text-lg font-medium text-slate-900 dark:text-white">
                          <span className="text-indigo-600 dark:text-indigo-400">{selectedSubject}</span>{' '}
                          <span className="px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold">
                            {negAux}
                          </span>{' '}
                          <span className="underline decoration-slate-300 dark:decoration-slate-600 underline-offset-4">
                            {chosenVerb.v1}
                          </span>{' '}
                          {chosenVerb.objectPhrase}.
                        </div>
                      </div>
                      <SpeakButton text={negSentence} size="md" />
                    </motion.div>

                    <motion.div
                      key={`q-${qSentence}`}
                      initial={{ opacity: 0.5, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between gap-3 rounded-xl border border-sky-200 dark:border-sky-900/70 bg-white dark:bg-slate-800 p-4"
                    >
                      <div>
                        <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">
                          {t.theory.machineSection.questionLabel}
                        </div>
                        <div className="font-mono text-base sm:text-lg font-medium text-slate-900 dark:text-white">
                          <span className="px-1.5 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold">
                            {qAux}
                          </span>{' '}
                          <span className="text-indigo-600 dark:text-indigo-400">{qSubj}</span>{' '}
                          <span className="underline decoration-slate-300 dark:decoration-slate-600 underline-offset-4">
                            {chosenVerb.v1}
                          </span>{' '}
                          {chosenVerb.objectPhrase}?
                        </div>
                      </div>
                      <SpeakButton text={qSentence} size="md" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'spelling' && (
              <motion.div
                key="spelling"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {t.theory.spellingSection.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t.theory.spellingSection.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {SPELLING_RULES.map((rule) => (
                    <div
                      key={rule.id}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 p-5"
                    >
                      <div className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                        {rule.badge}
                      </div>
                      <h4 className="font-display text-base font-bold text-slate-900 dark:text-white mb-1.5">
                        {pick(rule.title)}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {pick(rule.rule)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {rule.examples.map((ex) => (
                          <div
                            key={ex.base}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs font-mono"
                          >
                            <span className="text-slate-500 dark:text-slate-400">{ex.base}</span>
                            <span aria-hidden="true">→</span>
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                              {ex.third}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Spelling Checker */}
                <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/70 bg-indigo-50/50 dark:bg-indigo-950/20 p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        {t.theory.spellingSection.liveCheckerTitle}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {t.theory.spellingSection.liveCheckerHint}{' '}
                        <strong className="font-mono text-base text-indigo-700 dark:text-indigo-300">
                          {currentSpellingVerb.v1}
                        </strong>{' '}
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          ({pick(currentSpellingVerb.translation)})
                        </span>
                      </p>
                    </div>

                    <form onSubmit={handleCheckSpelling} className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        value={checkerInput}
                        onChange={(e) => {
                          setCheckerInput(e.target.value);
                          if (checkerResult !== 'idle') setCheckerResult('idle');
                        }}
                        placeholder={t.theory.spellingSection.liveCheckerPlaceholder}
                        className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                      >
                        {t.theory.spellingSection.liveCheckerBtn}
                      </button>
                      <button
                        type="button"
                        onClick={nextSpellingVerb}
                        aria-label="Next verb"
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                  {checkerResult !== 'idle' && (
                    <div
                      className={`mt-4 flex items-center gap-2 text-sm font-medium ${
                        checkerResult === 'correct'
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : checkerResult === 'empty'
                            ? 'text-amber-700 dark:text-amber-400'
                            : 'text-rose-700 dark:text-rose-400'
                      }`}
                    >
                      {checkerResult === 'correct' ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>
                            {t.theory.spellingSection.correctMsg} ({currentSpellingVerb.v1} →{' '}
                            {currentSpellingVerb.v3s})
                          </span>
                        </>
                      ) : checkerResult === 'empty' ? (
                        <>
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{t.theory.spellingSection.enterVerbFirst}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 shrink-0" />
                          <span>
                            {t.theory.spellingSection.wrongMsg}{' '}
                            <strong className="font-mono">{currentSpellingVerb.v3s}</strong>
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'frequency' && (
              <motion.div
                key="frequency"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {t.theory.frequencySection.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t.theory.frequencySection.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Interactive Frequency Meter */}
                  <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 p-5">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                        {t.theory.frequencySection.meterLabel}
                      </span>
                      <span className="font-mono text-lg font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                        {activeFreq.percent}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
                      {FREQUENCY_ADVERBS.map((item, idx) => {
                        const selected = idx === selectedFreqIdx;
                        return (
                          <button
                            key={item.word}
                            type="button"
                            onClick={() => setSelectedFreqIdx(idx)}
                            className={`px-3 py-2.5 rounded-xl text-left transition-all border ${
                              selected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs font-mono opacity-80">
                              <span>{item.word}</span>
                              <span className="tabular-nums">{item.percent}%</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-5">
                      <motion.div
                        animate={{ width: `${Math.max(4, activeFreq.percent)}%` }}
                        transition={{ duration: 0.25 }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
                      <div>
                        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                          {activeFreq.word} — {pick(activeFreq.meaning)}
                        </div>
                        <p className="text-base font-medium text-slate-900 dark:text-white">
                          {activeFreq.example}
                        </p>
                        {showTranslations && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {pick(activeFreq.exampleTr)}
                          </p>
                        )}
                      </div>
                      <SpeakButton text={activeFreq.example} />
                    </div>
                  </div>

                  {/* Word Position & Time Expressions */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 p-5">
                      <h4 className="font-display font-bold text-slate-900 dark:text-white mb-3">
                        {t.theory.frequencySection.positionRuleTitle}
                      </h4>
                      <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                        <li className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 p-3">
                          {t.theory.frequencySection.beforeVerbRule}
                        </li>
                        <li className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 p-3">
                          {t.theory.frequencySection.afterBeRule}
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 p-5">
                      <h4 className="font-display font-bold text-slate-900 dark:text-white mb-3">
                        {t.theory.frequencySection.timeExpressionsTitle}
                      </h4>
                      <div className="space-y-2">
                        {TIME_EXPRESSIONS.map((te) => (
                          <div
                            key={te.phrase}
                            className="flex items-center justify-between gap-2 text-xs sm:text-sm py-1.5 border-b last:border-b-0 border-slate-200/70 dark:border-slate-800"
                          >
                            <span className="font-mono font-medium text-indigo-700 dark:text-indigo-300">
                              {te.phrase}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 text-right">
                              {pick(te.meaning)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'mistakes' && (
              <motion.div
                key="mistakes"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {t.theory.mistakesSection.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {t.theory.mistakesSection.subtitle}
                  </p>
                </div>

                {/* Flip Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {COMMON_MISTAKES.map((item) => {
                    const flipped = Boolean(flippedMistakes[item.id]);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleMistakeFlip(item.id)}
                        className="perspective-1000 h-44 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
                      >
                        <div
                          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                            flipped ? 'rotate-y-180' : ''
                          }`}
                        >
                          {/* Front: Wrong */}
                          <div className="absolute inset-0 backface-hidden rounded-2xl border border-rose-200 dark:border-rose-900/70 bg-rose-50/70 dark:bg-rose-950/30 p-5 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
                                <XCircle className="w-4 h-4" />
                                {t.theory.mistakesSection.wrongLabel}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {t.theory.mistakesSection.flipHint}
                              </span>
                            </div>
                            <p className="font-mono text-base font-semibold text-rose-900 dark:text-rose-200 line-through decoration-rose-500 decoration-2">
                              {item.wrong}
                            </p>
                            <div className="text-xs text-rose-700/80 dark:text-rose-300/80">
                              Tap to fix →
                            </div>
                          </div>

                          {/* Back: Right */}
                          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl border border-emerald-200 dark:border-emerald-900/70 bg-emerald-50/80 dark:bg-emerald-950/40 p-5 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="w-4 h-4" />
                                {t.theory.mistakesSection.rightLabel}
                              </span>
                            </div>
                            <p className="font-mono text-base font-bold text-emerald-950 dark:text-emerald-100">
                              {item.right}
                            </p>
                            <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-snug">
                              {pick(item.reason)}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* To Be vs Action Verbs Short Note */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 p-5 sm:p-6">
                  <h4 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {t.theory.mistakesSection.toBeTitle}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {t.theory.mistakesSection.toBeSubtitle}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 space-y-2">
                      <div className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {t.theory.mistakesSection.toBeCol1}
                      </div>
                      <p className="font-mono text-slate-800 dark:text-slate-200">
                        I <strong>am</strong> a student. / She <strong>is</strong> happy.
                      </p>
                      <p className="font-mono text-slate-800 dark:text-slate-200">
                        He <strong>isn&apos;t</strong> tired. / <strong>Are</strong> you ready?
                      </p>
                    </div>
                    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 space-y-2">
                      <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {t.theory.mistakesSection.toBeCol2}
                      </div>
                      <p className="font-mono text-slate-800 dark:text-slate-200">
                        I <strong>study</strong> English. / She <strong>works</strong> hard.
                      </p>
                      <p className="font-mono text-slate-800 dark:text-slate-200">
                        He <strong>doesn&apos;t</strong> sleep late. / <strong>Do</strong> you play?
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Printable Quick Summary Cheat-Sheet */}
        <div className="print-surface mt-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                {t.theory.cheatSheet.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t.theory.cheatSheet.subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="no-print inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 self-start sm:self-auto"
            >
              <Printer className="w-4 h-4" />
              {t.theory.cheatSheet.printBtn}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                  <th className="py-2.5 pr-4 font-semibold">{t.theory.formsSection.subjectCol}</th>
                  <th className="py-2.5 pr-4 font-semibold">{t.theory.cheatSheet.colFormula}</th>
                  <th className="py-2.5 pr-4 font-semibold">{t.theory.cheatSheet.colKeyWords}</th>
                  <th className="py-2.5 font-semibold">{t.theory.cheatSheet.colReminder}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td className="py-3 pr-4 font-mono font-semibold">I / You / We / They</td>
                  <td className="py-3 pr-4 font-mono">
                    + V1 · - don&apos;t + V1 · ? Do + S + V1
                  </td>
                  <td className="py-3 pr-4">always, usually, often, every day</td>
                  <td className="py-3">No -s ending</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono font-semibold">He / She / It</td>
                  <td className="py-3 pr-4 font-mono">
                    + V(s/es) · - doesn&apos;t + V1 · ? Does + S + V1
                  </td>
                  <td className="py-3 pr-4">sometimes, rarely, never, on Mondays</td>
                  <td className="py-3">have → has · study → studies · go → goes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
