import { LocalizedText } from '../i18n/types';

// ================= GAMES DATA =================

export interface SpeedQuestion {
  id: string;
  sentence: string;
  options: [string, string, string];
  answer: string;
}

export const SPEED_QUESTIONS: SpeedQuestion[] = [
  { id: 'sp1', sentence: 'She ___ to school every day.', options: ['go', 'goes', 'going'], answer: 'goes' },
  { id: 'sp2', sentence: 'They ___ football on Sundays.', options: ['play', 'plays', 'playing'], answer: 'play' },
  { id: 'sp3', sentence: '___ he live in Bukhara?', options: ['Do', 'Does', 'Is'], answer: 'Does' },
  { id: 'sp4', sentence: 'I ___ drink coffee at night.', options: ["don't", "doesn't", "am not"], answer: "don't" },
  { id: 'sp5', sentence: 'My cat ___ milk every morning.', options: ['drink', 'drinks', 'drinking'], answer: 'drinks' },
  { id: 'sp6', sentence: 'He ___ English very hard.', options: ['study', 'studys', 'studies'], answer: 'studies' },
  { id: 'sp7', sentence: 'We ___ TV after dinner.', options: ['watch', 'watches', 'watching'], answer: 'watch' },
  { id: 'sp8', sentence: 'Laylo ___ two sisters.', options: ['have', 'has', 'haves'], answer: 'has' },
  { id: 'sp9', sentence: 'Does Timur ___ early?', options: ['wake up', 'wakes up', 'waking up'], answer: 'wake up' },
  { id: 'sp10', sentence: 'The sun ___ in the west.', options: ['set', 'sets', 'setting'], answer: 'sets' },
  { id: 'sp11', sentence: 'My dad ___ old bikes.', options: ['fix', 'fixs', 'fixes'], answer: 'fixes' },
  { id: 'sp12', sentence: '___ you speak Russian?', options: ['Do', 'Does', 'Are'], answer: 'Do' },
  { id: 'sp13', sentence: 'She ___ like rainy weather.', options: ["don't", "doesn't", "isn't"], answer: "doesn't" },
  { id: 'sp14', sentence: 'Birds ___ south in autumn.', options: ['fly', 'flies', 'flying'], answer: 'fly' },
  { id: 'sp15', sentence: 'An eagle ___ high in the sky.', options: ['fly', 'flys', 'flies'], answer: 'flies' },
  { id: 'sp16', sentence: 'Mr. Karimov ___ history.', options: ['teach', 'teachs', 'teaches'], answer: 'teaches' },
  { id: 'sp17', sentence: 'I ___ happy today.', options: ['am', 'do', 'have'], answer: 'am' },
  { id: 'sp18', sentence: 'The lesson ___ at 8:30.', options: ['start', 'starts', 'starting'], answer: 'starts' },
  { id: 'sp19', sentence: 'He ___ his hands before eating.', options: ['wash', 'washs', 'washes'], answer: 'washes' },
  { id: 'sp20', sentence: 'We ___ in a big city.', options: ['live', 'lives', 'living'], answer: 'live' },
];

export interface MemoryPair {
  id: string;
  v1: string;
  v3s: string;
}

export const MEMORY_PAIRS: MemoryPair[] = [
  { id: 'mp1', v1: 'study', v3s: 'studies' },
  { id: 'mp2', v1: 'go', v3s: 'goes' },
  { id: 'mp3', v1: 'have', v3s: 'has' },
  { id: 'mp4', v1: 'watch', v3s: 'watches' },
  { id: 'mp5', v1: 'play', v3s: 'plays' },
  { id: 'mp6', v1: 'fix', v3s: 'fixes' },
];

export interface DetectiveRound {
  id: string;
  sentences: [string, string, string, string];
  wrongIndex: number;
  correction: string;
  explanation: LocalizedText;
}

