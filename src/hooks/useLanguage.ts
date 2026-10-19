'use client';

import { useMemo } from 'react';
import { useLanguage as useLanguageContext } from '@/contexts/LanguageContext';
import type { SiteLanguage } from '@/contexts/LanguageContext';

/**
 * Convenience hook that combines the site language context with a
 * page-specific copy-getter function.
 *
 * Usage:
 *   const { t, isTi, language, setLanguage } = useLanguage(getMyPageCopy);
 *
 * @param getCopy - A function that takes a SiteLanguage and returns the
 *                  translated copy object for the current page.
 */
export function useLanguage<T>(getCopy: (lang: SiteLanguage) => T): {
  t: T;
  language: SiteLanguage;
  isTi: boolean;
  setLanguage: (lang: SiteLanguage) => void;
} {
  const { language, setLanguage } = useLanguageContext();

  const t = useMemo(() => getCopy(language), [getCopy, language]);

  return {
    t,
    language,
    isTi: language === 'ti',
    setLanguage,
  };
}
