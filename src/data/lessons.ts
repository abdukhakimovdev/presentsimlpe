import { LocalizedText } from '../i18n/types';

export interface UsageExample {
  en: string;
  highlight: string;
  tr: LocalizedText;
}

export interface UsageCategory {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  accent: 'indigo' | 'emerald' | 'sky' | 'amber' | 'rose';
  examples: UsageExample[];
}

export const USAGE_CATEGORIES: UsageCategory[] = [
  {
    id: 'habits',
    title: {
      uz: 'Odatlar va takroriy harakatlar',
      ru: 'Привычки и регулярные действия',
      en: 'Habits & Repeated Actions',
    },
    description: {
      uz: 'Har kuni, har hafta yoki muntazam bajariladigan odatlar uchun.',
      ru: 'Действия, которые повторяются каждый день, неделю или регулярно.',
      en: 'Actions you do regularly, every day, or as part of a habit.',
    },
    accent: 'indigo',
    examples: [
      {
        en: 'I drink a glass of water every morning.',
        highlight: 'drink',
        tr: {
          uz: 'Men har kuni ertalab bir stakan suv ichaman.',
          ru: 'Я пью стакан воды каждое утро.',
          en: 'Daily morning habit.',
        },
      },
      {
        en: 'She brushes her teeth twice a day.',
        highlight: 'brushes',
        tr: {
          uz: 'U kuniga ikki marta tishlarini yuvadi.',
          ru: 'Она чистит зубы дважды в день.',
          en: 'Repeated daily habit with she (+es).',
        },
      },
      {
        en: 'They play basketball on Fridays.',
        highlight: 'play',
        tr: {
          uz: 'Ular juma kunlari basketbol o‘ynaydilar.',
          ru: 'Они играют в баскетбол по пятницам.',
          en: 'Weekly habit with they.',
        },
      },
    ],
  },
  {
    id: 'routines',
    title: {
      uz: 'Doimiy holatlar va kasblar',
      ru: 'Постоянные ситуации и профессии',
      en: 'Permanent Situations & Jobs',
    },
    description: {
      uz: 'Yashash joyi, ish, o‘qish yoki uzoq vaqt o‘zgarmaydigan holatlar.',
      ru: 'Место жительства, учёба, работа и долгосрочные факты.',
      en: 'Where someone lives, works, or studies long-term.',
    },
    accent: 'emerald',
    examples: [
      {
        en: 'My uncle lives in Samarkand.',
        highlight: 'lives',
        tr: {
          uz: 'Amakim Samarqandda yashaydi.',
          ru: 'Мой дядя живёт в Самарканде.',
          en: 'Permanent residence.',
        },
      },
      {
        en: 'He works as a software engineer.',
        highlight: 'works',
        tr: {
          uz: 'U dasturiy ta’minot muhandisi bo‘lib ishlaydi.',
          ru: 'Он работает инженером-программистом.',
          en: 'Permanent job.',
        },
      },
      {
        en: 'We study at the technical college.',
        highlight: 'study',
        tr: {
          uz: 'Biz texnika kollejida o‘qiymiz.',
          ru: 'Мы учимся в техническом колледже.',
          en: 'Long-term situation.',
        },
      },
    ],
  },
  {
    id: 'facts',
    title: {
      uz: 'Umumiy haqiqatlar va tabiat qonunlari',
      ru: 'Общие факты и законы природы',
      en: 'General Truths & Scientific Facts',
    },
    description: {
      uz: 'Doim to‘g‘ri bo‘lgan ilmiy faktlar va tabiat hodisalari.',
      ru: 'Научные факты и истины, которые верны всегда.',
      en: 'Facts and laws of nature that are always true.',
    },
    accent: 'sky',
    examples: [
      {
        en: 'Water boils at 100 degrees Celsius.',
        highlight: 'boils',
        tr: {
          uz: 'Suv 100 gradus Selsiyda qaynaydi.',
          ru: 'Вода кипит при 100 градусах Цельсия.',
          en: 'Scientific fact.',
        },
      },
      {
        en: 'The Earth moves around the Sun.',
        highlight: 'moves',
        tr: {
          uz: 'Yer Quyosh atrofida aylanadi.',
          ru: 'Земля вращается вокруг Солнца.',
          en: 'Universal law of nature.',
        },
      },
      {
        en: 'Cats see very well in the dark.',
        highlight: 'see',
        tr: {
          uz: 'Mushuklar qorong‘uda juda yaxshi ko‘radi.',
          ru: 'Кошки очень хорошо видят в темноте.',
          en: 'Plural general fact.',
        },
      },
    ],
  },
  {
    id: 'schedules',
    title: {
      uz: 'Jadvallar va rasmiy vaqtlar',
      ru: 'Расписания и графики',
      en: 'Timetables & Fixed Schedules',
    },
    description: {
      uz: 'Poyezdlar, samolyotlar, darslar, do‘konlar va filmlarning aniq jadvali.',
      ru: 'Расписание поездов, уроков, работы магазинов и мероприятий.',
      en: 'Trains, classes, shops, and events running on a fixed schedule.',
    },
    accent: 'amber',
    examples: [
      {
        en: 'The train leaves Tashkent at 7:15 a.m.',
        highlight: 'leaves',
        tr: {
          uz: 'Poyezd Toshkentdan ertalab 7:15 da jo‘naydi.',
          ru: 'Поезд отправляется из Ташкента в 7:15 утра.',
          en: 'Transport timetable.',
        },
      },
      {
        en: 'Our English lesson starts at 9 o’clock.',
        highlight: 'starts',
        tr: {
          uz: 'Ingliz tili darsimiz soat 9 da boshlanadi.',
          ru: 'Наш урок английского начинается в 9 часов.',
          en: 'School schedule.',
        },
      },
      {
        en: 'The library closes at 7:00 p.m.',
        highlight: 'closes',
        tr: {
          uz: 'Kutubxona kechki soat 7:00 da yopiladi.',
          ru: 'Библиотека закрывается в 7:00 вечера.',
          en: 'Opening hours.',
        },
      },
    ],
  },
];

