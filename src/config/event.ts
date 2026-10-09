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
  categories: CATEGORIES,
} as const;