export const DETECTIVE_ROUNDS: DetectiveRound[] = [
  {
    id: 'det1',
    sentences: [
      'I drink tea every morning.',
      'She goes to the library on Mondays.',
      'He don’t like spicy food.',
      'They play chess after school.',
    ],
    wrongIndex: 2,
    correction: "He doesn't like spicy food.",
    explanation: {
      uz: '"He" bilan inkor shakl don\'t emas, doesn\'t bo‘ladi.',
      ru: 'С "He" отрицание требует doesn\'t, а не don\'t.',
      en: 'Third-person singular "He" uses "doesn\'t", not "don\'t".',
    },
  },
  {
    id: 'det2',
    sentences: [
      'Does your brother work in an office?',
      'Do she speak three languages?',
      'Where do your friends live?',
      'Water freezes at zero degrees.',
    ],
    wrongIndex: 1,
    correction: 'Does she speak three languages?',
    explanation: {
      uz: '"she" bilan so‘roq "Do" emas, "Does" bilan boshlanadi.',
      ru: 'Вопрос с "she" начинается с "Does", а не "Do".',
      en: 'Questions with "she" must start with "Does".',
    },
  },
  {
    id: 'det3',
    sentences: [
      'Madina studies biology at college.',
      'Timur watches cartoons on weekends.',
      'My uncle fixs computers very well.',
      'Our cat sleeps near the window.',
    ],
    wrongIndex: 2,
    correction: 'My uncle fixes computers very well.',
    explanation: {
      uz: '-x bilan tugagan "fix" fe’liga -es qo‘shiladi: fixes.',
      ru: 'После -x добавляется -es: fixes, а не fixs.',
      en: 'Verbs ending in -x take -es: "fixes".',
    },
  },
  {
    id: 'det4',
    sentences: [
      'Does Aziz play basketball?',
      'She always arrives on time.',
      'My sister has a blue backpack.',
      'He doesn’t goes to school on Sunday.',
    ],
    wrongIndex: 3,
    correction: "He doesn't go to school on Sunday.",
    explanation: {
      uz: '"doesn\'t" dan keyin asosiy fe’l asl shaklida (go) keladi.',
      ru: 'После "doesn\'t" основной глагол стоит без -es: go.',
      en: 'After "doesn\'t", always use the base form "go".',
    },
  },
  {
    id: 'det5',
    sentences: [
      'We are never late for English class.',
      'She always is very polite.',
      'I usually wake up at 6:45 a.m.',
      'They often visit their grandparents.',
    ],
    wrongIndex: 1,
    correction: 'She is always very polite.',
    explanation: {
      uz: '"always" ravishi "to be" (is) fe’lidan KEYIN qo‘yiladi.',
      ru: 'Наречие "always" ставится ПОСЛЕ глагола "is".',
      en: 'Adverbs of frequency come AFTER "to be" (is always).',
    },
  },
  {
    id: 'det6',
    sentences: [
      'I am work at a travel agency.',
      'My parents live in Bukhara.',
      'The train leaves at 8:00 a.m.',
      'She brushes her teeth twice a day.',
    ],
    wrongIndex: 0,
    correction: 'I work at a travel agency.',
    explanation: {
      uz: 'Present Simpleda harakat fe’li (work) oldidan "am" ishlatilmaydi.',
      ru: 'Перед глаголом действия "work" не нужно ставить "am".',
      en: 'Do not use "am" before action verbs in Present Simple.',
    },
  },
  {
    id: 'det7',
    sentences: [
      'He stays at home when it rains.',
      'She tryes to learn ten words a day.',
      'We enjoy reading science books.',
      'My brother plays the piano.',
    ],
    wrongIndex: 1,
    correction: 'She tries to learn ten words a day.',
    explanation: {
      uz: 'Undosh + y bilan tugagan "try" fe’li tries bo‘ladi (y → ies).',
      ru: 'Согласная + y у глагола "try" меняется на -ies: tries.',
      en: 'Consonant + y changes to -ies: "tries".',
    },
  },
  {
    id: 'det8',
    sentences: [
      'Does your school have a swimming pool?',
      'Do they know the right answer?',
      'My friend haves a cute puppy.',
      'Our lessons start at half past eight.',
    ],
    wrongIndex: 2,
    correction: 'My friend has a cute puppy.',
    explanation: {
      uz: '"have" fe’lining 3-shaxs shakli "has" dir ("haves" emas).',
      ru: 'Форма 3-го лица от "have" — это "has", а не "haves".',
      en: 'The third-person singular of "have" is "has".',
    },
  },
];

export interface RoutineStepItem {
  id: string;
  time: string;
  orderIndex: number;
  beforeBlank: string;
  afterBlank: string;
  options: [string, string, string];
  correctVerb: string;
  translation: LocalizedText;
}

