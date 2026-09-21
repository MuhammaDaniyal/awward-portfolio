import { useRef } from "react";
import { AnimatedTextLines } from "./AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { prefersReducedMotion } from "../utils/motion";

gsap.registerPlugin(ScrollTrigger, SplitText);

const AnimatedHeaderSection = ({
  subTitle,
  title,
  text,
  textColor,
  withScrollTrigger = false,
  // The hero shares its viewport with the portrait, so it trims the generous
  // vertical padding the standalone section headers use.
  compact = false,
}) => {
  const contextRef = useRef(null);
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const ruleRef = useRef(null);
  const titleParts = title.includes(" ") ? title.split(" ") : [title];

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    // `mask: "chars"` wraps every character in its own clipping box, so the
    // glyphs can rise from behind the line rather than just fading in.
    // `autoSplit` re-splits once Amiamie finishes loading — splitting against
    // fallback metrics otherwise bakes in the wrong character positions.
    const split = SplitText.create(titleRef.current, {
      type: "chars",
      mask: "chars",
      autoSplit: true,
      onSplit(self) {
        const tl = gsap.timeline({
          scrollTrigger: withScrollTrigger
            ? { trigger: contextRef.current, once: true }
            : undefined,
        });

        tl.from(contextRef.current, { y: "40vh", duration: 1, ease: "circ.out" }, 0)
          .from(
            subRef.current,
            { opacity: 0, y: 24, duration: 0.8, ease: "circ.out" },
            0.15
          )
          .from(
            self.chars,
            {
              yPercent: 115,
              duration: 1.1,
              stagger: 0.03,
              ease: "power4.out",
            },
            0.25
          )
          .from(
            ruleRef.current,
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 1.2,
              ease: "power3.inOut",
            },
            0.45
          );

        return tl;
      },
    });

    return () => split.revert();
  }, []);

  return (
    <div ref={contextRef}>
      <div style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
        <div
          ref={headerRef}
          className={`flex flex-col justify-center ${
            compact ? "gap-6 pt-6 sm:gap-8" : "gap-12 pt-16 sm:gap-16"
          }`}
        >
          <p
            ref={subRef}
            className={`text-sm font-light tracking-[0.5rem] uppercase px-10 ${textColor}`}
          >
            {subTitle}
          </p>
          <div className="px-10">
            <h1
              ref={titleRef}
              className={`flex flex-col gap-12 uppercase banner-text-responsive sm:gap-16 md:block ${textColor}`}
            >
              {titleParts.map((part, index) => (
                <span key={index}>{part} </span>
              ))}
            </h1>
          </div>
        </div>
      </div>
      <div
        className={`relative px-10 ${textColor}`}
        // Pull the rule (and the text under it) up onto the headline baseline,
        // restoring the overlap the old sub-1 line-height used to create.
        style={{ marginTop: "calc(var(--banner-size) * -1 * var(--banner-descent))" }}
      >
        <div ref={ruleRef} className="absolute inset-x-0 border-t-2" />
        <div className={`${compact ? "py-6 sm:py-8" : "py-12 sm:py-16"} text-end`}>
          <AnimatedTextLines
            text={text}
            className={`font-light uppercase value-text-responsive ${textColor}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedHeaderSection;
