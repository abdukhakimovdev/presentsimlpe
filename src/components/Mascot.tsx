import React from 'react';
import { motion } from 'framer-motion';

export type MascotMood = 'idle' | 'happy' | 'sad' | 'thinking';

interface MascotProps {
  mood?: MascotMood;
  size?: number;
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'idle',
  size = 88,
  className = '',
}) => {
  const animateProps =
    mood === 'happy'
      ? { y: [0, -10, 0], rotate: [0, -4, 4, 0], scale: [1, 1.06, 1] }
      : mood === 'sad'
        ? { x: [0, -6, 6, -4, 4, 0] }
        : mood === 'thinking'
          ? { rotate: [0, -3, 0] }
          : { y: [0, -4, 0] };

  const transitionProps =
    mood === 'happy' || mood === 'sad'
      ? { duration: 0.55, ease: 'easeOut' as const }
      : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const };

  return (
    <motion.div
      animate={animateProps}
      transition={transitionProps}
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm" fill="none">
        {/* Owl Ears */}
        <path d="M26 32 L38 14 L46 30 Z" fill="#4338CA" />
        <path d="M94 32 L82 14 L74 30 Z" fill="#4338CA" />

        {/* Body */}
        <ellipse cx="60" cy="68" rx="40" ry="42" fill="#4F46E5" />
        {/* Belly */}
        <ellipse cx="60" cy="78" rx="26" ry="26" fill="#E0E7FF" />
        {/* Belly feathers */}
        <path d="M50 74 Q54 78 58 74 M62 74 Q66 78 70 74 M56 84 Q60 88 64 84" stroke="#818CF8" strokeWidth="2.4" strokeLinecap="round" />

        {/* Wings */}
        <path
          d={mood === 'happy' ? 'M18 58 Q6 36 22 44 Q24 62 24 72 Z' : 'M20 56 Q10 72 22 86 Q28 74 26 58 Z'}
          fill="#3730A3"
        />
        <path
          d={mood === 'happy' ? 'M102 58 Q114 36 98 44 Q96 62 96 72 Z' : 'M100 56 Q110 72 98 86 Q92 74 94 58 Z'}
          fill="#3730A3"
        />

        {/* Eye Patches */}
        <circle cx="44" cy="48" r="16" fill="#FFFFFF" />
        <circle cx="76" cy="48" r="16" fill="#FFFFFF" />

        {/* Eyes based on mood */}
        {mood === 'happy' ? (
          <>
            <path d="M36 48 Q44 39 52 48" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M68 48 Q76 39 84 48" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        ) : mood === 'sad' ? (
          <>
            <circle cx="44" cy="50" r="6.5" fill="#1E1B4B" />
            <circle cx="76" cy="50" r="6.5" fill="#1E1B4B" />
            <path d="M34 39 L50 43" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
            <path d="M86 39 L70 43" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : mood === 'thinking' ? (
          <>
            <circle cx="46" cy="46" r="6.5" fill="#1E1B4B" />
            <circle cx="78" cy="46" r="6.5" fill="#1E1B4B" />
            <circle cx="48" cy="44" r="2.2" fill="#FFFFFF" />
            <circle cx="80" cy="44" r="2.2" fill="#FFFFFF" />
          </>
        ) : (
          <>
            <circle cx="44" cy="48" r="7" fill="#1E1B4B" />
            <circle cx="76" cy="48" r="7" fill="#1E1B4B" />
            <circle cx="46.5" cy="45.5" r="2.5" fill="#FFFFFF" />
            <circle cx="78.5" cy="45.5" r="2.5" fill="#FFFFFF" />
          </>
        )}

        {/* Beak */}
        <path d="M54 56 L60 64 L66 56 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />

        {/* Feet */}
        <path d="M44 108 L40 114 M44 108 L44 115 M44 108 L48 114" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M76 108 L72 114 M76 108 L76 115 M76 108 L80 114" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};