export interface SpellingRuleItem {
  id: string;
  badge: string;
  title: LocalizedText;
  rule: LocalizedText;
  examples: Array<{ base: string; third: string }>;
}

export const SPELLING_RULES: SpellingRuleItem[] = [
  {
    id: 'regular',
    badge: '+s',
    title: {
      uz: 'Oddiy fe’llar',
      ru: 'Большинство глаголов',
      en: 'Most Verbs',
    },
    rule: {
      uz: "Ko'pchilik fe’llarga shunchaki -s qo'shiladi.",
      ru: 'К большинству глаголов просто добавляется -s.',
      en: 'Simply add -s to the base verb.',
    },
    examples: [
      { base: 'work', third: 'works' },
      { base: 'read', third: 'reads' },
      { base: 'eat', third: 'eats' },
      { base: 'sleep', third: 'sleeps' },
    ],
  },
  {
    id: 'es-endings',
    badge: '+es',
    title: {
      uz: '-o, -ch, -sh, -ss, -x bilan tugasa',
      ru: 'Окончания -o, -ch, -sh, -ss, -x',
      en: 'Ending in -o, -ch, -sh, -ss, -x',
    },
    rule: {
      uz: 'Talaffuz qulay bo‘lishi uchun -es qo‘shiladi.',
      ru: 'Если глагол оканчивается на -o, -ch, -sh, -ss, -x, добавляем -es.',
      en: 'Add -es after -o, -ch, -sh, -ss, or -x.',
    },
    examples: [
      { base: 'go', third: 'goes' },
      { base: 'do', third: 'does' },
      { base: 'watch', third: 'watches' },
      { base: 'wash', third: 'washes' },
      { base: 'kiss', third: 'kisses' },
      { base: 'fix', third: 'fixes' },
      { base: 'teach', third: 'teaches' },
    ],
  },
  {
    id: 'consonant-y',
    badge: '-y → -ies',
    title: {
      uz: 'Undosh + y',
      ru: 'Согласная + y',
      en: 'Consonant + y',
    },
    rule: {
      uz: 'Undosh harfdan keyin y kelsa, y tushib qoladi va -ies qo‘shiladi.',
      ru: 'После согласной буква y меняется на i и добавляется -es (-ies).',
      en: 'Drop -y and add -ies after a consonant.',
    },
    examples: [
      { base: 'study', third: 'studies' },
      { base: 'fly', third: 'flies' },
      { base: 'try', third: 'tries' },
      { base: 'carry', third: 'carries' },
    ],
  },
  {
    id: 'vowel-y',
    badge: 'unli + y → +s',
    title: {
      uz: 'Unli (a, e, o, u) + y',
      ru: 'Гласная (a, e, o, u) + y',
      en: 'Vowel + y',
    },
    rule: {
      uz: 'Unli harfdan keyin y kelsa, y o‘zgarmaydi — faqat -s qo‘shiladi.',
      ru: 'После гласной буква y сохраняется — просто добавляем -s.',
      en: 'Keep -y and just add -s after a vowel.',
    },
    examples: [
      { base: 'play', third: 'plays' },
      { base: 'stay', third: 'stays' },
      { base: 'buy', third: 'buys' },
      { base: 'enjoy', third: 'enjoys' },
    ],
  },
  {
    id: 'special-have',
    badge: 'have → has',
    title: {
      uz: 'Alohida shakl: have',
      ru: 'Особый глагол: have',
      en: 'Special Verb: have',
    },
    rule: {
      uz: 'Have fe’li he/she/it bilan has shakliga o‘zgaradi ("haves" emas!).',
      ru: 'Глагол have в 3-м лице меняется на has (не "haves"!).',
      en: 'Have changes completely to has for he/she/it.',
    },
    examples: [
      { base: 'have', third: 'has' },
    ],
  },
];

