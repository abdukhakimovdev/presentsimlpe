import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: string[], disabled = false): string {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? 'hero');

  useEffect(() => {
    if (disabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0.01 }
    );

    const observeAll = () => {
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    };

    observeAll();
    const timer = window.setTimeout(observeAll, 600);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [sectionIds, disabled]);

  return activeSection;
}
