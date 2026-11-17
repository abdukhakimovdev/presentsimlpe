import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';
import { Lang } from '../i18n/types';

export const Footer: React.FC = () => {
  const { lang, setLang, t } = useLang();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { id: 'theory', label: t.nav.theory },
    { id: 'practice', label: t.nav.practice },
    { id: 'games', label: t.nav.games },
    { id: 'flashcards', label: t.nav.flashcards },
    { id: 'homework', label: t.nav.homework },
    { id: 'test', label: t.nav.test },
  ];

  const langOptions: Array<{ code: Lang; label: string }> = [
    { code: 'uz', label: "O'zbekcha (UZ)" },
    { code: 'ru', label: 'Русский (RU)' },
    { code: 'en', label: 'English (EN)' },
  ];

  return (
    <footer className="no-print border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-md">
            <div className="font-display text-lg font-bold text-slate-900 dark:text-white mb-1.5">
              {t.nav.brand} Academy
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t.footer.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
            {quickLinks.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-0.5">
              {langOptions.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLang(opt.code)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    lang === opt.code
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {opt.code.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label={t.footer.backToTop}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              {t.footer.backToTop}
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-slate-800/70 text-xs text-slate-500 dark:text-slate-400">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
};
