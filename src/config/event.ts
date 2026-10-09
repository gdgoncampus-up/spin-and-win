import { CATEGORIES } from '../data/categories';

/**
 * For now this is the one source of truth for all event copy and categories.
 * Later this object can be loaded from JSON/API/local storage without
 * changing the wheel or presentation components.
 */
export const EVENT = {
  chapterName: 'GDG on Campus',
  universityName: 'University of Primorska',
  eventName: 'ŠtartUP 2026',
  eyebrow: 'A little challenge. A lot of fun.',
  headline: 'Spin the wheel.',
  gradientHeadline: 'Discover your challenge.',
  subtitle: 'Six categories. One random challenge. No tech degree required.',
  subtitleLine2: 'Ready to put your curiosity to the test?',
  footerNote: 'Made for ŠtartUP 2026 · No external assets',
  categories: CATEGORIES,
} as const;
