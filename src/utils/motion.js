/**
 * Single source of truth for reduced-motion. Between Lenis smooth scroll, the
 * GSAP entrances and the hero's animated lattice, this site is heavy on motion —
 * animations are skipped entirely (not just shortened) when the user asks.
 */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