export const ROUTINE_STEPS: RoutineStepItem[] = [
  {
    id: 'r1',
    time: '07:00',
    orderIndex: 0,
    beforeBlank: 'Ali',
    afterBlank: 'early and makes his bed.',
    options: ['wake up', 'wakes up', 'waking up'],
    correctVerb: 'wakes up',
    translation: {
      uz: 'Ali erta uyg‘onadi va o‘rnini yig‘ishtiradi.',
      ru: 'Али просыпается рано и заправляет кровать.',
      en: 'Morning wake-up.',
    },
  },
  {
    id: 'r2',
    time: '07:30',
    orderIndex: 1,
    beforeBlank: 'He',
    afterBlank: 'a healthy breakfast with tea.',
    options: ['have', 'has', 'haves'],
    correctVerb: 'has',
    translation: {
      uz: 'U choy bilan foydali nonushta qiladi.',
      ru: 'Он полезно завтракает с чаем.',
      en: 'Breakfast time.',
    },
  },
  {
    id: 'r3',
    time: '08:15',
    orderIndex: 2,
    beforeBlank: 'He',
    afterBlank: 'to college by metro.',
    options: ['go', 'gos', 'goes'],
    correctVerb: 'goes',
    translation: {
      uz: 'U kollejga metroda boradi.',
      ru: 'Он едет в колледж на метро.',
      en: 'Commuting to college.',
    },
  },
  {
    id: 'r4',
    time: '14:30',
    orderIndex: 3,
    beforeBlank: 'After classes, he',
    afterBlank: 'English in the library.',
    options: ['study', 'studies', 'studys'],
    correctVerb: 'studies',
    translation: {
      uz: 'Darslardan keyin u kutubxonada ingliz tili o‘qiydi.',
      ru: 'После занятий он учит английский в библиотеке.',
      en: 'Afternoon study.',
    },
  },
  {
    id: 'r5',
    time: '18:00',
    orderIndex: 4,
    beforeBlank: 'In the evening, he',
    afterBlank: 'football with his friends.',
    options: ['play', 'plays', 'playes'],
    correctVerb: 'plays',
    translation: {
      uz: 'Kechqurun u do‘stlari bilan futbol o‘ynaydi.',
      ru: 'Вечером он играет в футбол с друзьями.',
      en: 'Evening sport.',
    },
  },
  {
    id: 'r6',
    time: '22:00',
    orderIndex: 5,
    beforeBlank: 'He',
    afterBlank: 'to sleep at ten o’clock.',
    options: ['go', 'goes', 'is go'],
    correctVerb: 'goes',
    translation: {
      uz: 'U soat o‘nda uxlashga yotadi.',
      ru: 'Он ложится спать в десять часов.',
      en: 'Bedtime.',
    },
  },
];

// ================= CLASSROOM TASKS (5 Tasks) =================

export interface TaskTableRow {
  id: string;
  pronoun: string;
  verbBase: string;
  expected: string;
}

export const TASK_1_TABLE: TaskTableRow[] = [
  { id: 't1r1', pronoun: 'I', verbBase: 'study', expected: 'study' },
  { id: 't1r2', pronoun: 'He', verbBase: 'study', expected: 'studies' },
  { id: 't1r3', pronoun: 'She', verbBase: 'watch', expected: 'watches' },
  { id: 't1r4', pronoun: 'They', verbBase: 'have', expected: 'have' },
  { id: 't1r5', pronoun: 'It', verbBase: 'have', expected: 'has' },
  { id: 't1r6', pronoun: 'She', verbBase: 'go', expected: 'goes' },
];

export const TASK_2_CHECKLIST: LocalizedText[] = [
  {
    uz: 'Kamida 5 ta gap yozdim (masalan: I wake up..., I go..., I study...).',
    ru: 'Написано не менее 5 предложений (например: I wake up..., I go...).',
    en: 'I wrote at least 5 complete sentences about my day.',
  },
  {
    uz: 'Kamida 2 ta vaqt ko‘rsatkichidan foydalandim (at 7:00, in the evening, always).',
    ru: 'Использованы минимум 2 маркера времени (at 7:00, always).',
    en: 'I used at least 2 time expressions or adverbs of frequency.',
  },
  {
    uz: "Kamida 1 ta inkor gap (I don't...) qo'shdim.",
    ru: "Добавлено минимум 1 отрицательное предложение (I don't...).",
    en: "I included at least 1 negative sentence (I don't...).",
  },
];

export const TASK_2_MODEL =
  "I usually wake up at 6:30 a.m. I wash my face and have breakfast with my family. At 8:00 a.m., I go to college by bus. I don't drink coffee in the morning because I prefer green tea. In the evening, I do my homework and read an English book before bed.";

export interface TaskQuestionBuild {
  id: string;
  givenAnswer: string;
  prompt: LocalizedText;
  accepted: string[];
}

