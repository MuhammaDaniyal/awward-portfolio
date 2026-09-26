import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Dot + trailing ring. The ring lags the dot, and grows into a soft disc over
 * anything interactive so links read as targets before you reach them.
 *
 * Only mounts for fine pointers — a touch device has no cursor to replace, and
 * the native one is left alone under reduced-motion.
 */
const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const allowed = fine.matches && !reduce.matches;
    setEnabled(allowed);
    if (!allowed) return;

    const sync = () => setEnabled(fine.matches && !reduce.matches);
    fine.addEventListener?.("change", sync);
    reduce.addEventListener?.("change", sync);
    return () => {
      fine.removeEventListener?.("change", sync);
      reduce.removeEventListener?.("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label';

    let visible = false;
    const show = () => {
      if (visible) return;
      visible = true;
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2 });
    };

    const onMove = (e) => {
      show();
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };
    const onOver = (e) => {
      const hit = e.target instanceof Element && e.target.closest(INTERACTIVE);
      gsap.to(ring, {
        scale: hit ? 1.9 : 1,
        backgroundColor: hit ? "rgba(207,163,85,0.18)" : "rgba(207,163,85,0)",
        borderColor: hit ? "rgba(207,163,85,0.9)" : "rgba(57,54,50,0.45)",
        duration: 0.3,
        ease: "power3.out",
      });
    };
    const onDown = () => gsap.to(ring, { scale: 0.75, duration: 0.18 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.25 });
    const onLeave = () => {
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([dot, ring]);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[100] pointer-events-none">
      <span
        ref={ringRef}
        className="absolute top-0 left-0 block border rounded-full opacity-0 -ml-5 -mt-5 w-10 h-10 border-DarkLava/45 will-change-transform"
      />
      <span
        ref={dotRef}
        className="absolute top-0 left-0 block w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full opacity-0 bg-DarkLava will-change-transform"
      />
    </div>
  );
};

export default Cursor;
