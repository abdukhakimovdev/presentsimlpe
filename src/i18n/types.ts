export type Lang = 'uz' | 'ru' | 'en';

export type LocalizedText = Record<Lang, string>;

export interface Translations {
  meta: {
    langName: string;
    langCode: string;
  };
  nav: {
    brand: string;
    roadmap: string;
    theory: string;
    practice: string;
    games: string;
    flashcards: string;
    tasks: string;
    homework: string;
    test: string;
    progress: string;
    menuOpen: string;
    menuClose: string;
    toggleTheme: string;
    switchLang: string;
  };
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    startBtn: string;
    testBtn: string;
    mascotGreeting: string;
    stats: {
      lessons: string;
      lessonsVal: string;
      exercises: string;
      exercisesVal: string;
      xp: string;
    };
  };
  roadmap: {
    heading: string;
    subheading: string;
    unlocked: string;
    completed: string;
    inProgress: string;
    openStep: string;
    steps: {
      learn: { title: string; desc: string };
      examples: { title: string; desc: string };
      practice: { title: string; desc: string };
      games: { title: string; desc: string };
      homework: { title: string; desc: string };
      test: { title: string; desc: string };
    };
  };
  theory: {
    heading: string;
    subheading: string;
    showTranslation: string;
    hideTranslation: string;
    listenLabel: string;
    tabs: {
      uses: string;
      forms: string;
      machine: string;
      spelling: string;
      frequency: string;
      mistakes: string;
    };
    usesSection: {
      title: string;
      intro: string;
    };
    formsSection: {
      title: string;
      affirmative: string;
      negative: string;
      question: string;
      shortAnswers: string;
      subjectCol: string;
      formulaCol: string;
      exampleCol: string;
      note: string;
    };
    machineSection: {
      title: string;
      subtitle: string;
      pickSubject: string;
      pickVerb: string;
      affirmativeLabel: string;
      negativeLabel: string;
      questionLabel: string;
      ruleHighlight: string;
      thirdPersonNote: string;
      baseFormNote: string;
    };
    spellingSection: {
      title: string;
      subtitle: string;
      liveCheckerTitle: string;
      liveCheckerPlaceholder: string;
      liveCheckerBtn: string;
      liveCheckerHint: string;
      correctMsg: string;
      wrongMsg: string;
      enterVerbFirst: string;
    };
    frequencySection: {
      title: string;
      subtitle: string;
      meterLabel: string;
      positionRuleTitle: string;
      beforeVerbRule: string;
      afterBeRule: string;
      timeExpressionsTitle: string;
    };
    mistakesSection: {
      title: string;
      subtitle: string;
      wrongLabel: string;
      rightLabel: string;
      flipHint: string;
      toBeTitle: string;
      toBeSubtitle: string;
      toBeCol1: string;
      toBeCol2: string;
    };
    cheatSheet: {
      title: string;
      subtitle: string;
      printBtn: string;
      colFormula: string;
      colKeyWords: string;
      colReminder: string;
    };
  };
  practice: {
    heading: string;
    subheading: string;
    levels: {
      easy: string;
      medium: string;
      hard: string;
      all: string;
    };
    typeLabels: {
      'multiple-choice': string;
      'fill-blank': string;
      'sentence-builder': string;
      'true-false': string;
      'fix-mistake': string;
      'matching': string;
      'do-does': string;
    };
    startSession: string;
    questionProgress: string;
    scoreLabel: string;
    streakLabel: string;
    xpLabel: string;
    checkBtn: string;
    nextBtn: string;
    finishBtn: string;
    clearBtn: string;
    typeAnswerPlaceholder: string;
    tapWordsHint: string;
    matchHint: string;
    emptyAnswerWarn: string;
    correctFeedback: string;
    wrongFeedback: string;
    explanationLabel: string;
    correctAnswerLabel: string;
    resultsTitle: string;
    accuracyLabel: string;
    earnedXpLabel: string;
    reviewMistakesTitle: string;
    noMistakesMsg: string;
    retryMistakesBtn: string;
    tryAgainBtn: string;
    changeLevelBtn: string;
    yourAnswerLabel: string;
    trueBtn: string;
    falseBtn: string;
  };
  games: {
    heading: string;
    subheading: string;
    tabs: {
      speed: string;
      memory: string;
      detective: string;
      routine: string;
    };
    speed: {
      title: string;
      desc: string;
      startBtn: string;
      playAgainBtn: string;
      timeLeft: string;
      score: string;
      combo: string;
      highScore: string;
      gameOver: string;
      newRecord: string;
    };
    memory: {
      title: string;
      desc: string;
      moves: string;
      pairsFound: string;
      bestMoves: string;
      restartBtn: string;
      wonTitle: string;
      wonDesc: string;
    };
    detective: {
      title: string;
      desc: string;
      instruction: string;
      roundLabel: string;
      scoreLabel: string;
      foundBug: string;
      wrongChoice: string;
      nextRound: string;
      finishTitle: string;
      restartBtn: string;
    };
    routine: {
      title: string;
      desc: string;
      instruction: string;
      checkBtn: string;
      resetBtn: string;
      perfectMsg: string;
      partialMsg: string;
      moveUp: string;
      moveDown: string;
    };
  };
  flashcards: {
    heading: string;
    subheading: string;
    filters: {
      all: string;
      review: string;
      known: string;
    };
    cardCount: string;
    masteredCount: string;
    flipPrompt: string;
    baseForm: string;
    thirdPerson: string;
    exampleLabel: string;
    knowBtn: string;
    reviewBtn: string;
    prevBtn: string;
    nextBtn: string;
    shuffleBtn: string;
    emptyFilter: string;
    resetCardsBtn: string;
  };
  tasks: {
    heading: string;
    subheading: string;
    taskTab: string;
    checkTaskBtn: string;
    resetTaskBtn: string;
    showModelBtn: string;
    hideModelBtn: string;
    completedBadge: string;
    scoreResult: string;
    selfCheckTitle: string;
    wordCount: string;
    sentenceCount: string;
    readingTextTitle: string;
    taskTitles: {
      t1: string;
      t2: string;
      t3: string;
      t4: string;
      t5: string;
    };
    tableCols: {
      subject: string;
      baseVerb: string;
      presentForm: string;
    };
    negativeLabel: string;
    questionLabel: string;
  };
  homework: {
    heading: string;
    subheading: string;
    studentNameLabel: string;
    studentNamePlaceholder: string;
    setEasy: string;
    setMedium: string;
    setHard: string;
    saveProgressBtn: string;
    savedNotice: string;
    submitBtn: string;
    resetBtn: string;
    printBtn: string;
    copySummaryBtn: string;
    copiedNotice: string;
    scoreTitle: string;
    writingSectionTitle: string;
    writingPrompt: string;
    writingPlaceholder: string;
    wordsLabel: string;
    rubricTitle: string;
    rubricItems: string[];
    explanationTitle: string;
  };
  test: {
    heading: string;
    subheading: string;
    rulesTitle: string;
    rulesList: string[];
    studentNameLabel: string;
    studentNamePlaceholder: string;
    nameRequired: string;
    startBtn: string;
    timeRemaining: string;
    questionOf: string;
    prevBtn: string;
    nextBtn: string;
    submitTestBtn: string;
    confirmSubmitTitle: string;
    confirmSubmitBody: string;
    cancelBtn: string;
    confirmBtn: string;
    resultsHeading: string;
    gradeLabel: string;
    scoreLabel: string;
    timeUsedLabel: string;
    retakeBtn: string;
    printCertBtn: string;
    certTitle: string;
    certSubtitle: string;
    certAwardedTo: string;
    certBody: string;
    certScoreLabel: string;
    certGradeLabel: string;
    certDateLabel: string;
    certSignature: string;
  };
  progress: {
    heading: string;
    subheading: string;
    totalXp: string;
    currentLevel: string;
    dailyStreak: string;
    daysUnit: string;
    levels: {
      beginner: string;
      explorer: string;
      pro: string;
      master: string;
    };
    nextLevelXp: string;
    maxLevelReached: string;
    completionTitle: string;
    sections: {
      theory: string;
      practice: string;
      games: string;
      flashcards: string;
      tasks: string;
      homework: string;
      test: string;
    };
    badgesTitle: string;
    unlockedLabel: string;
    lockedLabel: string;
    badges: {
      firstSteps: { title: string; desc: string };
      perfectScore: { title: string; desc: string };
      speedster: { title: string; desc: string };
      weekStreak: { title: string; desc: string };
      mistakeHunter: { title: string; desc: string };
      grammarMaster: { title: string; desc: string };
    };
    resetBtn: string;
    resetModalTitle: string;
    resetModalBody: string;
    resetConfirmBtn: string;
    resetCancelBtn: string;
  };
  footer: {
    tagline: string;
    copyright: string;
    backToTop: string;
    quickLinks: string;
  };
  toasts: {
    xpEarned: string;
    levelUp: string;
    badgeUnlocked: string;
    progressSaved: string;
    progressReset: string;
  };
  errors: {
    boundaryTitle: string;
    boundaryDesc: string;
    reloadBtn: string;
    notFoundTitle: string;
    notFoundDesc: string;
    goHomeBtn: string;
  };
}