export const TASK_3_QUESTIONS: TaskQuestionBuild[] = [
  {
    id: 't3q1',
    givenAnswer: 'Yes, I live in Samarkand.',
    prompt: {
      uz: 'Do you... bilan savol tuzing:',
      ru: 'Составьте вопрос с Do you...:',
      en: 'Make a question starting with "Do you...":',
    },
    accepted: ['Do you live in Samarkand', 'Do you live in Samarkand?'],
  },
  {
    id: 't3q2',
    givenAnswer: 'No, she does not play the piano.',
    prompt: {
      uz: 'Does she... bilan savol tuzing:',
      ru: 'Составьте вопрос с Does she...:',
      en: 'Make a question starting with "Does she...":',
    },
    accepted: ['Does she play the piano', 'Does she play the piano?'],
  },
  {
    id: 't3q3',
    givenAnswer: 'The library opens at 9:00 a.m.',
    prompt: {
      uz: 'What time... bilan savol tuzing:',
      ru: 'Составьте вопрос с What time...:',
      en: 'Make a question starting with "What time...":',
    },
    accepted: ['What time does the library open', 'What time does the library open?'],
  },
  {
    id: 't3q4',
    givenAnswer: 'They study English every day.',
    prompt: {
      uz: 'What language... bilan savol tuzing:',
      ru: 'Составьте вопрос с What language...:',
      en: 'Make a question starting with "What language...":',
    },
    accepted: ['What language do they study', 'What language do they study every day', 'What language do they study?'],
  },
];

export interface TaskTransformItem {
  id: string;
  affirmative: string;
  negativeAccepted: string[];
  questionAccepted: string[];
}

export const TASK_4_TRANSFORMS: TaskTransformItem[] = [
  {
    id: 't4i1',
    affirmative: 'She works at a bank.',
    negativeAccepted: ["She doesn't work at a bank", 'She does not work at a bank'],
    questionAccepted: ['Does she work at a bank', 'Does she work at a bank?'],
  },
  {
    id: 't4i2',
    affirmative: 'They drink green tea.',
    negativeAccepted: ["They don't drink green tea", 'They do not drink green tea'],
    questionAccepted: ['Do they drink green tea', 'Do they drink green tea?'],
  },
  {
    id: 't4i3',
    affirmative: 'He has a bicycle.',
    negativeAccepted: ["He doesn't have a bicycle", 'He does not have a bicycle'],
    questionAccepted: ['Does he have a bicycle', 'Does he have a bicycle?'],
  },
  {
    id: 't4i4',
    affirmative: 'We watch movies on Friday.',
    negativeAccepted: ["We don't watch movies on Friday", 'We do not watch movies on Friday'],
    questionAccepted: ['Do we watch movies on Friday', 'Do we watch movies on Friday?'],
  },
];

export const READING_PASSAGE = {
  en: `Anna is a 17-year-old college student in Tashkent. Every weekday, she wakes up at 6:30 a.m. and goes for a short walk in the park. At 7:15, she has breakfast with her parents—she usually eats eggs and drinks green tea, because she doesn't like coffee. Her classes start at 8:30 a.m. Anna studies computer science and English. After college, she goes to the library and finishes her homework by 5:00 p.m. On weekends, Anna doesn't study; she visits her grandmother and plays chess with her brother.`,
  tr: {
    uz: `Anna Toshkentdagi kollejning 17 yoshli talabasi. Har ish kuni u ertalab soat 6:30 da uyg‘onadi va bog‘da qisqa sayr qiladi. 7:15 da ota-onasi bilan nonushta qiladi — odatda tuxum yeydi va ko‘k choy ichadi, chunki u kofeni yoqtirmaydi. Darslari 8:30 da boshlanadi. Anna kompyuter fanlari va ingliz tilini o‘qiydi. Kollejdan keyin u kutubxonaga boradi va soat 17:00 gacha uyga vazifasini tugatadi. Dam olish kunlari Anna dars qilmaydi; u buvisinikiga boradi va ukasi bilan shaxmat o‘ynaydi.`,
    ru: `Анне 17 лет, она учится в колледже в Ташкенте. Каждый будний день она просыпается в 6:30 утра и выходит на короткую прогулку в парк. В 7:15 она завтракает с родителями — обычно ест яйца и пьёт зелёный чай, потому что не любит кофе. Занятия начинаются в 8:30. Анна изучает информатику и английский язык. После колледжа она идёт в библиотеку и заканчивает домашнюю работу к 17:00. По выходным Анна не учится: она навещает бабушку и играет в шахматы с братом.`,
    en: `Read carefully and notice all Present Simple verbs (wakes up, has, doesn't like, starts, studies, finishes, visits, plays).`,
  },
  questions: [
    {
      id: 'rq1',
      question: 'What time does Anna wake up on weekdays?',
      options: ['At 6:00 a.m.', 'At 6:30 a.m.', 'At 7:15 a.m.', 'At 8:30 a.m.'],
      answer: 'At 6:30 a.m.',
    },
    {
      id: 'rq2',
      question: 'Why does Anna drink green tea instead of coffee?',
      options: [
        "Because she doesn't like coffee",
        'Because tea is faster to make',
        'Because her parents forbid coffee',
        'Because she drinks coffee at college',
      ],
      answer: "Because she doesn't like coffee",
    },
    {
      id: 'rq3',
      question: 'What subjects does Anna study?',
      options: [
        'History and art',
        'Math and physics',
        'Computer science and English',
        'Biology and chemistry',
      ],
      answer: 'Computer science and English',
    },
    {
      id: 'rq4',
      question: 'Where does Anna finish her homework?',
      options: ['At home', 'In the park', 'At the cafe', 'In the library'],
      answer: 'In the library',
    },
    {
      id: 'rq5',
      question: 'What does Anna do on weekends?',
      options: [
        'She studies all day',
        'She visits her grandmother and plays chess',
        'She goes to college',
        'She works at a bank',
      ],
      answer: 'She visits her grandmother and plays chess',
    },
  ],
};

