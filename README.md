# Present Simple Academy

An interactive A1–A2 English grammar learning platform focused on the **Present Simple** tense, built with **Vite + React + TypeScript + Tailwind CSS + Framer Motion**. Supports **Uzbek (default)**, **Russian**, and **English** with instant language switching, Web Speech API pronunciation, 66 multi-format practice questions, 4 grammar games, 45 verb flashcards, 5 classroom tasks, 3 homework sets, a 25-question timed final test with printable PDF certificate, and localStorage gamification.

## Features

- **3 Languages (UZ / RU / EN)**: Default Uzbek (Latin script), instant switch without losing quiz progress.
- **Interactive Theory**: Uses, formula tables, live Conjugation Machine, spelling rules + live checker, 0–100% Frequency Meter, Common Mistakes flip cards, and printable Cheat-Sheet.
- **Practice Zone (66 Questions)**: Easy, Medium, and Hard levels across 7 question types (Multiple Choice, Fill in the Blank, Sentence Builder, True/False, Fix the Mistake, Matching Pairs, Do/Does/Don't/Doesn't).
- **4 Grammar Games**: Speed Round (60s + combo), Memory Match, Sentence Detective, and Daily Routine Builder.
- **45 Verb Flashcards**: 3D flip cards with audio pronunciation and spaced-repetition mastery tracking.
- **Tasks & Homework**: 5 classroom tasks + 3 graded homework sets + writing prompt with word counter and rubric.
- **Final Test & Certificate**: 25 random questions, 15-minute countdown timer, letter grading (A–D), and printable Certificate of Achievement.

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Type-check:

```bash
npm run lint
```

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Present Simple Academy"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repository.
2. Vercel auto-detects Vite (configured with `vercel.json` SPA rewrite to `/index.html`):
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Click **Deploy** — zero environment variables or API keys required.
