export function normalizeAnswer(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[’`‘]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/[.!?]+$/g, '');
}

const CONTRACTION_PAIRS: Array<[string, string]> = [
  ["doesn't", 'does not'],
  ["don't", 'do not'],
  ["isn't", 'is not'],
  ["aren't", 'are not'],
  ["i'm", 'i am'],
  ["he's", 'he is'],
  ["she's", 'she is'],
  ["it's", 'it is'],
  ["we're", 'we are'],
  ["they're", 'they are'],
  ["you're", 'you are'],
];

export function expandAndContractVariants(normalized: string): string[] {
  const variants = new Set<string>([normalized]);
  for (const [contracted, expanded] of CONTRACTION_PAIRS) {
    if (normalized.includes(contracted)) {
      variants.add(normalized.replaceAll(contracted, expanded));
    }
    if (normalized.includes(expanded)) {
      variants.add(normalized.replaceAll(expanded, contracted));
    }
  }
  return Array.from(variants);
}

export function isAnswerCorrect(userAnswer: string, acceptedAnswers: string[]): boolean {
  const normUser = normalizeAnswer(userAnswer);
  if (!normUser) return false;

  const userVariants = expandAndContractVariants(normUser);

  for (const rawAccepted of acceptedAnswers) {
    const normAccepted = normalizeAnswer(rawAccepted);
    const acceptedVariants = expandAndContractVariants(normAccepted);
    for (const uv of userVariants) {
      if (acceptedVariants.includes(uv)) {
        return true;
      }
    }
  }
  return false;
}

export function shuffleArray<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}
