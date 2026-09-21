import { useEffect } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "./motion";

/**
 * Pulls an element toward the cursor while it is within `radius` px, then eases
 * it home. Uses gsap.quickTo so each pointermove is a cheap property write
 * rather than a new tween.
 *
 * Skipped entirely on coarse pointers — there is no cursor to be magnetic to,
 * and the listener would just burn battery.
 */
export const useMagnetic = (ref, { strength = 0.35, radius = 110 } = {}) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < radius) {
        xTo(dx * strength);
        yTo(dy * strength);
      } else {
        xTo(0);
        yTo(0);
      }
    };
    const reset = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", reset);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", reset);
      gsap.killTweensOf(el);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [ref, strength, radius]);
};