export interface FrequencyAdverb {
  word: string;
  percent: number;
  meaning: LocalizedText;
  example: string;
  exampleTr: LocalizedText;
}

export const FREQUENCY_ADVERBS: FrequencyAdverb[] = [
  {
    word: 'always',
    percent: 100,
    meaning: { uz: 'doim / har doim', ru: 'всегда', en: '100% of the time' },
    example: 'She always arrives five minutes early.',
    exampleTr: {
      uz: 'U doim besh daqiqa erta keladi.',
      ru: 'Она всегда приходит на пять минут раньше.',
      en: 'Before the main verb "arrives".',
    },
  },
  {
    word: 'usually',
    percent: 80,
    meaning: { uz: 'odatda', ru: 'обычно', en: 'most of the time' },
    example: 'I usually have tea with breakfast.',
    exampleTr: {
      uz: 'Men odatda nonushtada choy ichaman.',
      ru: 'Я обычно пью чай за завтраком.',
      en: 'Before the main verb "have".',
    },
  },
  {
    word: 'often',
    percent: 65,
    meaning: { uz: 'tez-tez', ru: 'часто', en: 'many times' },
    example: 'They often visit their grandparents.',
    exampleTr: {
      uz: 'Ular tez-tez bobo-buvilarini ko‘rgani borishadi.',
      ru: 'Они часто навещают бабушку и дедушку.',
      en: 'Before the main verb "visit".',
    },
  },
  {
    word: 'sometimes',
    percent: 45,
    meaning: { uz: "ba'zan", ru: 'иногда', en: 'from time to time' },
    example: 'We sometimes watch a movie on Saturday.',
    exampleTr: {
      uz: 'Biz ba’zan shanba kuni kino ko‘ramiz.',
      ru: 'Мы иногда смотрим фильм в субботу.',
      en: 'Before the main verb "watch".',
    },
  },
  {
    word: 'rarely',
    percent: 15,
    meaning: { uz: 'kamdan-kam', ru: 'редко', en: 'not very often' },
    example: 'He rarely eats fast food.',
    exampleTr: {
      uz: 'U kamdan-kam tez tayyorlanadigan taom yeydi.',
      ru: 'Он редко ест фастфуд.',
      en: 'Before the main verb "eats".',
    },
  },
  {
    word: 'never',
    percent: 0,
    meaning: { uz: 'hech qachon', ru: 'никогда', en: '0% of the time' },
    example: 'She is never late for class.',
    exampleTr: {
      uz: 'U darsga hech qachon kech qolmaydi.',
      ru: 'Она никогда не опаздывает на урок.',
      en: 'After the verb "to be" (is).',
    },
  },
];