// ================= HOMEWORK SETS (3 sets x 10 exercises) =================

export interface HomeworkExercise {
  id: string;
  type: 'choice' | 'input';
  prompt: LocalizedText;
  sentence: string;
  options?: string[];
  accepted: string[];
  explanation: LocalizedText;
}

export const HOMEWORK_SETS: Record<'easy' | 'medium' | 'hard', HomeworkExercise[]> = {
  easy: [
    {
      id: 'hwe1',
      type: 'choice',
      prompt: { uz: "To'g'ri shaklni tanlang:", ru: 'Выберите правильную форму:', en: 'Choose the correct form:' },
      sentence: 'I ___ to music every evening.',
      options: ['listen', 'listens', 'listening'],
      accepted: ['listen'],
      explanation: { uz: '"I" bilan asosiy fe’l (listen) ishlatiladi.', ru: 'С "I" используется базовая форма listen.', en: 'Use base verb "listen" with "I".' },
    },
    {
      id: 'hwe2',
      type: 'choice',
      prompt: { uz: "To'g'ri shaklni tanlang:", ru: 'Выберите правильную форму:', en: 'Choose the correct form:' },
      sentence: 'He ___ soccer after school.',
      options: ['play', 'plays', 'playing'],
      accepted: ['plays'],
      explanation: { uz: '"He" bilan -s qo‘shiladi: plays.', ru: 'С "He" добавляем -s: plays.', en: 'Add -s with "He": plays.' },
    },
    {
      id: 'hwe3',
      type: 'input',
      prompt: { uz: "Fe'lni to'g'ri shaklda yozing:", ru: 'Впишите глагол в правильной форме:', en: 'Type the correct verb form:' },
      sentence: 'She ___ (read) a book before sleep.',
      accepted: ['reads'],
      explanation: { uz: '"She" + read → reads.', ru: '"She" + read → reads.', en: '"She" takes -s: reads.' },
    },
    {
      id: 'hwe4',
      type: 'choice',
      prompt: { uz: "To'g'ri yordamchi fe'lni tanlang:", ru: 'Выберите правильный глагол:', en: 'Choose the right auxiliary:' },
      sentence: '___ you like apples?',
      options: ['Do', 'Does', 'Is'],
      accepted: ['Do'],
      explanation: { uz: '"you" bilan "Do" ishlatiladi.', ru: 'С "you" используется "Do".', en: 'Use "Do" with "you".' },
    },
    {
      id: 'hwe5',
      type: 'input',
      prompt: { uz: "Fe'lni to'g'ri shaklda yozing:", ru: 'Впишите правильную форму:', en: 'Type the correct verb form:' },
      sentence: 'We ___ (live) in a quiet neighborhood.',
      accepted: ['live'],
      explanation: { uz: '"We" bilan fe’l o‘zgarmaydi: live.', ru: 'С "We" глагол остаётся неизменным: live.', en: '"We" takes base verb: live.' },
    },
    {
      id: 'hwe6',
      type: 'choice',
      prompt: { uz: "To'g'ri variantni tanlang:", ru: 'Выберите правильный вариант:', en: 'Choose the right option:' },
      sentence: 'My sister ___ have a car.',
      options: ["don't", "doesn't", "isn't"],
      accepted: ["doesn't"],
      explanation: { uz: '"My sister" = she, inkorda "doesn\'t" kerak.', ru: '"My sister" = she, в отрицании нужно "doesn\'t".', en: '"My sister" (she) uses "doesn\'t".' },
    },
    {
      id: 'hwe7',
      type: 'input',
      prompt: { uz: "Fe'lni to'g'ri shaklda yozing:", ru: 'Впишите правильную форму:', en: 'Type the correct verb form:' },
      sentence: 'They ___ (go) to the park on Sundays.',
      accepted: ['go'],
      explanation: { uz: '"They" bilan "go" ishlatiladi.', ru: 'С "They" используется "go".', en: 'With "They", use "go".' },
    },
    {
      id: 'hwe8',
      type: 'choice',
      prompt: { uz: "To'g'ri variantni tanlang:", ru: 'Выберите правильный вариант:', en: 'Choose the right option:' },
      sentence: '___ your father drive a car?',
      options: ['Do', 'Does', 'Are'],
      accepted: ['Does'],
      explanation: { uz: '"your father" = he, so‘roqda "Does" keladi.', ru: '"your father" = he, поэтому в вопросе "Does".', en: 'Singular "your father" takes "Does".' },
    },
    {
      id: 'hwe9',
      type: 'input',
      prompt: { uz: "Fe'lni to'g'ri shaklda yozing:", ru: 'Впишите правильную форму:', en: 'Type the correct verb form:' },
      sentence: 'Bob ___ (have) a new notebook.',
      accepted: ['has'],
      explanation: { uz: '3-shaxs birlikda "have" → "has" bo‘ladi.', ru: 'В 3-м лице ед. ч. "have" превращается в "has".', en: 'Third-person singular of "have" is "has".' },
    },
    {
      id: 'hwe10',
      type: 'choice',
      prompt: { uz: "To'g'ri shaklni tanlang:", ru: 'Выберите правильную форму:', en: 'Choose the right form:' },
      sentence: 'Cats ___ in the sun.',
      options: ['sleep', 'sleeps', 'sleeping'],
      accepted: ['sleep'],
      explanation: { uz: '"Cats" ko‘plik (they) → sleep.', ru: '"Cats" — множественное число → sleep.', en: 'Plural "Cats" takes "sleep".' },
    },
  ],
  medium: [
    {
      id: 'hwm1',
      type: 'input',
      prompt: { uz: "3-shaxs shaklini yozing:", ru: 'Впишите форму 3-го лица:', en: 'Type the third-person form:' },
      sentence: 'Karim ___ (study) mathematics every evening.',
      accepted: ['studies'],
      explanation: { uz: 'Undosh + y → -ies: studies.', ru: 'Согласная + y → -ies: studies.', en: 'Consonant + y → -ies: studies.' },
    },
    {
      id: 'hwm2',
      type: 'choice',
      prompt: { uz: "To'g'ri variantni tanlang:", ru: 'Выберите правильный вариант:', en: 'Choose the right option:' },
      sentence: 'Does Laylo ___ TV after dinner?',
      options: ['watch', 'watches', 'watching'],
      accepted: ['watch'],
      explanation: { uz: '"Does" dan keyin fe’l asl shaklida (watch) turadi.', ru: 'После "Does" глагол без окончания: watch.', en: 'After "Does", use base verb "watch".' },
    },
    {
      id: 'hwm3',
      type: 'input',
      prompt: { uz: "Inkor shaklini yozing:", ru: 'Впишите отрицательную форму:', en: 'Type the negative form:' },
      sentence: 'He ___ (not / eat) fast food.',
      accepted: ["doesn't eat", 'does not eat'],
      explanation: { uz: "He + doesn't eat (yoki does not eat).", ru: "He + doesn't eat (или does not eat).", en: "Use doesn't eat (or does not eat)." },
    },
    {
      id: 'hwm4',
      type: 'choice',
      prompt: { uz: "So'z tartibini to'g'ri tanlang:", ru: 'Выберите правильный порядок слов:', en: 'Choose the correct word order:' },
      sentence: 'Select the correct sentence:',
      options: [
        'She is always polite.',
        'She always is polite.',
        'Always she is polite.',
      ],
      accepted: ['She is always polite.'],
      explanation: { uz: '"always" ravishi "to be" (is) dan keyin keladi.', ru: 'Наречие "always" стоит после "is".', en: 'Adverb goes after "to be": She is always polite.' },
    },
    {
      id: 'hwm5',
      type: 'input',
      prompt: { uz: "Fe'lni to'g'ri shaklda yozing:", ru: 'Впишите правильную форму:', en: 'Type the correct verb form:' },
      sentence: 'My mother ___ (wash) the dishes every night.',
      accepted: ['washes'],
      explanation: { uz: '-sh bilan tugagan fe’lga -es qo‘shiladi: washes.', ru: 'После -sh добавляем -es: washes.', en: 'Verbs ending in -sh take -es: washes.' },
    },
    {
      id: 'hwm6',
      type: 'choice',
      prompt: { uz: "Qisqa javobni tanlang:", ru: 'Выберите краткий ответ:', en: 'Choose the short answer:' },
      sentence: 'Do your friends live nearby? — Yes, ___.',
      options: ['they do', 'they does', 'they are'],
      accepted: ['they do'],
      explanation: { uz: '"Do your friends...?" → "Yes, they do."', ru: '"Do your friends...?" → "Yes, they do."', en: 'Short affirmative reply is "they do".' },
    },
    {
      id: 'hwm7',
      type: 'input',
      prompt: { uz: "Fe'lni to'g'ri shaklda yozing:", ru: 'Впишите правильную форму:', en: 'Type the correct verb form:' },
      sentence: 'A mechanic ___ (fix) broken engines.',
      accepted: ['fixes'],
      explanation: { uz: '-x bilan tugagan fe’lga -es qo‘shiladi: fixes.', ru: 'Глаголы на -x принимают -es: fixes.', en: 'Verbs ending in -x add -es: fixes.' },
    },
    {
      id: 'hwm8',
      type: 'choice',
      prompt: { uz: "To'g'ri shaklni tanlang:", ru: 'Выберите правильную форму:', en: 'Choose the correct form:' },
      sentence: 'He ___ at home on rainy weekends.',
      options: ['stay', 'stays', 'stayes'],
      accepted: ['stays'],
      explanation: { uz: 'Unli (a) + y → faqat -s qo‘shiladi: stays.', ru: 'Гласная (a) + y → просто -s: stays.', en: 'Vowel + y simply adds -s: stays.' },
    },
    {
      id: 'hwm9',
      type: 'input',
      prompt: { uz: "Inkor shaklini yozing:", ru: 'Впишите отрицание:', en: 'Type the negative form:' },
      sentence: 'We ___ (not / go) to college on Sundays.',
      accepted: ["don't go", 'do not go'],
      explanation: { uz: "We + don't go (yoki do not go).", ru: "We + don't go (или do not go).", en: "Use don't go (or do not go)." },
    },
    {
      id: 'hwm10',
      type: 'choice',
      prompt: { uz: "To'g'ri so'roq so'zini tanlang:", ru: 'Выберите правильное начало вопроса:', en: 'Choose the right question start:' },
      sentence: '___ your uncle teach physics?',
      options: ['Do', 'Does', 'Is'],
      accepted: ['Does'],
      explanation: { uz: '"your uncle" = he va asosiy fe’l "teach" bor → Does.', ru: '"your uncle" = he и смысловой глагол "teach" → Does.', en: 'Singular subject + action verb takes "Does".' },
    },
  ],
  hard: [
    {
      id: 'hwh1',
      type: 'input',
      prompt: { uz: "To'liq so'roq iborasini yozing:", ru: 'Заполните пропуск в вопросе:', en: 'Complete the question:' },
      sentence: 'What time ___ (the bus / leave) for Bukhara?',
      accepted: ['does the bus leave'],
      explanation: { uz: 'What time + does + the bus + leave?', ru: 'What time + does + the bus + leave?', en: 'Wh-question: does + singular subject + base verb.' },
    },
    {
      id: 'hwh2',
      type: 'choice',
      prompt: { uz: "Grammatik jihatdan to'g'ri gapni toping:", ru: 'Выберите полностью правильное предложение:', en: 'Pick the 100% correct sentence:' },
      sentence: 'Which sentence has NO mistakes?',
      options: [
        'Everyone in the room knows the rule.',
        'Everyone in the room know the rule.',
        'Everyone in the room are know the rule.',
      ],
      accepted: ['Everyone in the room knows the rule.'],
      explanation: { uz: '"Everyone" birlik olmosh hisoblanadi → knows.', ru: '"Everyone" всегда согласуется с глаголом в ед. ч. → knows.', en: '"Everyone" takes singular verb "knows".' },
    },
    {
      id: 'hwh3',
      type: 'input',
      prompt: { uz: "Fe'lni to'g'ri shaklda yozing:", ru: 'Впишите правильную форму:', en: 'Type the correct form:' },
      sentence: 'She never ___ (miss) her morning exercise.',
      accepted: ['misses'],
      explanation: { uz: '"never" inkor ma’nosi bersa-da, darak gap formulasi ishlaydi: misses (-es).', ru: '"never" несёт отрицание, но глагол остаётся в утвердительной форме 3-го лица: misses.', en: 'With "never", keep the affirmative third-person -es: misses.' },
    },
    {
      id: 'hwh4',
      type: 'choice',
      prompt: { uz: "To'g'ri juftlikni tanlang:", ru: 'Выберите правильную пару:', en: 'Choose the right pair:' },
      sentence: 'He ___ a doctor, and he ___ at City Hospital.',
      options: ['is / works', 'does / works', 'is / work'],
      accepted: ['is / works'],
      explanation: { uz: 'Kasb nomi ("a doctor") bilan "is", harakat fe’li bilan "works" ishlatiladi.', ru: 'Перед профессией — "is", а глагол действия — "works".', en: 'Use "is" for profession and "works" for the action verb.' },
    },
    {
      id: 'hwh5',
      type: 'input',
      prompt: { uz: "Fe'lni to'g'ri shaklda yozing:", ru: 'Впишите правильную форму:', en: 'Type the correct verb form:' },
      sentence: 'Who ___ (teach) chemistry in your school?',
      accepted: ['teaches'],
      explanation: { uz: '"Who" egaga savol berganda "does" ishlatilmaydi: Who teaches...', ru: 'В вопросе к подлежащему с "Who" ставим -es: teaches.', en: 'Subject questions with "Who" take "teaches" without "does".' },
    },
    {
      id: 'hwh6',
      type: 'choice',
      prompt: { uz: "To'g'ri tag-savolni tanlang:", ru: 'Выберите правильный хвостик вопроса:', en: 'Choose the right question tag:' },
      sentence: 'Your brother speaks German, ___?',
      options: ["doesn't he", "isn't he", "don't he"],
      accepted: ["doesn't he"],
      explanation: { uz: 'Darak gap ("speaks") dan keyin inkor tag-savol ("doesn\'t he?") keladi.', ru: 'После утверждения с "speaks" идёт отрицательный хвостик "doesn\'t he?".', en: 'Affirmative "speaks" pairs with negative tag "doesn\'t he?".' },
    },
    {
      id: 'hwh7',
      type: 'input',
      prompt: { uz: "Inkor shaklini yozing:", ru: 'Впишите отрицательную форму:', en: 'Type the negative form:' },
      sentence: 'Water ___ (not / boil) at 60 degrees Celsius.',
      accepted: ["doesn't boil", 'does not boil'],
      explanation: { uz: '"Water" sanalmaydigan ot (it) → doesn\'t boil.', ru: '"Water" — неисчисляемое (it) → doesn\'t boil.', en: 'Uncountable "Water" takes "doesn\'t boil".' },
    },
    {
      id: 'hwh8',
      type: 'choice',
      prompt: { uz: "To'g'ri variantni tanlang:", ru: 'Выберите правильный вариант:', en: 'Choose the correct option:' },
      sentence: '___ your parents tired after work, or ___ they go for a walk?',
      options: ['Are / do', 'Do / do', 'Are / are'],
      accepted: ['Are / do'],
      explanation: { uz: '"tired" sifat (Are), "go" esa harakat fe’li (do).', ru: '"tired" — прилагательное (Are), "go" — глагол действия (do).', en: 'Use "Are" with adjective "tired" and "do" with verb "go".' },
    },
    {
      id: 'hwh9',
      type: 'input',
      prompt: { uz: "Fe'lni to'g'ri shaklda yozing:", ru: 'Впишите правильную форму:', en: 'Type the correct form:' },
      sentence: 'Nobody in this team ___ (want) to lose.',
      accepted: ['wants'],
      explanation: { uz: '"Nobody" olmoshi birlik sanaladi → wants.', ru: '"Nobody" требует глагола в единственном числе → wants.', en: '"Nobody" takes a singular verb: wants.' },
    },
    {
      id: 'hwh10',
      type: 'choice',
      prompt: { uz: "To'g'ri tartibni tanlang:", ru: 'Выберите правильное предложение:', en: 'Choose the right sentence:' },
      sentence: 'Pick the correct negative sentence:',
      options: [
        'He never drinks soda.',
        "He doesn't never drink soda.",
        "He isn't drink soda.",
      ],
      accepted: ['He never drinks soda.'],
      explanation: { uz: 'Ingliz tilida ikki marta inkor ishlatilmaydi ("never" o‘zi yetarli).', ru: 'В английском недопустимо двойное отрицание — достаточно "never".', en: 'Never use double negatives; "He never drinks soda." is correct.' },
    },
  ],
};
