import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { isSpeechSupported, speakEnglish } from '../utils/speech';
import { useLang } from '../i18n/LanguageContext';

interface SpeakButtonProps {
  text: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  size = 'sm',
  className = '',
}) => {
  const { t } = useLang();
  const [speaking, setSpeaking] = useState(false);

  if (!isSpeechSupported()) {
    return null;
  }

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = speakEnglish(text);
    if (ok) {
      setSpeaking(true);
      window.setTimeout(() => setSpeaking(false), 900);
    }
  };

  const dims = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <button
      type="button"
      onClick={handleSpeak}
      aria-label={`${t.theory.listenLabel}: ${text}`}
      title={t.theory.listenLabel}
      className={`no-print inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors shrink-0 ${dims} ${
        speaking ? 'ring-2 ring-indigo-400 scale-95' : ''
      } ${className}`}
    >
      <Volume2 className={iconSize} />
    </button>
  );
};
