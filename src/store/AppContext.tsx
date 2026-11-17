import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';
import { useLang } from '../i18n/LanguageContext';

export type BadgeId =
  | 'firstSteps'
  | 'perfectScore'
  | 'speedster'
  | 'weekStreak'
  | 'mistakeHunter'
  | 'grammarMaster';

export type LevelKey = 'beginner' | 'explorer' | 'pro' | 'master';

export type ThemeMode = 'light' | 'dark';

export interface ToastMessage {
  id: string;
  text: string;
  variant: 'xp' | 'level' | 'badge' | 'info';
}

export interface PersistedProgress {
  xp: number;
  dailyStreak: number;
  lastActiveDate: string;
  badges: BadgeId[];
  theoryTabsVisited: string[];
  practiceSolvedIds: string[];
  gamesPlayed: string[];
  speedHighScore: number;
  memoryBestMoves: number | null;
  flashcardsKnown: string[];
  tasksCompleted: number[];
  homeworkCompleted: Array<'easy' | 'medium' | 'hard'>;
  testBestScore: number | null;
  testBestGrade: 'A' | 'B' | 'C' | 'D' | null;
  studentName: string;
}

interface AppState {
  progress: PersistedProgress;
  theme: ThemeMode;
  toasts: ToastMessage[];
}

const PROGRESS_KEY = 'ps_academy_progress_v1';
const THEME_KEY = 'ps_academy_theme_v1';

function getTodayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getYesterdayStr(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function computeLevel(xp: number): LevelKey {
  if (xp >= 1200) return 'master';
  if (xp >= 600) return 'pro';
  if (xp >= 200) return 'explorer';
  return 'beginner';
}

export function getNextLevelThreshold(xp: number): number | null {
  if (xp < 200) return 200;
  if (xp < 600) return 600;
  if (xp < 1200) return 1200;
  return null;
}

const DEFAULT_PROGRESS: PersistedProgress = {
  xp: 0,
  dailyStreak: 1,
  lastActiveDate: getTodayStr(),
  badges: [],
  theoryTabsVisited: ['uses'],
  practiceSolvedIds: [],
  gamesPlayed: [],
  speedHighScore: 0,
  memoryBestMoves: null,
  flashcardsKnown: [],
  tasksCompleted: [],
  homeworkCompleted: [],
  testBestScore: null,
  testBestGrade: null,
  studentName: '',
};

function getInitialTheme(): ThemeMode {
  const saved = getStorageItem<string | null>(THEME_KEY, null);
  if (saved === 'light' || saved === 'dark') return saved;
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function loadInitialProgress(): PersistedProgress {
  const saved = getStorageItem<Partial<PersistedProgress> | null>(PROGRESS_KEY, null);
  const merged: PersistedProgress = {
    ...DEFAULT_PROGRESS,
    ...(saved ?? {}),
  };

  const today = getTodayStr();
  const yesterday = getYesterdayStr();

  if (merged.lastActiveDate !== today) {
    if (merged.lastActiveDate === yesterday) {
      merged.dailyStreak = Math.max(1, merged.dailyStreak + 1);
    } else if (saved) {
      merged.dailyStreak = 1;
    }
    merged.lastActiveDate = today;
  }

  if (merged.dailyStreak >= 7 && !merged.badges.includes('weekStreak')) {
    merged.badges = [...merged.badges, 'weekStreak'];
  }

  return merged;
}

type Action =
  | { type: 'ADD_XP'; amount: number }
  | { type: 'UNLOCK_BADGE'; badge: BadgeId }
  | { type: 'VISIT_THEORY_TAB'; tabId: string }
  | { type: 'RECORD_PRACTICE_SOLVED'; questionIds: string[] }
  | { type: 'RECORD_GAME_PLAYED'; gameId: string }
  | { type: 'UPDATE_SPEED_HIGH'; score: number }
  | { type: 'UPDATE_MEMORY_BEST'; moves: number }
  | { type: 'SET_FLASHCARD_KNOWN'; verbId: string; known: boolean }
  | { type: 'RESET_FLASHCARDS' }
  | { type: 'COMPLETE_TASK'; taskNum: number }
  | { type: 'COMPLETE_HOMEWORK'; level: 'easy' | 'medium' | 'hard' }
  | { type: 'RECORD_TEST_RESULT'; scorePercent: number; grade: 'A' | 'B' | 'C' | 'D' }
  | { type: 'SET_STUDENT_NAME'; name: string }
  | { type: 'TOGGLE_THEME' }
  | { type: 'PUSH_TOAST'; toast: ToastMessage }
  | { type: 'DISMISS_TOAST'; id: string }
  | { type: 'RESET_ALL' };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_XP': {
      const nextXp = state.progress.xp + Math.max(0, action.amount);
      return {
        ...state,
        progress: { ...state.progress, xp: nextXp },
      };
    }
    case 'UNLOCK_BADGE': {
      if (state.progress.badges.includes(action.badge)) return state;
      return {
        ...state,
        progress: {
          ...state.progress,
          badges: [...state.progress.badges, action.badge],
        },
      };
    }
    case 'VISIT_THEORY_TAB': {
      if (state.progress.theoryTabsVisited.includes(action.tabId)) return state;
      return {
        ...state,
        progress: {
          ...state.progress,
          theoryTabsVisited: [...state.progress.theoryTabsVisited, action.tabId],
        },
      };
    }
    case 'RECORD_PRACTICE_SOLVED': {
      const set = new Set([...state.progress.practiceSolvedIds, ...action.questionIds]);
      return {
        ...state,
        progress: {
          ...state.progress,
          practiceSolvedIds: Array.from(set),
        },
      };
    }
    case 'RECORD_GAME_PLAYED': {
      if (state.progress.gamesPlayed.includes(action.gameId)) return state;
      return {
        ...state,
        progress: {
          ...state.progress,
          gamesPlayed: [...state.progress.gamesPlayed, action.gameId],
        },
      };
    }
    case 'UPDATE_SPEED_HIGH': {
      if (action.score <= state.progress.speedHighScore) return state;
      return {
        ...state,
        progress: {
          ...state.progress,
          speedHighScore: action.score,
        },
      };
    }
    case 'UPDATE_MEMORY_BEST': {
      const prev = state.progress.memoryBestMoves;
      if (prev !== null && action.moves >= prev) return state;
      return {
        ...state,
        progress: {
          ...state.progress,
          memoryBestMoves: action.moves,
        },
      };
    }
    case 'SET_FLASHCARD_KNOWN': {
      const existing = new Set(state.progress.flashcardsKnown);
      if (action.known) existing.add(action.verbId);
      else existing.delete(action.verbId);
      return {
        ...state,
        progress: {
          ...state.progress,
          flashcardsKnown: Array.from(existing),
        },
      };
    }
    case 'RESET_FLASHCARDS': {
      return {
        ...state,
        progress: {
          ...state.progress,
          flashcardsKnown: [],
        },
      };
    }
    case 'COMPLETE_TASK': {
      if (state.progress.tasksCompleted.includes(action.taskNum)) return state;
      return {
        ...state,
        progress: {
          ...state.progress,
          tasksCompleted: [...state.progress.tasksCompleted, action.taskNum],
        },
      };
    }
    case 'COMPLETE_HOMEWORK': {
      if (state.progress.homeworkCompleted.includes(action.level)) return state;
      return {
        ...state,
        progress: {
          ...state.progress,
          homeworkCompleted: [...state.progress.homeworkCompleted, action.level],
        },
      };
    }
    case 'RECORD_TEST_RESULT': {
      const prev = state.progress.testBestScore;
      if (prev !== null && action.scorePercent <= prev) return state;
      return {
        ...state,
        progress: {
          ...state.progress,
          testBestScore: action.scorePercent,
          testBestGrade: action.grade,
        },
      };
    }
    case 'SET_STUDENT_NAME': {
      return {
        ...state,
        progress: {
          ...state.progress,
          studentName: action.name,
        },
      };
    }
    case 'TOGGLE_THEME': {
      const next: ThemeMode = state.theme === 'dark' ? 'light' : 'dark';
      return { ...state, theme: next };
    }
    case 'PUSH_TOAST': {
      return {
        ...state,
        toasts: [...state.toasts.slice(-3), action.toast],
      };
    }
    case 'DISMISS_TOAST': {
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      };
    }
    case 'RESET_ALL': {
      return {
        ...state,
        progress: {
          ...DEFAULT_PROGRESS,
          lastActiveDate: getTodayStr(),
          studentName: state.progress.studentName,
        },
      };
    }
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  awardXp: (amount: number, showToast?: boolean) => void;
  unlockBadge: (badge: BadgeId) => void;
  visitTheoryTab: (tabId: string) => void;
  recordPracticeSolved: (questionIds: string[]) => void;
  recordGamePlayed: (gameId: string) => void;
  updateSpeedHigh: (score: number) => void;
  updateMemoryBest: (moves: number) => void;
  setFlashcardKnown: (verbId: string, known: boolean) => void;
  resetFlashcards: () => void;
  completeTask: (taskNum: number) => void;
  completeHomework: (level: 'easy' | 'medium' | 'hard') => void;
  recordTestResult: (scorePercent: number, grade: 'A' | 'B' | 'C' | 'D') => void;
  setStudentName: (name: string) => void;
  toggleTheme: () => void;
  notifySaved: () => void;
  resetAllProgress: () => void;
  dismissToast: (id: string) => void;
  fireCelebration: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLang();

  const [state, dispatch] = useReducer(appReducer, undefined, () => ({
    progress: loadInitialProgress(),
    theme: getInitialTheme(),
    toasts: [],
  }));

  useEffect(() => {
    setStorageItem(PROGRESS_KEY, state.progress);
  }, [state.progress]);

  useEffect(() => {
    setStorageItem(THEME_KEY, state.theme);
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  const fireCelebration = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    try {
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.7 },
      });
    } catch {
      // Ignore confetti failures in headless environments
    }
  }, []);

  const pushToast = useCallback((text: string, variant: ToastMessage['variant']) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    dispatch({ type: 'PUSH_TOAST', toast: { id, text, variant } });
    window.setTimeout(() => {
      dispatch({ type: 'DISMISS_TOAST', id });
    }, 3400);
  }, []);

  const unlockBadge = useCallback(
    (badge: BadgeId) => {
      if (state.progress.badges.includes(badge)) return;
      dispatch({ type: 'UNLOCK_BADGE', badge });
      const badgeInfo = t.progress.badges[badge];
      pushToast(`${t.toasts.badgeUnlocked} ${badgeInfo.title}`, 'badge');
      fireCelebration();
    },
    [state.progress.badges, t, pushToast, fireCelebration]
  );

  const awardXp = useCallback(
    (amount: number, showToast = true) => {
      if (amount <= 0) return;
      const oldLevel = computeLevel(state.progress.xp);
      const newXp = state.progress.xp + amount;
      const newLevel = computeLevel(newXp);

      dispatch({ type: 'ADD_XP', amount });

      if (!state.progress.badges.includes('firstSteps')) {
        dispatch({ type: 'UNLOCK_BADGE', badge: 'firstSteps' });
        pushToast(`${t.toasts.badgeUnlocked} ${t.progress.badges.firstSteps.title}`, 'badge');
      }

      if (showToast) {
        pushToast(`+${amount} ${t.toasts.xpEarned}`, 'xp');
      }

      if (newLevel !== oldLevel) {
        pushToast(`${t.toasts.levelUp} ${t.progress.levels[newLevel]}`, 'level');
        fireCelebration();
      }
    },
    [state.progress.xp, state.progress.badges, t, pushToast, fireCelebration]
  );

  const visitTheoryTab = useCallback((tabId: string) => {
    dispatch({ type: 'VISIT_THEORY_TAB', tabId });
  }, []);

  const recordPracticeSolved = useCallback((questionIds: string[]) => {
    dispatch({ type: 'RECORD_PRACTICE_SOLVED', questionIds });
  }, []);

  const recordGamePlayed = useCallback((gameId: string) => {
    dispatch({ type: 'RECORD_GAME_PLAYED', gameId });
  }, []);

  const updateSpeedHigh = useCallback((score: number) => {
    dispatch({ type: 'UPDATE_SPEED_HIGH', score });
  }, []);

  const updateMemoryBest = useCallback((moves: number) => {
    dispatch({ type: 'UPDATE_MEMORY_BEST', moves });
  }, []);

  const setFlashcardKnown = useCallback((verbId: string, known: boolean) => {
    dispatch({ type: 'SET_FLASHCARD_KNOWN', verbId, known });
  }, []);

  const resetFlashcards = useCallback(() => {
    dispatch({ type: 'RESET_FLASHCARDS' });
  }, []);

  const completeTask = useCallback((taskNum: number) => {
    dispatch({ type: 'COMPLETE_TASK', taskNum });
  }, []);

  const completeHomework = useCallback((level: 'easy' | 'medium' | 'hard') => {
    dispatch({ type: 'COMPLETE_HOMEWORK', level });
  }, []);

  const recordTestResult = useCallback((scorePercent: number, grade: 'A' | 'B' | 'C' | 'D') => {
    dispatch({ type: 'RECORD_TEST_RESULT', scorePercent, grade });
  }, []);

  const setStudentName = useCallback((name: string) => {
    dispatch({ type: 'SET_STUDENT_NAME', name });
  }, []);

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);

  const notifySaved = useCallback(() => {
    pushToast(t.toasts.progressSaved, 'info');
  }, [pushToast, t.toasts.progressSaved]);

  const resetAllProgress = useCallback(() => {
    removeStorageItem('ps_academy_hw_drafts_v1');
    dispatch({ type: 'RESET_ALL' });
    pushToast(t.toasts.progressReset, 'info');
  }, [pushToast, t.toasts.progressReset]);

  const dismissToast = useCallback((id: string) => {
    dispatch({ type: 'DISMISS_TOAST', id });
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        awardXp,
        unlockBadge,
        visitTheoryTab,
        recordPracticeSolved,
        recordGamePlayed,
        updateSpeedHigh,
        updateMemoryBest,
        setFlashcardKnown,
        resetFlashcards,
        completeTask,
        completeHomework,
        recordTestResult,
        setStudentName,
        toggleTheme,
        notifySaved,
        resetAllProgress,
        dismissToast,
        fireCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useAppStore(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return ctx;
}