export const TIME_EXPRESSIONS: Array<{ phrase: string; meaning: LocalizedText }> = [
  { phrase: 'every day / week / month', meaning: { uz: 'har kuni / hafta / oy', ru: 'каждый день / неделю / месяц', en: 'regular intervals' } },
  { phrase: 'on Mondays / on weekends', meaning: { uz: 'dushanba kunlari / dam olish kunlari', ru: 'по понедельникам / по выходным', en: 'specific days' } },
  { phrase: 'once / twice a week', meaning: { uz: 'haftada bir / ikki marta', ru: 'раз / дважды в неделю', en: 'counts per period' } },
  { phrase: 'in the morning / afternoon', meaning: { uz: 'ertalab / tushdan keyin', ru: 'утром / днём', en: 'parts of the day' } },
];

export interface MistakeCard {
  id: string;
  wrong: string;
  right: string;
  reason: LocalizedText;
}

export const COMMON_MISTAKES: MistakeCard[] = [
  {
    id: 'm1',
    wrong: 'She go to school by bus.',
    right: 'She goes to school by bus.',
    reason: {
      uz: 'He/She/It bilan darak gapda fe’lga -s/-es qo‘shiladi (go → goes).',
      ru: 'С he/she/it в утверждении глагол требует -s/-es (go → goes).',
      en: 'Third-person singular subjects require -s/-es in affirmative sentences.',
    },
  },
  {
    id: 'm2',
    wrong: 'Does she likes pizza?',
    right: 'Does she like pizza?',
    reason: {
      uz: 'So‘roqda "Does" kelganda, asosiy fe’l asl shaklida qoladi ("likes" emas, "like").',
      ru: 'Когда в вопросе есть "Does", основной глагол теряет -s (like, а не likes).',
      en: 'After "Does", always use the base verb without -s.',
    },
  },
  {
    id: 'm3',
    wrong: "He don't play tennis.",
    right: "He doesn't play tennis.",
    reason: {
      uz: "He/She/It uchun inkorda don't emas, doesn't ishlatiladi.",
      ru: "С he/she/it для отрицания используется doesn't, а не don't.",
      en: "Use doesn't (does not) with he, she, and it.",
    },
  },
  {
    id: 'm4',
    wrong: 'I am work in a bank.',
    right: 'I work in a bank.',
    reason: {
      uz: "Harakat fe'li (work) oldidan am/is/are qo'yilmaydi.",
      ru: 'Перед глаголом действия (work) не нужно ставить am/is/are в Present Simple.',
      en: 'Do not mix "am/is/are" with base action verbs in Present Simple.',
    },
  },
  {
    id: 'm5',
    wrong: 'She haves two brothers.',
    right: 'She has two brothers.',
    reason: {
      uz: "Have fe'lining 3-shaxs shakli has bo'ladi.",
      ru: 'Форма 3-го лица от have — это has.',
      en: 'The third-person form of "have" is irregular: "has".',
    },
  },
  {
    id: 'm6',
    wrong: 'He studyes English.',
    right: 'He studies English.',
    reason: {
      uz: 'Undosh + y bilan tugagan fe’lda y → i ga aylanib, -es qo‘shiladi.',
      ru: 'Если перед y стоит согласная, y меняется на i + es (studies).',
      en: 'Consonant + y becomes -ies (study → studies).',
    },
  },
];
